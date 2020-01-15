/**
 * Curried version of String.prototype.startsWith.
 *
 * @param prefix The prefix to check for.
 */
export const startsWith = (prefix: string) => (str: string) =>
    str.startsWith(prefix)
