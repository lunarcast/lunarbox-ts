export const ensureLength = (length: number, text: string) => {
    if (text.length <= length) {
        return text
    }

    return `${text.substr(0, length - 3)}...`
}
