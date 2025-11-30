# Database Schema Documentation / Andmebaasi Skeemi Dokumentatsioon

## Important Notes / Tähtsad Märkused

**Terminology / Terminoloogia:**
- **Departments** = Colleges/Schools = **Osakonnad/Kolledžid** (e.g., IT Department, Mathematics Department)
- **Instructors** = Teachers = **Õpetajad/Õppejõud**
- **Courses** = Classes/Subjects = **Kursused/Ained** (e.g., Programming I, Mathematics)
- **Students** = **Õpilased/Üliõilased**
- **Enrollments** = Course Registrations = **Kursusele registreerimised**

**Automatic Timestamps:**
All tables include `created_at` and `updated_at` fields that are automatically managed by MySQL. These track when records are created and last modified.

Kõik tabelid sisaldavad `created_at` ja `updated_at` välju, mida MySQL haldab automaatselt. Need jälgivad, millal kirjed loodi ja viimati muudeti.

## Entity Relationship Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Departments   │◄────┐   │   Instructors   │
│                 │     │   │                 │
│ PK: dept_id     │     └───│ FK: dept_id     │
│                 │         │ PK: inst_id     │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │ 1:1                       │ 1:1
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│ DepartmentHeads │         │     Courses     │
│                 │         │                 │
│ PK: dept_id     │         │ PK: course_id   │
│ FK: inst_id     │◄────────│ FK: dept_id     │
└─────────────────┘    1:M  │ FK: inst_id     │
                             └────────┬────────┘
                                      │
                                      │ M:N
                                      │
                                      ▼
                             ┌─────────────────┐
                             │   Enrollments   │
                             │                 │
                             │ PK: enroll_id   │
                             │ FK: student_id  │◄────┐
                             │ FK: course_id   │     │
                             └────────┬────────┘     │
                                      │              │
                                      │ 1:M   ┌──────┴────────┐
                                      │       │   Students    │
                                      ▼       │               │
                             ┌─────────────────┐ PK: stud_id   │
                             │     Grades      │ FK: major_id  │
                             │                 │               │
                             │ PK: grade_id    └───────────────┘
                             │ FK: enroll_id   │
                             └─────────────────┘
```

**Note / Märkus**: GPA (Grade Point Average) is calculated from the Grades table as the average of all grade values.
Keskmine hinne arvutatakse Hinnete tabelist kõigi hindeväärtuste keskmisena.

## Tables Details

### 1. Departments (Osakonnad / Kolledžid)
**Purpose / Eesmärk**: Stores information about academic departments/colleges
Salvestab infot akadeemiliste osakondade/kolledžide kohta

| Column | Type | Constraints | Description | Kirjeldus (Estonian) |
|--------|------|-------------|-------------|----------------------|
| department_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier | Unikaalne identifikaator |
| department_name | VARCHAR(100) | NOT NULL, UNIQUE | Department name (e.g., "Computer Science", "Mathematics") | Osakonna nimi |
| building | VARCHAR(100) | | Building location where department is housed | Hoone, kus osakond asub |
| budget | DECIMAL(12,2) | | Annual or allocated budget for the department | Aasta- või eraldatud eelarve |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time (automatic) | Kirje loomise aeg (automaatne) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time (automatic) | Viimase uuenduse aeg (automaatne) |

**Relationships / Seosed**:
- One-to-Many with Instructors (üks-mitmele õpetajatega)
- One-to-Many with Courses (üks-mitmele kursustega)
- One-to-One with DepartmentHeads (üks-ühele osakonnajuhiga)
- One-to-Many with Students (major) (üks-mitmele üliõilastega - eriala järgi)

---

### 2. Instructors (Õpetajad / Õppejõud)
**Purpose / Eesmärk**: Stores instructor information and department association
Salvestab õpetajate infot ja osakonna kuuluvust

| Column | Type | Constraints | Description | Kirjeldus (Estonian) |
|--------|------|-------------|-------------|----------------------|
| instructor_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier | Unikaalne identifikaator |
| first_name | VARCHAR(50) | NOT NULL | First name | Eesnimi |
| last_name | VARCHAR(50) | NOT NULL | Last name | Perekonnanimi |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Email address | E-posti aadress |
| phone | VARCHAR(20) | | Phone number | Telefoninumber |
| department_id | INT | NOT NULL, FOREIGN KEY | Associated department (REQUIRED - instructor must belong to one department) | Seotud osakond (KOHUSTUSLIK) |
| salary | DECIMAL(10,2) | | Monthly or annual salary | Kuu- või aastapalk |
| hire_date | DATE | | Date of hire | Töölevõtmise kuupäev |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time (automatic) | Kirje loomise aeg (automaatne) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time (automatic) | Viimase uuenduse aeg (automaatne) |

**Relationships / Seosed**:
- Many-to-One with Departments (mitu-ühele osakondadega)
- One-to-Many with Courses (üks-mitmele kursustega)
- One-to-One with DepartmentHeads (üks-ühele osakonnajuhiga)

**Constraints / Piirangud**:
- An instructor works in only ONE department / Õpetaja töötab ainult ÜHES osakonnas
- An instructor can teach multiple courses / Õpetaja võib õpetada mitut kursust

---

### 3. DepartmentHeads (Osakonnajuhatajad)
**Purpose / Eesmärk**: Manages department head assignments (one head per department)
Haldab osakonnajuhatajate määramist (üks juhataja osakonna kohta)

**Table Structure Explained / Tabeli struktuuri selgitus**:
This is a junction/linking table that creates a 1:1 relationship between Departments and Instructors for management purposes. The department_id serves as the primary key, ensuring each department can have only one head record. The instructor_id is UNIQUE, ensuring an instructor can lead only one department.

See on ühendav/siduv tabel, mis loob 1:1 seose Osakondade ja Õpetajate vahel juhtimise eesmärgil. department_id toimib primaarvõtmena, tagades et igal osakonnal saab olla ainult üks juhataja kirje. instructor_id on UNIQUE, tagades et õpetaja saab juhtida ainult ühte osakonda.

| Column | Type | Constraints | Description | Kirjeldus (Estonian) |
|--------|------|-------------|-------------|----------------------|
| department_id | INT | PRIMARY KEY, FOREIGN KEY | Department being led (ensures one head per department) | Juhitav osakond (tagab ühe juhataja osakonna kohta) |
| instructor_id | INT | UNIQUE, NOT NULL, FOREIGN KEY | Instructor serving as head (ensures instructor leads only one department) | Juhatajana töötav õpetaja (tagab, et õpetaja juhib ainult ühte osakonda) |
| start_date | DATE | NOT NULL | Date when this instructor became head (tracks when current leadership began) | Kuupäev, millal see õpetaja sai juhatajaks (jälgib praeguse juhtimise algust) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time (automatic) | Kirje loomise aeg (automaatne) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time (automatic) | Viimase uuenduse aeg (automaatne) |

**Relationships / Seosed**:
- One-to-One with Departments (üks-ühele osakondadega)
- One-to-One with Instructors (üks-ühele õpetajatega)

**Constraints / Piirangud**:
- Each department can have at most ONE head at any given time / Igal osakonnal võib olla kõige rohkem ÜKS juhataja igal ajahetkel
- An instructor can be head of only ONE department at any given time / Õpetaja saab olla ainult ÜHE osakonna juhataja igal ajahetkel
- The instructor must work in the department they are heading / Õpetaja peab töötama osakonnas, mida ta juhib
- A department can exist without a head (no record in this table) / Osakond võib eksisteerida ilma juhatajata (pole kirjet selles tabelis)

**Historical Data / Ajaloolised Andmed**:

**[WARNING] IMPORTANT / TÄHTIS**:
This table tracks **ONLY the CURRENT department head**. Records of **PREVIOUS heads are NOT preserved**.
See tabel jälgib **AINULT PRAEGUST osakonnajuhatajat**. Kirjeid **VARASEMATEST juhatajatatest EI SÄILITATA**.

The start_date field tells when the current head's tenure began, but when a new head is assigned, information about the previous head is lost.
start_date väli näitab, millal praeguse juhataja ametiaeg algas, kuid kui määratakse uus juhataja, läheb informatsioon varasema juhataja kohta kaduma.

**When a new head is assigned / Kui määratakse uus juhataja**:
1. The old record is UPDATED (start_date changes) OR / Vana kirje UUENDATAKSE (start_date muutub) VÕI
2. The old record is DELETED and a new one is INSERTED / Vana kirje KUSTUTATAKSE ja lisatakse uus

This means previous heads and their tenure periods are NOT preserved.
See tähendab, et varasemaid juhatajaid ja nende ametiperioode EI SÄILITATA.

**[ENHANCEMENT] FUTURE ENHANCEMENT / TULEVIKU TÄIUSTUS**:

If you need to track the full history of department leadership changes:
Kui on vaja jälgida osakonna juhtimise muutuste täielikku ajalugu:

Create a separate **"DepartmentHeadHistory"** table:
Loo eraldi **"DepartmentHeadHistory"** tabel:
- `head_history_id` (PRIMARY KEY, AUTO_INCREMENT)
- `department_id` (FOREIGN KEY)
- `instructor_id` (FOREIGN KEY)
- `start_date` (NOT NULL) - when they became head / millal said juhatajaks
- `end_date` (NULL) - when they stepped down / millal lahkusid ametist
- `reason` (VARCHAR) - reason for change / muutuse põhjus
- `created_at`, `updated_at` (TIMESTAMP)

With this history table / Selle ajalootabeliga:
- You can track ALL past and present heads / Saad jälgida KÕIKI endisi ja praeguseid juhatajaid
- You can see how long each person served / Näed kui kaua iga isik teenis
- You can analyze leadership transition patterns / Saad analüüsida juhtimise ülemineku mustreid

---

### 4. Courses (Kursused / Ained)
**Purpose / Eesmärk**: Stores course offerings and assignments
Salvestab kursuste pakkumisi ja ülesandeid

| Column | Type | Constraints | Description | Kirjeldus (Estonian) |
|--------|------|-------------|-------------|----------------------|
| course_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier | Unikaalne identifikaator |
| course_code | VARCHAR(20) | NOT NULL, UNIQUE | Course code (e.g., CS101, MATH200) | Kursuse kood |
| course_name | VARCHAR(100) | NOT NULL | Course name | Kursuse nimi |
| department_id | INT | NOT NULL, FOREIGN KEY | Department offering course | Kursust pakkuv osakond |
| instructor_id | INT | FOREIGN KEY | Assigned instructor | Määratud õpetaja |
| credits | INT | NOT NULL, DEFAULT 3 | Credit hours/points | Krediidipunktid |
| semester | VARCHAR(20) | | Academic term (see detailed explanation below) | Akadeemiline periood (vaata üksikasjalikku selgitust allpool) |
| year | INT | | Academic year (see detailed explanation below) | Õppeaasta (vaata üksikasjalikku selgitust allpool) |
| room_number | VARCHAR(20) | | Classroom location (see detailed explanation below) | Klassiruumi asukoht (vaata üksikasjalikku selgitust allpool) |
| schedule | VARCHAR(100) | | Class meeting times (see detailed explanation below) | Tundide toimumise ajad (vaata üksikasjalikku selgitust allpool) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time (automatic) | Kirje loomise aeg (automaatne) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time (automatic) | Viimase uuenduse aeg (automaatne) |

**Scheduling Fields Detailed Explanation / Ajakava väljade üksikasjalik selgitus**:

These four fields work together to define **WHEN** and **WHERE** a course is offered:
Need neli välja töötavad koos, et määratleda, **MILLAL** ja **KUS** kursust pakutakse:

#### **[SEMESTER] semester** - ACADEMIC TERM / AKADEEMILINE PERIOOD
**Purpose**: Indicates which academic term/semester the course is offered
**Eesmärk**: Näitab, millises akadeemilises perioodis/semestris kursust pakutakse

**Examples / Näited**:
- "Fall 2024" / "Sügis 2024" - Autumn semester
- "Spring 2025" / "Kevad 2025" - Spring semester
- "Summer 2024" / "Suvi 2024" - Summer session
- "1. semester" - First semester
- "2. semester" - Second semester

**This answers**: "WHICH academic period is this course offered?"
**See vastab**: "MILLISES akadeemilises perioodis seda kursust pakutakse?"

#### **[YEAR] year** - ACADEMIC YEAR / ÕPPEAASTA
**Purpose**: The calendar year for the course offering
**Eesmärk**: Kalendriaasta kursuse pakkumisele

**Examples / Näited**: 2024, 2025, 2026

Combined with semester, this uniquely identifies the course offering period. For example: "Fall 2024" means autumn semester in year 2024.

Koos semestriga määrab see unikaalselt kursuse pakkumise perioodi. Näiteks: "Sügis 2024" tähendab sügisemestrit aastal 2024.

#### **[ROOM] room_number** - CLASSROOM LOCATION / KLASSIRUUMI ASUKOHT
**Purpose**: Physical location where the course lectures/classes are held
**Eesmärk**: Füüsiline asukoht, kus kursuse loengud/tunnid toimuvad

**Examples / Näited**:
- "A-101" - Room 101 in Building A
- "Room 305" - Room number 305
- "B-201" - Room 201 in Building B
- "Lab 3" - Laboratory 3
- "Auditorium 1" - Auditorium 1

**This answers**: "WHERE does this course physically take place?"
**See vastab**: "KUS see kursus füüsiliselt toimub?"

**Note**: This is a simple text field for flexibility. In a more complex system, you might have a separate "Rooms" table with detailed information about each classroom (capacity, equipment, building location, etc.).

**Märkus**: See on lihtne tekstiväli paindlikkuse tagamiseks. Keerukamas süsteemis võib olla eraldi "Ruumid" tabel üksikasjaliku infoga iga klassiruumi kohta (mahutavus, varustus, hoone asukoht jne).

#### **[SCHEDULE] schedule** - WEEKLY MEETING TIMES / NÄDALASED KOHTUMISE AJAD
**Purpose**: When during the week the course meets (days and times)
**Eesmärk**: Millal nädala jooksul kursus toimub (päevad ja kellaajad)

**Examples / Näited**:
- "Mon/Wed 10:00-11:30" - Mondays and Wednesdays from 10:00 to 11:30
- "E/K 10:00-11:30" - Esmaspäev/Kolmapäev (Estonian: Monday/Wednesday)
- "Tue/Thu 14:00-16:00" - Tuesdays and Thursdays 2:00 PM to 4:00 PM
- "Fri 09:00-12:00" - Fridays 9:00 AM to 12:00 PM
- "MWF 13:00-14:00" - Monday, Wednesday, Friday 1:00 PM to 2:00 PM

**This answers**: "WHEN during the week do students attend this course?"
**See vastab**: "MILLAL nädala jooksul õpilased selles kursuses osalevad?"

**Note**: This is a flexible text field that can accommodate various schedule formats. For a more sophisticated timetable system, you might create a separate "CourseSchedules" table with individual time slots.

**Märkus**: See on paindlik tekstiväli, mis võib mahutada erinevaid ajakava formaate. Keerukama tunniplaani süsteemi jaoks võite luua eraldi "CourseSchedules" tabeli individuaalsete ajapesadega.

#### **How These Fields Work Together / Kuidas need väljad koos töötavad**:

**Example 1 / Näide 1**:
```
semester: "Fall 2024"
year: 2024
room_number: "A-101"
schedule: "Mon/Wed 10:00-11:30"
```
**Meaning**: This course is offered in Fall semester of 2024, meets in room A-101, on Mondays and Wednesdays from 10:00 to 11:30.

**Tähendus**: Seda kursust pakutakse 2024. aasta sügissemestril, toimub ruumis A-101, esmaspäeviti ja kolmapäeviti kella 10:00-11:30.

**Example 2 / Näide 2**:
```
semester: "Spring 2025"
year: 2025
room_number: "Lab 3"
schedule: "Tue 14:00-17:00"
```
**Meaning**: Spring 2025 course, in Lab 3, every Tuesday afternoon for 3 hours.

**Tähendus**: 2025. aasta kevadkursus, Laboris 3, igal teisipäeval pärastlõunal 3 tundi.

**Relationships / Seosed**:
- Many-to-One with Departments (mitu-ühele osakondadega)
- Many-to-One with Instructors (mitu-ühele õpetajatega)
- One-to-Many with Enrollments (üks-mitmele registreerimistega)

**Constraints / Piirangud**:
- Each course is taught by only ONE instructor / Iga kursust õpetab ainult ÜKS õpetaja
- A course belongs to exactly ONE department / Kursus kuulub täpselt ÜHTE osakonda

**Design Philosophy / Disaini filosoofia**:

This flexible design allows for various scheduling patterns without requiring a complex timetable system. The text-based fields (semester, room_number, schedule) provide simplicity while the combination gives complete scheduling information.

See paindlik disain võimaldab erinevaid ajakava mustreid ilma keerulise tunniplaani süsteemita. Tekstipõhised väljad (semester, room_number, schedule) pakuvad lihtsust, samas kui kombinatsioon annab täieliku ajakava informatsiooni.

If you need more sophisticated features like:
- Conflict detection (same room, same time)
- Automated timetable generation
- Room capacity management
- Equipment requirements

Consider creating additional tables:
- Rooms (room_id, building, capacity, equipment)
- TimeSlots (slot_id, day_of_week, start_time, end_time)
- CourseSchedules (course_id, room_id, slot_id)

---

### 5. Students (Õpilased / Üliõilased)
**Purpose / Eesmärk**: Stores student information
Salvestab üliõilaste infot

| Column | Type | Constraints | Description | Kirjeldus (Estonian) |
|--------|------|-------------|-------------|----------------------|
| student_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier | Unikaalne identifikaator |
| first_name | VARCHAR(50) | NOT NULL | First name | Eesnimi |
| last_name | VARCHAR(50) | NOT NULL | Last name | Perekonnanimi |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Email address | E-posti aadress |
| phone | VARCHAR(20) | | Phone number | Telefoninumber |
| date_of_birth | DATE | | Birth date | Sünnikuupäev |
| enrollment_year | INT | | Year first enrolled | Esmakordselt registreerumise aasta |
| major_department_id | INT | FOREIGN KEY | Major/primary department | Eriala/põhiosakond |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time (automatic) | Kirje loomise aeg (automaatne) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time (automatic) | Viimase uuenduse aeg (automaatne) |

**Note / Märkus**: GPA (Grade Point Average / Keskmine hinne) is calculated from the Grades table, not stored directly.
Keskmine hinne arvutatakse Hinnete tabelist, ei salvestata otse.

**Relationships / Seosed**:
- Many-to-One with Departments (major) (mitu-ühele osakondadega - eriala)
- One-to-Many with Enrollments (üks-mitmele registreerimistega)

---

### 6. Enrollments (Kursusele registreerimised)
**Purpose / Eesmärk**: Manages student course enrollments (Many-to-Many relationship)
Haldab üliõilaste kursusele registreerimisi (Mitu-mitmele seos)

| Column | Type | Constraints | Description | Kirjeldus (Estonian) |
|--------|------|-------------|-------------|----------------------|
| enrollment_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier | Unikaalne identifikaator |
| student_id | INT | NOT NULL, FOREIGN KEY | Enrolled student | Registreerunud üliõilane |
| course_id | INT | NOT NULL, FOREIGN KEY | Enrolled course | Kursus, millele registreeruti |
| enrollment_date | DATE | NOT NULL | Date of enrollment | Registreerumise kuupäev |
| grade | VARCHAR(2) | | Final grade (e.g., "A", "B", "5", "4") | Lõplik hinne |
| status | VARCHAR(20) | DEFAULT 'Active' | Enrollment status: "Active", "Completed", "Dropped", "Failed" | Registreerumise olek |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time (automatic) | Kirje loomise aeg (automaatne) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time (automatic) | Viimase uuenduse aeg (automaatne) |

**Relationships / Seosed**:
- Many-to-One with Students (mitu-ühele üliõilastega)
- Many-to-One with Courses (mitu-ühele kursustega)
- One-to-Many with Grades (üks-mitmele hinnetega)

**Constraints / Piirangud**:
- UNIQUE(student_id, course_id) - A student can enroll in a course only once / Üliõilane saab kursusele registreeruda ainult üks kord
- Students can enroll in multiple courses / Üliõilased võivad registreeruda mitmele kursusele
- Courses can have multiple students / Kursustel võib olla mitu üliõilast

---

### 7. Grades (Hinded)
**Purpose / Eesmärk**: Stores individual grades for students in their enrolled courses. The average grade (GPA) is calculated from this table.
Salvestab üliõilaste individuaalseid hindeid nende registreeritud kursustes. Keskmine hinne (GPA) arvutatakse selle tabeli põhjal.

| Column | Type | Constraints | Description | Kirjeldus (Estonian) |
|--------|------|-------------|-------------|----------------------|
| grade_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier | Unikaalne identifikaator |
| enrollment_id | INT | NOT NULL, FOREIGN KEY | The enrollment this grade belongs to | Registreerumine, millele hinne kuulub |
| grade_value | DECIMAL(3,2) | NOT NULL | Numeric grade value (1.0 to 5.0) | Numbriline hinde väärtus (1.0 kuni 5.0) |
| grade_type | VARCHAR(50) | DEFAULT 'Exam' | Type of assessment (Exam, Homework, Project, Quiz, Lab, Essay, Presentation) | Hindamise tüüp |
| grade_date | DATE | NOT NULL | Date when the grade was given | Kuupäev, millal hinne anti |
| description | VARCHAR(255) | | Optional description of the grade | Hinde valikuline kirjeldus |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time (automatic) | Kirje loomise aeg (automaatne) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update time (automatic) | Viimase uuenduse aeg (automaatne) |

**Relationships / Seosed**:
- Many-to-One with Enrollments (mitu-ühele registreerimistega)

**Business Rules / Ärireeglid**:
- Multiple grades can be assigned to one enrollment / Ühele registreerumisele võib määrata mitu hinnet
- The student's GPA is calculated as the average of all grade_values / Õpilase keskmine hinne arvutatakse kõigi grade_value väärtuste keskmisena
- Grade values use Estonian grading scale: 5 (excellent), 4 (good), 3 (satisfactory), 2 (poor), 1 (fail) / Hinde väärtused kasutavad Eesti hindamisskaalat

---

## Indexes

For optimal query performance, the following indexes are created:

- **Departments**: `department_name` (UNIQUE)
- **Instructors**: `email` (UNIQUE), `department_id`
- **Courses**: `course_code` (UNIQUE), `department_id`, `instructor_id`
- **Students**: `email` (UNIQUE), `major_department_id`
- **Enrollments**: `student_id`, `course_id`, UNIQUE(student_id, course_id)
- **Grades**: `enrollment_id`, `grade_date`

## Cascade Rules

- **ON DELETE CASCADE**: Deleting a department removes all associated instructors, courses, and enrollments
- **ON DELETE SET NULL**: Deleting an instructor sets course instructor_id to NULL
- **ON DELETE CASCADE**: Deleting a student or course removes associated enrollments
- **ON DELETE CASCADE**: Deleting an enrollment removes associated grades

## Business Rules Enforced by Schema

1. [ENFORCED] An instructor works in only one department (department_id is NOT NULL)
2. [ENFORCED] A course is taught by only one instructor (instructor_id is single value)
3. [ENFORCED] Each department has at most one head (department_id is PRIMARY KEY in DepartmentHeads)
4. [ENFORCED] An instructor can be head of only one department (instructor_id is UNIQUE)
5. [ENFORCED] Students can enroll in multiple courses (Many-to-Many via Enrollments)
6. [ENFORCED] Courses can have multiple students (Many-to-Many via Enrollments)
7. [ENFORCED] No duplicate enrollments (UNIQUE constraint on student_id + course_id)

## Security Best Practices / Turvalisuse Parimad Tavad

**Database User Permissions / Andmebaasi kasutaja õigused:**

**[CRITICAL WARNING] / [KRIITILINE HOIATUS]:**

**DO NOT use the 'root' MySQL user for application access!**
**ÄRA kasuta 'root' MySQL kasutajat rakenduse juurdepääsuks!**

The 'root' user has dangerous privileges:
- [NOT ALLOWED] DROP DATABASE (can delete entire database)
- [NOT ALLOWED] DROP TABLE (can delete tables)
- [NOT ALLOWED] CREATE USER (can create new users)
- [NOT ALLOWED] GRANT (can give permissions to others)

Root kasutajal on ohtlikud õigused:
- [NOT ALLOWED] DROP DATABASE (saab kustutada terve andmebaasi)
- [NOT ALLOWED] DROP TABLE (saab kustutada tabeleid)
- [NOT ALLOWED] CREATE USER (saab luua uusi kasutajaid)
- [NOT ALLOWED] GRANT (saab anda teistele õigusi)

**Recommended Approach / Soovitatav lähenemisviis:**

1. Create a dedicated application user with limited privileges:
   ```sql
   CREATE USER 'college_app'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT SELECT, INSERT, UPDATE, DELETE ON college_db.* TO 'college_app'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. This user can ONLY:
   - [ALLOWED] SELECT (read data)
   - [ALLOWED] INSERT (create new records)
   - [ALLOWED] UPDATE (modify records)
   - [ALLOWED] DELETE (remove records)

3. This user CANNOT:
   - [NOT ALLOWED] DROP tables or databases
   - [NOT ALLOWED] CREATE or ALTER table structures
   - [NOT ALLOWED] Create or modify users
   - [NOT ALLOWED] Change permissions

See detailed instructions in:
- `database/config.sql`
- `SETUP_GUIDE.md`
- `backend/config.php`

Vaata üksikasjalikke juhiseid:
- `database/config.sql`
- `SETUP_GUIDE.md`
- `backend/config.php`
