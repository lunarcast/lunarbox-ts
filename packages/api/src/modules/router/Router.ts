import { Context, DefaultState } from "koa"

import koaRouter from "koa-router"

export default class Router extends koaRouter<Context, DefaultState> {}
