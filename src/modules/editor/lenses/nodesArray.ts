import * as Array from 'fp-ts/es6/Array'
import { flow, Endomorphism } from 'fp-ts/es6/function'
import { pipe } from 'fp-ts/es6/pipeable'
import { getRecordValues } from '../../fp/helpers/getRecordValues'
import { EditorState } from '../types/EditorState'
import { VNodeState } from '../types/VNodeState'
import { nodes, nodeById } from './editorState'
import { isSelected } from './vNodeState'

/**
 * Getter for an array of nodes.
 */
export const getNodesArray = flow(nodes.asGetter().get, getRecordValues)

/**
 * Getter returning an array of all selected nodes.
 */
export const getSelectedNodes = flow(getNodesArray, Array.filter(isSelected))

/**
 * Helper to only apply setter on selected nodes.
 *
 * @param setter The setter to use.
 */
export const setSelectedNodes = (setter: Endomorphism<VNodeState>) => (
    state: EditorState
) =>
    pipe(
        state,
        getSelectedNodes,
        Array.map(setter),
        Array.reduce(state, (accumulated, current) => {
            return nodeById(current.id).set(current)(accumulated)
        })
    )
