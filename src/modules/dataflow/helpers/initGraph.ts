import { pubsub, sync } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import * as Either from 'fp-ts/es6/Either'
import * as IO from 'fp-ts/es6/IO'
import { pipe } from 'fp-ts/es6/pipeable'
import { unknownTypeError } from '../../typeChecking/constants'
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
                    Either.filterOrElse(isUnknown, IO.of(unknownTypeError)),
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

            // I didn't to it, it wasn't me!!! See? I am coding!!!

            return getConnectionStart(connection).source
        })

        const indexedResults = sync<
            SVariableInstance,
            Record<string, SVariableInstance>
        >({
            src: streams
        }).transform(
            tx.map(Object.values),
            tx.mapcat(node.transformation),
            tx.indexed()
        )

        const splitter = pubsub({
            topic: (a: [number, SVariableInstance]) => a[0]
        })

        indexedResults.subscribe(splitter)

        for (let index = 0; index < node.outputs.length; index++) {
            splitter
                .subscribeTopic(
                    index,
                    tx.map(v => v[1])
                )
                .subscribe(node.outputs[index].source)
        }
    }
}
