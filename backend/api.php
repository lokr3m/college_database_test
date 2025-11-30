<?php
/**
 * API Handler for College Database
 * Handles all CRUD operations for different entities
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = getDBConnection();
if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$request = isset($_GET['request']) ? $_GET['request'] : '';
$parts = explode('/', trim($request, '/'));
$entity = isset($parts[0]) ? $parts[0] : '';
$id = isset($parts[1]) ? $parts[1] : null;

// Route requests to appropriate handlers
switch ($entity) {
    case 'departments':
        handleDepartments($conn, $method, $id);
        break;
    case 'instructors':
        handleInstructors($conn, $method, $id);
        break;
    case 'students':
        handleStudents($conn, $method, $id);
        break;
    case 'courses':
        handleCourses($conn, $method, $id);
        break;
    case 'enrollments':
        handleEnrollments($conn, $method, $id);
        break;
    case 'department-heads':
        handleDepartmentHeads($conn, $method, $id);
        break;
    case 'grades':
        handleGrades($conn, $method, $id);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Invalid endpoint']);
        break;
}

/**
 * Handle Departments CRUD operations
 */
function handleDepartments($conn, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getDepartmentById($conn, $id);
            } else {
                getAllDepartments($conn);
            }
            break;
        case 'POST':
            createDepartment($conn);
            break;
        case 'PUT':
            updateDepartment($conn, $id);
            break;
        case 'DELETE':
            deleteDepartment($conn, $id);
            break;
    }
}

function getAllDepartments($conn) {
    $stmt = $conn->query("SELECT * FROM Departments ORDER BY department_name");
    echo json_encode($stmt->fetchAll());
}

function getDepartmentById($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM Departments WHERE department_id = ?");
    $stmt->execute([$id]);
    $result = $stmt->fetch();
    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Department not found']);
    }
}

