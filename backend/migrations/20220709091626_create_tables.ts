import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (!(await knex.schema.hasTable('users'))) {
        await knex.schema.createTable('users', table => {
            table.increments('id')
            table.string('email', 60).notNullable().unique()
            table.string('first_name', 60)
            table.string('last_name', 60)
            table.string('password', 255)
            table.timestamps(false, true)
            table.text("profile_pic");
            table.string("user_id", 60).notNullable().unique();
            table.integer("connection_number");
            table.boolean("is_public").notNullable().defaultTo(false);
            table.boolean("verified").notNullable().defaultTo(false);
            table.string("token")
            table.text('description')
            //table.timestamp('created_at').defaultTo(knex.fn.now());
            //table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }

    if (!(await knex.schema.hasTable('user_cards'))) {
        await knex.schema.createTable('user_cards', table => {
            table.increments('id')
            table.string('user_id',60).notNullable().references('users.user_id')
            table.text('card_image')
            table.text('qrcode_image').notNullable().unique()
            table.string('first_name', 60)
            table.string('last_name', 60)
            table.string('title', 60)
            table.string('sector', 60)
            table.string('company_name', 255)
            table.text('address')
            table.string('email', 60)
            table.text('website')
            table.timestamps(false, true)
            table.boolean("is_public").notNullable().defaultTo(false);
            table.string("card_id", 60).notNullable().unique();
            table.integer("image_format").notNullable().defaultTo(1);
            table.integer("image_bg").notNullable().defaultTo(1);
            table.text("ecard_image");
            table.integer("default_image_index").notNullable().defaultTo(1)
        })
    }

    if (!(await knex.schema.hasTable('card_request'))) {
        await knex.schema.createTable('card_request', table => {
            table.increments('id')
            table.string('requestor_id',60).notNullable().references('users.user_id')
            table.string('user_card_id',60).notNullable().references('users.user_id')
            table.string('card_requested',60).notNullable().references('user_cards.card_id')
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        })
    }

    if (!(await knex.schema.hasTable('events'))) {
        await knex.schema.createTable('events', table => {
            table.increments('id')
            table.string('name', 255).notNullable()
            table.text('banner_image')
            table.text('qrcode_image').unique()
            table.string('invitation_code', 255).notNullable().unique()
            table.string('sector', 255)
            table.string('organiser', 255).notNullable()
            table.string('host_id',60).notNullable().references('users.user_id')
            table.date('start_date').notNullable()
            table.date('end_date')
            table.time('start_time').notNullable()
            table.time('end_time')
            table.string('status', 60).notNullable().defaultTo('prepare')
            table.text('event_address')
            table.text('conference_link')
            table.string('conference_type', 60)
            table.integer('estimated_participant')
            table.text('event_link')
            table.text('fb_link')
            table.text('linkedin_link')
            table.string('contact_email', 60)
            table.string('contact_person', 60)
            table.boolean('is_private').notNullable().defaultTo(false)
            table.integer('allowtime_walkin').defaultTo(0)
            table.timestamps(false, true)
            table.string("location", 255)
            table.text('description')
        })
    }    

    if (!(await knex.schema.hasTable('user_cardholders'))) {
        await knex.schema.createTable('user_cardholders', table => {
            table.increments('id')
            table.string('user_id',60).notNullable().references('users.user_id')
            table.string('card_stored',60).notNullable().references('user_cards.card_id')
            table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            table.string("event_code",60).references('events.invitation_code');
            table.text("note");
            table.boolean("has_acct").notNullable().defaultTo(true);
        })
    }

    if (!(await knex.schema.hasTable('event_groups'))) {
        await knex.schema.createTable('event_groups', (table) => {
            table.increments('id')
            table.string('group_name', 60).notNullable()
            table.integer('event_id').notNullable().references('events.id');
        })
    }

    if (!(await knex.schema.hasTable('event_participants'))) {
        await knex.schema.createTable('event_participants', table => {
            table.increments('id')
            table.string('card_id',60).notNullable().references('user_cards.card_id')
            table.integer('event_id').notNullable().references('events.id')
            table.integer("group").references('event_groups.id');
            table.boolean("is_public").notNullable().defaultTo(false);
            table.timestamps(false, true)
        })
    }

    if (!(await knex.schema.hasTable('telephones'))) {
        await knex.schema.createTable('telephones', table => {
            table.increments('id')
            table.string('card_id',60).notNullable().references('user_cards.card_id')
            table.integer('tel_number').notNullable()
            table.integer('country_code').defaultTo('852')
            table.string('category', 60).defaultTo('work')
        })
    }

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('telephones')
    await knex.schema.dropTableIfExists('event_participants')
    await knex.schema.dropTableIfExists('event_groups')
    await knex.schema.dropTableIfExists('user_cardholders')
    await knex.schema.dropTableIfExists('events')
    await knex.schema.dropTableIfExists('card_request')
    await knex.schema.dropTableIfExists('user_cards')
    await knex.schema.dropTableIfExists('users')
}

