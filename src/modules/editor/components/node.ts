import { VNodeListCell } from '../classes/VNodeList'
import { calculateNodeTitleX } from '../helpers/calculateNodeTitleX'
import { calculateTotalPinHeight } from '../helpers/calculateTotalPinHeight'
import { createPinRenderer } from './pin'
import { bullet } from '../helpers/bullet'

/**
 * Used to render nodes.
 *
 * @param current The current state of the node.
 */
export const renderNode = (cell: VNodeListCell) => {
    const state = cell.state.deref()
    const { template, selected, transform } = state
    const { label, material, shape, pins } = template

    const textHeight = label.position === 'inside' ? 2 * label.size : 0
    const maxPinsCount = Math.max(pins.inputs.length, pins.outputs.length)
    const totalPinsHeight = calculateTotalPinHeight(
        maxPinsCount,
        shape.pinRadius
    )
    const nodeHeight = 2 * shape.strokeWidth + textHeight + totalPinsHeight

    const inputPinRenderer = createPinRenderer(1, totalPinsHeight, state)
    const outputPinRenderer = createPinRenderer(-1, totalPinsHeight, state)

    const info = [
        `Name: ${label.text}`,
        '',
        `Description: ${label.description}`,
        '',
        'Inputs:',
        ...pins.inputs.map(pin => bullet(pin.label)),
        '',
        'Outputs:',
        ...pins.outputs.map(pin => bullet(pin.label))
    ].join('\n')

    return [
        'g',
        {
            class: 'unselectable',
            transform: `translate(${transform.position})`
        },
        ['title', info],
        [
            'rect',
            {
                id: cell.id,
                width: transform.scale[0],
                height: nodeHeight,
                fill: material.fill,
                opacity: material.opacity,
                stroke: selected
                    ? material.stroke.active
                    : material.stroke.normal,
                'stroke-width': shape.strokeWidth,
                rx: shape.borderRadius
            }
        ],
        [
            'text',
            {
                x: calculateNodeTitleX(state),
                y:
                    label.position === 'inside'
                        ? shape.strokeWidth + label.size / 2
                        : label.position === 'bottom-center'
                        ? nodeHeight + label.size / 2
                        : -label.size / 2 - shape.strokeWidth,
                'font-size': label.size,
                'text-anchor':
                    label.position === 'top-center' ||
                    label.position === 'bottom-center'
                        ? 'middle'
                        : 'start',
                'dominant-baseline':
                    label.position === 'inside' ||
                    label.position === 'bottom-center'
                        ? 'hanging'
                        : null,
                style: {
                    fill: label.fill
                },
                class: 'overpass'
            },
            label.text
        ],
        [
            'g',
            { transform: `translate(0,${textHeight + shape.strokeWidth})` },
            ...pins.inputs.flatMap(inputPinRenderer),
            ...pins.outputs.flatMap(outputPinRenderer)
        ]
    ]
}