function createDepartment($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("INSERT INTO Departments (department_name, building, budget) VALUES (?, ?, ?)");
    try {
        $stmt->execute([
            $data['department_name'],
            $data['building'] ?? null,
            $data['budget'] ?? null
        ]);
        http_response_code(201);
        echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Department created successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateDepartment($conn, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("UPDATE Departments SET department_name = ?, building = ?, budget = ? WHERE department_id = ?");
    try {
        $stmt->execute([
            $data['department_name'],
            $data['building'] ?? null,
            $data['budget'] ?? null,
            $id
        ]);
        echo json_encode(['message' => 'Department updated successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteDepartment($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM Departments WHERE department_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Department deleted successfully']);
}

/**
 * Handle Instructors CRUD operations
 */
function handleInstructors($conn, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getInstructorById($conn, $id);
            } else {
                getAllInstructors($conn);
            }
            break;
        case 'POST':
            createInstructor($conn);
            break;
        case 'PUT':
            updateInstructor($conn, $id);
            break;
        case 'DELETE':
            deleteInstructor($conn, $id);
            break;
    }
}

function getAllInstructors($conn) {
    $stmt = $conn->query("
        SELECT i.*, d.department_name 
        FROM Instructors i 
        LEFT JOIN Departments d ON i.department_id = d.department_id 
        ORDER BY i.last_name, i.first_name
    ");
    echo json_encode($stmt->fetchAll());
}

function getInstructorById($conn, $id) {
    $stmt = $conn->prepare("
        SELECT i.*, d.department_name 
        FROM Instructors i 
        LEFT JOIN Departments d ON i.department_id = d.department_id 
        WHERE i.instructor_id = ?
    ");
    $stmt->execute([$id]);
    $result = $stmt->fetch();
    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Instructor not found']);
    }
}

function createInstructor($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        INSERT INTO Instructors (first_name, last_name, email, phone, department_id, salary, hire_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    try {
        $stmt->execute([
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $data['department_id'],
            $data['salary'] ?? null,
            $data['hire_date'] ?? null
        ]);
        http_response_code(201);
        echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Instructor created successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateInstructor($conn, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        UPDATE Instructors 
        SET first_name = ?, last_name = ?, email = ?, phone = ?, department_id = ?, salary = ?, hire_date = ? 
        WHERE instructor_id = ?
    ");
    try {
        $stmt->execute([
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $data['department_id'],
            $data['salary'] ?? null,
            $data['hire_date'] ?? null,
            $id
        ]);
        echo json_encode(['message' => 'Instructor updated successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteInstructor($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM Instructors WHERE instructor_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Instructor deleted successfully']);
}

/**
 * Handle Students CRUD operations
 */
function handleStudents($conn, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getStudentById($conn, $id);
            } else {
                getAllStudents($conn);
            }
            break;
        case 'POST':
            createStudent($conn);
            break;
        case 'PUT':
            updateStudent($conn, $id);
            break;
        case 'DELETE':
            deleteStudent($conn, $id);
            break;
    }
}

function getAllStudents($conn) {
    $stmt = $conn->query("
        SELECT s.*, d.department_name as major_name,
               (SELECT AVG(g.grade_value) 
                FROM Grades g 
                JOIN Enrollments e ON g.enrollment_id = e.enrollment_id 
                WHERE e.student_id = s.student_id) as gpa
        FROM Students s 
        LEFT JOIN Departments d ON s.major_department_id = d.department_id 
        ORDER BY s.last_name, s.first_name
    ");
    echo json_encode($stmt->fetchAll());
}

function getStudentById($conn, $id) {
    $stmt = $conn->prepare("
        SELECT s.*, d.department_name as major_name,
               (SELECT AVG(g.grade_value) 
                FROM Grades g 
                JOIN Enrollments e ON g.enrollment_id = e.enrollment_id 
                WHERE e.student_id = s.student_id) as gpa
        FROM Students s 
        LEFT JOIN Departments d ON s.major_department_id = d.department_id 
        WHERE s.student_id = ?
    ");
    $stmt->execute([$id]);
    $result = $stmt->fetch();
    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Student not found']);
    }
}

function createStudent($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        INSERT INTO Students (first_name, last_name, email, phone, date_of_birth, enrollment_year, major_department_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    try {
        $stmt->execute([
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $data['date_of_birth'] ?? null,
            $data['enrollment_year'] ?? null,
            $data['major_department_id'] ?? null
        ]);
        http_response_code(201);
        echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Student created successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateStudent($conn, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        UPDATE Students 
        SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, enrollment_year = ?, major_department_id = ? 
        WHERE student_id = ?
    ");
    try {
        $stmt->execute([
            $data['first_name'],
            $data['last_name'],
            $data['email'],
            $data['phone'] ?? null,
            $data['date_of_birth'] ?? null,
            $data['enrollment_year'] ?? null,
            $data['major_department_id'] ?? null,
            $id
        ]);
        echo json_encode(['message' => 'Student updated successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteStudent($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM Students WHERE student_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Student deleted successfully']);
}

/**
 * Handle Courses CRUD operations
 */
function handleCourses($conn, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getCourseById($conn, $id);
            } else {
                getAllCourses($conn);
            }
            break;
        case 'POST':
            createCourse($conn);
            break;
        case 'PUT':
            updateCourse($conn, $id);
            break;
        case 'DELETE':
            deleteCourse($conn, $id);
            break;
    }
}

function getAllCourses($conn) {
    $stmt = $conn->query("
        SELECT c.*, d.department_name, 
               CONCAT(i.first_name, ' ', i.last_name) as instructor_name
        FROM Courses c 
        LEFT JOIN Departments d ON c.department_id = d.department_id 
        LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
        ORDER BY c.course_code
    ");
    echo json_encode($stmt->fetchAll());
}

function getCourseById($conn, $id) {
    $stmt = $conn->prepare("
        SELECT c.*, d.department_name, 
               CONCAT(i.first_name, ' ', i.last_name) as instructor_name
        FROM Courses c 
        LEFT JOIN Departments d ON c.department_id = d.department_id 
        LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
        WHERE c.course_id = ?
    ");
    $stmt->execute([$id]);
    $result = $stmt->fetch();
    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Course not found']);
    }
}

function createCourse($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        INSERT INTO Courses (course_code, course_name, department_id, instructor_id, credits, semester, year, room_number, schedule) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    try {
        $stmt->execute([
            $data['course_code'],
            $data['course_name'],
            $data['department_id'],
            $data['instructor_id'] ?? null,
            $data['credits'] ?? 3,
            $data['semester'] ?? null,
            $data['year'] ?? null,
            $data['room_number'] ?? null,
            $data['schedule'] ?? null
        ]);
        http_response_code(201);
        echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Course created successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateCourse($conn, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        UPDATE Courses 
        SET course_code = ?, course_name = ?, department_id = ?, instructor_id = ?, credits = ?, semester = ?, year = ?, room_number = ?, schedule = ? 
        WHERE course_id = ?
    ");
    try {
        $stmt->execute([
            $data['course_code'],
            $data['course_name'],
            $data['department_id'],
            $data['instructor_id'] ?? null,
            $data['credits'] ?? 3,
            $data['semester'] ?? null,
            $data['year'] ?? null,
            $data['room_number'] ?? null,
            $data['schedule'] ?? null,
            $id
        ]);
        echo json_encode(['message' => 'Course updated successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteCourse($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM Courses WHERE course_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Course deleted successfully']);
}

/**
 * Handle Enrollments CRUD operations
 */
function handleEnrollments($conn, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getEnrollmentById($conn, $id);
            } else {
                getAllEnrollments($conn);
            }
            break;
        case 'POST':
            createEnrollment($conn);
            break;
        case 'PUT':
            updateEnrollment($conn, $id);
            break;
        case 'DELETE':
            deleteEnrollment($conn, $id);
            break;
    }
}

function getAllEnrollments($conn) {
    $stmt = $conn->query("
        SELECT e.*, 
               CONCAT(s.first_name, ' ', s.last_name) as student_name,
               c.course_code, c.course_name
        FROM Enrollments e 
        LEFT JOIN Students s ON e.student_id = s.student_id 
        LEFT JOIN Courses c ON e.course_id = c.course_id
        ORDER BY e.enrollment_date DESC
    ");
    echo json_encode($stmt->fetchAll());
}

function getEnrollmentById($conn, $id) {
    $stmt = $conn->prepare("
        SELECT e.*, 
               CONCAT(s.first_name, ' ', s.last_name) as student_name,
               c.course_code, c.course_name
        FROM Enrollments e 
        LEFT JOIN Students s ON e.student_id = s.student_id 
        LEFT JOIN Courses c ON e.course_id = c.course_id
        WHERE e.enrollment_id = ?
    ");
    $stmt->execute([$id]);
    $result = $stmt->fetch();
    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Enrollment not found']);
    }
}

function createEnrollment($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        INSERT INTO Enrollments (student_id, course_id, enrollment_date, grade, status) 
        VALUES (?, ?, ?, ?, ?)
    ");
    try {
        $stmt->execute([
            $data['student_id'],
            $data['course_id'],
            $data['enrollment_date'] ?? date('Y-m-d'),
            $data['grade'] ?? null,
            $data['status'] ?? 'Active'
        ]);
        http_response_code(201);
        echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Enrollment created successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateEnrollment($conn, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        UPDATE Enrollments 
        SET student_id = ?, course_id = ?, enrollment_date = ?, grade = ?, status = ? 
        WHERE enrollment_id = ?
    ");
    try {
        $stmt->execute([
            $data['student_id'],
            $data['course_id'],
            $data['enrollment_date'],
            $data['grade'] ?? null,
            $data['status'] ?? 'Active',
            $id
        ]);
        echo json_encode(['message' => 'Enrollment updated successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteEnrollment($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM Enrollments WHERE enrollment_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Enrollment deleted successfully']);
}

/**
 * Handle Department Heads CRUD operations
 */
function handleDepartmentHeads($conn, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getDepartmentHeadById($conn, $id);
            } else {
                getAllDepartmentHeads($conn);
            }
            break;
        case 'POST':
            createDepartmentHead($conn);
            break;
        case 'PUT':
            updateDepartmentHead($conn, $id);
            break;
        case 'DELETE':
            deleteDepartmentHead($conn, $id);
            break;
    }
}

function getAllDepartmentHeads($conn) {
    $stmt = $conn->query("
        SELECT dh.*, d.department_name, 
               CONCAT(i.first_name, ' ', i.last_name) as head_name
        FROM DepartmentHeads dh 
        LEFT JOIN Departments d ON dh.department_id = d.department_id 
        LEFT JOIN Instructors i ON dh.instructor_id = i.instructor_id
        ORDER BY d.department_name
    ");
    echo json_encode($stmt->fetchAll());
}

function getDepartmentHeadById($conn, $id) {
    $stmt = $conn->prepare("
        SELECT dh.*, d.department_name, 
               CONCAT(i.first_name, ' ', i.last_name) as head_name
        FROM DepartmentHeads dh 
        LEFT JOIN Departments d ON dh.department_id = d.department_id 
        LEFT JOIN Instructors i ON dh.instructor_id = i.instructor_id
        WHERE dh.department_id = ?
    ");
    $stmt->execute([$id]);
    $result = $stmt->fetch();
    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Department head not found']);
    }
}

function createDepartmentHead($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        INSERT INTO DepartmentHeads (department_id, instructor_id, start_date) 
        VALUES (?, ?, ?)
    ");
    try {
        $stmt->execute([
            $data['department_id'],
            $data['instructor_id'],
            $data['start_date'] ?? date('Y-m-d')
        ]);
        http_response_code(201);
        echo json_encode(['message' => 'Department head assigned successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateDepartmentHead($conn, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        UPDATE DepartmentHeads 
        SET instructor_id = ?, start_date = ? 
        WHERE department_id = ?
    ");
    try {
        $stmt->execute([
            $data['instructor_id'],
            $data['start_date'],
            $id
        ]);
        echo json_encode(['message' => 'Department head updated successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteDepartmentHead($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM DepartmentHeads WHERE department_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Department head removed successfully']);
}

/**
 * Handle Grades CRUD operations
 */
function handleGrades($conn, $method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                getGradeById($conn, $id);
            } else {
                getAllGrades($conn);
            }
            break;
        case 'POST':
            createGrade($conn);
            break;
        case 'PUT':
            updateGrade($conn, $id);
            break;
        case 'DELETE':
            deleteGrade($conn, $id);
            break;
    }
}

function getAllGrades($conn) {
    $stmt = $conn->query("
        SELECT g.*, 
               e.student_id, e.course_id,
               CONCAT(s.first_name, ' ', s.last_name) as student_name,
               c.course_code, c.course_name
        FROM Grades g 
        JOIN Enrollments e ON g.enrollment_id = e.enrollment_id
        LEFT JOIN Students s ON e.student_id = s.student_id 
        LEFT JOIN Courses c ON e.course_id = c.course_id
        ORDER BY g.grade_date DESC
    ");
    echo json_encode($stmt->fetchAll());
}

function getGradeById($conn, $id) {
    $stmt = $conn->prepare("
        SELECT g.*, 
               e.student_id, e.course_id,
               CONCAT(s.first_name, ' ', s.last_name) as student_name,
               c.course_code, c.course_name
        FROM Grades g 
        JOIN Enrollments e ON g.enrollment_id = e.enrollment_id
        LEFT JOIN Students s ON e.student_id = s.student_id 
        LEFT JOIN Courses c ON e.course_id = c.course_id
        WHERE g.grade_id = ?
    ");
    $stmt->execute([$id]);
    $result = $stmt->fetch();
    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Grade not found']);
    }
}

function createGrade($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        INSERT INTO Grades (enrollment_id, grade_value, grade_type, grade_date, description) 
        VALUES (?, ?, ?, ?, ?)
    ");
    try {
        $stmt->execute([
            $data['enrollment_id'],
            $data['grade_value'],
            $data['grade_type'] ?? 'Exam',
            $data['grade_date'] ?? date('Y-m-d'),
            $data['description'] ?? null
        ]);
        http_response_code(201);
        echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Grade created successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateGrade($conn, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $conn->prepare("
        UPDATE Grades 
        SET enrollment_id = ?, grade_value = ?, grade_type = ?, grade_date = ?, description = ? 
        WHERE grade_id = ?
    ");
    try {
        $stmt->execute([
            $data['enrollment_id'],
            $data['grade_value'],
            $data['grade_type'] ?? 'Exam',
            $data['grade_date'],
            $data['description'] ?? null,
            $id
        ]);
        echo json_encode(['message' => 'Grade updated successfully']);
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteGrade($conn, $id) {
    $stmt = $conn->prepare("DELETE FROM Grades WHERE grade_id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Grade deleted successfully']);
}
?>
