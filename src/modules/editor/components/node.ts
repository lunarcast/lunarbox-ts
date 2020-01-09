import { VNodeState } from '../types/EditorState'
import { VNodeListCell } from '../classes/VNodeList'

/**
 * Used to render nodes.
 *
 * @param current The current state of the node.
 */
export const renderNode = (cell: VNodeListCell) => {
    const current = cell.state.deref()

    return [
        'rect',
        {
            id: cell.id,
            x: current.transform.position[0],
            y: current.transform.position[1],
            width: current.transform.scale[0],
            height: current.transform.scale[1],
            fill: '#3C3C3C',
            stroke: current.selected ? '#76FF02' : '#3FC4FF',
            'stroke-width': 5
        }
    ]
}
