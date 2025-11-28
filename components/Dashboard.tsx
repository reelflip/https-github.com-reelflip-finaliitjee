import React, { useEffect, useState } from 'react';
import { User, Notification } from '../types';
import { generateMotivation, generateStudyTip } from '../services/gemini';
import { Clock, TrendingUp, AlertCircle, Book, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  user: User;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Physics Mock Test', message: 'Full syllabus mock test available tomorrow.', date: '2023-10-25', type: 'alert' },
  { id: 2, title: 'Syllabus Update', message: 'Admin added new questions to Rotational Motion.', date: '2023-10-24', type: 'reminder' },
  { id: 3, title: 'Parent Connection', message: 'Your parent viewed your progress report.', date: '2023-10-23', type: 'invite' },
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [motivation, setMotivation] = useState<string>('Loading daily motivation...');
  const [tip, setTip] = useState<string>('Loading study tip...');
  
  useEffect(() => {
    generateMotivation(user.name).then(setMotivation);
    generateStudyTip('Physics').then(setTip);
  }, [user.name]);

  // Mock Date for JEE
  const examDate = new Date('2025-05-25');
  const today = new Date();
  const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const progressData = [
    { name: 'Completed', value: 35, color: '#16a34a' },
    { name: 'In Progress', value: 25, color: '#2563eb' },
    { name: 'Not Started', value: 40, color: '#94a3b8' },
  ];

  const recentScores = [
    { name: 'Mock 1', score: 140 },
    { name: 'Mock 2', score: 165 },
    { name: 'Mock 3', score: 155 },
    { name: 'Mock 4', score: 180 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome & Motivation */}
        <div className="md:col-span-2 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
                <p className="text-blue-200 text-sm mb-6">" {motivation} "</p>
                
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                        <p className="text-xs text-blue-200 uppercase tracking-wider">Days to JEE Advanced</p>
                        <p className="text-3xl font-bold">{daysLeft}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                        <p className="text-xs text-blue-200 uppercase tracking-wider">Current Streak</p>
                        <p className="text-3xl font-bold">12 Days</p>
                    </div>
                </div>
            </div>
            {/* Decor */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* AI Study Tip */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-emerald-600">
                <Target size={20} />
                <h3 className="font-semibold">AI Insight of the Day</h3>
            </div>
            <p className="text-slate-600 text-sm italic flex-1">"{tip}"</p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 text-right">
                Powered by Gemini 2.5
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Book size={18} className="text-blue-500"/> Syllabus Coverage
            </h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={progressData} 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={5} 
                            dataKey="value"
                        >
                            {progressData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs">
                {progressData.map(d => (
                    <div key={d.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                        <span>{d.name}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500"/> Mock Test Trends
            </h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recentScores}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide domain={[0, 300]} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-slate-500 mt-2">Last 4 test scores (Total: 300)</p>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto">
             <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-orange-500"/> Updates
            </h3>
            <div className="space-y-4">
                {MOCK_NOTIFICATIONS.map(notif => (
                    <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                        <AlertCircle size={16} className={`mt-0.5 ${notif.type === 'alert' ? 'text-red-500' : 'text-blue-500'}`} />
                        <div>
                            <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
