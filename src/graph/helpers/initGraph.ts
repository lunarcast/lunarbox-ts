import * as Option from '@adrielus/option'
import { fromIterable, metaStream, pubsub, stream, sync } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import { SVariableInstance } from '../types/Labels'
import { SConnection, SNode } from '../types/VGraph'
import { isUnknown } from './labelValidation'
import { getConnectionStart, getInputPinLabel } from './staticTyping'

export const initGraph = (_module: SNode[]) => {
    for (const node of _module) {
        const streams = node.inputs.map(input => {
            const connection = Option.get<SConnection>(input.connection)

            // validate input
            const type = getInputPinLabel(input, new Set())

            if (isUnknown(type)) {
                throw new Error(
                    'Hey, you are probably missing a connection or something because I cannot figure out the type of this input pin :3'
                )
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
