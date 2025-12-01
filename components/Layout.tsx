import React from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  PenTool, 
  PieChart, 
  Calendar, 
  LogOut, 
  Users,
  FileText,
  Settings,
  BrainCircuit,
  ArrowUpCircle
} from 'lucide-react';

interface LayoutProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, activeTab, setActiveTab, onLogout, children }) => {
  
  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
    { id: 'focus', label: 'Focus', icon: BrainCircuit },
    { id: 'tests', label: 'Tests', icon: PenTool },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const parentNav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'syllabus', label: 'Progress', icon: BookOpen },
    { id: 'analytics', label: 'Stats', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminNav = [
    { id: 'dashboard', label: 'Admin', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'tests', label: 'Tests', icon: PenTool },
    { id: 'docs', label: 'Docs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = user.role === 'student' ? studentNav : user.role === 'parent' ? parentNav : adminNav;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <ArrowUpCircle className="text-blue-500" size={28} />
          <div>
            <h1 className="text-lg font-bold tracking-tight">JEE Tracker</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{user.role} Portal</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold ring-2 ring-slate-800">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-300 hover:bg-slate-800 hover:text-red-200 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE TOP HEADER (Visible on Mobile) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-30 px-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
              <ArrowUpCircle className="text-blue-500" size={24} />
              <span className="font-bold text-lg">JEE Tracker</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0)}
          </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8 overflow-y-auto h-full w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION (Visible on Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 pb-safe-area">
          <div className="flex items-center justify-around overflow-x-auto no-scrollbar py-2 px-1">
              {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                      <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`flex flex-col items-center justify-center min-w-[64px] p-2 rounded-lg transition-all ${
                              isActive ? 'text-blue-600' : 'text-slate-400'
                          }`}
                      >
                          <div className={`p-1.5 rounded-full mb-1 transition-all ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
                              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                          </div>
                          <span className="text-[10px] font-medium truncate w-full text-center">
                              {item.label}
                          </span>
                      </button>
                  )
              })}
              <button 
                  onClick={onLogout} 
                  className="flex flex-col items-center justify-center min-w-[64px] p-2 text-red-400"
              >
                  <div className="p-1.5 mb-1">
                      <LogOut size={20} />
                  </div>
                  <span className="text-[10px] font-medium">Exit</span>
              </button>
          </div>
      </nav>
    </div>
  );
};

export default Layout;