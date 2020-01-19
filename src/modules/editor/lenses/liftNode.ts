import { generateZIndex } from '../helpers/generateZIndex'
import { EditorState } from '../types/EditorState'
import { nodeById } from './editorState'
import { nodeZIndex } from './vNodeState'

/**
 * Lift a node on top of everything else.
 *
 * @param id The id of he node to lift.
 */
export const liftNode = (id: number) => (initial: EditorState) => {
    const [index, state] = generateZIndex(initial)

    return nodeById(id)
        .compose(nodeZIndex)
        .set(index)(state)
}
