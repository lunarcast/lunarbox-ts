// Labels are basically vpt types
// We might have more types than just primitives
export enum Label {
    number,
    string,
    boolean,
    void
}

// Base type for all variables
export type SVariable<T extends Label = Label, U extends unknown = unknown> = {
    type: T
    value: U
}

/**
 * Convert label to inner type
 */
export type LabelToType<T extends Label> = {
    [Label.number]: number
    [Label.boolean]: boolean
    [Label.string]: string
    [Label.void]: null
}[T]

/**
 * Convert label to variable type
 */
export type LabelToSVariable<T extends Label> = SVariable<T, LabelToType<T>>

export type SNumber = LabelToSVariable<Label.number>
export type SString = LabelToSVariable<Label.string>
export type SBoolean = LabelToSVariable<Label.boolean>
export type SVoid = LabelToSVariable<Label.void>

// Primitives can be either of those 3
export type SPrimitive = SNumber | SString | SBoolean

// We might add more than just primitives later so we create an alias for this
export type SVariableInstance = SPrimitive
