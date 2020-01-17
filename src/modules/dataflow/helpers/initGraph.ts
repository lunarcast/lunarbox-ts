import { sync } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import * as Either from 'fp-ts/es6/Either'
import { flow, tuple } from 'fp-ts/es6/function'
import * as IO from 'fp-ts/es6/IO'
import { pipe } from 'fp-ts/es6/pipeable'
import * as Record from 'fp-ts/es6/Record'
import { snd } from 'fp-ts/es6/Tuple'
import { unknownTypeError } from '../../typeChecking/constants'
import { getConnectionStart } from '../../typeChecking/helpers/getConnectionStart'
import { getInputPinLabel } from '../../typeChecking/helpers/getInputPinLabels'
import { isUnknown } from '../../typeChecking/helpers/isUnknown'
import { SVariableInstance } from '../../typeChecking/types/Labels'
import { SNode } from '../types/SGraph'

export const initGraph = (_module: SNode[]) => {
    for (const node of _module) {
        const streams = node.inputs.map(input => {
            // validate input
            const type = getInputPinLabel(input, new Set())

            if (
                pipe(
                    type,
                    Either.filterOrElse(isUnknown, IO.of(unknownTypeError))
                ) &&
                type._tag === 'Left'
            ) {
                throw type.left
            }

            // This comment was from a random joke you most probably can't understand
            // So just skip over it please:

            // I didn't to it, it wasn't me!!! See? I am coding!!!

            return getConnectionStart(input.connection).source
        })

        const indexedResults = sync<
            SVariableInstance,
            Record<string, SVariableInstance>
        >({
            src: streams
        }).transform(
            tx.map(flow(Record.collect(flow(tuple, snd)), node.transformation))
        )

        node.outputs.forEach((node, index) =>
            indexedResults
                .transform(tx.map(outputs => outputs[index]))
                .subscribe(node.source)
        )
    }
}
