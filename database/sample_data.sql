-- Sample Data for College Database
-- This script inserts sample data into the database for testing

-- Insert Departments
INSERT INTO Departments (department_name, building, budget) VALUES
('Computer Science', 'Engineering Building A', 500000.00),
('Mathematics', 'Science Building B', 350000.00),
('Physics', 'Science Building C', 450000.00),
('English', 'Humanities Building', 250000.00),
('Business Administration', 'Business Hall', 600000.00);

-- Insert Instructors
INSERT INTO Instructors (first_name, last_name, email, phone, department_id, salary, hire_date) VALUES
('John', 'Smith', 'john.smith@college.edu', '555-0101', 1, 85000.00, '2015-08-15'),
('Emily', 'Johnson', 'emily.johnson@college.edu', '555-0102', 1, 78000.00, '2017-01-10'),
('Michael', 'Williams', 'michael.williams@college.edu', '555-0103', 2, 82000.00, '2014-09-01'),
('Sarah', 'Brown', 'sarah.brown@college.edu', '555-0104', 2, 75000.00, '2018-08-20'),
('David', 'Jones', 'david.jones@college.edu', '555-0105', 3, 88000.00, '2013-07-15'),
('Jennifer', 'Garcia', 'jennifer.garcia@college.edu', '555-0106', 4, 72000.00, '2016-01-05'),
('Robert', 'Martinez', 'robert.martinez@college.edu', '555-0107', 5, 95000.00, '2012-09-01'),
('Lisa', 'Anderson', 'lisa.anderson@college.edu', '555-0108', 5, 87000.00, '2015-06-15');

-- Insert Department Heads
INSERT INTO DepartmentHeads (department_id, instructor_id, start_date) VALUES
(1, 1, '2020-01-01'),
(2, 3, '2019-07-01'),
(3, 5, '2018-01-01'),
(4, 6, '2021-01-01'),
(5, 7, '2017-09-01');

-- Insert Courses
INSERT INTO Courses (course_code, course_name, department_id, instructor_id, credits, semester, year, room_number, schedule) VALUES
('CS101', 'Introduction to Programming', 1, 1, 3, 'Fall', 2024, 'ENG-A101', 'Mon/Wed 9:00-10:30'),
('CS201', 'Data Structures', 1, 2, 4, 'Fall', 2024, 'ENG-A102', 'Tue/Thu 10:00-12:00'),
('CS301', 'Database Systems', 1, 1, 3, 'Spring', 2024, 'ENG-A103', 'Mon/Wed 14:00-15:30'),
('MATH101', 'Calculus I', 2, 3, 4, 'Fall', 2024, 'SCI-B201', 'Mon/Wed/Fri 11:00-12:00'),
('MATH201', 'Linear Algebra', 2, 4, 3, 'Fall', 2024, 'SCI-B202', 'Tue/Thu 13:00-14:30'),
('PHY101', 'Physics I', 3, 5, 4, 'Fall', 2024, 'SCI-C101', 'Mon/Wed 15:00-17:00'),
('ENG101', 'English Composition', 4, 6, 3, 'Fall', 2024, 'HUM-101', 'Tue/Thu 9:00-10:30'),
('BUS101', 'Introduction to Business', 5, 7, 3, 'Fall', 2024, 'BUS-201', 'Mon/Wed 10:00-11:30'),
('BUS201', 'Marketing Fundamentals', 5, 8, 3, 'Fall', 2024, 'BUS-202', 'Tue/Thu 14:00-15:30');

-- Insert Students (GPA will be calculated from Grades table / GPA arvutatakse Hinnete tabelist)
INSERT INTO Students (first_name, last_name, email, phone, date_of_birth, enrollment_year, major_department_id) VALUES
('Alice', 'Wilson', 'alice.wilson@student.college.edu', '555-1001', '2003-05-15', 2023, 1),
('Bob', 'Taylor', 'bob.taylor@student.college.edu', '555-1002', '2002-11-22', 2022, 1),
('Charlie', 'Moore', 'charlie.moore@student.college.edu', '555-1003', '2003-08-10', 2023, 2),
('Diana', 'Thomas', 'diana.thomas@student.college.edu', '555-1004', '2004-02-28', 2024, 3),
('Edward', 'Jackson', 'edward.jackson@student.college.edu', '555-1005', '2003-07-19', 2023, 5),
('Fiona', 'White', 'fiona.white@student.college.edu', '555-1006', '2002-12-05', 2022, 4),
('George', 'Harris', 'george.harris@student.college.edu', '555-1007', '2003-09-14', 2023, 1),
('Hannah', 'Martin', 'hannah.martin@student.college.edu', '555-1008', '2004-04-30', 2024, 2);

