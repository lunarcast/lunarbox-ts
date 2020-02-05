import * as Either from 'fp-ts/es6/Either'
import { pipe } from 'fp-ts/es6/pipeable'
import { SInputPin, SNode } from '../../dataflow/types/SGraph'
import {
    LabelValidationFailureReasons,
    LabelValidationResult
} from '../types/Errors'
import { LabelCode } from '../types/Labels'
import { createLabelValidationError } from './createLabelValidationError'
import { getNodeOutputLabel } from './getNodeOutputLabel'

/**
 * Infers the label of any input pin.
 *
 * @param node The pin to get the label for.
 * @param visitedInputs Optional set of inputs already visited. Used to prevent infinite recursion.
 */
export const getNodeInputPinLabel = (
    node: SNode,
    visitedInputs: Set<number>
): LabelValidationResult => {
    // input pins get their labels by passing the label
    // of the connected output trough a special constraint predicate
    // given for each pin

    if (visitedInputs.has(node.id)) {
        // if we already visited the pin we return void
        // I do this to prevent infinite recursion
        return Either.right([LabelCode.void])
    }

    // infer the type of the connected pin
    const type = getNodeOutputLabel(node.input, visitedInputs.add(node.id))

    // this pipe is here to let typescript guess the type
    // for the callback given to Either.chain
    return pipe(
        type,
        Either.chain(found => {
            const success = node.labelTransformer.guard(found)

            // in case of no errors we just return the type we found
            if (success) {
                return Either.right(found)
            }

            // details used to generate friendly error messages
            const errorDetails = {
                found: 'a',
                expected: 'b'
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
