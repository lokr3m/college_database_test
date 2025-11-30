-- College Database Schema / Kolledži Andmebaasi Skeem
-- This script creates all necessary tables for the college database system
-- See skript loob kõik vajalikud tabelid kolledži andmebaasi süsteemi jaoks
--
-- TERMINOLOGY / TERMINOLOOGIA:
-- Departments = Colleges/Schools = Osakonnad/Kolledžid (näiteks IT-osakond, Matemaatika-osakond)
-- Instructors = Teachers = Õpetajad/Õppejõud
-- Courses = Classes/Lessons = Kursused/Ained (näiteks Programmeerimine I, Matemaatika)
-- Students = Õpilased/Üliõpilased
-- Enrollments = Course Registrations = Kursusele registreerimised
--
-- TIMESTAMPS:
-- created_at and updated_at fields are automatically managed by MySQL
-- and track when records are created and last modified.
-- Need väljad haldab MySQL automaatselt ja jälgivad, millal kirjed loodi ja viimati muudeti.

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS Grades;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS DepartmentHeads;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Instructors;
DROP TABLE IF EXISTS Departments;

-- ============================================================================
-- DEPARTMENTS TABLE (Osakonnad / Kolledžid)
-- ============================================================================
-- Purpose / Eesmärk: 
--   Stores information about academic departments/colleges within the institution.
--   Each department represents a distinct academic unit (e.g., Computer Science, Mathematics).
--   Salvestab infot akadeemiliste osakondade/kolledžide kohta.
--   Iga osakond esindab eraldi akadeemilist üksust (nt Informaatika, Matemaatika).
--
-- Fields / Väljad:
--   - department_id: Unique identifier for the department / Osakonna unikaalne identifikaator
--   - department_name: Official name of the department (must be unique) / Osakonna ametlik nimi (peab olema unikaalne)
--   - building: Physical location/building where department is located / Füüsiline asukoht/hoone, kus osakond asub
--   - budget: Annual or allocated budget for the department / Aasta- või eraldatud eelarve osakonnale
-- ============================================================================
CREATE TABLE Departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    building VARCHAR(100),
    budget DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSTRUCTORS TABLE (Õpetajad / Õppejõud)
-- ============================================================================
-- Purpose / Eesmärk:
--   Stores information about teachers/instructors employed by the institution.
--   Each instructor belongs to exactly ONE department.
--   Salvestab infot õpetajate/õppejõudude kohta, kes töötavad asutuses.
--   Iga õpetaja kuulub täpselt ÜHTE osakonda.
--
-- Fields / Väljad:
--   - instructor_id: Unique identifier for the instructor / Õpetaja unikaalne identifikaator
--   - first_name: Instructor's first name / Õpetaja eesnimi
--   - last_name: Instructor's last name / Õpetaja perekonnanimi
--   - email: Contact email (must be unique) / Kontakt-email (peab olema unikaalne)
--   - phone: Contact phone number / Kontakttelefon
--   - department_id: Department where instructor works (REQUIRED) / Osakond, kus õpetaja töötab (KOHUSTUSLIK)
--   - salary: Monthly or annual salary / Kuu- või aastapalk
--   - hire_date: Date when instructor was hired / Kuupäev, millal õpetaja palgati
--
-- Business Rules / Ärireeglid:
--   - An instructor can work in ONLY ONE department
--   - An instructor can teach MULTIPLE courses
--   - Õpetaja võib töötada ainult ÜHES osakonnas
--   - Õpetaja võib õpetada MITUT kursust
-- ============================================================================
CREATE TABLE Instructors (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id INT NOT NULL,
    salary DECIMAL(10, 2),
    hire_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE,
    INDEX idx_department (department_id),
    INDEX idx_email (email)
);

