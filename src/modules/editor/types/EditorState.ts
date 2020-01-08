export interface VNodeState {
    transform: {
        position: number[]
        scale: number[]
    }
    selected: boolean
}

/**
 * State for the editor componentCHR
 */
export interface EditorState {
    selectedNodes: Set<number>
    lastId: number
    nodes: Record<number, VNodeState>
}
