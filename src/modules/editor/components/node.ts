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

    return [
        'g',
        {
            transform: `translate(${transform.position})`
        },
        [
            'rect',
            {
                id: cell.id,
                width: transform.scale[0],
                height: transform.scale[1],
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
                        ? shape.strokeWidth + label.size
                        : -label.size - shape.strokeWidth,
                'font-size': label.size,
                'text-anchor':
                    label.position === 'top-center' ? 'middle' : 'start',
                'dominant-baseline':
                    label.position === 'inside' ? null : 'hanging',
                style: {
                    fill: label.fill
                }
            },
            label.text
        ]
    ]
}
