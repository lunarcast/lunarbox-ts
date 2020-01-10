/**
 * Takes some text and a length and returns a string of
 * the text with the desired lenght (In case the text is too long adds ... at the end)
 *
 * @param length The desired length for the text.
 * @param text The text to process.
 */
export const ensureLength = (length: number, text: string) => {
    if (text.length <= length) {
        return text
    }

    return `${text.substr(0, length - 3)}...`
}
