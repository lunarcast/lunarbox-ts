import * as Array from 'fp-ts/es6/Array'
import { constant } from 'fp-ts/es6/function'
import * as Option from 'fp-ts/es6/Option'

/**
 * Same as Array.updateAt but returns the original array if the index is out of bounds
 *
 * @param i The index the update at
 * @param v The value to put in the index.
 */
export const tryUpdateAt = <T>(i: number, v: T) => (arr: T[]) =>
    Option.getOrElse(constant(arr))(Array.updateAt(i, v)(arr))
