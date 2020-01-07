import { IColor, asCSS } from '@thi.ng/color'

/**
 * Mixin to set the backgounrd color of an element.
 *
 * @param color The color to use for the background.
 */
export const background = (...params: Parameters<typeof asCSS>) => ({
    background: asCSS(...params)
})
