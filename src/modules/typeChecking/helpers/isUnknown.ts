import { LabelCode } from '../types/Labels'
import { isOfLabel } from './isOfLabel'

/**
 * Returns true if the type is known, false otherwise
 */
export const isUnknown = isOfLabel(LabelCode.void)
