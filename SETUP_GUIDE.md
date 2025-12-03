# College Database - Quick Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Check

**For Node.js Backend (Recommended):**
```bash
# Check MySQL
mysql --version

# Check Node.js (version 16 or higher recommended)
node --version

# Check npm
npm --version
```

**For PHP Backend (Legacy):**
```bash
# Check MySQL
mysql --version

# Check PHP
php --version

# PHP should be 7.4 or higher with PDO MySQL extension
php -m | grep -i pdo
```

### 2. Database Setup

**Option A: Using MySQL Command Line**
```bash
# Login to MySQL
mysql -u root -p

# Run setup commands
mysql> source database/config.sql;
mysql> source database/schema.sql;
mysql> source database/sample_data.sql;
mysql> exit;
```

**Option B: Using phpMyAdmin**
1. Login to phpMyAdmin
2. Create database named `college_db`
3. Import `database/schema.sql`
4. Import `database/sample_data.sql`

### 3. Configure Backend

**IMPORTANT SECURITY NOTE / TÄHTIS TURVAMÄRKUS:**

For production environments, DO NOT use the 'root' MySQL user!
The root user has dangerous privileges including:
- DROP DATABASE (can delete entire database)
- DROP TABLE (can delete tables)
- CREATE USER (can create new users)

Tootmiskeskkondades ÄRA KASUTA 'root' MySQL kasutajat!
Root kasutajal on ohtlikud õigused, sealhulgas:
- DROP DATABASE (saab kustutada terve andmebaasi)
- DROP TABLE (saab kustutada tabeleid)
- CREATE USER (saab luua uusi kasutajaid)

**Option A: Development (Not Secure - Only for Testing)**

For Node.js backend, edit `backend/config.js`:
```javascript
const dbConfig = {
    host: 'localhost',
    port: 3306,
    database: 'college_db',
    user: 'root',              // Only for development!
    password: 'your_root_password', // Only for development!
    // ... other settings
};
```

For PHP backend (legacy), edit `backend/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'college_db');
define('DB_USER', 'root');              // Only for development!
define('DB_PASS', 'your_root_password'); // Only for development!
```

**Option B: Production (Secure - Recommended)**

1. Create a limited-privilege database user:
   ```bash
   mysql -u root -p
   ```

2. Run these SQL commands:
   ```sql
   -- Create application user with limited privileges
   CREATE USER 'college_app'@'localhost' IDENTIFIED BY 'your_secure_password';
   
   -- Grant only necessary permissions (SELECT, INSERT, UPDATE, DELETE)
   GRANT SELECT, INSERT, UPDATE, DELETE ON college_db.* TO 'college_app'@'localhost';
   
   -- Apply changes
   FLUSH PRIVILEGES;
   
   -- Verify permissions
   SHOW GRANTS FOR 'college_app'@'localhost';
   
   EXIT;
   ```

3. For Node.js backend, edit `backend/config.js` to use the secure user:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       port: 3306,
       database: 'college_db',
       user: 'college_app',           // Limited privilege user
       password: 'your_secure_password',  // Strong password
       // ... other settings
   };
   ```

   For PHP backend (legacy), edit `backend/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_PORT', '3306');
   define('DB_NAME', 'college_db');
   define('DB_USER', 'college_app');           // Limited privilege user
   define('DB_PASS', 'your_secure_password');  // Strong password
   ```

**Benefits of limited-privilege user / Piiratud õigustega kasutaja eelised:**
- ✅ Cannot drop tables or database / Ei saa kustutada tabeleid ega andmebaasi
- ✅ Cannot create or modify users / Ei saa luua ega muuta kasutajaid
- ✅ Can only perform CRUD operations (Create, Read, Update, Delete)
- ✅ Limits damage if credentials are compromised / Piirab kahju, kui volitused on ohustatud

### 4. Install Dependencies & Start Application

**Node.js Backend (Recommended):**
```bash
cd college_database/backend

# Install dependencies
npm install

# Start the server
npm start
# or
node api.js
```

The server will start on port 8000 by default.

**PHP Backend (Legacy - Development):**
```bash
cd college_database
php -S localhost:8000
```

**Production (Apache with PHP):**
- Copy files to Apache document root (e.g., `/var/www/html/`)
- Access via `http://your-domain/`

**Production (Nginx with PHP):**
- Configure Nginx to serve PHP files
- Point root to project directory

**Production (Node.js with PM2):**
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start backend/api.js --name "college-api"

# Configure to start on boot
pm2 startup
pm2 save
```

### 5. Access the Application

Open browser and navigate to:
- `http://localhost:8000` (development)
- `http://your-domain/` (production)

## Troubleshooting

### Database Connection Failed
- Check MySQL is running: `sudo service mysql status`
- For Node.js: Verify credentials in `backend/config.js`
- For PHP: Verify credentials in `backend/config.php`
- For PHP: Check PDO MySQL extension: `php -m | grep pdo_mysql`

### 500 Internal Server Error
- Check server error logs (Node.js console or PHP error logs)
- Ensure proper file permissions
- Verify version compatibility (Node.js 16+ or PHP 7.4+)

### API Not Responding
- For Node.js: Check if server is running (`npm start`)
- For PHP: Check `.htaccess` if using Apache
- Verify API endpoint URLs in `js/app.js`

### Node.js Specific Issues
- Run `npm install` to ensure all dependencies are installed
- Check for port conflicts (default port 8000)
- Verify mysql2 package is installed: `npm list mysql2`

## Default Sample Data

After running `sample_data.sql`, you'll have:
- 5 Departments (CS, Math, Physics, English, Business)
- 8 Instructors assigned to departments
- 8 Students with different majors
- 9 Courses across departments
- 16 Student enrollments
- 5 Department heads assigned

## Next Steps

1. **Customize**: Modify the sample data or add your own
2. **Secure**: Add authentication for production use
3. **Extend**: Add more features like attendance, grading, etc.
4. **Deploy**: Set up on a production server with HTTPS

## Support

For issues or questions:
- Check the main README.md
- Review database schema in `database/schema.sql`
- For Node.js backend: Examine API endpoints in `backend/api.js`
- For PHP backend: Examine API endpoints in `backend/api.php`
