import { start } from '@thi.ng/hdom'
import { app } from './modules/core/components/app'

start(app, {
    // data passed to all components
    ctx: {},

    // element to render to
    root: document.body,

    // prevent creation of unnecessary spans
    span: false
})
