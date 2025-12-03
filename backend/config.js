/**
 * Database Configuration / Andmebaasi Konfiguratsioon
 * Update these constants with your MySQL server details
 * Uuenda neid konstante oma MySQL serveri andmetega
 * 
 * ============================================================================
 * SECURITY WARNING / TURVALISUSE HOIATUS:
 * ============================================================================
 * DO NOT use 'root' user in production environments!
 * ÄRA kasuta 'root' kasutajat tootmiskeskkondades!
 * 
 * The 'root' user has unrestricted access to:
 * 'root' kasutajal on piiramatu juurdepääs järgmisele:
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
 *   CREATE USER 'college_app'@'localhost' IDENTIFIED BY 'secure_password';
 *   GRANT SELECT, INSERT, UPDATE, DELETE ON college_db.* TO 'college_app'@'localhost';
 *   FLUSH PRIVILEGES;
 * 
 * See database/config.sql and SETUP_GUIDE.md for more details.
 * Vaata database/config.sql ja SETUP_GUIDE.md täpsema info saamiseks.
 * ============================================================================
 */

const dbConfig = {
    host: 'localhost',
    port: 3306,
    database: 'college_db',
    user: 'root',        // WARNING: Change this for production! / HOIATUS: Muuda see tootmiseks!
    password: '',        // WARNING: Use a strong password! / HOIATUS: Kasuta tugevat parooli!
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = dbConfig;
