import { Atom, Cursor } from '@thi.ng/atom'
import { VNodeList } from '../classes/VNodeList'
import { EditorState, VNodeState } from '../types/EditorState'

/**
 * Create a function which spawns nodes.
 *
 * @param state The state to write the nodes to.
 * @param nodes Double hashed list to spawn the node to.
 */
export const createNodeSpawner = (
    state: Atom<EditorState>,
    nodes: VNodeList
) => {
    const id = new Atom(0)

    return () => {
        const currentId = id.swap(last => last + 1)

        // set defaults for the node state
        state.resetIn<VNodeState>(['nodes', currentId], {
            selected: false,
            transform: {
                position: [0, 0],
                scale: [200, 200]
            }
        })

        const nodeState = new Cursor<VNodeState>(state, ['nodes', currentId])

        nodes.spawn(currentId, nodeState)
    }
}
