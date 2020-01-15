import { generateZIndex } from '../helpers/generateZIndex'
import { EditorState } from '../types/EditorState'

/**
 * Lift a node on top of everything else.
 *
 * @param id The id of he node to lift.
 */
export const liftNode = (id: number) => (initial: EditorState) => {
    const [index, state] = generateZIndex(initial)

    return EditorState.nodes.k(id).transform.zIndex.set(index)(state)
}
