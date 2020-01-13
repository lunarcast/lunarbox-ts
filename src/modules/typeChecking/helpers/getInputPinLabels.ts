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
    // input pins get their labels by passing the label
    // of the connected output trough a special constraint predicate
    // given for each pin

    if (visitedInputs.has(pin.id)) {
        // if we already visited the pin we return void
        // I do this to prevent infinite recursion
        return Either.right(Label.void)
    }

    // infer the type of the connected pin
    const type = getOutputPinLabel(pin.connection, visitedInputs.add(pin.id))

    // this pipe is here to let typescript guess the type
    // for the callback given to Either.chain
    return pipe(
        type,
        Either.chain(found => {
            const success = pin.labelConstraint(found)

            // in case of no errors we just return the type we found
            if (success) {
                return Either.right(found)
            }

            // details used to generate friendly error messages
            const errorDetails = {
                found,
                expected: pin.labelName
            }

            // create an error builder for the type mismatch
            const buildError = createLabelValidationError(
                LabelValidationFailureReasons.typeMismatch
            )

            // first we build the error and than we mark it as an error
            return pipe(errorDetails, buildError, Either.left)
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
