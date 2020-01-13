import { merge, stream, trigger } from '@thi.ng/rstream'
import * as tx from '@thi.ng/transducers'
import { updateDOM } from '@thi.ng/transducers-hdom'
import { app } from './modules/core/components/app'
import { AppContext } from './modules/core/types/AppContext'

const globalStreams: AppContext['reactingTo'] = stream()

const initialContext: AppContext = {
    reactingTo: globalStreams
}

merge({
    src: [globalStreams]
}).transform(
    tx.comp(
        tx.map(() => app),
        updateDOM({
            // data passed to all components
            ctx: initialContext,

            // element to render to
            root: document.body,

            // prevent creation of unnecessary spans
            span: false
        })
    )
)

// initial render
globalStreams.next(trigger(null))
