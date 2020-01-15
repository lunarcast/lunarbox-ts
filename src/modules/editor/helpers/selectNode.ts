import { EditorState } from '../types/EditorState'

/**
 * Select a node given it's id
 *
 * @param id The id of the node.
 */
export const selectNode = (id: number) =>
    EditorState.nodes.k(id).selected.set(true)
