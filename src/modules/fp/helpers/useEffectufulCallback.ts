import { IO } from 'fp-ts/es6/IO'
import { flow } from 'fp-ts/es6/function'

/**
 * Takes a function and returns another one which runs the returned side effects
 *
 * @param func The function to create the callback from.
 */
export const useEffectufulCallback = <T, U>(func: (v: T) => IO<U>) =>
    flow(func, v => v())