-- Insert Enrollments
INSERT INTO Enrollments (student_id, course_id, enrollment_date, grade, status) VALUES
(1, 1, '2024-08-20', 'A', 'Active'),
(1, 2, '2024-08-20', 'A-', 'Active'),
(1, 4, '2024-08-20', NULL, 'Active'),
(2, 1, '2024-08-20', 'B+', 'Active'),
(2, 3, '2024-08-20', NULL, 'Active'),
(3, 4, '2024-08-20', 'A', 'Active'),
(3, 5, '2024-08-20', 'A-', 'Active'),
(4, 6, '2024-08-20', 'A', 'Active'),
(4, 7, '2024-08-20', NULL, 'Active'),
(5, 8, '2024-08-20', 'B', 'Active'),
(5, 9, '2024-08-20', 'B+', 'Active'),
(6, 7, '2024-08-20', 'A-', 'Active'),
(7, 1, '2024-08-20', 'C+', 'Active'),
(7, 2, '2024-08-20', NULL, 'Active'),
(8, 4, '2024-08-20', 'A', 'Active'),
(8, 5, '2024-08-20', NULL, 'Active');

-- Insert Grades (Hinded)
-- Grade values use Estonian grading scale: 5 (excellent), 4 (good), 3 (satisfactory), 2 (poor), 1 (fail)
-- Hinde väärtused kasutavad Eesti hindamisskaalat: 5 (suurepärane), 4 (hea), 3 (rahuldav), 2 (puudulik), 1 (nõrk)
INSERT INTO Grades (enrollment_id, grade_value, grade_type, grade_date, description) VALUES
-- Alice Wilson grades (enrollment_id 1, 2, 3)
(1, 4.50, 'Exam', '2024-10-15', 'Midterm exam'),
(1, 5.00, 'Homework', '2024-09-20', 'Programming assignment 1'),
(1, 4.00, 'Project', '2024-11-10', 'Final project'),
(2, 4.00, 'Exam', '2024-10-20', 'Data structures midterm'),
(2, 4.50, 'Homework', '2024-09-25', 'Linked list implementation'),
-- Bob Taylor grades (enrollment_id 4, 5)
(4, 3.50, 'Exam', '2024-10-15', 'Midterm exam'),
(4, 4.00, 'Homework', '2024-09-20', 'Programming assignment 1'),
(4, 3.00, 'Project', '2024-11-10', 'Final project'),
-- Charlie Moore grades (enrollment_id 6, 7)
(6, 5.00, 'Exam', '2024-10-18', 'Calculus midterm'),
(6, 4.50, 'Homework', '2024-09-22', 'Problem set 1'),
(7, 4.00, 'Exam', '2024-10-25', 'Linear algebra test'),
(7, 4.50, 'Quiz', '2024-09-15', 'Weekly quiz'),
-- Diana Thomas grades (enrollment_id 8, 9)
(8, 5.00, 'Exam', '2024-10-20', 'Physics midterm'),
(8, 4.50, 'Lab', '2024-09-28', 'Laboratory report'),
(8, 5.00, 'Homework', '2024-10-05', 'Problem set'),
-- Edward Jackson grades (enrollment_id 10, 11)
(10, 3.50, 'Exam', '2024-10-22', 'Business midterm'),
(10, 4.00, 'Presentation', '2024-11-05', 'Group presentation'),
(11, 4.00, 'Exam', '2024-10-28', 'Marketing test'),
(11, 3.50, 'Project', '2024-11-12', 'Marketing plan'),
-- Fiona White grades (enrollment_id 12)
(12, 4.00, 'Exam', '2024-10-18', 'English composition midterm'),
(12, 4.50, 'Essay', '2024-09-30', 'Persuasive essay'),
(12, 4.00, 'Essay', '2024-10-25', 'Research paper'),
-- George Harris grades (enrollment_id 13, 14)
(13, 2.50, 'Exam', '2024-10-15', 'Midterm exam'),
(13, 3.00, 'Homework', '2024-09-20', 'Programming assignment 1'),
(13, 3.50, 'Project', '2024-11-10', 'Final project'),
-- Hannah Martin grades (enrollment_id 15, 16)
(15, 5.00, 'Exam', '2024-10-18', 'Calculus midterm'),
(15, 5.00, 'Homework', '2024-09-22', 'Problem set 1'),
(15, 4.50, 'Quiz', '2024-10-01', 'Weekly quiz');
