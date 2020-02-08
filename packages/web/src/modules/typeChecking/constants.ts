import { LabelValidationFailureReasons } from './types/Errors'

/**
 * Error which should be thrown when finding a type which cannot be inferred.
 */
export const unknownTypeError = {
    reason: LabelValidationFailureReasons.unknownType
}
