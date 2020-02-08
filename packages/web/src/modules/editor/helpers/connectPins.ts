import { array } from 'fp-ts/es6/Array'
import { constant, Endomorphism, flow } from 'fp-ts/es6/function'
import * as Option from 'fp-ts/es6/Option'
import { none, option, some } from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import * as Reader from 'fp-ts/es6/Reader'
import { trySetAt } from '../../fp/array/helpers/tryUpdateAt'
import { pinTypes } from '../constants'
import { connectionInProgress, nodeById } from '../lenses/editorState'
import { connections } from '../lenses/vNodeState'
import { connectionInProgressMonoid } from '../monoids/connectionInProgress'
import { ConnectionInProgress } from '../types/ConnectionInProgress'
import { EditorState } from '../types/EditorState'
import { VPinPointer } from '../types/VPinPointer'

const deleteConnection = (pointer: VPinPointer) => {
    return flow(
        connectionInProgress.modify(trySetAt(pinTypes.input, none)),
        nodeById(pointer.id)
            .compose(connections)
            .modify(trySetAt(pointer.index, none))
    )
}

const addConnection = ([start, end]: VPinPointer[]) =>
    flow(
        connectionInProgress.set(connectionInProgressMonoid.empty),
        nodeById(end.id)
            .compose(connections)
            .modify(trySetAt(end.index, some(start)))
    )

const updateInputPin = (state: EditorState) => {
    return pipe(
        state.connectionInProgress,
        array.sequence(option),
        Option.fold(
            flow(
                constant(state.connectionInProgress[pinTypes.input]),
                Option.fold(() => constant(state), deleteConnection)
            ),
            addConnection
        )
    )
}

const setConnectionPointer = (
    opts: VPinPointer
): Endomorphism<ConnectionInProgress> => {
    return trySetAt(opts.type, some(opts))
}

export const connectPins = flow(
    setConnectionPointer,
    connectionInProgress.asSetter().modify,
    Reader.chain(updateInputPin)
)
