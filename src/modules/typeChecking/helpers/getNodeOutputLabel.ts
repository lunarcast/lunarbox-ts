import * as Either from 'fp-ts/es6/Either'
import { pipe } from 'fp-ts/es6/pipeable'
import { SConnection } from '../../dataflow/types/SGraph'
import { LabelValidationResult } from '../types/Errors'
import { getNodeInputPinLabel } from './getNodeInputLabel'
/**
 * Infers the label for any output pin.
 *
 * @notice Will return void if the label cannot be inferred.
 *
 * @param connection The connection pointing to the pin to get the label of.
 * @param visitedInputs Optional set of inputs already visited. Used to prevent infinite recursion.
 */
export const getNodeOutputLabel = (
    connection: SConnection,
    visitedInputs: Set<number>
): LabelValidationResult => {
    const start = connection.node()
    const startInputLabel = getNodeInputPinLabel(
        connection.node(),
        visitedInputs
    )

    return pipe(startInputLabel, Either.map(start.labelTransformer.outputLabel))
}