-- ============================================================================
-- DEPARTMENT HEADS TABLE (Osakonnajuhatajad)
-- ============================================================================
-- Purpose / Eesmärk:
--   Tracks which instructor is currently serving as the head of each department.
--   Each department can have only ONE head at a time.
--   An instructor can be head of only ONE department at a time.
--   Jälgib, milline õpetaja on praegu iga osakonna juhataja.
--   Igal osakonnal saab olla ainult ÜKS juhataja korraga.
--   Õpetaja saab olla ainult ÜHE osakonna juhataja korraga.
--
-- Table Structure Explained / Tabeli struktuuri selgitus:
--   This is a junction/linking table that creates a 1:1 relationship between
--   Departments and Instructors for management purposes. The department_id serves
--   as the primary key, ensuring each department can have only one head record.
--   The instructor_id is UNIQUE, ensuring an instructor can lead only one department.
--   
--   See on ühendav/siduv tabel, mis loob 1:1 seose Osakondade ja Õpetajate vahel
--   juhtimise eesmärgil. department_id toimib primaarvõtmena, tagades et igal
--   osakonnal saab olla ainult üks juhataja kirje. instructor_id on UNIQUE,
--   tagades et õpetaja saab juhtida ainult ühte osakonda.
--
-- Fields / Väljad:
--   - department_id: Department being led (PRIMARY KEY) / Juhitav osakond (PRIMAARVÕTI)
--                    Ensures one head per department / Tagab ühe juhataja osakonna kohta
--   - instructor_id: Instructor serving as head (UNIQUE, NOT NULL) / 
--                    Õpetaja, kes töötab juhatajana (UNIQUE, NOT NULL)
--                    Ensures instructor leads only one department / 
--                    Tagab, et õpetaja juhib ainult ühte osakonda
--   - start_date: Date when this instructor became head / 
--                 Kuupäev, millal see õpetaja sai juhatajaks
--                 Used to track when current leadership began /
--                 Kasutatakse jälgimaks, millal praegune juhtimine algas
--   - created_at: Automatically set when record is created / 
--                 Automaatselt seatud, kui kirje luuakse
--   - updated_at: Automatically updated when record changes /
--                 Automaatselt uuendatud, kui kirje muutub
--
-- Historical Data / Ajaloolised Andmed:
--   [WARNING] IMPORTANT / TÄHTIS:
--   This table tracks ONLY the CURRENT department head. Records of PREVIOUS heads are NOT preserved.
--   See tabel jälgib AINULT PRAEGUST osakonnajuhatajat. Kirjeid VARASEMATEST juhatajatatest EI SÄILITATA.
--   
--   The start_date field tells when the current head's tenure began, but when a new head
--   is assigned, information about the previous head is lost.
--   start_date väli näitab, millal praeguse juhataja ametiaeg algas, kuid kui määratakse
--   uus juhataja, läheb informatsioon varasema juhataja kohta kaduma.
--   
--   When a new head is assigned:
--   Kui määratakse uus juhataja:
--     1. The old record is UPDATED (start_date changes) OR
--        Vana kirje UUENDATAKSE (start_date muutub) VÕI
--     2. The old record is DELETED and a new one is INSERTED
--        Vana kirje KUSTUTATAKSE ja lisatakse uus
--   
--   This means previous heads and their tenure periods are NOT preserved.
--   See tähendab, et varasemaid juhatajaid ja nende ametiperioode EI SÄILITATA.
--
--   [ENHANCEMENT] FUTURE ENHANCEMENT / TULEVIKU TÄIUSTUS:
--   If you need to track the full history of department leadership changes:
--   Kui on vaja jälgida osakonna juhtimise muutuste täielikku ajalugu:
--   
--   Create a separate "DepartmentHeadHistory" table:
--   Loo eraldi "DepartmentHeadHistory" tabel:
--     - head_history_id (PRIMARY KEY, AUTO_INCREMENT)
--     - department_id (FOREIGN KEY)
--     - instructor_id (FOREIGN KEY)
--     - start_date (NOT NULL) - when they became head / millal said juhatajaks
--     - end_date (NULL) - when they stepped down / millal lahkusid ametist
--     - reason (VARCHAR) - reason for change / muutuse põhjus
--     - created_at, updated_at (TIMESTAMP)
--   
--   With this history table:
--   Selle ajalootabeliga:
--     - You can track ALL past and present heads / Saad jälgida KÕIKI endisi ja praeguseid juhatajaid
--     - You can see how long each person served / Näed kui kaua iga isik teenis
--     - You can analyze leadership transition patterns / Saad analüüsida juhtimise ülemineku mustreid
--
-- Business Rules / Ärireeglid:
--   - Each department can have at most ONE head at any given time
--   - An instructor can be head of only ONE department at any given time
--   - The instructor must work in the department they are heading
--   - A department can exist without a head (no record in this table)
--   - Igal osakonnal võib olla kõige rohkem ÜKS juhataja igal ajahetkel
--   - Õpetaja saab olla ainult ÜHE osakonna juhataja igal ajahetkel
--   - Õpetaja peab töötama osakonnas, mida ta juhib
--   - Osakond võib eksisteerida ilma juhatajata (pole kirjet selles tabelis)
-- ============================================================================
CREATE TABLE DepartmentHeads (
    department_id INT PRIMARY KEY,
    instructor_id INT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id) ON DELETE CASCADE
);

-- ============================================================================
-- COURSES TABLE (Kursused / Ained)
-- ============================================================================
-- Purpose / Eesmärk:
--   Stores information about courses/subjects offered by the institution.
--   Each course belongs to ONE department and is taught by ONE instructor.
--   Salvestab infot institutsioonide poolt pakutavate kursuste/ainete kohta.
--   Iga kursus kuulub ÜHTE osakonda ja seda õpetab ÜKS õpetaja.
--
-- Core Fields / Põhiväljad:
--   - course_id: Unique identifier for the course / Kursuse unikaalne identifikaator
--   - course_code: Short code for the course (e.g., "CS101", "MATH200") / Lühike kood kursuse jaoks
--   - course_name: Full name of the course / Kursuse täisnimi
--   - department_id: Department offering this course (REQUIRED) / Osakond, mis pakub seda kursust (KOHUSTUSLIK)
--   - instructor_id: Instructor teaching this course / Õpetaja, kes õpetab seda kursust
--   - credits: Credit hours/points for the course / Krediidipunktid kursuse eest
--   - created_at: Automatically set when record is created / Automaatselt seatud, kui kirje luuakse
--   - updated_at: Automatically updated when record changes / Automaatselt uuendatud, kui kirje muutub
--
-- Scheduling Fields / Ajakava väljad:
--   These four fields work together to define WHEN and WHERE a course is offered:
--   Need neli välja töötavad koos, et määratleda, MILLAL ja KUS kursust pakutakse:
--
--   [SEMESTER] semester (VARCHAR(20)) - ACADEMIC TERM / AKADEEMILINE PERIOOD
--       Purpose: Indicates which academic term/semester the course is offered
--       Eesmärk: Näitab, millises akadeemilises perioodis/semestris kursust pakutakse
--       
--       Examples / Näited:
--         • "Fall 2024" / "Sügis 2024" - Autumn semester
--         • "Spring 2025" / "Kevad 2025" - Spring semester  
--         • "Summer 2024" / "Suvi 2024" - Summer session
--         • "1. semester" - First semester
--         • "2. semester" - Second semester
--       
--       This answers the question: "WHICH academic period is this course offered?"
--       See vastab küsimusele: "MILLISES akadeemilises perioodis seda kursust pakutakse?"
--
--   [YEAR] year (INT) - ACADEMIC YEAR / ÕPPEAASTA
--       Purpose: The calendar year for the course offering
--       Eesmärk: Kalendriaasta kursuse pakkumisele
--       
--       Examples / Näited: 2024, 2025, 2026
--       
--       Combined with semester, this uniquely identifies the course offering period.
--       For example: "Fall 2024" means autumn semester in year 2024.
--       
--       Koos semestriga määrab see unikaalselt kursuse pakkumise perioodi.
--       Näiteks: "Sügis 2024" tähendab sügisemestrit aastal 2024.
--
--   [ROOM] room_number (VARCHAR(20)) - CLASSROOM LOCATION / KLASSIRUUMI ASUKOHT
--       Purpose: Physical location where the course lectures/classes are held
--       Eesmärk: Füüsiline asukoht, kus kursuse loengud/tunnid toimuvad
--       
--       Examples / Näited:
--         • "A-101" - Room 101 in Building A
--         • "Room 305" - Room number 305
--         • "B-201" - Room 201 in Building B
--         • "Lab 3" - Laboratory 3
--         • "Auditorium 1" - Auditorium 1
--       
--       This answers: "WHERE does this course physically take place?"
--       See vastab: "KUS see kursus füüsiliselt toimub?"
--       
--       Note: This is a simple text field for flexibility. In a more complex system,
--       you might have a separate "Rooms" table with detailed information about
--       each classroom (capacity, equipment, building location, etc.).
--       
--       Märkus: See on lihtne tekstiväli paindlikkuse tagamiseks. Keerukamas süsteemis
--       võib olla eraldi "Ruumid" tabel üksikasjaliku infoga iga klassiruumi kohta
--       (mahutavus, varustus, hoone asukoht jne).
--
--   [SCHEDULE] schedule (VARCHAR(100)) - WEEKLY MEETING TIMES / NÄDALASED KOHTUMISE AJAD
--       Purpose: When during the week the course meets (days and times)
--       Eesmärk: Millal nädala jooksul kursus toimub (päevad ja kellaajad)
--       
--       Examples / Näited:
--         • "Mon/Wed 10:00-11:30" - Mondays and Wednesdays from 10:00 to 11:30
--         • "E/K 10:00-11:30" - Esmaspäev/Kolmapäev (Estonian: Monday/Wednesday)
--         • "Tue/Thu 14:00-16:00" - Tuesdays and Thursdays 2:00 PM to 4:00 PM
--         • "Fri 09:00-12:00" - Fridays 9:00 AM to 12:00 PM
--         • "MWF 13:00-14:00" - Monday, Wednesday, Friday 1:00 PM to 2:00 PM
--       
--       This answers: "WHEN during the week do students attend this course?"
--       See vastab: "MILLAL nädala jooksul õpilased selles kursuses osalevad?"
--       
--       Note: This is a flexible text field that can accommodate various schedule
--       formats. For a more sophisticated timetable system, you might create a
--       separate "CourseSchedules" table with individual time slots.
--       
--       Märkus: See on paindlik tekstiväli, mis võib mahutada erinevaid ajakava
--       formaate. Keerukama tunniplaani süsteemi jaoks võite luua eraldi
--       "CourseSchedules" tabeli individuaalsete ajapesadega.
--
-- How These Fields Work Together / Kuidas need väljad koos töötavad:
--   
--   Example 1 / Näide 1:
--     semester: "Fall 2024"
--     year: 2024
--     room_number: "A-101"
--     schedule: "Mon/Wed 10:00-11:30"
--     
--     Meaning: This course is offered in Fall semester of 2024, meets in room A-101,
--              on Mondays and Wednesdays from 10:00 to 11:30.
--     Tähendus: Seda kursust pakutakse 2024. aasta sügissemestril, toimub ruumis A-101,
--               esmaspäeviti ja kolmapäeviti kella 10:00-11:30.
--   
--   Example 2 / Näide 2:
--     semester: "Spring 2025"
--     year: 2025
--     room_number: "Lab 3"
--     schedule: "Tue 14:00-17:00"
--     
--     Meaning: Spring 2025 course, in Lab 3, every Tuesday afternoon for 3 hours.
--     Tähendus: 2025. aasta kevadkursus, Laboris 3, igal teisipäeval pärastlõunal 3 tundi.
--
-- Business Rules / Ärireeglid:
--   - Each course is taught by ONLY ONE instructor
--   - A course belongs to exactly ONE department
--   - An instructor can teach MULTIPLE courses
--   - Iga kursust õpetab ainult ÜKS õpetaja
--   - Kursus kuulub täpselt ÜHTE osakonda
--   - Õpetaja võib õpetada MITUT kursust
--
-- Design Philosophy / Disaini filosoofia:
--   This flexible design allows for various scheduling patterns without requiring
--   a complex timetable system. The text-based fields (semester, room_number, schedule)
--   provide simplicity while the combination gives complete scheduling information.
--   
--   If you need more sophisticated features like:
--   - Conflict detection (same room, same time)
--   - Automated timetable generation
--   - Room capacity management
--   - Equipment requirements
--   
--   Consider creating additional tables:
--   - Rooms (room_id, building, capacity, equipment)
--   - TimeSlots (slot_id, day_of_week, start_time, end_time)
--   - CourseSchedules (course_id, room_id, slot_id)
--   
--   See paindlik disain võimaldab erinevaid ajakava mustreid ilma keerulise
--   tunniplaani süsteemita. Tekstipõhised väljad (semester, room_number, schedule)
--   pakuvad lihtsust, samas kui kombinatsioon annab täieliku ajakava informatsiooni.
-- ============================================================================
CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    instructor_id INT,
    credits INT NOT NULL DEFAULT 3,
    semester VARCHAR(20),
    year INT,
    room_number VARCHAR(20),
    schedule VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id) ON DELETE SET NULL,
    INDEX idx_department (department_id),
    INDEX idx_instructor (instructor_id),
    INDEX idx_course_code (course_code)
);

