import { Atom } from '@thi.ng/atom'
import { ColorMode } from '@thi.ng/color'
import { ILifecycle } from '@thi.ng/hdom'
import { svg } from '@thi.ng/hiccup-svg'
import { fromEvent } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import { add2, sub2, Vec2 } from '@thi.ng/vectors'
import { background } from '../../core/styles/background'
import { full } from '../../core/styles/full'
import { AppConext } from '../../core/types/AppContext'
import { EditorState } from '../types/EditorState'
import { VNode } from './node'

export class Editor implements ILifecycle {
    private state = new Atom<EditorState>({
        lastId: 0,
        nodes: {
            [0]: {
                transform: {
                    position: [100, 200],
                    scale: [200, 300]
                }
            }
        },
        selectedNodes: new Set()
    })

    /**
     * Array with all nodes in the editor.
     */
    private nodes: VNode[] = [new VNode(this.state)]

    /**
     * Called by hdom when the element is added to the dom.
     */
    public init(element: HTMLElement, ctx: AppConext) {
        const mousemoves = fromEvent(element, 'mousemove')

        const drags = mousemoves.transform(
            tx.filter<MouseEvent>(e => e.buttons !== 0)
        )

        drags
            .transform(
                // only keep the data we need
                tx.map(e => [e.clientX, e.clientY]),
                // combine the data with it's previous value
                tx.partition(2, 1),
                // calculate the difference between the latest and current value
                tx.map(([old, current]) => sub2([], current, old)),
                // typescript cannot guess the type of dedupe
                tx.dedupe<Vec2>()
            )
            .subscribe({
                next: diff => {
                    for (const node of this.nodes) {
                        node.state.swapIn(
                            ['transform', 'position'],
                            (input: number[]) => {
                                return add2([], diff, input)
                            }
                        )
                    }
                }
            })

        ctx.reactingTo.next(drags)
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
