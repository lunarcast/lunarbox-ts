import { pinTypes } from '../constants'

/**
 * Struct pointing to a pin in the current editor.
 */
export interface VPinPointer {
    index: number
    id: number
    type: pinTypes
}
