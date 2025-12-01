import React, { useState } from 'react';
import { User, Test, Question, Notification, TestAttempt } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Syllabus from './components/Syllabus';
import Analytics from './components/Analytics';
import TestCenter from './components/TestCenter';
import TimetableGenerator from './components/TimetableGenerator';
import AdminDocs from './components/AdminDocs';
import AdminUserManagement from './components/AdminUserManagement';
import Settings from './components/Settings';
import FocusZone from './components/FocusZone';

// Initial Data
const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Physics Mock Test', message: 'Full syllabus mock test available tomorrow.', date: '2023-10-25', type: 'alert' },
  { id: 2, title: 'Syllabus Update', message: 'Admin added new questions to Rotational Motion.', date: '2023-10-24', type: 'reminder' },
];

const MOCK_QUESTION_BANK: Question[] = [
    { id: 101, text: "A particle of mass m moves in a circular orbit...", options: ["L", "2L", "L/2", "4L"], correctOption: 0, subject: "Physics", topic: "Rotational Motion" },
    { id: 102, text: "The dimensions of magnetic flux are:", options: ["[ML2T-2A-1]", "[ML2T-2A-2]", "[MLT-2A-1]", "[MLT-1A-1]"], correctOption: 0, subject: "Physics", topic: "Magnetism" },
    { id: 103, text: "Which of the following is diamagnetic?", options: ["Oxygen", "Nitrogen", "Iron", "Cobalt"], correctOption: 1, subject: "Chemistry", topic: "Magnetism" },
    { id: 104, text: "Integration of log(x) dx is:", options: ["x log x - x + C", "x log x + x + C", "log x - x + C", "1/x + C"], correctOption: 0, subject: "Maths", topic: "Calculus" },
    { id: 105, text: "The number of sigma and pi bonds in benzene are:", options: ["12, 3", "6, 3", "12, 6", "6, 6"], correctOption: 0, subject: "Chemistry", topic: "Organic" },
];

const INITIAL_TESTS: Test[] = [
  { id: 1, title: 'JEE Main Full Mock 1', type: 'mock', duration: 180, totalMarks: 300, questionsCount: 5 },
  { id: 2, title: 'Physics - Rotational Mechanics', type: 'mock', duration: 60, totalMarks: 100, questionsCount: 2 },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Shared State (Lifted)
  const [tests, setTests] = useState<Test[]>(INITIAL_TESTS);
  const [questionBank, setQuestionBank] = useState<Question[]>(MOCK_QUESTION_BANK);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);

  // Handlers
  const handleAddTest = (newTest: Test) => {
    setTests(prev => [...prev, newTest]);
    
    // Auto-notify students
    const newNotif: Notification = {
        id: Date.now(),
        title: 'New Test Added',
        message: `Admin has published a new test: ${newTest.title}`,
        date: new Date().toISOString().split('T')[0],
        type: 'alert'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleTestComplete = (attempt: TestAttempt) => {
    setTestAttempts(prev => [attempt, ...prev]);
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} notifications={notifications} />;
      case 'syllabus':
        return <Syllabus readOnly={user.role === 'parent'} />;
      case 'analytics':
        return <Analytics testAttempts={testAttempts.filter(a => a.studentId === user.id)} />;
      case 'tests':
        return (
          <TestCenter 
            user={user} 
            tests={tests} 
            setTests={handleAddTest}
            questionBank={questionBank}
            setQuestionBank={setQuestionBank}
            testAttempts={testAttempts.filter(a => a.studentId === user.id)}
            onTestComplete={handleTestComplete}
          />
        );
      case 'timetable':
        return <TimetableGenerator />; 
      case 'focus':
        return <FocusZone user={user} />;
      case 'users':
        return <AdminUserManagement />;
      case 'docs':
        return <AdminDocs />;
      case 'settings':
        return <Settings user={user} onUpdateUser={setUser} />;
      default:
        return <div className="p-4">Module under construction</div>;
    }
  };

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={() => setUser(null)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;