import { Option } from 'fp-ts/es6/Option'
import { VNodeTemplate } from './VNodeTemplate'
import { VPinPointer } from './VPinPointer'
/**
 * State used to render nodes.
 */
export interface VNodeState {
    transform: {
        position: number[]
        scale: [number, number]
        zIndex: number
    }
    connections: Option<VPinPointer>[]
    template: VNodeTemplate
    selected: boolean
    id: number
}
