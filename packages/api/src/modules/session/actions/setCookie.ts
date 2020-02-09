import db from "../../../../db/knex"

import { Session } from "../types/Session"
import deleteCookie from "./deleteCookie"

export default async (
    key: Session["key"],
    session: Session["session"],
    maxAge: Session["maxAge"]
) => {
    await deleteCookie(key)

    return db<Session>("sessions").insert({ key, session, maxAge }, "*")
}
