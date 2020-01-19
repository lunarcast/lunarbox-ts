import merge from 'deepmerge'
import { State } from 'fp-ts/es6/State'
import { DeepPartial } from 'utility-types'
import { defaultVNodeTemplate } from '../constants'
import { nodeById } from '../lenses/editorState'
import { EditorState, VNodeState } from '../types/EditorState'
import { VNodeTemplate } from '../types/VNodeTemplate'
import { calculateTotalPinWidth } from './calculateTotalPinWidth'
import { generateZIndex } from './generateZIndex'
import { pipe } from 'fp-ts/es6/pipeable'
import * as Array from 'fp-ts/es6/Array'
import { constant } from 'fp-ts/es6/function'
import * as Option from 'fp-ts/es6/Option'

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

    const { shape, pins, content } = template

    const totalPinsWidth = calculateTotalPinWidth(
        Math.max(pins.inputs.length, pins.outputs.length),
        shape.pinRadius
    )

    const width = Math.max(
        2 * shape.strokeWidth + totalPinsWidth,
        content.scale[0] + 2 * content.margin
    )

    const height = content.scale[1] + 2 * (content.margin + shape.pinRadius)

    // We can use the z index as a stand alone id
    const nodeState: VNodeState = {
        id: zIndex,
        selected: false,
        template,
        transform: {
            position: [0, 0],
            scale: [width, height],
            zIndex
        },
        connections: pipe(
            template.pins.inputs,
            Array.map(constant(Option.none))
        )
    }

    const finalState = nodeById(zIndex).set(nodeState)(state)

    return [nodeState, finalState]
}
