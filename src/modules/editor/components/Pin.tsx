import { calculateTotalPinWidth } from '../helpers/calculateTotalPinWidth'
import { VNodeState } from '../types/EditorState'
import { PinTemplate } from '../types/VNodeTemplate'
import { h, Fragment } from 'preact'

/**
 * Creates a render to for pins of a certain type following a few constraints.
 *
 * @param nodeType The type of the pins: 1 means input and -1 means output.
 * @param maximumHeight The maximum height the pins can take
 * @param state The state of the node to render the pins for.
 */
export const createPinRenderer = (
    nodeType: 1 | -1,
    scale: [number, number],
    { selected, template: { shape, pins, material } }: VNodeState
) => {
    const total = (nodeType === 1 ? pins.inputs : pins.outputs).length

    const xOffset =
        (scale[0] - calculateTotalPinWidth(total, shape.pinRadius)) / 2
    const y = nodeType === 1 ? 0 : scale[1]

    return (pin: PinTemplate, index: number) => {
        const rawX =
            calculateTotalPinWidth(index, shape.pinRadius) + shape.pinRadius
        const x = rawX + xOffset
        const fill = selected ? material.stroke.active : material.stroke.normal

        return (
            <Fragment>
                <circle r={shape.pinRadius} cx={x} cy={y} fill={fill}></circle>
                <title>{pin.label}</title>
            </Fragment>
        )
    }
}
