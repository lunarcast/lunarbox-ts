import { VNodeListCell } from '../classes/VNodeList'

/**
 * Used to render nodes.
 *
 * @param current The current state of the node.
 */
export const renderNode = (cell: VNodeListCell) => {
    const { template, selected, transform } = cell.state.deref()
    const { label, material, shape } = template

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

    const height = () => {
        const textOffset = label.position === 'inside' ? 2 * label.size : 0

        return 2 * shape.strokeWidth + textOffset
    }

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
                height: height(),
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
        ]
    ]
}
