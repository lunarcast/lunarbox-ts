import { contramap, ordNumber } from 'fp-ts/es6/Ord'
import { VNodeState } from '../types/VNodeState'
/**
 * Used to sort nodes.
 */
export const vNodeOrd = contramap((node: VNodeState) => node.transform.zIndex)(
    ordNumber
)
