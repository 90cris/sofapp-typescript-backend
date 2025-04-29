import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

export const db = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  allowExitOnIdle: true,
});


// require("dotenv").config();
// const { Pool } = require("pg");

// const DB = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false } // obligatorio para Railway
// });

// module.exports = { DB };