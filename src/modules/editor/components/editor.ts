import { full } from '../../core/styles/full'
import { background } from '../../core/styles/background'
import { ColorMode } from '@thi.ng/color'
import { svg, rect } from '@thi.ng/hiccup-svg'
import { VNode, VNodeState } from './node'
import { Atom, Cursor } from '@thi.ng/atom'
import { AppConext } from '../../core/types/AppContext'

/**
 * Atom holding the state for all editor nodes
 */
const db = new Atom<VNodeState[]>([
    {
        position: [100, 200],
        scale: [300, 270],
        delta: [0, 0],
        lastDelta: [0, 0]
    }
])

// Test node, in the future this will be removed
const nodeState = new Cursor<VNodeState>(db, 0)
const node = new VNode(nodeState)

export const editor = (ctx: AppConext) => {
    return svg(
        {
            style: {
                ...full,
                ...background('#333333', ColorMode.CSS)
            }
        },

        // nodes are components so we need to wrap them in arrays
        [node]
    )
}
