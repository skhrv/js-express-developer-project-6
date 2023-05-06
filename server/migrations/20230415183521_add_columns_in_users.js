// @ts-check

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) =>
  knex.schema.table("users", (table) => {
    table.string("first_name");
    table.string("last_name");
  });

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) =>
  knex.schema.table("users", (table) => {
    table.dropColumn("first_name");
    table.dropColumn("last_name");
  });
