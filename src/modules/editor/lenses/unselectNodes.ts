import { pipe } from 'fp-ts/es6/pipeable'
import * as Record from 'fp-ts/es6/Record'
import { EditorState, VNodeState } from '../types/EditorState'

/**
 * Unselect a node.
 */
export const unselectNode = VNodeState.selected.set(false)

/**
 * Unselect all nodes from a record.
 */
export const unselectNodes = pipe(
    unselectNode,
    Record.map,
    EditorState.nodes.set
)
