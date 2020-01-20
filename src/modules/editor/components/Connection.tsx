import { add2 } from '@thi.ng/vectors'
import * as Option from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { h } from 'preact'
import { pinTypes } from '../constants'
import { nodeById } from '../lenses/editorState'
import { EditorState } from '../types/EditorState'
import { VNodeState } from '../types/VNodeState'
import { calculatePinPosition } from './Pin'

interface Props {
    state: EditorState
    output: VNodeState
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

export const Connection = ({ state, output, index: outputIndex }: Props) => {
    const connection = output.connections[outputIndex]

    return pipe(
        connection,
        Option.map(({ nodeId, index: inputIndex }) => {
            const [x1, y1] = calculateAbsolutePinPosition(
                inputIndex,
                pinTypes.input,
                nodeById(nodeId).get(state)
            )

            const [x2, y2] = calculateAbsolutePinPosition(
                outputIndex,
                pinTypes.output,
                output
            )

            return (
                <line width="2px" stroke="blue" {...{ x1, x2, y1, y2 }}></line>
            )
        }),

        // for react to be able to handle Options
        Option.toNullable
    )
}
