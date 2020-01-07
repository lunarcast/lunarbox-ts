import { Stream, Subscription } from '@thi.ng/rstream'

/**
 * Data passed by hdom to all components.
 */
export interface AppConext {
    globalStreams: Stream<Subscription<unknown, unknown>>
}
