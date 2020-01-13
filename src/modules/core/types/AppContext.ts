import { Stream, Subscription } from '@thi.ng/rstream'

/**
 * Data passed by hdom to all components.
 */
export interface AppContext {
    reactingTo: Stream<Subscription<unknown, unknown>>
}
