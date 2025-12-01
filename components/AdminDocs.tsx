import React from 'react';
import { Database, Server, Copy, Download, Code, Globe, Shield, FileCog } from 'lucide-react';

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
    target_year VARCHAR(20), -- e.g., 'JEE 2025'
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
-- 2. SYLLABUS & TRACKING (UPDATED)
-- ==========================================

CREATE TABLE syllabus_topics (
    id INT PRIMARY KEY, -- Manually mapped to Frontend IDs (e.g., 1011) for consistency
    subject VARCHAR(50),      -- Physics, Chemistry, Maths
    chapter_name VARCHAR(100), -- Maps to JEE "UNIT" name
    phase VARCHAR(20),        -- Phase 1 (Class 11), Phase 2 (Class 12)
    topic_name VARCHAR(100),  -- Specific Topic Name
    est_hours INT
);

CREATE TABLE student_topic_progress (
    student_id INT,
    topic_id INT,
    status ENUM('not_started','in_progress','completed','revision_required') DEFAULT 'not_started',
    
    -- Exercise Tracking
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

CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    type ENUM('mock','pyq'),
    duration INT, -- in minutes
    total_marks INT,
    questions_count INT,
    published BOOLEAN DEFAULT 0
);

CREATE TABLE student_test_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    test_id INT,
    score INT,
    accuracy FLOAT, -- Percentage
    time_spent INT, -- Seconds
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- ==========================================
-- 4. UTILITIES & CONFIG
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
    config_data JSON, -- Stores school/coaching/sleep times and days
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
-- 5. INITIAL DATA SEEDING (JEE MAIN 2025)
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
        <div className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">System Deployment & Docs</h2>
                <p className="text-slate-500 mt-2">Everything you need to deploy to Hostinger, even without Node.js.</p>
            </div>

            {/* SECTION 1: DATABASE */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Database size={20} className="text-blue-400" />
                        <h3 className="font-semibold">1. MySQL Database Setup</h3>
                    </div>
                    <button 
                        onClick={() => copyToClipboard(FULL_SCHEMA)}
                        className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors"
                    >
                        <Copy size={14} /> Copy SQL
                    </button>
                </div>
                <div className="p-0">
                    <div className="bg-blue-50 p-4 text-xs text-blue-800 border-b border-blue-100">
                        <strong>Action:</strong> Go to Hostinger → Databases → phpMyAdmin. Select your database and run this SQL in the "SQL" tab.
                    </div>
                    <pre className="bg-slate-50 p-6 text-xs font-mono text-slate-700 overflow-x-auto leading-relaxed max-h-[300px] overflow-y-auto">
                        {FULL_SCHEMA}
                    </pre>
                </div>
            </section>

            {/* SECTION 2: BACKEND FILES */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-indigo-600 text-white p-4 flex items-center gap-2">
                    <FileCog size={20} />
                    <h3 className="font-semibold">2. Backend Files (Download & Upload)</h3>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-6">
                        Since you might not be able to create these manually, download them here and upload to <span className="font-mono bg-slate-100 px-1 rounded">public_html/backend/</span> folder.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Config */}
                        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Code size={16}/> config.php</h4>
                                <button onClick={() => downloadFile('config.php', PHP_CONFIG)} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 flex items-center gap-1 hover:bg-indigo-100">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Database connection settings. <span className="text-red-500 font-bold">Edit password after downloading!</span></p>
                        </div>

                        {/* Login */}
                        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Code size={16}/> auth/login.php</h4>
                                <button onClick={() => downloadFile('login.php', PHP_LOGIN)} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 flex items-center gap-1 hover:bg-indigo-100">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Handles user authentication. Upload to <code>backend/auth/</code> folder.</p>
                        </div>

                        {/* Register */}
                        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Code size={16}/> auth/register_student.php</h4>
                                <button onClick={() => downloadFile('register_student.php', PHP_REGISTER)} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 flex items-center gap-1 hover:bg-indigo-100">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Handles student signup. Upload to <code>backend/auth/</code> folder.</p>
                        </div>

                         {/* Htaccess */}
                         <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-slate-50">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FileCog size={16}/> .htaccess</h4>
                                <button onClick={() => downloadFile('.htaccess', HTACCESS_CODE)} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-300 flex items-center gap-1 hover:bg-slate-300">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Required for React Routing. Upload to <code>public_html/</code> root.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: FRONTEND BUILD (STACKBLITZ) */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 flex items-center gap-2">
                    <Globe size={20} />
                    <h3 className="font-semibold">3. "No-Code" Build Guide (Frontend)</h3>
                </div>
                
                <div className="p-8">
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                        <p className="text-sm text-orange-800">
                            <strong>Problem:</strong> You cannot run <code>npm run build</code> on your computer.<br/>
                            <strong>Solution:</strong> Use StackBlitz (a free online IDE) to build the files for you.
                        </p>
                    </div>

                    <div className="space-y-6 relative">
                        {/* Step 3.1 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">1</div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-800">Go to StackBlitz</h4>
                                <p className="text-sm text-slate-600">
                                    Open <a href="https://stackblitz.com" target="_blank" className="text-blue-600 underline">StackBlitz.com</a> and click "New Project". Select "Upload" if you have the files, or simply copy-paste your code into a new React (Vite) project.
                                </p>
                            </div>
                        </div>

                         {/* Step 3.2 */}
                         <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">2</div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-800">Run Build Command</h4>
                                <p className="text-sm text-slate-600">
                                    In the StackBlitz terminal (bottom of screen), type these commands:
                                </p>
                                <div className="bg-slate-900 text-white p-3 rounded font-mono text-xs mt-2">
                                    npm install<br/>
                                    npm run build
                                </div>
                            </div>
                        </div>

                         {/* Step 3.3 */}
                         <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">3</div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-800">Download the 'dist' Folder</h4>
                                <p className="text-sm text-slate-600">
                                    Once the command finishes, you will see a <code className="bg-slate-100 px-1 rounded">dist</code> folder appear in the sidebar. Right-click it and select <strong>Download</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Step 3.4 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">4</div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-800">Upload to Hostinger</h4>
                                <p className="text-sm text-slate-600">
                                    Take the files inside that downloaded <code>dist</code> folder (index.html, assets, etc.) and upload them to your Hostinger <code>public_html</code> folder alongside the backend files you downloaded above.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDocs;