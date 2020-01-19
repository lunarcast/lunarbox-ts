import * as Record from 'fp-ts/es6/Record'
import { flow, tuple } from 'fp-ts/es6/function'
import { snd } from 'fp-ts/es6/Tuple'
import { pipe } from 'fp-ts/es6/pipeable'

/**
 *  Typesafe version of Object.values()
 *
 * @param r The record to get the values of.
 */
export const getRecordValues = <T extends string | symbol | number, U>(
    r: Record<T, U>
) => pipe(r, Record.collect(flow(tuple, snd)))
