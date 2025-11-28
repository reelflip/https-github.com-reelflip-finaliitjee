import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const data = [
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

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Performance Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Wise Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold mb-6">Subject Performance vs Average</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="score" name="Your Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg" name="Batch Avg" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Area Radar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold mb-6">Topic Strength Analysis</h3>
          <div className="h-72">
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
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex items-start gap-4">
        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-orange-900">Focus Area Detected: Organic Chemistry</h3>
          <p className="text-sm text-orange-800 mt-1">
            Your accuracy in Organic Chemistry is 45%, which is below your average of 72%. 
            It is recommended to revise <strong>Reaction Mechanisms</strong> and attempt 20 practice questions daily.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
