import { lens } from 'lens.ts'

/**
 * Lens for any html element.
 */
export const HtmlLens = lens<HTMLElement>()

/**
 * Get the id of any html element.
 */
export const getElementId = HtmlLens.id.get()
