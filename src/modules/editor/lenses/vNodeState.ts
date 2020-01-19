import { Lens } from 'monocle-ts'
import { SConnection } from '../../dataflow/types/SGraph'
import { VConnection, VNodeState } from '../types/EditorState'

const VNodeStateLens = Lens.fromProp<VNodeState>()
const VNodeStateTransform = Lens.fromProp<VNodeState['transform']>()
const VConnectionLens = Lens.fromProp<VConnection>()

export const selected = VNodeStateLens('selected')
export const transform = VNodeStateLens('transform')
export const connections = VNodeStateLens('connections')

export const position = VNodeStateTransform('position')
export const zIndex = VNodeStateTransform('zIndex')

export const nodeIndex = VConnectionLens('index')
export const nodeId = VConnectionLens('nodeId')

export const nodePosition = transform.compose(position)
export const nodeZIndex = transform.compose(zIndex)

export const connectionById = (id: number) =>
    Lens.fromProp<VNodeState['connections']>()(id)

/**
 * Predicate returning true only if the node is currently selected.
 */
export const isSelected = selected.asGetter().get
