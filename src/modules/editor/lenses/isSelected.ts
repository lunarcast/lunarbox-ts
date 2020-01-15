import { VNodeState } from '../types/EditorState'

/**
 * Predicate returning true only if the node is currently selected.
 */
export const isSelected = VNodeState.selected.get()
