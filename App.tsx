import React, { useState } from 'react';
import { User } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Syllabus from './components/Syllabus';
import Analytics from './components/Analytics';
import TestCenter from './components/TestCenter';
import TimetableGenerator from './components/TimetableGenerator';
import AdminDocs from './components/AdminDocs';
import AdminUserManagement from './components/AdminUserManagement';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'syllabus':
        return <Syllabus />;
      case 'analytics':
        return <Analytics />;
      case 'tests':
        return <TestCenter />;
      case 'timetable':
        return <TimetableGenerator />; 
      case 'users':
        return <AdminUserManagement />;
      case 'docs':
        return <AdminDocs />;
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