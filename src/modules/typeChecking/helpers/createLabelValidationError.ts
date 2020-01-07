import {
    LabelValidationError,
    LabelValidationFailureReasons,
    LabelValidationFailureReasonToType
} from '../types/Errors'

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
