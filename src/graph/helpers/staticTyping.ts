import * as Array from 'fp-ts/es6/Array'
import * as Either from 'fp-ts/es6/Either'
import { pipe } from 'fp-ts/es6/pipeable'
import {
    LabelValidationFailureReasons,
    LabelValidationResult
} from '../types/Errors'
import { Label } from '../types/Labels'
import { SConnection, SInputPin, SNode, SOutputPin } from '../types/VGraph'
import { createLabelValidationError } from './labelValidation'

export const labelToString = (label: Label) => {
    if (Label[label]) {
        return Label[label]
    }
}

export const getConnectionStart = (connection: SConnection): SOutputPin =>
    connection.node().outputs[connection.index]

export const getInputPinLabel = (
    pin: SInputPin,
    visitedInputs: Set<number>
): LabelValidationResult => {
    if (visitedInputs.has(pin.id)) {
        return Either.right(Label.void)
    }

    const type = getOutputPinLabel(pin.connection, visitedInputs.add(pin.id))

    return pipe(
        type,
        Either.chain(found => {
            const succes = pin.labelConstraint(found)

            if (succes) {
                return Either.right(found)
            }

            const errorDetails = {
                found,
                expected: pin.labelName
            }

            return pipe(
                errorDetails,
                createLabelValidationError(
                    LabelValidationFailureReasons.typeMismatch
                ),
                Either.left
            )
        })
    )
}

const getInputPinLabels = (
    node: SNode,
    visitedInputs: Set<number>
): LabelValidationResult[] => {
    return node.inputs.map(pin => getInputPinLabel(pin, visitedInputs))
}

const getOutputPinLabel = (
    connection: SConnection,
    visitedInputs: Set<number>
): LabelValidationResult => {
    const start = getConnectionStart(connection)
    const startInputLabels = getInputPinLabels(connection.node(), visitedInputs)

    return pipe(
        startInputLabels,
        Array.array.sequence(Either.either),
        Either.map(start.computeOutputKind)
    )
}
