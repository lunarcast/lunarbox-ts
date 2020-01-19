import * as Array from 'fp-ts/es6/Array'
import { pipe } from 'fp-ts/es6/pipeable'
import { Fragment, h } from 'preact'
import { nodeById } from '../lenses/editorState'
import { EditorState } from '../types/EditorState'
import { Connection } from './Connection'
import { connections } from '../lenses/vNodeState'

interface Props {
    state: EditorState
    id: number
}

/**
 * Component to render the connections of 1 node
 */
export const NodeConnections = ({ id, state }: Props) => {
    const node = nodeById(id).get(state)

    const content = node.connections.map((_, index) => (
        <Connection
            key={`${index}-${id}`}
            output={node}
            state={state}
            index={index}
        />
    ))

    return <Fragment>{content}</Fragment>
}
