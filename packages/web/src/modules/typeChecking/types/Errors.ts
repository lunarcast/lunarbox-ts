import { Either } from 'fp-ts/es6/Either'
import { Object } from 'ts-toolbelt'
import { Label } from './Labels'

/**
 * Enum containing all possible errors which could occur
 * while validating a label.
 */
export enum LabelValidationFailureReasons {
    typeMismatch,
    unknownType
}

/**
 * Takes a reason and returns the details for the respective validation error.
 */
export type LabelValidationFailureReasonToType<
    T extends LabelValidationFailureReasons
> = {
    [LabelValidationFailureReasons.typeMismatch]: {
        expected: string
        found: string
    }
    [LabelValidationFailureReasons.unknownType]: {}
}[T]

/**
 * Takes a reason and produces a type for the respective error.
 */
export type LabelValidationError<
    T extends LabelValidationFailureReasons = LabelValidationFailureReasons
> = Object.Update<LabelValidationFailureReasonToType<T>, 'reason', T>

/**
 * Result of any label validation.
 */
export type LabelValidationResult<T extends Label = Label> = Either<
    LabelValidationError,
    T
>
