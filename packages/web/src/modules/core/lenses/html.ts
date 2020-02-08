import { Lens } from 'monocle-ts'
/**
 * Lens for any html element.
 */
const HtmlLens = Lens.fromProp<HTMLElement>()

/**
 * Get the id of any html element.
 */
export const getElementId = HtmlLens('id').asGetter().get
