import React from 'react';
import { Database, Server, Copy, CheckCircle, Terminal, FileCode, Globe, Shield } from 'lucide-react';

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

const HtaccessCode = `
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
`;

const AdminDocs: React.FC = () => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">System Documentation</h2>
                <p className="text-slate-500 mt-2">Reference guide for database management and deployment.</p>
            </div>

            {/* Database Schema Section */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Database size={20} className="text-blue-400" />
                        <h3 className="font-semibold">Complete MySQL Database Schema</h3>
                    </div>
                    <button 
                        onClick={() => copyToClipboard(FULL_SCHEMA)}
                        className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors"
                    >
                        <Copy size={14} /> Copy SQL
                    </button>
                </div>
                <div className="p-0">
                    <pre className="bg-slate-50 p-6 text-xs font-mono text-slate-700 overflow-x-auto border-b border-slate-100 leading-relaxed max-h-[500px] overflow-y-auto">
                        {FULL_SCHEMA}
                    </pre>
                </div>
            </section>

            {/* Deployment Guide Section */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-blue-600 text-white p-4 flex items-center gap-2">
                    <Server size={20} />
                    <h3 className="font-semibold">Hostinger Deployment Guide</h3>
                </div>
                
                <div className="p-8 space-y-8">
                    
                    {/* Step 1 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">1</div>
                        <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-slate-800">Build the Frontend</h4>
                            <p className="text-sm text-slate-600">
                                Run the build command in your local environment (or StackBlitz) to generate the static files.
                            </p>
                            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-sm inline-block">
                                npm run build
                            </div>
                            <p className="text-xs text-slate-500 italic">This creates a `dist` folder containing index.html and assets.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">2</div>
                        <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-slate-800">Prepare PHP Backend</h4>
                            <p className="text-sm text-slate-600">
                                Ensure your `backend/config.php` has the correct Hostinger database credentials.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800 font-mono">
                                $host = '82.25.121.80';<br/>
                                $db   = 'u131922718_iitjee_tracker';<br/>
                                $user = 'u131922718_iitjee_tracker';<br/>
                                $pass = 'YOUR_PASSWORD_HERE';
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">3</div>
                        <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-slate-800">Upload to File Manager</h4>
                            <p className="text-sm text-slate-600">
                                Upload the contents of `dist` and the `backend` folder to <span className="font-mono bg-slate-100 px-1">public_html</span>.
                            </p>
                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-sm font-mono text-slate-700">
                                /public_html/<br/>
                                ├── assets/ <span className="text-slate-400"> (from dist)</span><br/>
                                ├── backend/ <span className="text-slate-400"> (your php files)</span><br/>
                                ├── index.html <span className="text-slate-400"> (from dist)</span><br/>
                                └── .htaccess
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">4</div>
                        <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-slate-800">Configure Routing (.htaccess)</h4>
                            <p className="text-sm text-slate-600">
                                Create a `.htaccess` file in `public_html` to handle React routing. This prevents 404 errors when refreshing pages.
                            </p>
                            <div className="relative">
                                <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                                    {HtaccessCode.trim()}
                                </pre>
                                <button 
                                    onClick={() => copyToClipboard(HtaccessCode.trim())}
                                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white bg-white/10 rounded transition-colors"
                                    title="Copy"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">5</div>
                         <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-slate-800">Import Database</h4>
                            <p className="text-sm text-slate-600">
                                Go to <strong>Hostinger hPanel &rarr; Databases &rarr; phpMyAdmin</strong>. Select your database and use the "Import" or "SQL" tab to run the schema code provided above.
                            </p>
                         </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default AdminDocs;