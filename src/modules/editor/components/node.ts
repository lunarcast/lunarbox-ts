import { Cursor } from '@thi.ng/atom'
import { ILifecycle } from '@thi.ng/hdom'
import { Vec2Like } from '@thi.ng/hiccup-svg'
import { metaStream, Subscription } from '@thi.ng/rstream'
import {
    GestureEvent,
    gestureStream,
    GestureType
} from '@thi.ng/rstream-gestures'
import * as tx from '@thi.ng/transducers'
import { AppConext } from '../../core/types/AppContext'

export interface VNodeState {
    position: Vec2Like
    scale: Vec2Like

    lastDelta: Vec2Like
    delta: Vec2Like
}

export class VNode implements ILifecycle {
    /**
     * Options for gestures on boxes.
     */
    private static gestureStreamOptions = {
        local: false
    }

    /**
     * Stream of unified mouse / touch events.
     * The tx.dedupe is there to remove duplicaes
     */
    private gestures = metaStream((el: HTMLElement) =>
        gestureStream(el, VNode.gestureStreamOptions).transform<GestureEvent>(
            tx.dedupe()
        )
    )

    /**
     * General node component for all nodes in the editor.
     *
     * @param state
     */
    public constructor(private state: Cursor<VNodeState>) {}

    /**
     * Called by hdom when the element is added to the dom.
     */
    public init(element: HTMLElement, ctx: AppConext) {
        const ofType = (type: GestureType) =>
            tx.comp(
                tx.filter((v: GestureEvent) => v[0] === type),
                tx.map((t: GestureEvent) => t[1])
            )

        ctx.globalStreams.next(this.gestures)
        this.gestures.next(element)

        // const gestures = gestureStream(element).transform(tx.dedupe())
        const drags = this.gestures.transform(ofType(GestureType.DRAG))

        drags.subscribe({
            next: eventData => {
                // prevent non-right click buttons
                if (eventData.buttons !== 1) {
                    return
                }

                const [dx, dy] = eventData.delta
                const [ox, oy] = this.state.deref().lastDelta as number[]

                // console.//)

                this.state.swapIn('position', ([x, y]: number[]) => [
                    x - ox + dx,
                    y - oy + dy
                ])

                this.state.swapIn('lastDelta', () => [dx, dy])
            }
        })
    }

    /**
     * Called by hdom on each render.
     */
    public render(_: AppConext) {
        const current = this.state.deref()

        return [
            'rect',
            {
                x: current.position[0],
                y: current.position[1],
                width: current.scale[0],
                height: current.scale[1],
                fill: 'white'
            }
        ]
    }
}
