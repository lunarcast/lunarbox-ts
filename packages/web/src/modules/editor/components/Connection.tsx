import { add2 } from '@thi.ng/vectors'
import * as Option from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { h, Fragment } from 'preact'
import { pinTypes } from '../constants'
import { calculatePinPosition } from '../helpers/calculatePinPosition'
import { nodeById } from '../lenses/editorState'
import { EditorState } from '../types/EditorState'
import { VNodeState } from '../types/VNodeState'
import { pinFill } from '../helpers/pinFill'

interface Props {
    state: EditorState
    end: VNodeState
    index: number
}

const calculateAbsolutePinPosition = (
    index: number,
    nodeType: pinTypes,
    { transform, template }: VNodeState
) => {
    const position = calculatePinPosition(
        index,
        nodeType,
        transform.scale,
        template
    )

    return add2([], position, transform.position)
}

export const Connection = ({ state, end, index: endIndex }: Props) => {
    return pipe(
        end.connections[endIndex],
        Option.map(({ id, index: startIndex }) => {
            const connectionStartState = nodeById(id).get(state)

            const [x1, y1] = calculateAbsolutePinPosition(
                startIndex,
                pinTypes.output,
                connectionStartState
            )

            const [x2, y2] = calculateAbsolutePinPosition(
                endIndex,
                pinTypes.input,
                end
            )

            const radius = end.template.shape.pinRadius

            return (
                <line
                    strokeOpacity={0.75}
                    strokeWidth={radius}
                    strokeLinecap="round"
                    stroke={end.template.material.stroke.normal}
                    {...{ x1, x2, y1, y2 }}
                />
            )
        }),

        // for react to be able to handle Options
        Option.toNullable
    )
}
