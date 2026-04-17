import { Client } from 'pg';
const client = new Client({
  connectionString: 'postgresql://supabase:jees0r1x40boj9zeexq6bbawb3eqz0wu@72-61-64-225.sslip.io:5432/postgres'
});
async function run() {
  await client.connect();
  const res = await client.query('SELECT NOW()');
  console.log('Connected! Time:', res.rows[0]);
  
  // Apply schema updates
  await client.query(`
    ALTER TABLE public.usuarios 
    ADD COLUMN IF NOT EXISTS fecha_registro DATE,
    ADD COLUMN IF NOT EXISTS verificacion_sticker VARCHAR(255),
    ADD COLUMN IF NOT EXISTS fecha_verificacion_sticker TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS observacion_verificacion_sticker TEXT,
    ADD COLUMN IF NOT EXISTS nombre_verificador VARCHAR(255),
    ADD COLUMN IF NOT EXISTS poblacion VARCHAR(255);
  `);
  
  await client.query(`
    ALTER TABLE public.militantes
    ADD COLUMN IF NOT EXISTS compromiso_difusion VARCHAR(255),
    ADD COLUMN IF NOT EXISTS compromiso_proyecto VARCHAR(255);
  `);
  
  console.log('Schema updated successfully.');
  await client.end();
}
run().catch(console.error);
