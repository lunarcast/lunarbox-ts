import { contramap, ordNumber } from 'fp-ts/es6/Ord'
import { Lens } from 'monocle-ts'
import { VNodeTemplate } from './VNodeTemplate'

/**
 * State used to render nodes.
 */
export interface VNodeState {
    transform: {
        position: number[]
        scale: number[]
        zIndex: number
    }
    template: VNodeTemplate
    selected: boolean
    id: number
}

/**
 * Used to sort nodes.
 */
export const vNodeOrd = contramap((node: VNodeState) => node.transform.zIndex)(
    ordNumber
)

/**
 * State for the editor componentCHR
 */
export interface EditorState {
    lastZIndex: number
    nodes: Record<number, VNodeState>
}
