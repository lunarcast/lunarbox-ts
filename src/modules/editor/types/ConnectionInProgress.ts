import { Option } from 'fp-ts/es6/Option'
import { VPinPointer } from './VPinPointer'

/**
 * State for current selected pins.
 */
export type ConnectionInProgress = Option<VPinPointer>[]
