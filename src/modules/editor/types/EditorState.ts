import { VNodeTemplate } from './VNodeTemplate'
import { lens } from 'lens.ts'
import { contramap, ordNumber } from 'fp-ts/es6/Ord'

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
 * Lens for node states.
 */
export const VNodeState = lens<VNodeState>()

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
    laseZIndex: number
    nodes: Record<number, VNodeState>
}

/**
 * Lens for editor states.
 */
export const EditorState = lens<EditorState>()
