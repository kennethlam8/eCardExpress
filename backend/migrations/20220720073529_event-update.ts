import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (!(await knex.schema.hasTable('event_note'))) {
        await knex.schema.createTable('event_note', table => {
            table.increments('id')
            table.string('user_id',60).notNullable().references('users.user_id')
            table.integer("event_id").references('events.id');
            table.text('note')
        });
    }

    if (await knex.schema.hasTable("user_cards")) {
        await knex.schema.table('user_cards', table => {
            table.text('qrcode_image').nullable().alter();
            table.specificType('updated_items','VARCHAR[]')
        })
    }

    if (await knex.schema.hasTable("user_cardholders")) {
        await knex.schema.table('user_cardholders', table => {
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.specificType('checked_items','VARCHAR[]')
        })
    }
    
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('event_note');

    if (await knex.schema.hasTable("user_cards")) {
        await knex.schema.createTable('user_cards', table => {
            table.dropColumn('updated_items')
        })
    }

    if (await knex.schema.hasTable("user_cardholders")) {
        await knex.schema.createTable('user_cardholders', table => {
            table.dropColumn("updated_at");
            table.dropColumn("checked_items");
        })
    }
}

