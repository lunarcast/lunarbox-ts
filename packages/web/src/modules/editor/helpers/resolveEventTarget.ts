import { Predicate } from 'fp-ts/es6/function'
import * as Option from 'fp-ts/es6/Option'
import { pipe } from 'fp-ts/es6/pipeable'
import { Reader } from 'fp-ts/es6/Reader'

export const resolveEventTarget = (
    predicate: Predicate<HTMLElement>
): Reader<Option.Option<HTMLElement>, Option.Option<HTMLElement>> =>
    Option.chain(target => {
        if (predicate(target)) {
            return Option.some(target)
        }

        return pipe(
            target.parentElement,
            Option.fromNullable,
            resolveEventTarget(predicate)
        )
    })
