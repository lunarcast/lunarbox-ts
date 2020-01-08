import { VNodeState } from '../types/EditorState'

export const node = (current: VNodeState) => {
    return [
        'rect',
        {
            x: current.transform.position[0],
            y: current.transform.position[1],
            width: current.transform.scale[0],
            height: current.transform.scale[1],
            fill: 'white'
        }
    ]
}
