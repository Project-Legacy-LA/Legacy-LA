import dotenv from "dotenv";
import path from "path";
import {Pool} from "pg";

dotenv.config();


// Create a new Pool instance to manage connections

const pg_pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export {pg_pool}