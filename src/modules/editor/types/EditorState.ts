import { VNodeTemplate } from './VNodeTemplate'
import { lens } from 'lens.ts'

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
