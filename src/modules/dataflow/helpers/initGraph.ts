import { fromIterable, metaStream, pubsub, stream, sync } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import * as Either from 'fp-ts/es6/Either'
import { pipe } from 'fp-ts/es6/pipeable'
import { unkownTypeError } from '../../typeChecking/constants'
import { getConnectionStart } from '../../typeChecking/helpers/getConnectionStart'
import { getInputPinLabel } from '../../typeChecking/helpers/getInputPinLabels'
import { isUnknown } from '../../typeChecking/helpers/isUnknown'
import { LabelValidationError } from '../../typeChecking/types/Errors'
import { SVariableInstance } from '../../typeChecking/types/Labels'
import { SNode } from '../types/SGraph'

export const initGraph = (_module: SNode[]) => {
    for (const node of _module) {
        const streams = node.inputs.map(input => {
            const connection = input.connection

            // validate input
            const type = getInputPinLabel(input, new Set())

            if (
                pipe(
                    type,
                    Either.filterOrElse(isUnknown, () => unkownTypeError),
                    Either.isLeft
                )
            ) {
                const { left: error } = type as Either.Left<
                    LabelValidationError
                >

                throw error
            }

            // This comment was from a random joke you most probably can't understand
            // So just skip over it please:

            // I din't to it, it wasn't me!!! See? I am coding!!!

            return getConnectionStart(connection).source
        })

        const merged = sync<
            SVariableInstance,
            Record<string, SVariableInstance>
        >({
            src: streams,
            all: true
        }).transform(tx.map(o => Object.values(o)))

        const results = merged.transform(tx.map(node.transformation))

        const indexedResults = results.subscribe(
            metaStream((inputs: SVariableInstance[]) =>
                fromIterable(tx.indexed(inputs))
            )
        )

        const splitter = pubsub({
            topic: (a: [number, SVariableInstance]) => a[0]
        })

        indexedResults.subscribe(splitter)

        for (let index = 0; index < node.outputs.length; index++) {
            const pipe = stream<[number, SVariableInstance]>().transform(
                tx.map(v => v[1])
            )

            splitter.subscribeTopic(index, pipe)
            pipe.subscribe(node.outputs[index].source)
        }
    }
}
