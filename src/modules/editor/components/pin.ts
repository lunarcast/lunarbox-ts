import { calculateTotalPinHeight } from '../helpers/calculateTotalPinHeight'
import { VNodeState } from '../types/EditorState'
import { PinTemplate } from '../types/VNodeTemplate'
import { ensureLength } from '../helpers/ensureLength'

/**
 * Creates a render to for pins of a certian type following a few constraints.
 *
 * @param nodeType The type of the pins: 1 means input and -1 means output.
 * @param maximumHeight The maximum height the pins can take
 * @param state The state of the node to render the pins for.
 */
export const createPinRenderer = (
    nodeType: 1 | -1,
    maximumHeight: number,
    { transform, selected, template: { shape, pins, material } }: VNodeState
) => {
    const total = (nodeType === 1 ? pins.inputs : pins.outputs).length

    const yOffset =
        (maximumHeight - calculateTotalPinHeight(total, shape.pinRadius)) / 2
    const x = nodeType === 1 ? 0 : transform.scale[0]

    return (pin: PinTemplate, index: number) => {
        const rawY =
            calculateTotalPinHeight(index, shape.pinRadius) + shape.pinRadius
        const y = rawY + yOffset

        return [
            [
                'circle',
                {
                    r: shape.pinRadius,
                    cx: x,
                    cy: y,
                    fill: selected
                        ? material.stroke.active
                        : material.stroke.normal
                },
                ['title', pin.label]
            ],
            pins.labels && [
                'text',
                {
                    'dominant-baseline': 'middle',
                    'text-anchor': nodeType === 1 ? 'start' : 'end',
                    y,
                    x: x + nodeType * shape.pinRadius * 2,
                    fill: material.pinLabelFIll,
                    class: 'overpass'
                },
                ensureLength(10, pin.label)
            ]
        ].filter(Boolean)
    }
}
