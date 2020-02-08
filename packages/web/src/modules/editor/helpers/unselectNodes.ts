import { pipe } from 'fp-ts/es6/pipeable'
import * as Record from 'fp-ts/es6/Record'
import { } from 'monocle-ts'
import { nodes } from '../lenses/editorState'
import { selected } from '../lenses/vNodeState'

/**
 * Unselect a node.
 */
export const unselectNode = selected.set(false)

/**
 * Unselect all nodes from a record.
 */
export const unselectNodes = pipe(
    unselectNode,
    Record.map,
    nodes.asSetter().modify
)
