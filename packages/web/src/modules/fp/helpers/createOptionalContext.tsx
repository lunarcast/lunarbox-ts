import { none, Option, some } from 'fp-ts/es6/Option'
import { createContext, FunctionComponent, h } from 'preact'
import { useContext } from 'preact/hooks'

/**
 * Helper to create a context and a hook for it.
 */
export const createOptionalContext = <T,>() => {
    const context = createContext<Option<T>>(none)
    const hook = () => useContext(context)

    const Provider: FunctionComponent<{ value: T }> = ({ value, children }) => (
        <context.Provider value={some(value)}>{children}</context.Provider>
    )

    return [Provider, hook] as const
}
