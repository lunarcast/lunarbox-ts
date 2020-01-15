import Array from 'fp-ts/es6/Array'
import { flow } from 'fp-ts/es6/function'
import { EditorState, VNodeState } from '../types/EditorState'
import { isSelected } from './isSelected'

/**
 * Getter for an array of nodes.
 */
export const getNodesArray = EditorState.nodes.get(
    v => Object.values(v) as VNodeState[]
)

/**
 * Getter returning an array of all selected nodes.
 */
export const getSelectedNodes = flow(getNodesArray, Array.filter(isSelected))
