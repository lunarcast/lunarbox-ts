import * as Array from 'fp-ts/es6/Array'
import { flow } from 'fp-ts/es6/function'
import { EditorState, VNodeState } from '../types/EditorState'
import { isSelected } from './isSelected'
import { Setter } from 'lens.ts'
import { pipe } from 'fp-ts/es6/pipeable'

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

/**
 * Helper to only apply setter on selected nodes.
 *
 * @param setter The setter to use.
 */
export const setSelectedNodes = (setter: Setter<VNodeState>) => (
    state: EditorState
) =>
    pipe(
        state,
        getSelectedNodes,
        Array.map(VNodeState.set(setter)),
        Array.reduce(state, (accumulated, current) => {
            return EditorState.nodes.k(current.id).set(current)(accumulated)
        })
    )
