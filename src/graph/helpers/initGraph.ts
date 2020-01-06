import * as Option from '@adrielus/option'
import { fromIterable, metaStream, pubsub, stream, sync } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import { Label, SVariableInstance } from '../types/Labels'
import { SConnection, SInputPin, SNode, SOutputPin } from '../types/VGraph'
import { isOfLabel } from './labelValidation'

const labelToString = (label: Label) => {
    if (Label[label]) {
        return Label[label]
    }
}

const getConnectionStart = (connection: SConnection): SOutputPin =>
    connection.node().outputs[connection.index]

const getInputPinLabel = (
    pin: SInputPin,
    visitedInputs: Set<number>
): Label => {
    if (visitedInputs.has(pin.id)) {
        return Label.void
    }

    const connection = Option.get<SConnection>(pin.connection)
    const type = getOutputPinLabel(connection, visitedInputs.add(pin.id))

    const validationResult = pin.labelConstraint(type)

    if (!validationResult) {
        throw new Error(
            `Hey, it looks like the output pin gave me a "${labelToString(
                type
            )}", but the input pin was expecting ${
                pin.labelName === undefined
                    ? '"something else"'
                    : `a "${pin.labelName}"`
            }!`
        )
    }

    return type
}

const getInputPinLabels = (
    node: SNode,
    visitedInputs: Set<number>
): Label[] => {
    return node.inputs.map(pin => getInputPinLabel(pin, visitedInputs))
}

const getOutputPinLabel = (
    connection: SConnection,
    visitedInputs: Set<number>
): Label => {
    const start = getConnectionStart(connection)
    const startInputLabels = getInputPinLabels(connection.node(), visitedInputs)

    return start.computeOutputKind(startInputLabels)
}

const isUnknown = isOfLabel(Label.void)

export const initGraph = (_module: SNode[]) => {
    for (const node of _module) {
        const streams = node.inputs.map(input => {
            const connection = Option.get<SConnection>(input.connection)

            // validate input
            const type = getInputPinLabel(input, new Set())

            if (isUnknown(type)) {
                // TODO: better error message
                throw new Error('Cannot resolve label')
            }

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
