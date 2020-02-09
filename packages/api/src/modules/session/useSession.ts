import Koa from "koa"

import session from "koa-session"

import getCookie from "./actions/getCookie"
import setCookie from "./actions/setCookie"
import deleteCookie from "./actions/deleteCookie"

export const config: Readonly<Partial<session.opts>> = {
    store: {
        get: getCookie,
        set: setCookie,
        destroy: deleteCookie
    },
    key: "api:sess",
    maxAge: 86400000,
    httpOnly: true,
    renew: true,
    signed: false
}

export default (app: Koa) => session(config, app)
