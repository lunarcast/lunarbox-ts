import { Stream, Subscription } from '@thi.ng/rstream'

/**
 * Data passed by hdom to all components.
 */
export interface AppConext {
    reactingTo: Stream<Subscription<unknown, unknown>>
}