-- ============================================================================
-- STUDENTS TABLE (Õpilased / Üliõilased)
-- ============================================================================
-- Purpose / Eesmärk:
--   Stores information about students enrolled in the institution.
--   Salvestab infot institutsioonides õppivate õpilaste kohta.
--
-- Fields / Väljad:
--   - student_id: Unique identifier for the student / Õpilase unikaalne identifikaator
--   - first_name: Student's first name / Õpilase eesnimi
--   - last_name: Student's last name / Õpilase perekonnanimi
--   - email: Contact email (must be unique) / Kontakt-email (peab olema unikaalne)
--   - phone: Contact phone number / Kontakttelefon
--   - date_of_birth: Student's birth date / Õpilase sünnikuupäev
--   - enrollment_year: Year the student first enrolled / Aasta, millal õpilane esmakordselt registreerus
--   - major_department_id: Student's major/primary department / Õpilase eriala/põhiosakond
--
-- Note / Märkus:
--   GPA is calculated from the Grades table, not stored directly.
--   Keskmine hinne (GPA) arvutatakse Hinnete tabelist, ei salvestata otse.
--
-- Business Rules / Ärireeglid:
--   - Students can enroll in MULTIPLE courses
--   - A student has ONE primary major department
--   - Õpilased võivad registreeruda MITMELE kursusele
--   - Õpilasel on ÜKS põhieriala osakond
-- ============================================================================
CREATE TABLE Students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    enrollment_year INT,
    major_department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (major_department_id) REFERENCES Departments(department_id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_major_department (major_department_id)
);

