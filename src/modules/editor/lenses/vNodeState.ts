import { Lens } from 'monocle-ts'
import { VNodeState } from '../types/EditorState'

export const selected = Lens.fromProp<VNodeState>()('selected')
export const transform = Lens.fromProp<VNodeState>()('transform')

export const position = Lens.fromProp<VNodeState['transform']>()('position')
export const zIndex = Lens.fromProp<VNodeState['transform']>()('zIndex')

export const nodePosition = transform.compose(position)
export const nodeZIndex = transform.compose(zIndex)

/**
 * Predicate returning true only if the node is currently selected.
 */
export const isSelected = selected.asGetter().get
