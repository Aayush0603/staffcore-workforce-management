import { Pool, types } from "pg";
import dotenv from "dotenv";

dotenv.config();

/*
  Fix PostgreSQL DATE timezone issue
  OID 1082 = DATE
*/
types.setTypeParser(
  1082,
  (value) => value
);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;