-- ============================================================================
-- ENROLLMENTS TABLE (Kursusele registreerimised)
-- ============================================================================
-- Purpose / Eesmärk:
--   Manages the many-to-many relationship between students and courses.
--   Tracks which students are enrolled in which courses and their grades.
--   Haldab mitme-mitmele suhet õpilaste ja kursuste vahel.
--   Jälgib, millised õpilased on registreerunud millistele kursustele ja nende hindeid.
--
-- Fields / Väljad:
--   - enrollment_id: Unique identifier for the enrollment / Registreerumise unikaalne identifikaator
--   - student_id: Student enrolled (REQUIRED) / Registreerunud õpilane (KOHUSTUSLIK)
--   - course_id: Course being taken (REQUIRED) / Võetav kursus (KOHUSTUSLIK)
--   - enrollment_date: Date when student enrolled in course / Kuupäev, millal õpilane kursusele registreerus
--   - grade: Final grade for the course / Lõplik hinne kursuse eest
--            Examples: "A", "B", "C", "5", "4", "3"
--   - status: Current enrollment status / Praegune registreerumise olek
--             Examples: "Active" (currently enrolled), "Completed" (finished), 
--                       "Dropped" (withdrew from course), "Failed" (did not pass)
--
-- Business Rules / Ärireeglid:
--   - A student can enroll in MULTIPLE courses
--   - A course can have MULTIPLE students
--   - A student can enroll in the same course only ONCE (enforced by UNIQUE constraint)
--   - Õpilane võib registreeruda MITMELE kursusele
--   - Kursusel võib olla MITU õpilast
--   - Õpilane saab samale kursusele registreeruda ainult ÜÜKS kord (tagatud UNIQUE piiranguga)
-- ============================================================================
CREATE TABLE Enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    grade VARCHAR(2),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    INDEX idx_student (student_id),
    INDEX idx_course (course_id)
);

-- ============================================================================
-- GRADES TABLE (Hinded)
-- ============================================================================
-- Purpose / Eesmärk:
--   Stores individual grades for students in their enrolled courses.
--   The average grade (GPA) is calculated from this table instead of being stored directly.
--   Salvestab üliõilaste individuaalseid hindeid nende registreeritud kursustes.
--   Keskmine hinne (GPA) arvutatakse selle tabeli põhjal, mitte ei salvestata otse.
--
-- Fields / Väljad:
--   - grade_id: Unique identifier for the grade / Hinde unikaalne identifikaator
--   - enrollment_id: The enrollment this grade belongs to / Registreerumine, millele hinne kuulub
--   - grade_value: Numeric grade value (1.0 to 5.0) / Numbriline hinde väärtus (1.0 kuni 5.0)
--   - grade_type: Type of assessment (e.g., exam, homework, project) / Hindamise tüüp
--   - grade_date: Date when the grade was given / Kuupäev, millal hinne anti
--   - description: Optional description of the grade / Hinde valikuline kirjeldus
--
-- Business Rules / Ärireeglid:
--   - Multiple grades can be assigned to one enrollment
--   - The student's GPA is calculated as the average of all grade_values
--   - Ühele registreerumisele võib määrata mitu hinnet
--   - Õpilase keskmine hinne arvutatakse kõigi grade_value väärtuste keskmisena
-- ============================================================================
CREATE TABLE Grades (
    grade_id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    grade_value DECIMAL(3, 2) NOT NULL CHECK (grade_value >= 1.0 AND grade_value <= 5.0),
    grade_type VARCHAR(50) DEFAULT 'Exam',
    grade_date DATE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES Enrollments(enrollment_id) ON DELETE CASCADE,
    INDEX idx_enrollment (enrollment_id),
    INDEX idx_grade_date (grade_date)
);
