import { VPinPointer } from './VPinPointer'
import { pinTypes } from '../constants'
import { Option } from 'fp-ts/es6/Option'

/**
 * State for current selected pins.
 */
export type ConnectionInProgress = Record<pinTypes, Option<VPinPointer>>
