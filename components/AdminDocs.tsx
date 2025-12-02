
import React from 'react';
import { Database, Copy, Download, Code, Globe, FileCog, FolderOpen, ArrowRight, CheckCircle2, FileJson, Server } from 'lucide-react';

const FULL_SCHEMA = `
-- ==========================================
-- 1. USER MANAGEMENT
-- ==========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student','parent','admin') NOT NULL,
    recovery_question VARCHAR(255),
    recovery_answer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    user_id INT PRIMARY KEY,
    institute VARCHAR(100),
    target_year VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE parents (
    user_id INT PRIMARY KEY,
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE parent_student_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    student_id INT,
    status ENUM('pending','accepted','rejected') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- 2. SYLLABUS & TRACKING
-- ==========================================

CREATE TABLE syllabus_topics (
    id INT PRIMARY KEY,
    subject VARCHAR(50),
    chapter_name VARCHAR(100),
    phase VARCHAR(20),
    topic_name VARCHAR(100),
    est_hours INT
);

CREATE TABLE student_topic_progress (
    student_id INT,
    topic_id INT,
    status ENUM('not_started','in_progress','completed','revision_required') DEFAULT 'not_started',
    ex1_solved INT DEFAULT 0,
    ex1_total INT DEFAULT 0,
    ex2_solved INT DEFAULT 0,
    ex2_total INT DEFAULT 0,
    ex3_solved INT DEFAULT 0,
    ex3_total INT DEFAULT 0,
    ex4_solved INT DEFAULT 0,
    ex4_total INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, topic_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES syllabus_topics(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. EXAMS & ANALYTICS
-- ==========================================

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(50),
    topic_name VARCHAR(100),
    difficulty ENUM('easy','medium','hard') DEFAULT 'medium',
    question_text TEXT,
    options_json TEXT, 
    correct_option INT
);

CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    type ENUM('mock','pyq'),
    duration INT,
    total_marks INT,
    questions_count INT,
    question_ids_json JSON,
    published BOOLEAN DEFAULT 0
);

CREATE TABLE student_test_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    test_id INT,
    test_title VARCHAR(255),
    score INT,
    accuracy FLOAT,
    time_spent INT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

CREATE TABLE practice_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    topic_id INT,
    correct_count INT,
    wrong_count INT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES syllabus_topics(id) ON DELETE CASCADE
);

-- ==========================================
-- 5. UTILITIES & CONFIG
-- ==========================================

CREATE TABLE planner (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    date DATE,
    subject VARCHAR(50),
    task_type VARCHAR(30),
    duration INT,
    status ENUM('pending','done'),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE timetable_config (
    student_id INT PRIMARY KEY,
    student_type ENUM('regular', 'dummy') DEFAULT 'regular',
    config_data JSON, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE study_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(50),
    duration_minutes INT,
    session_type ENUM('pomodoro', 'deep_work', 'short_break'),
    recall_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    message TEXT,
    role_target ENUM('student','parent','all'),
    publish_date DATE
);

-- ==========================================
-- 6. INITIAL DATA SEEDING (JEE MAIN 2025)
-- ==========================================

-- MATHEMATICS (Units 1-14)
INSERT INTO syllabus_topics (id, subject, chapter_name, phase, topic_name, est_hours) VALUES
(3011, 'Mathematics', 'UNIT 1: Sets, Relations and Functions', 'Maths', 'Sets, Relations & Functions', 8),
(3021, 'Mathematics', 'UNIT 2: Complex Numbers and Quadratic Equations', 'Maths', 'Complex Numbers', 10),
(3022, 'Mathematics', 'UNIT 2: Complex Numbers and Quadratic Equations', 'Maths', 'Quadratic Equations', 8),
(3031, 'Mathematics', 'UNIT 3: Matrices and Determinants', 'Maths', 'Matrices & Determinants', 10),
(3041, 'Mathematics', 'UNIT 4: Permutations and Combinations', 'Maths', 'Permutations & Combinations', 10),
(3051, 'Mathematics', 'UNIT 5: Binomial Theorem', 'Maths', 'Binomial Theorem', 7),
(3061, 'Mathematics', 'UNIT 6: Sequence and Series', 'Maths', 'Sequence and Series', 8),
(3071, 'Mathematics', 'UNIT 7: Limit, Continuity and Differentiability', 'Maths', 'Limits & Continuity', 8),
(3072, 'Mathematics', 'UNIT 7: Limit, Continuity and Differentiability', 'Maths', 'Differentiation', 8),
(3073, 'Mathematics', 'UNIT 7: Limit, Continuity and Differentiability', 'Maths', 'Applications of Derivatives', 12),
(3081, 'Mathematics', 'UNIT 8: Integral Calculus', 'Maths', 'Indefinite Integration', 12),
(3082, 'Mathematics', 'UNIT 8: Integral Calculus', 'Maths', 'Definite Integration', 10),
(3091, 'Mathematics', 'UNIT 9: Differential Equations', 'Maths', 'Differential Equations', 8),
(3101, 'Mathematics', 'UNIT 10: Co-ordinate Geometry', 'Maths', 'Straight Lines', 10),
(3102, 'Mathematics', 'UNIT 10: Co-ordinate Geometry', 'Maths', 'Circles', 9),
(3103, 'Mathematics', 'UNIT 10: Co-ordinate Geometry', 'Maths', 'Conic Sections', 12),
(3111, 'Mathematics', 'UNIT 11: Three Dimensional Geometry', 'Maths', '3D Geometry', 10),
(3121, 'Mathematics', 'UNIT 12: Vector Algebra', 'Maths', 'Vector Algebra', 8),
(3131, 'Mathematics', 'UNIT 13: Statistics and Probability', 'Maths', 'Statistics', 6),
(3132, 'Mathematics', 'UNIT 13: Statistics and Probability', 'Maths', 'Probability', 9),
(3141, 'Mathematics', 'UNIT 14: