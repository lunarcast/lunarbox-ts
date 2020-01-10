import { VNodeListCell } from '../classes/VNodeList'
import { bullet } from '../helpers/bullet'
import { calculateTotalPinWidth } from '../helpers/calculateTotalPinWidth'
import { createPinRenderer } from './pin'
import { sub2, divN2, add2 } from '@thi.ng/vectors'

/**
 * Used to render nodes.
 *
 * @param current The current state of the node.
 */
export const renderNode = (cell: VNodeListCell) => {
    const state = cell.state.deref()
    const { template, selected, transform } = state
    const { label, material, shape, pins, content } = template

    const maxPinsCount = Math.max(pins.inputs.length, pins.outputs.length)
    const totalPinsWidth = calculateTotalPinWidth(maxPinsCount, shape.pinRadius)
    const nodeWidth = Math.max(
        2 * shape.strokeWidth + totalPinsWidth,
        transform.scale[0],
        content.scale[0] + 2 * content.margin
    )
    const nodeHeight = Math.max(
        transform.scale[1],
        content.scale[1] + 2 * content.margin + 2 * shape.pinRadius
    )
    const scale = [nodeWidth, nodeHeight] as [number, number]

    const inputPinRenderer = createPinRenderer(1, scale, state)
    const outputPinRenderer = createPinRenderer(-1, scale, state)

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
                id: `node-${cell.id}`,
                width: nodeWidth,
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
                x: nodeWidth + 2 * shape.strokeWidth + label.size / 2,
                y: nodeHeight / 2,
                'font-size': label.size,
                'dominant-baseline': 'middle',
                'text-anchor': 'start',
                style: {
                    fill: label.fill
                },
                class: 'overpass'
            },
            label.text
        ],
        [
            'g',
            ...pins.inputs.flatMap(inputPinRenderer),
            ...pins.outputs.flatMap(outputPinRenderer)
        ],
        [
            'g',
            {
                id: `node-${cell.id}`,
                transform: `translate(${divN2(
                    null,
                    sub2([], scale, content.scale),
                    2
                )})`
            },
            content.generate(cell)
        ]
    ]
}
