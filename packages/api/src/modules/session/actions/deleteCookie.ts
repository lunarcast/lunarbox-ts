import db from "../../../../db/knex"

import { Session } from "../types/Session"

export default async (key: Session["key"]) =>
    db<Session>("sessions")
        .where({ key })
        .del("*")
