import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable('user_cards')) {
        await knex.schema.table('user_cards', table => {
            table.text("profile_pic");
        });
    }

    if (await knex.schema.hasTable('card_request')) {
        await knex.schema.table('card_request', table => {
            table.boolean("allow_ex").defaultTo(true);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable('user_cards')) {
        await knex.schema.table('user_cards', table => {
            table.dropColumn('profile_pic');
        })
    }
    
    if (await knex.schema.hasTable('card_request')) {
        await knex.schema.table('card_request', table => {
            table.dropColumn('allow_ex');
        })
    }
}

