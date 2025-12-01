import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { TestAttempt } from '../types';

interface AnalyticsProps {
    testAttempts: TestAttempt[];
}

const Analytics: React.FC<AnalyticsProps> = ({ testAttempts }) => {
  
  // Dynamic Data Processing
  const avgScore = testAttempts.length > 0 
    ? Math.round(testAttempts.reduce((acc, curr) => acc + curr.score, 0) / testAttempts.length)
    : 0;

  const avgAccuracy = testAttempts.length > 0
    ? Math.round(testAttempts.reduce((acc, curr) => acc + curr.accuracy, 0) / testAttempts.length)
    : 0;

  // Chart Data
  const trendData = testAttempts.map(t => ({
      name: t.testTitle.substring(0, 15) + '...',
      score: t.score
  })).slice(-5); // Last 5 tests

  // Static Fallback for Demo visuals if no data
  const subjectData = [
    { subject: 'Physics', score: 120, total: 180, avg: 90 },
    { subject: 'Chemistry', score: 98, total: 180, avg: 110 },
    { subject: 'Maths', score: 86, total: 180, avg: 75 },
  ];

  const topicStrengthData = [
    { subject: 'Mechanics', A: 120, fullMark: 150 },
    { subject: 'Electrodynamics', A: 98, fullMark: 150 },
    { subject: 'Optics', A: 86, fullMark: 150 },
    { subject: 'Calculus', A: 99, fullMark: 150 },
    { subject: 'Algebra', A: 85, fullMark: 150 },
    { subject: 'Organic Chem', A: 65, fullMark: 150 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <h2 className="text-2xl font-bold text-slate-800">Performance Analytics</h2>
         <div className="flex gap-4">
             <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-center">
                 <p className="text-xs text-slate-500 uppercase font-bold">Avg Score</p>
                 <p className="text-xl font-bold text-blue-600">{avgScore}</p>
             </div>
             <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-center">
                 <p className="text-xs text-slate-500 uppercase font-bold">Tests Taken</p>
                 <p className="text-xl font-bold text-slate-800">{testAttempts.length}</p>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Test Trends - Dynamic */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold mb-6">Recent Test Scores</h3>
          {trendData.length > 0 ? (
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="score" name="Your Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
          ) : (
              <div className="h-72 flex items-center justify-center text-slate-400">
                  No tests taken yet.
              </div>
          )}
        </div>

        {/* Subject Wise Performance - Static Demo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold mb-6">Subject Performance vs Batch Avg (Demo)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="score" name="Your Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg" name="Batch Avg" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Area Radar - Static Demo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="font-semibold mb-6">Detailed Topic Strength Analysis (AI Generated)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicStrengthData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="Strength" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {avgAccuracy > 0 && avgAccuracy < 60 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4 animate-fade-in">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <AlertTriangle size={24} />
            </div>
            <div>
            <h3 className="font-semibold text-orange-900">Accuracy Alert</h3>
            <p className="text-sm text-orange-800 mt-1">
                Your overall accuracy is {avgAccuracy}%. It is recommended to slow down and verify answers before submitting. Focus on negative marking reduction.
            </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;