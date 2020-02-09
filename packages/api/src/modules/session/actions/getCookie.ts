import db from "../../../../db/knex"

import { Session } from "../types/Session"

export default async (key: Session["key"]) => {
    const cookie = await db<Session>("sessions")
        .where({ key })
        .select("key", "maxAge", "session")
        .first()

    if (!cookie) return undefined
    return cookie.session
}
