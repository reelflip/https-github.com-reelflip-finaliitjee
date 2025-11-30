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
    chapter_name VARCHAR(100), -- Mechanics, Organic Chemistry, etc.
    phase VARCHAR(20),        -- Phase 1 (Class 11), Phase 2 (Class 12)
    topic_name VARCHAR(100),  -- Kinematics, Mole Concept
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
-- 4. UTILITIES
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

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    message TEXT,
    role_target ENUM('student','parent','all'),
    publish_date DATE
);

-- ==========================================
-- 5. INITIAL DATA SEEDING (Syllabus)
-- ==========================================

-- Physics (Unit Wise)
INSERT INTO syllabus_topics (id, subject, chapter_name, phase, topic_name, est_hours) VALUES
(1011, 'Physics', 'General Physics', 'Class 11', 'Units and Dimensions', 4),
(1012, 'Physics', 'General Physics', 'Class 11', 'Errors & Measurements', 3),
(1013, 'Physics', 'General Physics', 'Class 11', 'Vectors', 5),
(1021, 'Physics', 'Mechanics', 'Class 11', 'Kinematics (1D & 2D)', 12),
(1022, 'Physics', 'Mechanics', 'Class 11', 'Newton''s Laws of Motion', 10),
(1023, 'Physics', 'Mechanics', 'Class 11', 'Friction', 5),
(1024, 'Physics', 'Mechanics', 'Class 11', 'Work, Energy, and Power', 8),
(1025, 'Physics', 'Mechanics', 'Class 11', 'Circular Motion', 6),
(1026, 'Physics', 'Mechanics', 'Class 11', 'Center of Mass & Collisions', 10),
(1027, 'Physics', 'Mechanics', 'Class 11', 'Rotational Motion', 18),
(1028, 'Physics', 'Mechanics', 'Class 11', 'Gravitation', 7),
(1029, 'Physics', 'Mechanics', 'Class 11', 'Fluid Mechanics', 10),
(1031, 'Physics', 'Thermal Physics', 'Class 11', 'Thermal Expansion & Calorimetry', 5),
(1032, 'Physics', 'Thermal Physics', 'Class 11', 'Thermodynamics', 9),
(1033, 'Physics', 'Thermal Physics', 'Class 11', 'Kinetic Theory of Gases', 5),
(1034, 'Physics', 'Thermal Physics', 'Class 11', 'Heat Transfer', 6),
(1041, 'Physics', 'Oscillations & Waves', 'Class 11', 'Simple Harmonic Motion', 10),
(1042, 'Physics', 'Oscillations & Waves', 'Class 11', 'Waves & Sound', 12),
(1051, 'Physics', 'Electricity & Magnetism', 'Class 12', 'Electrostatics', 16),
(1052, 'Physics', 'Electricity & Magnetism', 'Class 12', 'Capacitance', 6),
(1053, 'Physics', 'Electricity & Magnetism', 'Class 12', 'Current Electricity', 14),
(1054, 'Physics', 'Electricity & Magnetism', 'Class 12', 'Moving Charges & Magnetism', 12),
(1055, 'Physics', 'Electricity & Magnetism', 'Class 12', 'Magnetism & Matter', 5),
(1056, 'Physics', 'Electricity & Magnetism', 'Class 12', 'EMI', 9),
(1057, 'Physics', 'Electricity & Magnetism', 'Class 12', 'Alternating Current', 7),
(1061, 'Physics', 'Optics', 'Class 12', 'Ray Optics', 14),
(1062, 'Physics', 'Optics', 'Class 12', 'Wave Optics', 9),
(1063, 'Physics', 'Modern Physics', 'Class 12', 'Dual Nature of Matter', 5),
(1064, 'Physics', 'Modern Physics', 'Class 12', 'Atoms & Nuclei', 7),
(1065, 'Physics', 'Modern Physics', 'Class 12', 'Semiconductors', 8);

