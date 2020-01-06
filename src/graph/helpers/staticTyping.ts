import * as Option from '@adrielus/option'
import { Label } from '../types/Labels'
import { SConnection, SInputPin, SNode, SOutputPin } from '../types/VGraph'

const labelToString = (label: Label) => {
    if (Label[label]) {
        return Label[label]
    }
}

export const getConnectionStart = (connection: SConnection): SOutputPin =>
    connection.node().outputs[connection.index]

export const getInputPinLabel = (
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
