import { Atom, Cursor } from '@thi.ng/atom'
import merge from 'deepmerge'
import { DeepPartial } from 'utility-types'
import { VNodeList } from '../classes/VNodeList'
import { defaultVNodeTemplate } from '../constants'
import { EditorState, VNodeState } from '../types/EditorState'
import { VNodeTemplate } from '../types/VNodeTemplate'

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

    return (options: DeepPartial<VNodeTemplate> = {}) => {
        const template = merge(defaultVNodeTemplate, options) as VNodeTemplate
        const currentId = id.swap(last => last + 1)

        // set defaults for the node state
        state.resetIn<VNodeState>(['nodes', currentId], {
            selected: false,
            transform: {
                position: [0, 0],
                scale: [0, 50]
            },
            template,
            id: currentId
        })

        const nodeState = new Cursor<VNodeState>(state, ['nodes', currentId])

        nodes.spawn(nodeState)
    }
}
