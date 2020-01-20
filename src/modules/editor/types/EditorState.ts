import { ConnectionInProgress } from './ConnectionInProgress'
import { VNodeState } from './VNodeState'

/**
 * State for the editor componentCHR
 */
export interface EditorState {
    lastZIndex: number
    nodes: Record<number, VNodeState>
    connectionInProgress: ConnectionInProgress
}
