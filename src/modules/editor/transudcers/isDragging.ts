import * as tx from '@thi.ng/transducers'
import { GestureInfo } from '@thi.ng/rstream-gestures'

/**
 * This is here because of a bug with the gestures package.
 * I opened a PR to fix it so I'll remove this as
 * the new version gets released.
 */
export const isDragging = () => tx.filter((ev: GestureInfo) => ev.buttons !== 0)
