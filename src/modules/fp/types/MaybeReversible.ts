import { Option } from 'fp-ts/es6/Option'

/**
 * Operation which is reversible but doesn't always resolve to an actual value.
 */
export type MaybeReversible<A, B> = {
    do: (v: A) => Option<B>
    undo: (v: B) => Option<A>
}
