import { Label } from '../types/Labels'

/**
 * Takes a label and returns a string to be displayed to the user.
 *
 * @param label The label to stringify.
 */
export const labelToString = (label: Label) => {
    if (Label[label]) {
        return Label[label]
    }
}
