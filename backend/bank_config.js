require('dotenv').config();
const { Pool } = require('pg');

module.exports = new Pool({
  host: process.env.BANK_DB_HOST || process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.BANK_DB_PORT || process.env.DB_PORT || 5432),
  database: process.env.BANK_DB_NAME || 'bank',
  user: process.env.BANK_DB_USER || process.env.DB_USER || 'postgres',
  password: process.env.BANK_DB_PASSWORD || process.env.DB_PASSWORD || '',
});