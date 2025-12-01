import React from 'react';
import { Database, Copy, Download, Code, Globe, FileCog, FolderOpen, ArrowRight, CheckCircle2, FileJson } from 'lucide-react';

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
(3141, 'Mathematics', 'UNIT 14: Trigonometry', 'Maths', 'Trigonometry', 12);

-- PHYSICS (Units 1-20)
INSERT INTO syllabus_topics (id, subject, chapter_name, phase, topic_name, est_hours) VALUES
(1011, 'Physics', 'UNIT 1: Units and Measurements', 'Physics', 'Units & Measurements', 4),
(1021, 'Physics', 'UNIT 2: Kinematics', 'Physics', 'Kinematics', 10),
(1031, 'Physics', 'UNIT 3: Laws of Motion', 'Physics', 'Laws of Motion', 10),
(1041, 'Physics', 'UNIT 4: Work, Energy and Power', 'Physics', 'Work, Energy & Power', 8),
(1051, 'Physics', 'UNIT 5: Rotational Motion', 'Physics', 'Rotational Motion', 18),
(1061, 'Physics', 'UNIT 6: Gravitation', 'Physics', 'Gravitation', 7),
(1071, 'Physics', 'UNIT 7: Properties of Solids and Liquids', 'Physics', 'Properties of Solids & Liquids', 10),
(1081, 'Physics', 'UNIT 8: Thermodynamics', 'Physics', 'Thermodynamics', 9),
(1091, 'Physics', 'UNIT 9: Kinetic Theory of Gases', 'Physics', 'KTG', 5),
(1101, 'Physics', 'UNIT 10: Oscillations and Waves', 'Physics', 'Oscillations (SHM)', 10),
(1102, 'Physics', 'UNIT 10: Oscillations and Waves', 'Physics', 'Waves', 12),
(1111, 'Physics', 'UNIT 11: Electrostatics', 'Physics', 'Electrostatics', 16),
(1121, 'Physics', 'UNIT 12: Current Electricity', 'Physics', 'Current Electricity', 14),
(1131, 'Physics', 'UNIT 13: Magnetic Effects of Current and Magnetism', 'Physics', 'Moving Charges & Magnetism', 12),
(1132, 'Physics', 'UNIT 13: Magnetic Effects of Current and Magnetism', 'Physics', 'Magnetism & Matter', 5),
(1141, 'Physics', 'UNIT 14: Electromagnetic Induction and AC', 'Physics', 'EMI', 9),
(1142, 'Physics', 'UNIT 14: Electromagnetic Induction and AC', 'Physics', 'Alternating Current', 7),
(1151, 'Physics', 'UNIT 15: Electromagnetic Waves', 'Physics', 'EM Waves', 4),
(1161, 'Physics', 'UNIT 16: Optics', 'Physics', 'Ray Optics', 14),
(1162, 'Physics', 'UNIT 16: Optics', 'Physics', 'Wave Optics', 9),
(1171, 'Physics', 'UNIT 17: Dual Nature of Matter and Radiation', 'Physics', 'Dual Nature of Matter', 5),
(1181, 'Physics', 'UNIT 18: Atoms and Nuclei', 'Physics', 'Atoms & Nuclei', 7),
(1191, 'Physics', 'UNIT 19: Electronic Devices', 'Physics', 'Semiconductors', 8),
(1201, 'Physics', 'UNIT 20: Experimental Skills', 'Physics', 'Experimental Physics', 5);

-- CHEMISTRY (Units 1-20)
INSERT INTO syllabus_topics (id, subject, chapter_name, phase, topic_name, est_hours) VALUES
(2011, 'Chemistry', 'UNIT 1: Some Basic Concepts in Chemistry', 'Physical Chem', 'Mole Concept', 8),
(2021, 'Chemistry', 'UNIT 2: Atomic Structure', 'Physical Chem', 'Atomic Structure', 10),
(2031, 'Chemistry', 'UNIT 3: Chemical Bonding and Molecular Structure', 'Physical Chem', 'Chemical Bonding', 14),
(2041, 'Chemistry', 'UNIT 4: Chemical Thermodynamics', 'Physical Chem', 'Thermodynamics', 10),
(2051, 'Chemistry', 'UNIT 5: Solutions', 'Physical Chem', 'Solutions', 8),
(2061, 'Chemistry', 'UNIT 6: Equilibrium', 'Physical Chem', 'Chemical & Ionic Equilibrium', 12),
(2071, 'Chemistry', 'UNIT 7: Redox Reactions and Electrochemistry', 'Physical Chem', 'Redox & Electrochemistry', 11),
(2081, 'Chemistry', 'UNIT 8: Chemical Kinetics', 'Physical Chem', 'Chemical Kinetics', 9),
(2091, 'Chemistry', 'UNIT 9: Classification of Elements', 'Inorganic Chem', 'Periodic Table', 6),
(2101, 'Chemistry', 'UNIT 10: p-Block Elements', 'Inorganic Chem', 'p-Block Elements', 12),
(2111, 'Chemistry', 'UNIT 11: d- and f- Block Elements', 'Inorganic Chem', 'd & f Block', 7),
(2121, 'Chemistry', 'UNIT 12: Coordination Compounds', 'Inorganic Chem', 'Coordination Compounds', 12),
(2131, 'Chemistry', 'UNIT 13: Purification and Characterisation', 'Organic Chem', 'Purification Techniques', 5),
(2141, 'Chemistry', 'UNIT 14: Some Basic Principles of Organic Chemistry', 'Organic Chem', 'GOC & Isomerism', 15),
(2151, 'Chemistry', 'UNIT 15: Hydrocarbons', 'Organic Chem', 'Hydrocarbons', 10),
(2161, 'Chemistry', 'UNIT 16: Organic Compounds Containing Halogens', 'Organic Chem', 'Haloalkanes & Haloarenes', 8),
(2171, 'Chemistry', 'UNIT 17: Organic Compounds Containing Oxygen', 'Organic Chem', 'Alcohols, Phenols, Ethers', 9),
(2172, 'Chemistry', 'UNIT 17: Organic Compounds Containing Oxygen', 'Organic Chem', 'Aldehydes, Ketones, Acids', 12),
(2181, 'Chemistry', 'UNIT 18: Organic Compounds Containing Nitrogen', 'Organic Chem', 'Amines', 6),
(2191, 'Chemistry', 'UNIT 19: Biomolecules', 'Organic Chem', 'Biomolecules', 6),
(2201, 'Chemistry', 'UNIT 20: Principles Related to Practical Chemistry', 'Practical Chem', 'Practical Chemistry', 5);
`.trim();

const PHP_CONFIG = `
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = '82.25.121.80';
$db   = 'u131922718_iitjee_tracker';
$user = 'u131922718_iitjee_tracker';
$pass = 'YOUR_DB_PASSWORD_HERE'; // <--- IMPORTANT: Update this!
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}
?>
`.trim();

const PHP_LOGIN = `
<?php
require_once '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$email = $data['email'];
$password = $data['password'];
$role = $data['role'];

// For security, use password_verify() in production. 
// This is a simplified example.
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = ?");
$stmt->execute([$email, $role]);
$user = $stmt->fetch();

if ($user && $password === '123456') { // Demo Password Check
    // In production: if ($user && password_verify($password, $user['password_hash'])) {
    
    // Fetch extra details
    $details = [];
    if ($role === 'student') {
        $stmtS = $pdo->prepare("SELECT * FROM students WHERE user_id = ?");
        $stmtS->execute([$user['id']]);
        $details = $stmtS->fetch();
    } elseif ($role === 'parent') {
        $stmtP = $pdo->prepare("SELECT * FROM parents WHERE user_id = ?");
        $stmtP->execute([$user['id']]);
        $details = $stmtP->fetch();
    }

    echo json_encode([
        'success' => true,
        'user' => array_merge($user, $details ? $details : [])
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}
?>
`.trim();

const PHP_REGISTER = `
<?php
require_once '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

$fullName = $data['fullName'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$role = 'student';
$institute = $data['institute'];
$targetYear = $data['targetYear'];
$recoveryQ = $data['recoveryQuestion'];
$recoveryA = $data['recoveryAnswer'];

try {
    $pdo->beginTransaction();

    // Insert User
    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password_hash, role, recovery_question, recovery_answer) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$fullName, $email, $password, $role, $recoveryQ, $recoveryA]);
    $userId = $pdo->lastInsertId();

    // Insert Student Details
    $stmt2 = $pdo->prepare("INSERT INTO students (user_id, institute, target_year) VALUES (?, ?, ?)");
    $stmt2->execute([$userId, $institute, $targetYear]);

    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
`.trim();

const HTACCESS_CODE = `
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
`.trim();

const PHP_QUESTIONS = `
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$file = 'questions.json';

// Handle GET request (Read questions)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode([]);
    }
    exit;
}

// Handle POST request (Add/Update questions)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input');
    // Validate JSON
    if (json_decode($data)) {
        file_put_contents($file, $data);
        echo json_encode(['success' => true, 'message' => 'Questions saved']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    }
    exit;
}
?>
`.trim();

const AdminDocs: React.FC = () => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const downloadFile = (filename: string, content: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 pb-12 max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Deployment Guide</h2>
                <p className="text-slate-500 mt-2">Follow these <strong className="text-slate-800">5 Phases</strong> sequentially to deploy your site to Hostinger.</p>
            </div>

            {/* PHASE 1: DATABASE */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
                    <div className="bg-slate-700 px-3 py-1 rounded text-sm font-bold">Phase 1</div>
                    <div className="flex items-center gap-2">
                        <Database size={20} className="text-blue-400" />
                        <h3 className="font-semibold">Setup Database</h3>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4">
                        1. Log in to Hostinger hPanel.<br/>
                        2. Go to <strong>Databases</strong> → <strong>phpMyAdmin</strong>.<br/>
                        3. Select your database (<code>u131922718_iitjee_tracker</code>) and click the <strong>SQL</strong> tab.<br/>
                        4. Copy the code below and Paste it there. Click <strong>Go</strong>.
                    </p>
                    <div className="relative">
                        <button 
                            onClick={() => copyToClipboard(FULL_SCHEMA)}
                            className="absolute top-2 right-2 flex items-center gap-2 text-xs bg-white shadow-sm border px-3 py-1.5 rounded hover:bg-slate-50 transition-colors z-10"
                        >
                            <Copy size={14} /> Copy SQL
                        </button>
                        <pre className="bg-slate-50 p-4 pt-10 text-xs font-mono text-slate-700 overflow-x-auto h-[200px] border border-slate-100 rounded-lg">
                            {FULL_SCHEMA}
                        </pre>
                    </div>
                </div>
            </section>

            {/* PHASE 2: BACKEND FILES */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
                    <div className="bg-slate-700 px-3 py-1 rounded text-sm font-bold">Phase 2</div>
                    <div className="flex items-center gap-2">
                        <FileCog size={20} className="text-purple-400" />
                        <h3 className="font-semibold">Prepare Backend Files</h3>
                    </div>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-6">
                        Download these essential files to your computer. You will upload them later.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Config */}
                        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-blue-50/30">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Code size={16}/> config.php</h4>
                                <button onClick={() => downloadFile('config.php', PHP_CONFIG)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Database connection. <span className="text-red-600 font-bold bg-red-50 px-1 rounded">⚠️ Open and add your password!</span></p>
                        </div>

                        {/* Login */}
                        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Code size={16}/> login.php</h4>
                                <button onClick={() => downloadFile('login.php', PHP_LOGIN)} className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded border hover:bg-slate-50 transition-colors flex items-center gap-1">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Handles login logic.</p>
                        </div>

                        {/* Register */}
                        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Code size={16}/> register_student.php</h4>
                                <button onClick={() => downloadFile('register_student.php', PHP_REGISTER)} className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded border hover:bg-slate-50 transition-colors flex items-center gap-1">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Handles student registration logic.</p>
                        </div>

                         {/* Htaccess */}
                         <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FileCog size={16}/> .htaccess</h4>
                                <button onClick={() => downloadFile('.htaccess', HTACCESS_CODE)} className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded border hover:bg-slate-50 transition-colors flex items-center gap-1">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Redirects traffic to index.html (Required).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PHASE 3: FRONTEND BUILD */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
                    <div className="bg-slate-700 px-3 py-1 rounded text-sm font-bold">Phase 3</div>
                    <div className="flex items-center gap-2">
                        <Globe size={20} className="text-green-400" />
                        <h3 className="font-semibold">Generate Frontend (No-Code Build)</h3>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 text-sm text-orange-800">
                        This step creates the visual website files (HTML/CSS/JS). You need to use an online builder since you don't have Node.js installed.
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-600 shrink-0">1</div>
                            <div className="text-sm">
                                <p className="font-semibold text-slate-800">Open StackBlitz</p>
                                <p className="text-slate-600">Go to <a href="https://stackblitz.com" target="_blank" className="text-blue-600 underline">StackBlitz.com</a>. Click "New Project" → "Upload" and drag all your project files there.</p>
                            </div>
                        </div>

                         <div className="flex gap-4 items-start">
                            <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-600 shrink-0">2</div>
                            <div className="text-sm w-full">
                                <p className="font-semibold text-slate-800">Run Build Command</p>
                                <p className="text-slate-600 mb-2">In the terminal at the bottom of the screen, type:</p>
                                <div className="bg-black text-green-400 font-mono p-3 rounded text-xs w-full">
                                    npm install &amp;&amp; npm run build
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-600 shrink-0">3</div>
                            <div className="text-sm">
                                <p className="font-semibold text-slate-800">Download Output</p>
                                <p className="text-slate-600">
                                    A <code>dist</code> folder will appear in the sidebar. Right-click it and select <strong>Download</strong>.
                                    This folder contains your website.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* PHASE 4: FINAL ASSEMBLY */}
             <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
                    <div className="bg-slate-700 px-3 py-1 rounded text-sm font-bold">Phase 4</div>
                    <div className="flex items-center gap-2">
                        <FolderOpen size={20} className="text-yellow-400" />
                        <h3 className="font-semibold">Final Upload (Hostinger)</h3>
                    </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm text-slate-600 mb-4">
                            Go to Hostinger <strong>File Manager</strong>. Open the <code>public_html</code> folder.
                            Upload the files from Phase 2 and Phase 3 so they look <strong>EXACTLY</strong> like this:
                        </p>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm leading-7">
                            <div className="flex items-center gap-2 text-slate-800 font-bold"><FolderOpen size={16} className="text-yellow-500"/> public_html /</div>
                            
                            <div className="ml-6 flex items-center gap-2 text-slate-600">
                                <FolderOpen size={16} className="text-blue-500"/> assets <span className="text-slate-400 text-xs">(From Phase 3 dist folder)</span>
                            </div>

                            <div className="ml-6 flex items-center gap-2 text-slate-600">
                                <FolderOpen size={16} className="text-blue-500"/> backend <span className="text-purple-500 text-xs font-bold">(Create this folder!)</span>
                            </div>
                            
                            <div className="ml-12 flex items-center gap-2 text-slate-500 border-l-2 border-slate-200 pl-2">
                                <Code size={14}/> config.php <span className="text-xs text-slate-400">(From Phase 2)</span>
                            </div>

                            <div className="ml-12 flex items-center gap-2 text-slate-600 border-l-2 border-slate-200 pl-2">
                                <FolderOpen size={14} className="text-blue-400"/> auth <span className="text-purple-500 text-xs font-bold">(Create this folder!)</span>
                            </div>

                            <div className="ml-[4.5rem] flex items-center gap-2 text-slate-500 border-l-2 border-slate-200 pl-2">
                                <Code size={14}/> login.php <span className="text-xs text-slate-400">(From Phase 2)</span>
                            </div>
                            <div className="ml-[4.5rem] flex items-center gap-2 text-slate-500 border-l-2 border-slate-200 pl-2">
                                <Code size={14}/> register_student.php <span className="text-xs text-slate-400">(From Phase 2)</span>
                            </div>

                            {/* Added Question Bank File */}
                            <div className="ml-12 flex items-center gap-2 text-slate-500 border-l-2 border-slate-200 pl-2">
                                <Code size={14}/> questions.php <span className="text-xs text-purple-600 font-bold">(See Phase 5)</span>
                            </div>

                            <div className="ml-6 flex items-center gap-2 text-slate-600">
                                <FileCog size={16} className="text-slate-400"/> .htaccess <span className="text-xs text-slate-400">(From Phase 2)</span>
                            </div>
                            
                            <div className="ml-6 flex items-center gap-2 text-slate-600">
                                <Globe size={16} className="text-orange-500"/> index.html <span className="text-xs text-slate-400">(From Phase 3 dist folder)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 size={48} className="text-green-500 mb-4" />
                        <h4 className="text-lg font-bold text-green-800">You're Done!</h4>
                        <p className="text-sm text-green-700 mt-2">
                            Once your file structure matches the diagram, your IIT JEE Tracker will be live at your domain name.
                        </p>
                    </div>
                </div>
            </section>

             {/* PHASE 5: QUESTION BANK API */}
             <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
                    <div className="bg-slate-700 px-3 py-1 rounded text-sm font-bold">Phase 5</div>
                    <div className="flex items-center gap-2">
                        <FileJson size={20} className="text-pink-400" />
                        <h3 className="font-semibold">Question Bank Setup (Optional)</h3>
                    </div>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-6">
                        To enable the Admin Question Bank (Server-side File Storage), upload this file to your <code>/backend</code> folder.
                    </p>

                    <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-pink-50/30">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2"><Code size={16}/> questions.php</h4>
                            <button onClick={() => downloadFile('questions.php', PHP_QUESTIONS)} className="text-xs bg-pink-600 text-white px-3 py-1.5 rounded hover:bg-pink-700 transition-colors flex items-center gap-1 shadow-sm">
                                <Download size={12} /> Download
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">Reads/Writes to <code>questions.json</code> on the server.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDocs;