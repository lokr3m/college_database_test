# College Database Project

A comprehensive database management system for educational institutions with a modern web-based user interface.

## 📋 Project Description

This college database system manages the following relationships:
- A college contains many departments
- Each department can offer any number of courses
- Many instructors can work in a department, but an instructor can work only in one department
- For each department, there is a head, and an instructor can be the head of only one department
- Each instructor can take any number of courses, and a course can be taken by only one instructor
- A student can enroll in any number of courses and each course can have any number of students

## 🎯 Project Requirements

### Functional Requirements

The system is designed to create a comprehensive management system for educational institutions with the following capabilities:

#### School Management
- ✅ System supports multiple schools
- ✅ Each school has a unique name and location

#### Group/Class Management
- ✅ Each school has one or more groups (e.g., 10A, 11B)
- ✅ Groups always belong to a specific school

#### Student Management
- ✅ Students always belong to one group
- ✅ Student records include first name and last name
- ✅ Multiple students with the same name can exist in different groups
- ✅ Students have representatives/guardians

#### Teacher Management
- ✅ Teachers are associated with one specific school
- ✅ Teacher records include first and last name
- ✅ Teachers can teach multiple groups and multiple subjects
- ✅ System includes teacher salary data and payment information
- ✅ Teacher contact information is stored (multiple phone numbers and addresses possible per teacher)

#### Class/Lesson Management
- ✅ Lessons are linked to a teacher and a group
- ✅ Lesson information includes subject name and date
- ✅ Each lesson belongs to a specific group

#### Grade Management
- ✅ Each grade is associated with a specific student and lesson
- ✅ Grade values range from 1 to 5 (or other scale as needed)
- ✅ Grades can include free-text comments (e.g., "absent", "late")

#### Classroom Management
- ✅ Rooms/classrooms are tracked
- ✅ Additional information can be stored (e.g., maintenance needs, technician notes)

### Non-Functional Requirements

- ✅ **Extensibility**: System supports database expansion (new schools, new subjects)
- ✅ **Normalization**: Data is relationally structured to avoid duplication
- ✅ **Data Types**: All fields use appropriate data types
- ✅ **Query Support**: Database supports filtering and JOIN operations
- ✅ **Performance**: Data entry and query performance at reasonable levels

### Relationship Requirements

The system enforces the following relationships:
- Each group belongs to one school
- Each student belongs to one group
- Each teacher belongs to one school
- Each lesson is associated with one teacher and one group
- Each grade is associated with one student and one specific lesson

### User Role Scenarios

The system provides access for different user roles:

#### User A (School Secretary)
- ✅ Add new groups to a school
- ✅ Add new students to a group
- ✅ Check which teachers teach in group 10A

#### User B (Teacher)
- ✅ Add student grades for their lessons
- ✅ View grades given in a specific lesson (e.g., mathematics on September 10th)

#### User C (Student or Parent)
- ✅ View summary of grades for the last month

### Future Expansion Possibilities

Potential features for future development:
- Separate subjects table (for better normalization)
- User accounts (students, teachers, administrators)
- Absence/attendance management
- Schedule/timetable management
- Inventory management

## 🎯 Projekti Nõuded (Estonian Version)

### Funktsionaalsed Nõuded

Süsteem on loodud haridusasutuste tervikliku haldussüsteemi loomiseks järgmiste võimalustega:

#### Kooli Haldamine
- ✅ Süsteem toetab mitut kooli
- ✅ Igal koolil on unikaalne nimi ja asukoht

#### Grupi/Klassi Haldamine
- ✅ Igal koolil on üks või mitu gruppi (nt 10A, 11B)
- ✅ Grupid kuuluvad alati konkreetsesse kooli

#### Õpilaste Haldamine
- ✅ Õpilased kuuluvad alati ühte gruppi
- ✅ Õpilase andmed sisaldavad ees- ja perekonnanime
- ✅ Mitu sama nimega õpilast võib eksisteerida erinevates gruppides
- ✅ Õpilastel on esindajad/eestkostjad

