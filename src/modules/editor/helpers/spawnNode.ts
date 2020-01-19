import merge from 'deepmerge'
import { State } from 'fp-ts/es6/State'
import { DeepPartial } from 'utility-types'
import { defaultVNodeTemplate } from '../constants'
import { EditorState, VNodeState } from '../types/EditorState'
import { VNodeTemplate } from '../types/VNodeTemplate'
import { generateZIndex } from './generateZIndex'
import { nodeById } from '../lenses/editorState'
import { connections } from '../lenses/vNodeState'

/**
 * Create a function which spawns nodes.
 *
 * @param options partial template to spawn
 */
export const spawnNode = (
    options: DeepPartial<VNodeTemplate> = {}
): State<EditorState, VNodeState> => (initial: EditorState) => {
    const [zIndex, state] = generateZIndex(initial)
    const template = merge(defaultVNodeTemplate, options) as VNodeTemplate

    // We can use the z index as a stand alone id
    const nodeState: VNodeState = {
        id: zIndex,
        selected: false,
        template,
        transform: {
            position: [0, 0],
            zIndex
        },
        connections: []
    }

    const finalState = nodeById(zIndex).set(nodeState)(state)

    return [nodeState, finalState]
}
