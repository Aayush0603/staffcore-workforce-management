const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function main() {
  await client.connect();
  const tables = ['employees', 'employee_personal_details', 'employee_addresses', 'employee_employment_details', 'employee_bank_details'];
  for (const table of tables) {
    console.log(`\n--- Schema for table: ${table} ---`);
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [table]);
    for (const row of res.rows) {
      console.log(`${row.column_name}: ${row.data_type} (Nullable: ${row.is_nullable})`);
    }
  }
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