#### Õpetajate Haldamine
- ✅ Õpetajad on seotud ühe konkreetse kooliga
- ✅ Õpetaja andmed sisaldavad ees- ja perekonnanime
- ✅ Õpetajad saavad õpetada mitut gruppi ja mitut ainet
- ✅ Süsteem sisaldab õpetajate palga- ja makseinfot
- ✅ Õpetajate kontaktandmed on salvestatud (õpetajal võib olla mitu telefoninumbrit ja aadressi)

#### Tunni/Õppetunni Haldamine
- ✅ Õppetunnid on seotud õpetaja ja grupiga
- ✅ Tunni info sisaldab aine nime ja kuupäeva
- ✅ Iga õppetund kuulub konkreetsesse gruppi

#### Hinnete Haldamine
- ✅ Iga hinne on seotud konkreetse õpilase ja õppetunniga
- ✅ Hinnete väärtused ulatuvad 1-st 5-ni (või muu skaala vastavalt vajadusele)
- ✅ Hinded võivad sisaldada vabateksti kommentaare (nt "puudus", "hilines")

#### Klassiruumide Haldamine
- ✅ Ruumid/klassid on jälgitavad
- ✅ Lisainfot saab salvestada (nt hoolduse vajadused, tehnikute märkused)

### Mittefunktsionaalsed Nõuded

- ✅ **Laiendatavus**: Süsteem toetab andmebaasi laienemist (uued koolid, uued ained)
- ✅ **Normaliseerimine**: Andmed on relatsiooniliselt struktureeritud, et vältida dubleerimist
- ✅ **Andmetüübid**: Kõik väljad kasutavad sobivaid andmetüüpe
- ✅ **Päringute Tugi**: Andmebaas toetab filtreerimist ja JOIN operatsioone
- ✅ **Jõudlus**: Andmesisestuse ja päringu jõudlus mõistlikul tasemel

### Seoste Nõuded

Süsteem jõustab järgmised seosed:
- Iga grupp kuulub ühte kooli
- Iga õpilane kuulub ühte gruppi
- Iga õpetaja kuulub ühte kooli
- Iga õppetund on seotud ühe õpetaja ja ühe grupiga
- Iga hinne on seotud ühe õpilase ja ühe konkreetse õppetunniga

### Kasutajarolli Stsenaariumid

Süsteem pakub juurdepääsu erinevatele kasutajarollidele:

#### Kasutaja A (Kooli Sekretär)
- ✅ Lisa kooli uusi gruppe
- ✅ Lisa gruppi uusi õpilasi
- ✅ Kontrolli, millised õpetajad õpetavad grupis 10A

#### Kasutaja B (Õpetaja)
- ✅ Lisa õpilaste hindeid oma õppetundidele
- ✅ Vaata konkreetses õppetunnis antud hindeid (nt matemaatika 10. septembril)

#### Kasutaja C (Õpilane või Vanem)
- ✅ Vaata viimase kuu hinnete kokkuvõtet

### Tuleviku Laiendusvõimalused

Potentsiaalsed funktsioonid tulevaseks arenduseks:
- Eraldi ainete tabel (parema normaliseerimise jaoks)
- Kasutajakontod (õpilased, õpetajad, administraatorid)
- Puudumiste/kohaloleku haldamine
- Tunniplaani haldamine
- Inventari haldamine

## 📊 Database Schema

**Tables:**
1. **Departments** - Stores department information
2. **Instructors** - Stores instructor details and department association
3. **DepartmentHeads** - Manages department head assignments
4. **Courses** - Contains course information with department and instructor associations
5. **Students** - Stores student information
6. **Enrollments** - Manages student course enrollments (many-to-many relationship)

## 🚀 Setup Instructions

