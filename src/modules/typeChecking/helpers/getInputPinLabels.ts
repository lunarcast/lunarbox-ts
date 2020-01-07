import * as Either from 'fp-ts/es6/Either'
import { pipe } from 'fp-ts/es6/pipeable'
import { SInputPin, SNode } from '../../dataflow/types/SGraph'
import {
    LabelValidationFailureReasons,
    LabelValidationResult
} from '../types/Errors'
import { Label } from '../types/Labels'
import { createLabelValidationError } from './createLabelValidationError'
import { getOutputPinLabel } from './getOutputPinLabel'

/**
 * Infers the label of any input pin.
 *
 * @param pin The pin to get the label for.
 * @param visitedInputs Optional set of inputs already visited. Used to prevent infinite recursion.
 */
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

/**
 * Infers the labels for all the input pins of any node.
 *
 * @param node The node to infer the input pins for.
 * @param visitedInputs Optional set of inputs already visited. Used to prevent infinite recursion.
 */
export const getInputPinLabels = (
    node: SNode,
    visitedInputs: Set<number>
): LabelValidationResult[] => {
    return node.inputs.map(pin => getInputPinLabel(pin, visitedInputs))
}
