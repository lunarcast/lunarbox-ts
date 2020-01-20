import { getStructMonoid } from 'fp-ts/es6/Monoid'
import { pinTypes } from '../constants'
import { getLastMonoid } from 'fp-ts/es6/Option'
import { ConnectionInProgress } from '../types/ConnectionInProgress'

export const connectionInProgressMonoid = getStructMonoid<ConnectionInProgress>(
    {
        [pinTypes.input]: getLastMonoid(),
        [pinTypes.output]: getLastMonoid()
    }
)
