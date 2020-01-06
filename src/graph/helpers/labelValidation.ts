import {
  Label,
  SVariableInstance,
  LabelToSVariable,
  SVariable
} from "../types/Labels";

export const isOfType = <T extends Label>(type: T) => (input: Label) =>
  input === type;
