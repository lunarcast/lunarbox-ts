/**
 * Labels for primitives
 */
export enum PrimitiveLabels {
  number,
  string,
  boolean
}

// Labels are basically vpt types
// We might have more types than just primitives
export type Label = PrimitiveLabels;

// Base type for all variables
export type SVariable<T extends Label = Label, U extends unknown = unknown> = {
  type: T;
  value: U;
};

/**
 * Convert label to inner type
 */
export type LabelToType<T extends Label> = {
  [PrimitiveLabels.number]: number;
  [PrimitiveLabels.boolean]: boolean;
  [PrimitiveLabels.string]: string;
}[T];

/**
 * Convert label to variable type
 */
export type LabelToSVariable<T extends Label> = SVariable<T, LabelToType<T>>;

export type SNumber = LabelToSVariable<PrimitiveLabels.number>;
export type SString = LabelToSVariable<PrimitiveLabels.string>;
export type SBoolean = LabelToSVariable<PrimitiveLabels.boolean>;

// Primitives can be either of those 3
export type SPrimitive = SNumber | SString | SBoolean;

// We might add more than just primitives later so we create an alias for this
export type SVariableInstance = SPrimitive;