### Prerequisites
- PostgreSQL Server (13 or higher, including WSL install)
- Node.js (16 or higher) - for Node.js backend (recommended)
- OR PHP (7.4 or higher) with PDO PostgreSQL extension - for PHP backend (legacy)
- Modern web browser

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/lokr3m/college_database.git
   cd college_database
   ```

2. **Create the database**
   - Login to PostgreSQL:
     ```bash
     psql -U postgres
     ```
   - Create the database and user:
     ```sql
     \i database/config.sql
     ```
   - Connect and create the tables:
     ```sql
     \c college_db
     \i database/schema.sql
     ```
   - (Optional) Insert sample data:
     ```sql
     \i database/sample_data.sql
     ```

3. **Configure the backend**
   
   **For Node.js backend (recommended):**
   - Install dependencies:
     ```bash
     cd backend
     npm install
     ```
   - Edit `backend/config.js` and update the PostgreSQL credentials:
     ```javascript
     const dbConfig = {
         host: 'localhost',
         port: 5432,
         database: 'college_db',
         user: 'your_username',
         password: 'your_password',
         // ... other settings
     };
     ```

   **For PHP backend (legacy):**
   - Edit `backend/config.php` and update the PostgreSQL credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_PORT', '5432');
     define('DB_NAME', 'college_db');
     define('DB_USER', 'your_username');
     define('DB_PASS', 'your_password');
     ```

4. **Start the web server**
   
   **Using Node.js (recommended):**
   ```bash
   cd backend
   npm start
   ```
   
   **Using PHP built-in server (legacy):**
   ```bash
   php -S localhost:8000
   ```
   
   Or configure Apache/Nginx to serve the project directory.

5. **Access the application**
   - Open your browser and navigate to: `http://localhost:8000`

## 💻 Usage

The web interface provides the following features:

### Dashboard Navigation
- **Departments** - View, add, edit, and delete departments
- **Instructors** - Manage instructor information
- **Students** - Manage student records
- **Courses** - Create and manage courses
- **Enrollments** - Enroll students in courses and track grades
- **Department Heads** - Assign and manage department heads
- **Payments** - Export salary payments and view bank statuses

### Features
- ✅ Full CRUD operations for all entities
- ✅ Beautiful, responsive UI with gradient design
- ✅ Real-time data updates
- ✅ Form validation
- ✅ Relationship management
- ✅ Modal-based forms
- ✅ Salary payment export to bank with status tracking

## 🗂️ Project Structure

```
college_database/
├── database/
│   ├── config.sql          # Database creation script
│   ├── schema.sql          # Table creation script
│   └── sample_data.sql     # Sample data for testing
├── backend/
│   ├── api.js              # Node.js RESTful API endpoints (recommended)
│   ├── config.js           # Node.js database configuration
│   ├── package.json        # Node.js dependencies
│   ├── config.php          # PHP database configuration (legacy)
│   └── api.php             # PHP RESTful API endpoints (legacy)
├── css/
│   └── styles.css          # Application styles
├── js/
│   └── app.js              # Frontend JavaScript logic
├── index.html              # Main application page
└── readme.md               # This file
```

## 🔧 API Endpoints

The backend provides RESTful API endpoints:

- **Departments**: `/backend/api.php?request=departments`
- **Instructors**: `/backend/api.php?request=instructors`
- **Students**: `/backend/api.php?request=students`
- **Courses**: `/backend/api.php?request=courses`
- **Enrollments**: `/backend/api.php?request=enrollments`
- **Department Heads**: `/backend/api.php?request=department-heads`
- **Salary Payments**: `/backend/api.php?request=salary-payments`
- **Export Salary Payments**: `/backend/api.php?request=salary-payments/export` (POST)
- **Bank Payments**: `/backend/api.php?request=bank-payments`

Each endpoint supports:
- `GET` - Retrieve records
- `POST` - Create new record
- `PUT` - Update existing record
- `DELETE` - Delete record

## 🎨 UI Features

- Modern gradient design with purple theme
- Responsive layout for all screen sizes
- Card-based data display
- Modal forms for data entry
- Success/error notifications
- Empty state handling
- Smooth animations and transitions

## 📝 Database Relationships

```
Departments (1) ----< (M) Instructors
     |                       |
     | (1)                   | (1)
     |                       |
     v                       v
DepartmentHeads (1:1) -------+
     
Departments (1) ----< (M) Courses >---- (1) Instructors
                            |
                            | (M)
                            |
                            v
                      Enrollments
                            |
                            | (M)
                            |
                            v
                       Students (M)
```

## 🔐 Security Notes

- Update database credentials in `backend/config.php`
- Use prepared statements to prevent SQL injection
- Implement proper authentication for production use
- Enable HTTPS in production
- Restrict file permissions appropriately

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is created for educational purposes.
