export interface VNodeState {
    transform: {
        position: number[]
        scale: number[]
    }
}

/**
 * State for the editor componentCHR
 */
export interface EditorState {
    selectedNodes: Set<number>
    lastId: number
    nodes: Record<number, VNodeState>
}
