import { Atom } from '@thi.ng/atom'
import { ColorMode } from '@thi.ng/color'
import { ILifecycle } from '@thi.ng/hdom'
import { svg } from '@thi.ng/hiccup-svg'
import { fromAtom, fromEvent } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import { add2, sub2 } from '@thi.ng/vectors'
import * as Option from 'fp-ts/es6/Option'
import { MouseButtons } from '../../core/constants'
import { background } from '../../core/styles/background'
import { full } from '../../core/styles/full'
import { AppConext } from '../../core/types/AppContext'
import { VNodeList } from '../classes/VNodeList'
import { createNodeSpawner } from '../helpers/createNodeSpawner'
import { EditorState } from '../types/EditorState'
import { renderNode } from './node'
import { Nullable } from '@thi.ng/api'

export class Editor implements ILifecycle {
    /**
     * Atom holding state for the entire editor.
     */
    private state = new Atom<EditorState>({
        nodes: {},
        selectedNodes: new Set()
    })

    /**
     * Array with all nodes in the editor.
     */
    private nodes = new VNodeList()

    /**
     * Function used to generate new nodes
     */
    private spawnNode = createNodeSpawner(this.state, this.nodes)

    /**
     * Getter for array of all nodes in the editor.
     */
    private get nodeArray() {
        return this.nodes.toArray()
    }

    /**
     * Getter for an array with all the nodes which are curently selected.
     */
    private get selectedNodes() {
        return this.nodeArray.filter(node => node.state.deref().selected)
    }

    /**
     * Called by hdom when the element is added to the dom.
     */
    public init(element: HTMLElement, ctx: AppConext) {
        // mount event listeners
        const mouseMoves = fromEvent(element, 'mousemove')
        const mouseDowns = fromEvent(element, 'mousedown')
        const mouseUps = fromEvent(element, 'mouseup')

        this.spawnNode()

        // only allow drag
        const drags = mouseMoves.transform(
            tx.filter<MouseEvent>(e => Boolean(e.buttons & MouseButtons.left))
        )

        // store the mouse delta
        const delta = new Atom<Option.Option<readonly [number, number]>>(
            Option.none
        )

        // runs when the user stops holding the mosue
        mouseUps.subscribe({
            next: () => {
                // no more delta values
                delta.reset(Option.none)

                // unselect everything
                for (const node of this.nodes) {
                    node.state.resetIn('selected', false)
                }
            }
        })

        mouseDowns
            .transform(
                tx.comp(
                    tx.filter<MouseEvent>(e =>
                        Boolean(e.buttons & MouseButtons.left)
                    ), // only allow left clicks
                    tx.map(e => {
                        let target = e.target as Nullable<HTMLElement>

                        if (!target) {
                            return null
                        }

                        while (!target.id.startsWith('node-')) {
                            if (target.parentElement) {
                                target = target?.parentElement
                            } else {
                                return null
                            }
                        }

                        return target.id.substr('node-'.length)
                    }), // only select the data we need
                    tx.filter(Boolean),
                    tx.map(Number) // cast to number
                )
            )
            .subscribe({
                next: id => {
                    this.nodes.lift(id)

                    for (const node of this.nodes) {
                        // unselect everything that was selected
                        if (node.state.deref().selected) {
                            node.state.resetIn('selected', false)
                        }

                        // select the thing the user clicked on
                        if (node.id === id) {
                            node.state.resetIn('selected', true)
                        }
                    }
                }
            })

        drags
            .transform(
                tx.comp(
                    tx.map(e => [e.clientX, e.clientY] as const), // only keep what we need
                    tx.dedupe() // remove duplicates
                )
            )
            .subscribe({
                next: position => {
                    // We need this because we are not sure
                    // we have a previous delta to go of
                    Option.map((oldDelta: ReadonlyArray<number>) => {
                        // The amount the mouse moved since the last update
                        const diff = sub2([], position, oldDelta)

                        // move the nodes which are selected
                        for (const node of this.selectedNodes) {
                            node.state.swapIn(
                                'transform.position',
                                (input: number[]) => {
                                    // move the input by the mouse difference
                                    return add2([], diff, input)
                                }
                            )
                        }
                    })(delta.deref())

                    // save current delta
                    delta.reset(Option.some(position))
                }
            })

        // We aren't allowed to start reacting to changes in init
        // so we start on the next tick
        Promise.resolve().then(() => {
            // changes on this editor
            const stateChanges = fromAtom(this.state)

            // streams to make the app react from
            const streams = [
                drags,
                mouseUps,
                mouseMoves,
                mouseDowns,
                stateChanges
            ]

            // start reacting to streams
            for (const stream of streams) {
                ctx.reactingTo.next(stream)
            }
        })
    }

    /**
     * Called by hdom on each render.
     */
    public render(c: AppConext) {
        return svg(
            {
                style: {
                    ...full,
                    ...background('#222222', ColorMode.CSS)
                }
            },
            ['g', ...this.nodeArray.map(renderNode)]
        )
    }
}
