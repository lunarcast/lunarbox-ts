import { Cursor } from '@thi.ng/atom'
import merge from 'deepmerge'
import { DeepPartial } from 'utility-types'
import { defaultVNodeTemplate } from '../constants'
import { VNodeState, EditorState } from '../types/EditorState'
import { VNodeTemplate } from '../types/VNodeTemplate'
import { State } from 'fp-ts/es6/State'
import { generateZIndex } from './generateZIndex'

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
            scale: [100, 100],
            zIndex
        }
    }

    const finalState = EditorState.nodes.k(zIndex).set(nodeState)(state)

    return [nodeState, finalState]
}
