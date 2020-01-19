import { nodeById } from '../lenses/editorState'
import { selected } from '../lenses/vNodeState'

/**
 * Select a node given it's id
 *
 * @param id The id of the node.
 */
export const selectNode = (id: number) =>
    nodeById(id)
        .compose(selected)
        .set(true)
