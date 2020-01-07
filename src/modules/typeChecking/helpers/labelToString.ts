import { Label } from '../types/Labels'

/**
 * Takes a label and returns a string to be displayed to the user.
 *
 * @param label The label to stringify.
 */
export const labelToString = (label: Label) => {
    // typescript enums are double maps
    // that means enum[a] = b <=> enum[b] = a
    // We can use this to extract the name of the label code
    return Label[label]
}
