import { Predicate } from 'fp-ts/es6/function'
import { MaybeReversible } from '../../fp/types/MaybeReversible'

export enum LabelCode {
    number,
    string,
    void,
    arrow,
    unknown
}

export type Label<T extends LabelCode = LabelCode> = [T, ...Label[]]

export type LabelT<T extends Label = Label, O extends Label = Label> = {
    transform: (v: LabelValue<T>) => LabelValue<O>
    typeGuards: MaybeReversible<T, O>
}

export type LabelValue<T extends Label> = {
    [LabelCode.number]: number
    [LabelCode.string]: string
    [LabelCode.void]: null
    [LabelCode.unknown]: null
    [LabelCode.arrow]: LabelT<T[1], T[2]>
}[T[0]]
