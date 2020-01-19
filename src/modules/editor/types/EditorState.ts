import { Option } from 'fp-ts/es6/Option'
import { contramap, ordNumber } from 'fp-ts/es6/Ord'
import { VNodeTemplate } from './VNodeTemplate'

/**
 * State necessary for rendering connections
 */
export interface VConnection {
    index: number
    nodeId: number
}

/**
 * State used to render nodes.
 */
export interface VNodeState {
    transform: {
        position: number[]
        scale: [number, number]
        zIndex: number
    }
    connections: Option<VConnection>[]
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
    connectionInProgress: {
        start: Option<VConnection>
        end: Option<VConnection>
    }
}
