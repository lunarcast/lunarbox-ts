import { Middleware } from "koa"

import { ObjectSchema } from "@hapi/joi"

import { HttpError } from "../../error/classes/httpError"

type ValidationField = "body" | "params" | "query"

export default (
    schema: ObjectSchema,
    field: ValidationField
): Middleware => async (ctx, next) => {
    const toValidate: Record<ValidationField, any> = {
        body: ctx.request.body,
        params: ctx.params,
        query: ctx.query
    }

    const result = await schema.validateAsync(toValidate[field])

    if (result.error) throw new HttpError(400)

    return next()
}
