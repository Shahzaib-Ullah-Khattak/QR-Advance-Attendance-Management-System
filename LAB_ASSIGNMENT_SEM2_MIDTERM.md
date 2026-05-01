# QR Code Attendance Management System - Semester 2 Mid-Term Lab Assignment

**Course:** Database Management & Web Development  
**Semester:** 2  
**Due Date:** [Set by Instructor]  
**Total Marks:** 100

---

## Overview

In this lab assignment, you will work with the **QR Code Attendance Management System** - a real-world application that uses QR code technology to automate student attendance tracking. Your task is to understand, enhance, and improve various components of the system.

---

## System Architecture

The system consists of the following components:

```
┌─────────────────────────────────────────────┐
│   QR Code Attendance Management System      │
├─────────────────────────────────────────────┤
│  Frontend: HTML/CSS/JavaScript              │
│  Backend: Node.js/Express                   │
│  Database: MySQL                            │
│  QR Tech: QR Code Generation & Scanning     │
└─────────────────────────────────────────────┘
```

### Database Schema

```sql
-- Sessions Table
CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    class_id INT NOT NULL,
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Attendance Table
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('Present', 'Absent', 'Late') DEFAULT 'Present',
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Students Table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    class_id INT NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Teachers Table
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Classes Table
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(50) NOT NULL,
    teacher_id INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
```

---

## Part A: Understanding & Analysis (25 Marks)

### Task A1: Code Review (10 Marks)

Review the `attendance.js` file and answer the following questions:

```javascript
// Current Implementation
router.post("/mark", (req, res) => {
    const { student_id, session_id, status } = req.body;
    
    db.query(
        "SELECT * FROM sessions WHERE id=?",
        [session_id],
        (err, session) => {
            if (session.length === 0)
                return res.send("Invalid session");
            
            const created = new Date(session[0].created_at);
            const now = new Date();
            
            const diff = (now - created) / 1000;
            
            if (diff > 300) {  // 5 minutes
                return res.send("QR Expired (5 min)");
            }
            
            db.query(
                "INSERT INTO attendance(session_id,student_id,status) VALUES (?,?,?)",
                [session_id, student_id, status]
            );
            
            res.send("Attendance Marked");
        }
    );
});
```

**Questions:**
1. What is the QR code expiration time in the current system?
2. Why is error handling important in the `db.query()` callback?
3. Identify at least 3 security vulnerabilities in this code.
4. What happens if a student scans the same QR code twice?

### Task A2: Database Analysis (8 Marks)

1. Draw an Entity-Relationship Diagram (ERD) for the database.
2. Identify the relationships between tables (One-to-One, One-to-Many, Many-to-Many).
3. Suggest 2 indexes that could improve query performance.

### Task A3: System Flow Diagram (7 Marks)

Create a flowchart showing:
1. QR Code generation process (from teacher's side)
2. QR Code scanning process (from student's side)
3. Attendance marking workflow

---

## Part B: Bug Fixes & Improvements (35 Marks)

### Task B1: Fix Critical Bugs (15 Marks)

Identify and fix the following issues in the current code:

**Bug #1: No error handling for database errors**
```javascript
// Current (WRONG):
db.query("INSERT INTO attendance(session_id,student_id,status) VALUES (?,?,?)",
    [session_id, student_id, status]
);
```

Your task: Add proper error handling.

**Bug #2: Duplicate attendance marking**
- A student can mark attendance multiple times for the same session
- Add a check to prevent duplicate entries

**Bug #3: Missing input validation**
- No validation for `student_id`, `session_id`, or `status`
- Add proper validation

### Task B2: Improve Error Messages (8 Marks)

Modify the attendance marking endpoint to return structured error responses:

```javascript
// Expected Response Format:
{
    success: true/false,
    message: "Descriptive message",
    data: { /* relevant data */ },
    timestamp: "ISO timestamp"
}
```

### Task B3: Add Attendance Report Generation (12 Marks)

Create a new endpoint `GET /attendance/report/:session_id` that returns:

```javascript
{
    session_id: 1,
    class_name: "CS-101",
    date: "2026-05-01",
    total_students: 45,
    present: 42,
    absent: 2,
    late: 1,
    attendance_percentage: 93.33,
    students: [
        {
            roll_number: "CS001",
            name: "Ahmed Ali",
            status: "Present",
            marked_at: "2026-05-01T09:15:00Z"
        }
        // ... more students
    ]
}
```

---

## Part C: Feature Development (25 Marks)

### Task C1: Real-time Attendance Dashboard (12 Marks)

Create a new endpoint `GET /dashboard/live/:session_id` that provides:

```javascript
{
    session_id: 1,
    start_time: "2026-05-01T09:00:00Z",
    elapsed_time: 120,  // in seconds
    marked_count: 38,
    pending_count: 7,
    class_strength: 45,
    attendance_rate: 84.44,
    live_updates: {
        last_marked: {
            student_name: "Fatima Khan",
            timestamp: "2026-05-01T09:02:15Z"
        }
    }
}
```

### Task C2: Advanced QR Features (13 Marks)

Implement the following features:

**a) QR Code Regeneration (6 Marks)**
- Add endpoint to regenerate QR code if current one expires
- Track all QR codes for a session
- Prevent marking attendance on old QR codes

**b) Late Marking Penalty (5 Marks)**
- If student marks attendance after 2 minutes, mark as "Late"
- Create analytics for late markings

