import { add2 } from '@thi.ng/vectors'
import * as Option from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { h } from 'preact'
import { nodeTypes } from '../constants'
import { nodeById } from '../lenses/editorState'
import { EditorState, VNodeState } from '../types/EditorState'
import { calculatePinPosition } from './Pin'

interface Props {
    state: EditorState
    output: VNodeState
    index: number
}

const calculateAbsolutePinPosition = (
    index: number,
    nodeType: nodeTypes,
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
                nodeTypes.input,
                nodeById(nodeId).get(state)
            )

            const [x2, y2] = calculateAbsolutePinPosition(
                outputIndex,
                nodeTypes.output,
                output
            )

            return <line {...{ x1, x2, y1, y2 }}></line>
        }),

        // for react to be able to handle Options
        Option.toNullable
    )
}
