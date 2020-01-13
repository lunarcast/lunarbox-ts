import { VNodeTemplate } from './VNodeTemplate'

/**
 * State used to render nodes.
 */
export interface VNodeState {
    transform: {
        position: number[]
        scale: number[]
    }
    template: VNodeTemplate
    selected: boolean
    id: number
}

/**
 * State for the editor componentCHR
 */
export interface EditorState {
    selectedNodes: Set<number>
    nodes: Record<number, VNodeState>
}
