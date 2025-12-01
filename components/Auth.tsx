import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { loginUser, registerStudent } from '../services/auth';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Building, 
  Calendar, 
  HelpCircle, 
  ArrowUpCircle, 
  ChevronRight,
  ShieldCheck,
  Loader2,
  Database,
  WifiOff
} from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const COACHING_INSTITUTES = [
  "Allen Career Institute",
  "FIITJEE",
  "Aakash Institute",
  "Sri Chaitanya",
  "Narayana IIT Academy",
  "Bakliwal Tutorials",
  "Resonance",
  "Vidyamandir Classes (VMC)",
  "Vibrant Academy",
  "Motion Education",
  "Physics Wallah (Vidyapeeth)",
  "Unacademy Centre",
  "PACE IIT & Medical",
  "Reliable Institute",
  "Super 30",
  "Self Study / Other"
];

const TARGET_YEARS = [
  "JEE 2025",
  "JEE 2026",
  "JEE 2027",
  "JEE 2028"
];

// SQL Schema as a string for client-side download
const SQL_SCHEMA = `
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
    chapter_name VARCHAR(100), -- Maps to JEE "UNIT" name
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

CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    type ENUM('mock','pyq'),
    duration INT,
    total_marks INT,
    questions_count INT,
    published BOOLEAN DEFAULT 0
);

CREATE TABLE student_test_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    test_id INT,
    score INT,
    accuracy FLOAT,
    time_spent INT,
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

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [role, setRole] = useState<Role>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institute, setInstitute] = useState(COACHING_INSTITUTES[0]);
  const [targetYear, setTargetYear] = useState(TARGET_YEARS[0]);
  const [recoveryQuestion, setRecoveryQuestion] = useState('What is the name of your first pet?');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');

  // Update default email based on role for demo convenience
  useEffect(() => {
    if (role === 'admin') setEmail('admin@iitjee.com');
    else if (role === 'parent') setEmail('parent@example.com');
    else setEmail('student@example.com');
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
        if (isRegister) {
            if (role === 'student') {
                const success = await registerStudent({
                    fullName,
                    email,
                    password,
                    institute,
                    targetYear,
                    recoveryQuestion,
                    recoveryAnswer
                });
                if (success) {
                    // Auto login after register or switch to login
                    const user = await loginUser(email, password, role);
                    onLogin(user);
                } else {
                    setErrorMsg('Registration failed. Please try again.');
                }
            } else {
                setErrorMsg('Parent/Admin registration not implemented in this demo.');
            }
        } else {
            const user = await loginUser(email, password, role);
            onLogin(user);
        }
    } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleDownloadSql = (e: React.MouseEvent) => {
    e.preventDefault();
    const blob = new Blob([SQL_SCHEMA], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iit_jee_tracker_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-1 mb-4">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">IIT <span className="text-orange-500">JEE</span></h1>
        </div>
        
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950"></div>
             {/* Abstract arrow symbol resembling the logo in screenshot */}
             <div className="relative z-10 flex flex-col items-center text-blue-400">
                <ArrowUpCircle size={40} strokeWidth={1.5} />
             </div>
        </div>

        <h2 className="text-3xl font-bold text-blue-600 tracking-wider">TRACKER</h2>
        <div className="flex items-center justify-center gap-3 mt-3 opacity-60">
            <div className="h-[1px] w-12 bg-slate-400"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Your Journey. Your Data.</p>
            <div className="h-[1px] w-12 bg-slate-400"></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[450px] overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="flex justify-between items-baseline mb-8">
            <h3 className="text-xl font-bold text-slate-900">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h3>
            <button 
              type="button"
              onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isRegister ? 'Back to Login' : 'Create Account'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  role === 'student' 
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  role === 'parent' 
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  role === 'admin' 
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Admin
              </button>
            </div>

            {isRegister && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Full Name</label>
                <div className="relative group">
                  <UserIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Student Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            )}

            {isRegister && role === 'student' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Institute</label>
                   <div className="relative group">
                      <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                      <select 
                        value={institute}
                        onChange={(e) => setInstitute(e.target.value)}
                        className="w-full pl-10 pr-6 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none truncate"
                      >
                        {COACHING_INSTITUTES.map((inst) => (
                          <option key={inst} value={inst}>{inst}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                   </div>
                </div>
                <div>
                   <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Target Year</label>
                   <div className="relative group">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                      <select 
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        className="w-full pl-10 pr-6 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                      >
                        {TARGET_YEARS.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                   </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegister ? "Create a strong password" : "Enter your password"}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
               {!isRegister && (
                  <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                      Demo Mode: Enter any password
                  </p>
               )}
            </div>

            {isRegister && (
              <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                   <ShieldCheck size={16} className="text-blue-600" />
                   <h4 className="text-xs font-bold text-blue-700">Account Recovery Setup</h4>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Security Question</label>
                        <div className="relative">
                            <HelpCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                            <select 
                                value={recoveryQuestion}
                                onChange={(e) => setRecoveryQuestion(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-blue-200 rounded-lg text-slate-700 font-medium outline-none appearance-none focus:border-blue-400 transition-colors"
                            >
                                <option>What is the name of your first pet?</option>
                                <option>What is your mother's maiden name?</option>
                                <option>What city were you born in?</option>
                            </select>
                            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Answer</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Fluffy"
                            value={recoveryAnswer}
                            onChange={(e) => setRecoveryAnswer(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 bg-white border border-blue-200 rounded-lg text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-slate-300"
                        />
                    </div>
                </div>
              </div>
            )}
            
            {errorMsg && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center">
                    {errorMsg}
                </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-all transform active:scale-[0.99] mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
              ) : (
                  isRegister ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          {!isRegister && (
              <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-2">
                    <WifiOff size={12} />
                    <span>Demo Mode (PHP Backend Disconnected)</span>
                </div>
                <p className="text-xs text-slate-400">
                    Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
                </p>
              </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <p className="text-xs font-medium text-slate-400 opacity-60">
            &copy; 2024 IIT JEE Tracker. Exhaustive System.
        </p>
        <button 
          onClick={handleDownloadSql}
          className="inline-flex items-center gap-1.5 text-[10px] text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
        >
          <Database size={10} />
          Download Database Schema (SQL)
        </button>
      </div>
    </div>
  );
};

export default Auth;