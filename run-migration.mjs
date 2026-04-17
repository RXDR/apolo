import { Client } from 'pg';
import fs from 'fs';

const client = new Client({
  connectionString: 'postgresql://supabase:jees0r1x40boj9zeexq6bbawb3eqz0wu@72-61-64-225.sslip.io:5432/postgres'
});

async function run() {
  await client.connect();
  const sql = fs.readFileSync('update-schema-migration.sql', 'utf8');
  await client.query(sql);
  console.log('Migration executed successfully!');
  await client.end();
}
run().catch(console.error);
