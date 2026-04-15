/**
 * Database Configuration / Andmebaasi Konfiguratsioon
 * Update these constants with your PostgreSQL server details
 * Uuenda neid konstante oma PostgreSQL serveri andmetega
 * 
 * ============================================================================
 * SECURITY WARNING / TURVALISUSE HOIATUS:
 * ============================================================================
 * DO NOT use the default 'postgres' user in production environments!
 * ÄRA kasuta vaikimisi 'postgres' kasutajat tootmiskeskkondades!
 * 
 * The 'postgres' user has unrestricted access to:
 * 'postgres' kasutajal on piiramatu juurdepääs järgmisele:
 *   - DROP databases and tables / Andmebaaside ja tabelite kustutamine
 *   - CREATE and modify users / Kasutajate loomine ja muutmine
 *   - Access all databases / Kõikidele andmebaasidele juurdepääs
 * 
 * For production, create a limited-privilege database user that can only:
 * Tootmiseks loo piiratud õigustega andmebaasi kasutaja, kes saab ainult:
 *   - SELECT, INSERT, UPDATE, DELETE on application tables
 *   - SELECT, INSERT, UPDATE, DELETE rakenduse tabelitel
 * 
 * Example SQL commands to create a secure user:
 * Näidis SQL käsud turvalise kasutaja loomiseks:
 * 
 *   CREATE USER college_app WITH PASSWORD 'secure_password';
 *   GRANT CONNECT ON DATABASE college_db TO college_app;
 *   GRANT USAGE ON SCHEMA public TO college_app;
 *   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO college_app;
 *   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO college_app;
 * 
 * See database/config.sql and SETUP_GUIDE.md for more details.
 * Vaata database/config.sql ja SETUP_GUIDE.md täpsema info saamiseks.
 * ============================================================================
 */

const dbConfig = {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    database: process.env.PGDATABASE || 'college_db',
    user: process.env.PGUSER || 'postgres', // WARNING: Change this for production! / HOIATUS: Muuda see tootmiseks!
    password: process.env.PGPASSWORD || '', // WARNING: Use a strong password! / HOIATUS: Kasuta tugevat parooli!
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
};

module.exports = dbConfig;
