import { Either } from 'fp-ts/es6/Either'
import { Label } from './Labels'

export enum LabelValidationFailureReasons {
    typeMismatch,
    unkownType
}

export type LabelValidationFailureReasonToType<
    T extends LabelValidationFailureReasons
> = {
    [LabelValidationFailureReasons.typeMismatch]: {
        expected: string
        found: Label
    }
    [LabelValidationFailureReasons.unkownType]: {}
}[T]

export type LabelValidationError<
    T extends LabelValidationFailureReasons = LabelValidationFailureReasons
> =
    | ({
          reason: T
      } & LabelValidationFailureReasonToType<T>)
    | LabelValidationError<T>[]

export type LabelValidationResult = Either<LabelValidationError, Label>
