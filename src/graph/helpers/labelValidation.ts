import { Label } from '../types/Labels'
import {
    LabelValidationFailureReasons,
    LabelValidationError,
    LabelValidationFailureReasonToType
} from '../types/Errors'

export const isOfLabel = <T extends Label>(type: T) => (input: Label) =>
    input === type

export const isUnknown = isOfLabel(Label.void)

/**
 * Creates a function used to create errors with the initially given reason.
 *
 * @param reason The reason for the error
 */
export const createLabelValidationError = <
    T extends LabelValidationFailureReasons
>(
    reason: T
) => (
    details: LabelValidationFailureReasonToType<T>
): LabelValidationError<T> => ({
    reason,
    ...details
})

export const unkownTypeError = {
    reason: LabelValidationFailureReasons.unkownType
}