-- Chemistry (Unit Wise)
INSERT INTO syllabus_topics (id, subject, chapter_name, phase, topic_name, est_hours) VALUES
(2011, 'Chemistry', 'Physical Chemistry', 'Class 11', 'Mole Concept', 8),
(2012, 'Chemistry', 'Physical Chemistry', 'Class 11', 'Atomic Structure', 10),
(2013, 'Chemistry', 'Physical Chemistry', 'Class 11', 'Gaseous State', 6),
(2014, 'Chemistry', 'Physical Chemistry', 'Class 11', 'Chemical Equilibrium', 8),
(2015, 'Chemistry', 'Physical Chemistry', 'Class 11', 'Ionic Equilibrium', 12),
(2016, 'Chemistry', 'Physical Chemistry', 'Class 11', 'Thermodynamics', 10),
(2017, 'Chemistry', 'Physical Chemistry', 'Class 11', 'Redox Reactions', 5),
(2041, 'Chemistry', 'Physical Chemistry', 'Class 12', 'Solid State', 7),
(2042, 'Chemistry', 'Physical Chemistry', 'Class 12', 'Solutions', 8),
(2043, 'Chemistry', 'Physical Chemistry', 'Class 12', 'Electrochemistry', 11),
(2044, 'Chemistry', 'Physical Chemistry', 'Class 12', 'Chemical Kinetics', 9),
(2045, 'Chemistry', 'Physical Chemistry', 'Class 12', 'Surface Chemistry', 5),
(2021, 'Chemistry', 'Inorganic Chemistry', 'Class 11', 'Periodic Table', 6),
(2022, 'Chemistry', 'Inorganic Chemistry', 'Class 11', 'Chemical Bonding', 14),
(2023, 'Chemistry', 'Inorganic Chemistry', 'Class 11', 'Hydrogen & s-Block', 6),
(2024, 'Chemistry', 'Inorganic Chemistry', 'Class 11', 'p-Block Elements (Group 13, 14)', 6),
(2051, 'Chemistry', 'Inorganic Chemistry', 'Class 12', 'Metallurgy', 5),
(2052, 'Chemistry', 'Inorganic Chemistry', 'Class 12', 'p-Block (Group 15-18)', 10),
(2053, 'Chemistry', 'Inorganic Chemistry', 'Class 12', 'd and f Block', 7),
(2054, 'Chemistry', 'Inorganic Chemistry', 'Class 12', 'Coordination Compounds', 12),
(2031, 'Chemistry', 'Organic Chemistry', 'Class 11', 'GOC', 15),
(2032, 'Chemistry', 'Organic Chemistry', 'Class 11', 'Isomerism', 6),
(2033, 'Chemistry', 'Organic Chemistry', 'Class 11', 'Hydrocarbons', 10),
(2061, 'Chemistry', 'Organic Chemistry', 'Class 12', 'Haloalkanes & Haloarenes', 8),
(2062, 'Chemistry', 'Organic Chemistry', 'Class 12', 'Alcohols, Phenols, Ethers', 9),
(2063, 'Chemistry', 'Organic Chemistry', 'Class 12', 'Aldehydes, Ketones, Carboxylic', 12),
(2064, 'Chemistry', 'Organic Chemistry', 'Class 12', 'Amines', 6),
(2065, 'Chemistry', 'Organic Chemistry', 'Class 12', 'Biomolecules & Polymers', 6);

-- Mathematics (Unit Wise)
INSERT INTO syllabus_topics (id, subject, chapter_name, phase, topic_name, est_hours) VALUES
(3011, 'Mathematics', 'Algebra', 'Class 11', 'Sets, Relations & Functions', 8),
(3013, 'Mathematics', 'Algebra', 'Class 11', 'Quadratic Equations', 9),
(3014, 'Mathematics', 'Algebra', 'Class 11', 'Complex Numbers', 10),
(3015, 'Mathematics', 'Algebra', 'Class 11', 'Sequence & Series', 8),
(3016, 'Mathematics', 'Algebra', 'Class 11', 'Permutations & Combinations', 10),
(3017, 'Mathematics', 'Algebra', 'Class 11', 'Binomial Theorem', 7),
(3041, 'Mathematics', 'Algebra', 'Class 12', 'Matrices & Determinants', 10),
(3042, 'Mathematics', 'Algebra', 'Class 12', 'Probability', 9),
(3012, 'Mathematics', 'Trigonometry', 'Class 11', 'Trigonometric Ratios & Identities', 12),
(3018, 'Mathematics', 'Trigonometry', 'Class 11', 'Trigonometric Equations', 6),
(3019, 'Mathematics', 'Trigonometry', 'Class 11', 'Solutions of Triangles', 6),
(3045, 'Mathematics', 'Trigonometry', 'Class 12', 'Inverse Trigonometric Func', 6),
(3021, 'Mathematics', 'Coordinate Geometry', 'Class 11', 'Straight Lines', 10),
(3022, 'Mathematics', 'Coordinate Geometry', 'Class 11', 'Circles', 9),
(3023, 'Mathematics', 'Coordinate Geometry', 'Class 11', 'Parabola', 7),
(3024, 'Mathematics', 'Coordinate Geometry', 'Class 11', 'Ellipse & Hyperbola', 8),
(3031, 'Mathematics', 'Calculus', 'Class 12', 'Limits, Continuity & Diff', 12),
(3032, 'Mathematics', 'Calculus', 'Class 12', 'Differentiation', 8),
(3033, 'Mathematics', 'Calculus', 'Class 12', 'AOD', 12),
(3034, 'Mathematics', 'Calculus', 'Class 12', 'Indefinite Integration', 12),
(3035, 'Mathematics', 'Calculus', 'Class 12', 'Definite Integration', 10),
(3036, 'Mathematics', 'Calculus', 'Class 12', 'Area Under Curve', 6),
(3037, 'Mathematics', 'Calculus', 'Class 12', 'Differential Equations', 8),
(3043, 'Mathematics', 'Vectors & 3D Geometry', 'Class 12', 'Vector Algebra', 8),
(3044, 'Mathematics', 'Vectors & 3D Geometry', 'Class 12', '3D Geometry', 10);
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