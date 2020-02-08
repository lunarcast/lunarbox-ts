import { flow } from 'fp-ts/es6/function'
import { IO } from 'fp-ts/es6/IO'
import { useEffect } from 'preact/hooks'

/**
 * Inputs for the hook
 */
type Inputs = Parameters<typeof useEffect>['1']

/**
 * Callback for the useIo hook
 */
export type EffectCallback = IO<IO<void> | void>

/**
 * Hook for handling side effects based on IO
 *
 * @param func The function to use as the effect.
 * @param inputs The inputs the effect should be run on the change of.
 */
export const useIo = (func: IO<EffectCallback>, inputs: Inputs = []) => {
    const callback = flow(func, f => f())

    return useEffect(callback, inputs)
}
