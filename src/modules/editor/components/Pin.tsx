import { Fragment, h } from 'preact'
import { calculateTotalPinWidth } from '../helpers/calculateTotalPinWidth'
import { VNodeState } from '../types/EditorState'
import { PinTemplate, VNodeTemplate } from '../types/VNodeTemplate'
import { nodeTypes } from '../constants'

/**
 * Get the position of any pin
 *
 * @param index The index of the pin.
 * @param nodeType The type of the pin.
 * @param scale The scale of the node.
 * @param template The template to use for the node
 */
export const calculatePinPosition = (
    index: number,
    nodeType: nodeTypes,
    scale: [number, number],
    { shape, pins }: VNodeTemplate
) => {
    const total = (nodeType === nodeTypes.input ? pins.inputs : pins.outputs)
        .length

    const xOffset =
        (scale[0] - calculateTotalPinWidth(total, shape.pinRadius)) / 2
    const rawX =
        calculateTotalPinWidth(index, shape.pinRadius) + shape.pinRadius
    const x = rawX + xOffset

    const y = nodeType === nodeTypes.input ? 0 : scale[1]

    return [x, y] as const
}

/**
 * Creates a render to for pins of a certain type following a few constraints.
 *
 * @param nodeType The type of the pins: 1 means input and -1 means output.
 * @param maximumHeight The maximum height the pins can take
 * @param state The state of the node to render the pins for.
 */
export const createPinRenderer = (
    nodeType: nodeTypes,
    { template, selected, transform }: VNodeState
) => {
    const { shape, material } = template

    return (pin: PinTemplate, index: number) => {
        const fill = selected ? material.stroke.active : material.stroke.normal
        const [x, y] = calculatePinPosition(
            index,
            nodeType,
            transform.scale,
            template
        )

        return (
            <Fragment>
                <circle r={shape.pinRadius} cx={x} cy={y} fill={fill}></circle>
                <title>{pin.label}</title>
            </Fragment>
        )
    }
}
