import { array } from 'fp-ts/es6/Array'
import { constant, Endomorphism, flow, identity } from 'fp-ts/es6/function'
import * as Option from 'fp-ts/es6/Option'
import { option, some } from 'fp-ts/es6/Option'
import * as Reader from 'fp-ts/es6/Reader'
import { tryUpdateAt } from '../../fp/array/helpers/tryUpdateAt'
import { connectionInProgress, nodeById } from '../lenses/editorState'
import { connections } from '../lenses/vNodeState'
import { connectionInProgressMonoid } from '../monoids/connectionInProgress'
import { ConnectionInProgress } from '../types/ConnectionInProgress'
import { EditorState } from '../types/EditorState'
import { VPinPointer } from '../types/VPinPointer'

const updateInputPin = Option.fold(
    constant<Endomorphism<EditorState>>(identity),
    ([start, end]) =>
        flow(
            connectionInProgress.set(connectionInProgressMonoid.empty),
            nodeById(end.nodeId)
                .compose(connections)
                .modify(tryUpdateAt(end.index, some(start)))
        )
)

const setConnectionPointer = (
    opts: VPinPointer
): Endomorphism<ConnectionInProgress> => {
    return tryUpdateAt(opts.type, some(opts))
}

export const connectPins = flow(
    setConnectionPointer,
    connectionInProgress.asSetter().modify,
    Reader.map(state => state.connectionInProgress),
    Reader.map(array.sequence(option)),
    Reader.chain(updateInputPin)
)