**c) Attendance Streak Tracking (2 Marks)**
- Track consecutive present days for each student
- Calculate attendance percentage per student

---

## Part D: Testing & Documentation (15 Marks)

### Task D1: Unit Tests (8 Marks)

Write test cases for the attendance marking endpoint using Jest/Mocha:

```javascript
describe('Attendance Marking API', () => {
    
    test('Should mark attendance successfully', () => {
        // Test case 1
    });
    
    test('Should reject expired QR code', () => {
        // Test case 2
    });
    
    test('Should prevent duplicate marking', () => {
        // Test case 3
    });
    
    test('Should validate input parameters', () => {
        // Test case 4
    });
});
```

### Task D2: API Documentation (5 Marks)

Document all endpoints using Swagger/OpenAPI format:

```yaml
/api/attendance/mark:
  post:
    summary: Mark attendance via QR code
    parameters:
      - name: student_id
        required: true
        type: integer
      - name: session_id
        required: true
        type: integer
      - name: status
        required: true
        type: string (Present/Absent/Late)
    responses:
      200:
        description: Attendance marked successfully
      400:
        description: Invalid input
      401:
        description: QR code expired
```

### Task D3: Code Documentation (2 Marks)

Add JSDoc comments to all functions:

```javascript
/**
 * Marks student attendance for a session
 * @param {number} student_id - The student's ID
 * @param {number} session_id - The session's ID
 * @param {string} status - Attendance status (Present/Absent/Late)
 * @returns {Object} Response object with success status and message
 * @throws {Error} If database operation fails
 */
router.post("/mark", (req, res) => {
    // implementation
});
```

---

## Submission Requirements

1. **Code Files**: Submit all modified/new JavaScript files
2. **Documentation**: 
   - README explaining your changes
   - ERD diagram
   - System flowcharts
3. **Test Cases**: Test files with at least 10 test cases
4. **SQL Scripts**: Any database modifications or new tables
5. **Report**: 
   - Summary of bugs found and fixed
   - Features implemented
   - Challenges faced
   - Performance improvements (if any)

---

## Evaluation Criteria

| Component | Marks | Criteria |
|-----------|-------|----------|
| Code Quality | 20 | Clean, readable, follows conventions |
| Functionality | 30 | All features work as expected |
| Error Handling | 15 | Proper validation and error messages |
| Documentation | 15 | Well-documented code and API |
| Testing | 12 | Comprehensive test coverage |
| Report | 8 | Clear explanation of work done |
| **Total** | **100** | |

---

## Resources & References

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [QR Code Libraries](https://github.com/davidshimjs/qrcodejs)
- [Jest Testing Framework](https://jestjs.io/)
- [Swagger/OpenAPI](https://swagger.io/)

---

## Important Notes

⚠️ **Academic Integrity**: 
- Write your own code
- Document all external resources used
- Do not copy code from other students
- Plagiarism will result in zero marks

📅 **Deadline**: Submit by [DATE] at [TIME]

📧 **Submission**: Upload to classroom or send via email

---

## Good Luck! 🚀

If you have any questions, reach out during office hours or via email.

**Instructor**: [Your Name]  
**Contact**: [Your Email]
