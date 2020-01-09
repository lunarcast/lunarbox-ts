import { VNodeState } from '../types/EditorState'
import { VNodeListCell } from '../classes/VNodeList'

/**
 * Used to render nodes.
 *
 * @param current The current state of the node.
 */
export const renderNode = (cell: VNodeListCell) => {
    const current = cell.state.deref()
    const { active, normal } = current.template.material.stroke

    return [
        'g',
        [
            'text',
            {
                y: current.transform.position[1],
                x: current.transform.position[0],
                width: '100%',
                style: {
                    fill: 'red'
                }
            },
            current.template.name
        ],
        [
            'rect',
            {
                id: cell.id,
                x: current.transform.position[0],
                y: current.transform.position[1],
                width: current.transform.scale[0],
                height: current.transform.scale[1],
                fill: '#3C3C3C',
                stroke: current.selected ? active : normal,
                'stroke-width': 5
            }
        ]
    ]
}
