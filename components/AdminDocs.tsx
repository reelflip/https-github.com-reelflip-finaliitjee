import React from 'react';
import { Database, Server, Copy, CheckCircle, Terminal, FileCode, Globe, Shield } from 'lucide-react';

const FULL_SCHEMA = `
-- 1. Users & Auth
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('student','parent','admin'),
    recovery_question VARCHAR(255),
    recovery_answer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Student Profile
CREATE TABLE students (
    user_id INT PRIMARY KEY,
    institute VARCHAR(100),
    target_year VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Parent Profile
CREATE TABLE parents (
    user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Parent-Student Connections
CREATE TABLE parent_student_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    student_id INT,
    status ENUM('pending','accepted','rejected') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Syllabus Structure
CREATE TABLE syllabus_topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(50),
    phase VARCHAR(20),
    topic_name VARCHAR(100),
    est_hours INT
);

-- 6. Student Progress
CREATE TABLE student_topic_progress (
    student_id INT,
    topic_id INT,
    status ENUM('not_started','in_progress','completed'),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, topic_id)
);

-- 7. Question Bank
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(50),
    topic_id INT,
    difficulty ENUM('easy','medium','hard'),
    question TEXT,
    options_json TEXT,
    correct_option INT
);

-- 8. Practice Sessions
CREATE TABLE practice_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    topic_id INT,
    correct_count INT,
    wrong_count INT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tests (Mock & PYQ)
CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    type ENUM('mock','pyq'),
    duration INT,
    total_marks INT,
    published BOOLEAN DEFAULT 0
);

-- 10. Test Attempts
CREATE TABLE student_test_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    test_id INT,
    score INT,
    accuracy FLOAT,
    time_spent INT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Planner / Timetable
CREATE TABLE planner (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    date DATE,
    subject VARCHAR(50),
    task_type VARCHAR(30),
    duration INT,
    status ENUM('pending','done')
);

-- 12. Timetable Configuration
CREATE TABLE timetable_config (
    student_id INT PRIMARY KEY,
    coaching_json TEXT,
    school_json TEXT,
    sleep_json TEXT
);

-- 13. Notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    message TEXT,
    role_target ENUM('student','parent','all'),
    publish_date DATE
);
`;

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
                    <pre className="bg-slate-50 p-6 text-xs font-mono text-slate-700 overflow-x-auto border-b border-slate-100 leading-relaxed">
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
                                Run the build command in your local environment to generate the static files.
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
