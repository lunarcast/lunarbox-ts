import { LabelValidationFailureReasons } from './types/Errors'

/**
 * Error which should be thrown when finding a type which cannot be infered.
 */
export const unkownTypeError = {
    reason: LabelValidationFailureReasons.unkownType
}
