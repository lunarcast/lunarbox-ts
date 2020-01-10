import { VNodeListCell } from '../classes/VNodeList'

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

    const textOffset = label.position === 'inside' ? 2 * label.size : 0
    const maxPinsCount = Math.max(pins.inputs, pins.outputs)
    const maximumPinSpace = calculatePinSpace(maxPinsCount, shape.pinRadius)

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

    const height = 2 * shape.strokeWidth + textOffset + maximumPinSpace

    const pinRenderer = (x: number, offset: number, total: number) => (
        index: number
    ) => {
        const y = calculatePinSpace(index, shape.pinRadius) + shape.pinRadius
        const yOffset =
            offset +
            (maximumPinSpace - calculatePinSpace(total, shape.pinRadius)) / 2

        return [
            'circle',
            {
                r: shape.pinRadius,
                cx: x,
                cy: y + yOffset,
                fill: selected ? material.stroke.active : material.stroke.normal
            }
        ]
    }

    const inputPinRenderer = pinRenderer(
        0,
        textOffset + shape.strokeWidth,
        pins.inputs
    )
    const outputPinRenderer = pinRenderer(
        transform.scale[1],
        textOffset + shape.strokeWidth,
        pins.outputs
    )

    return [
        'g',
        {
            class: 'unselectable',
            transform: `translate(${transform.position})`
        },
        [
            'rect',
            {
                id: cell.id,
                width: transform.scale[0],
                height,
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
        ...Array(pins.inputs)
            .fill(1)
            .map((_, i) => inputPinRenderer(i)),

        ...Array(pins.outputs)
            .fill(1)
            .map((_, i) => outputPinRenderer(i))
    ]
}
