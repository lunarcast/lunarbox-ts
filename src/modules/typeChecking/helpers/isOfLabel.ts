import { LabelCode, LabelT, Label } from '../types/Labels'

/**
 * Takes in a label and creates a function which
 * checks if the input is equal to the initially passed label.
 *
 * @param type The type to create the function for.
 */
export const isOfLabel = <T extends LabelCode>(type: T): LabelT['guard'] => (
    input: Label
) => input[0] === type
