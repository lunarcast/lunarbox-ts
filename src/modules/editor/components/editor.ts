import { Atom, Cursor } from '@thi.ng/atom'
import { ColorMode } from '@thi.ng/color'
import { ILifecycle } from '@thi.ng/hdom'
import { svg } from '@thi.ng/hiccup-svg'
import { fromEvent, trace, fromAtom } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import { add2, sub2, Vec2 } from '@thi.ng/vectors'
import { background } from '../../core/styles/background'
import { full } from '../../core/styles/full'
import { AppConext } from '../../core/types/AppContext'
import { EditorState } from '../types/EditorState'
import { VNode } from './node'
import { pipe } from 'fp-ts/es6/pipeable'
import * as Option from 'fp-ts/es6/Option'

export class Editor implements ILifecycle {
    private state = new Atom<EditorState>({
        lastId: 0,
        nodes: {},
        selectedNodes: new Set()
    })

    /**
     * Array with all nodes in the editor.
     */
    private nodes: VNode[] = [new VNode(this.state)]

    private get selectedNodes() {
        return this.nodes.filter(node => node.state.deref().selected)
    }

    /**
     * Called by hdom when the element is added to the dom.
     */
    public init(element: HTMLElement, ctx: AppConext) {
        // mount event listeners
        const mouseMoves = fromEvent(element, 'mousemove')
        const dragStarts = fromEvent(element, 'mousedown')
        const mouseUps = fromEvent(element, 'mouseup')

        // only allow drag
        const drags = mouseMoves.transform(
            tx.filter<MouseEvent>(e => e.buttons !== 0)
        )

        // store the mouse delta
        const delta = new Atom<Option.Option<readonly [number, number]>>(
            Option.none
        )

        //
        mouseUps.subscribe({
            next: () => {
                delta.reset(Option.none)

                for (const node of this.nodes) {
                    node.state.resetIn('selected', false)
                }
            }
        })

        dragStarts
            .transform(
                tx.comp(
                    tx.map(e => e.target),
                    tx.filter(e => e !== null),
                    tx.map((target: HTMLElement) => target.id)
                )
            )
            .subscribe({
                next: id => {
                    for (const node of this.nodes) {
                        if (node.state.deref().selected) {
                            node.state.resetIn('selected', false)
                        }

                        if (node.id === Number(id)) {
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
                    pipe(
                        delta.deref(),
                        // We need this because we are not sure
                        // we have a previous delta to go of
                        Option.map(oldDelta => {
                            // The amount the mouse moved since the last update
                            const diff = sub2([], position, oldDelta)

                            // move the nodes which are selected
                            for (const node of this.selectedNodes) {
                                node.state.swapIn(
                                    ['transform', 'position'],
                                    (input: number[]) => {
                                        return add2([], diff, input)
                                    }
                                )
                            }
                        })
                    )

                    delta.reset(Option.some(position))
                }
            })

        // We aren't allowed to start reacting to changes in init
        // so we start on the next tick
        Promise.resolve().then(() => {
            // changes on this editor
            const stateChanges = fromAtom(this.state)

            // streams to make the app react from
            const streams = [drags, mouseUps, mouseMoves, stateChanges]

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
                    ...background('#333333', ColorMode.CSS)
                }
            },
            ...this.nodes.map(node => [node])
        )
    }
}
