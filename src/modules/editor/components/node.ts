import { VNodeListCell } from '../classes/VNodeList'
import { PinTemplate } from '../types/VNodeTemplate'
import { ensureLength } from '../helpers/ensureLength'

const bullet = (text: string) => ` -> ${text}`

const calculatePinSpace = (total: number, radius: number) =>
    (total * 2 + 1) * radius * 2

/**
 * Used to render nodes.
 *
 * @param current The current state of the node.
 */
export const renderNode = (cell: VNodeListCell) => {
    const { template, selected, transform } = cell.state.deref()
    const { label, material, shape, pins } = template

    /**
     * Represents the total height of the text (+ spacing around it).
     * Used to calculate the node height and stuff.
     */
    const textHeight = label.position === 'inside' ? 2 * label.size : 0

    /**
     * Maximum number of pins. Used for calculating the node height.
     */
    const maxPinsCount = Math.max(pins.inputs.length, pins.outputs.length)

    /**
     * Maximum amount of space the pins of the current node can take.
     * Useful for calculating the node total height and rendering pins
     * cenered vertically.
     */
    const maximumPinSpace = calculatePinSpace(maxPinsCount, shape.pinRadius)

    /**
     * Helper for getting the horizontal position of the lable
     * dependeing of ths position attribute in the template.
     */
    const labelX = () => {
        switch (label.position) {
            case 'inside':
                return shape.strokeWidth + label.size / 2
            case 'top-left':
                return shape.borderRadius
            case 'top-center':
                return transform.scale[0] / 2
        }
    }

    const nodeHeight = 2 * shape.strokeWidth + textHeight + maximumPinSpace

    const pinRenderer = (offset: number, total: number, direction: 1 | -1) => (
        pin: PinTemplate,
        index: number
    ) => {
        const rawY = calculatePinSpace(index, shape.pinRadius) + shape.pinRadius
        const yOffset =
            offset +
            (maximumPinSpace - calculatePinSpace(total, shape.pinRadius)) / 2
        const y = rawY + yOffset
        const x = direction === 1 ? 0 : transform.scale[1]

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
            [
                'text',
                {
                    'dominant-baseline': 'middle',
                    'text-anchor': direction === 1 ? 'start' : 'end',
                    y,
                    x: x + direction * shape.pinRadius * 2,
                    fill: material.pinLabelFIll
                },
                ensureLength(10, pin.label)
            ]
        ]
    }

    const inputPinRenderer = pinRenderer(
        textHeight + shape.strokeWidth,
        pins.inputs.length,
        1
    )
    const outputPinRenderer = pinRenderer(
        textHeight + shape.strokeWidth,
        pins.outputs.length,
        -1
    )

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
                x: labelX(),
                y:
                    label.position === 'inside'
                        ? shape.strokeWidth + label.size / 2
                        : -label.size / 2 - shape.strokeWidth,
                'font-size': label.size,
                'text-anchor':
                    label.position === 'top-center' ? 'middle' : 'start',
                'dominant-baseline':
                    label.position === 'inside' ? 'hanging' : null,
                style: {
                    fill: label.fill
                }
            },
            label.text
        ],
        ...pins.inputs.flatMap(inputPinRenderer),
        ...pins.outputs.flatMap(outputPinRenderer)
    ]
}
