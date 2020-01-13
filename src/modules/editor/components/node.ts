import { divN2, sub2 } from '@thi.ng/vectors'
import { VNodeListCell } from '../classes/VNodeList'
import { bullet } from '../helpers/bullet'
import { calculateTotalPinWidth } from '../helpers/calculateTotalPinWidth'
import { createPinRenderer } from './pin'

interface DropShadowOpts {
    id: string
    offset: [number, number]
    blur: number
    opacity: number
    fill: string
}

const dropShadow = ({ opacity, id, offset, blur, fill }: DropShadowOpts) => {
    return [
        'filter',
        { id, height: '130%' },
        [
            'feDropShadow',
            {
                dx: offset[0],
                dy: offset[1],
                stdDeviation: blur,
                'flood-color': fill,
                'flood-opacity': opacity
            }
        ]
    ]
}

interface SoftUiOpts {
    id: string
    offset: [number, number]
    blur: number
    opacity: number
    fills: [string, string]
}

const softUiShadow = ({ id, offset, blur, fills, opacity }: SoftUiOpts) => {
    return [
        'filter',
        { id },
        [
            'feDropShadow',
            {
                dx: offset[0],
                dy: offset[1],
                stdDeviation: blur,
                'flood-color': fills[0],
                'flood-opacity': opacity,
                result: 'shadow-down',
                in: 'SourceGraphic'
            }
        ],
        [
            'feDropShadow',
            {
                dx: -offset[0],
                dy: -offset[1],
                stdDeviation: blur,
                'flood-color': fills[1],
                'flood-opacity': opacity,
                result: 'shadow-up',
                in: 'SourceGraphic'
            }
        ],
        [
            'feMerge',
            ['feMergeNode', { in: 'shadow-up' }],
            ['feMergeNode', { in: 'shadow-down' }]
        ]
    ]
}

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
        softUiShadow({
            blur: 0,
            fills: ['#000000', '#555555'],
            id: `drop-${cell.id}`,
            offset: [7, 7],
            opacity: 0.5
        }),
        [
            'rect',
            {
                filter: `url(#drop-${cell.id})`,
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
