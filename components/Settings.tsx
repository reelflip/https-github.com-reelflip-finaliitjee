import React, { useState } from 'react';
import { User } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Building, 
  Calendar, 
  Copy, 
  Link as LinkIcon, 
  CheckCircle2, 
  Loader2,
  Smartphone
} from 'lucide-react';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [connectStudentId, setConnectStudentId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectStudentId) return;

    setIsConnecting(true);
    // Simulate API call to backend/parent_student_requests
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionStatus('success');
      setConnectStudentId('');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
        <p className="text-slate-500">Manage your profile and connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900"></div>
            <div className="px-6 pb-6 relative">
              <div className="w-20 h-20 bg-white rounded-full p-1 absolute -top-10 left-6 shadow-sm">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-2xl">
                  {user.name.charAt(0)}
                </div>
              </div>
              
              <div className="mt-12 space-y-1">
                <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  user.role === 'student' ? 'bg-blue-100 text-blue-700' : 
                  user.role === 'parent' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.role} Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 space-y-6">
          
          {/* General Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <UserIcon size={18} className="text-blue-500" /> General Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Full Name</p>
                  <p className="text-sm font-medium text-slate-700">{user.name}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Email Address</p>
                  <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail size={14} /> {user.email}
                  </p>
                </div>
              </div>

              {/* Unique ID Display */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 uppercase font-bold mb-1">Your Unique User ID</p>
                  <p className="text-lg font-mono font-bold text-slate-800 tracking-wider">#{user.id}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(String(user.id))}
                  className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                  title="Copy ID"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-400 italic">
                * Share this ID with {user.role === 'student' ? 'your parent' : 'support'} to connect accounts.
              </p>
            </div>
          </div>

          {/* Student Specific Details */}
          {user.role === 'student' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Building size={18} className="text-orange-500" /> Academic Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <Building size={20} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Institute</p>
                      <p className="text-sm font-medium">{user.institute || 'Not Set'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <Calendar size={20} className="text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Target Year</p>
                      <p className="text-sm font-medium">{user.targetYear || 'Not Set'}</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Parent Specific Connection Tool */}
          {user.role === 'parent' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <LinkIcon size={18} className="text-green-500" /> Connect to Student
              </h3>
              
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                 <p className="text-sm text-green-800 mb-4">
                   Enter your child's <strong>User ID</strong> (found in their Settings tab) to request access to their progress dashboard.
                 </p>
                 
                 <form onSubmit={handleConnect} className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Enter Student ID (e.g. 101)"
                      value={connectStudentId}
                      onChange={(e) => setConnectStudentId(e.target.value)}
                      className="flex-1 px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                      disabled={connectionStatus === 'success'}
                    />
                    <button 
                      type="submit"
                      disabled={isConnecting || !connectStudentId || connectionStatus === 'success'}
                      className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isConnecting ? <Loader2 size={18} className="animate-spin" /> : 'Send Invite'}
                    </button>
                 </form>

                 {connectionStatus === 'success' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-700 font-medium animate-fade-in">
                        <CheckCircle2 size={16} />
                        Invitation sent! Waiting for student approval.
                    </div>
                 )}
              </div>
            </div>
          )}

          {/* Admin Specific */}
          {user.role === 'admin' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-red-500" /> System Status
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Database Connection: <span className="font-mono bg-slate-100 px-1 rounded">Active (Demo)</span>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;