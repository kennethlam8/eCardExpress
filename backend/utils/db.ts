import env from './env'
import pg from "pg";
import Knex from 'knex';

let configs = require('../knexfile')

export const client = new pg.Client({
    database: env.DB_NAME,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
  });
  

  export function connectDB(){
    client.connect()
  }
  let mode = process.env.NODE_ENV || 'development'
  let profile = configs[mode]
if (!profile) {
  throw new Error('Knex profile not found. Invalid mode: ' + mode)
}

export let knex = Knex(profile)
  