require('dotenv').config();

process.env.PGHOST = process.env.PG_HOST ?? 'Update PG Settings in .env';
process.env.PGPORT = process.env.PG_PORT ?? 65535;
process.env.PGPASSWORD = process.env.PG_PASS ?? 'Update PG Settings in .env';
process.env.PGUSERNAME = process.env.PG_USER ?? 'Update PG Settings in .env';
process.env.PGDATABASE = process.env.PG_DB ?? 'Update PG Settings in .env';
process.env.PGCONNECT_TIMEOUT = process.env.PG_TIMEOUT_MS ?? '30000';
process.env.PGIDLE_TIMEOUT = process.env.PG_IDLE_TIMEOUT_MS ?? 'null';
