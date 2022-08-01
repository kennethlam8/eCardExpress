import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable('events')) {
        await knex.schema.table('events', table => {
            table.date('start_date').nullable().alter();
            table.time('start_time').nullable().alter();
            table.dateTime('start_date_time');
            table.dateTime('end_date_time');
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable('events')) {
        await knex.schema.createTable('events', table => {
            table.dropColumn('end_date_time');
            table.dropColumn('start_date_time');
        })
    }
}

