import { GestureEvent, GestureType } from '@thi.ng/rstream-gestures'
import * as tx from '@thi.ng/transducers'

/**
 * Filters out all gestures which don't match the
 * given type and return the gesture info
 *
 * @param type The type of the gesture to allow.
 */
export const gestureOfType = (type: GestureType) =>
    tx.comp(
        tx.filter((v: GestureEvent) => v[0] === type),
        tx.map(t => t[1])
    )
