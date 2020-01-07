import * as Array from 'fp-ts/es6/Array'
import * as Either from 'fp-ts/es6/Either'
import { pipe } from 'fp-ts/es6/pipeable'
import { SConnection } from '../../dataflow/types/SGraph'
import { LabelValidationResult } from '../types/Errors'
import { getConnectionStart } from './getConnectionStart'
import { getInputPinLabels } from './getInputPinLabels'

/**
 * Infers the label for any output pin.
 *
 * @notice Will return void if the label cannot be infered.
 *
 * @param connection The connection pointing to the pin to get the label of.
 * @param visitedInputs Optional set of inputs already visited. Used to prevent infinite recursion.
 */
export const getOutputPinLabel = (
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
