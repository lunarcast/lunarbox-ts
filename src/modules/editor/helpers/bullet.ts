/**
 * Adds a bullet at the start of a text. Useful for lists outside html.
 *
 * @param text The text to process.
 */
export const bullet = (text: string, prefix = '->') => ` ${prefix} ${text}`
