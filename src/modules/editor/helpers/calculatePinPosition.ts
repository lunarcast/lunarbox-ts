import { pinTypes } from '../constants'
import { calculateTotalPinWidth } from './calculateTotalPinWidth'
import { VNodeTemplate } from '../types/VNodeTemplate'
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
    nodeType: pinTypes,
    scale: [number, number],
    { shape, pins }: VNodeTemplate
) => {
    const total = (nodeType === pinTypes.input ? pins.inputs : pins.outputs)
        .length
    const xOffset =
        (scale[0] - calculateTotalPinWidth(total, shape.pinRadius)) / 2
    const rawX =
        calculateTotalPinWidth(index, shape.pinRadius) + shape.pinRadius
    const x = rawX + xOffset
    const y = nodeType === pinTypes.input ? 0 : scale[1]

    return [x, y] as const
}
