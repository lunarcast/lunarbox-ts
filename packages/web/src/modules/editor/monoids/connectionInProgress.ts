import { getTupleMonoid, Monoid } from 'fp-ts/es6/Monoid'
import { getLastMonoid } from 'fp-ts/es6/Option'
import { ConnectionInProgress } from '../types/ConnectionInProgress'

export const connectionInProgressMonoid: Monoid<ConnectionInProgress> = getTupleMonoid(
    getLastMonoid(),
    getLastMonoid()
)
