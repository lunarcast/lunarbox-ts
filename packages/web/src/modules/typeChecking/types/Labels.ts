import { Option } from 'fp-ts/es6/Option'

export enum LabelCode {
    number,
    string,
    void,
    arrow,
    unknown
}

export type Label<T extends LabelCode = LabelCode> = [T, ...Label[]]
export type ArrowLabel<A extends Label, B extends Label> = [
    LabelCode.arrow,
    A,
    B
]

export type LabelT<A extends Label, B extends Label> = {
    mapValue: (v: LabelValue<A>) => LabelValue<B>
    mapLabel: (v: A) => Option<B>
}

export type LabelValue<T extends Label> = {
    [LabelCode.number]: number
    [LabelCode.string]: string
    [LabelCode.void]: null
    [LabelCode.unknown]: null
    [LabelCode.arrow]: LabelT<T[1], T[2]>
}[T[0]]
