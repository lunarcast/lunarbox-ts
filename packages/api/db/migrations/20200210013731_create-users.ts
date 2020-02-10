import Knex from "knex"

export const up = async (knex: Knex) =>
    knex.schema.createTable("users", table => {
        table.increments("id")
        table.integer("master_id")
        table
            .string("username")
            .notNullable()
            .unique()
        table.string("password").notNullable()
        table
            .foreign("master_id")
            .references("id")
            .inTable("users")
    })

export const down = async (knex: Knex) => knex.schema.dropTable("users")
