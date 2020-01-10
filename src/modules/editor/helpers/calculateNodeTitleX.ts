import { VNodeState } from '../types/EditorState'

/**
 * Calculates the horizontal position of a node label
 *
 * @param param0 State to calculate the label x for.
 */
export const calculateNodeTitleX = ({
    transform,
    template: { label, shape }
}: VNodeState) => {
    switch (label.position) {
        case 'inside':
            return shape.strokeWidth + label.size / 2
        case 'top-left':
            return shape.borderRadius
        case 'top-center':
        case 'bottom-center':
            return transform.scale[0] / 2
    }
}
