import React, { useState } from 'react';
import { Clock, BookOpen, Building2, Moon, CalendarClock, Loader2 } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TimetableGenerator: React.FC = () => {
  // State for Coaching
  const [coachingDays, setCoachingDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [coachingStart, setCoachingStart] = useState('17:30');
  const [coachingEnd, setCoachingEnd] = useState('20:30');
  
  // State for School
  const [schoolEnabled, setSchoolEnabled] = useState(true);
  const [schoolStart, setSchoolStart] = useState('08:00');
  const [schoolEnd, setSchoolEnd] = useState('14:00');

  // State for Sleep
  const [wakeTime, setWakeTime] = useState('06:00');
  const [bedTime, setBedTime] = useState('23:00');

  const [isGenerating, setIsGenerating] = useState(false);

  const toggleDay = (day: string) => {
    setCoachingDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
        setIsGenerating(false);
        alert('Timetable generated successfully based on your constraints!');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto font-sans">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CalendarClock size={24} className="text-white/90" />
            <h2 className="text-xl font-bold tracking-wide">Timetable Generator</h2>
          </div>
          <p className="text-orange-50 text-sm font-medium opacity-90">
            Define your fixed commitments to find your study slots.
          </p>
        </div>

        <div className="p-8 space-y-10">
          
          {/* Coaching Schedule Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold uppercase text-xs tracking-wider">
              <BookOpen size={16} />
              <span>Coaching Schedule</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {DAYS.map((day) => {
                const isSelected = coachingDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Start Time</label>
                <div className="relative">
                    <input
                    type="time"
                    value={coachingStart}
                    onChange={(e) => setCoachingStart(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">End Time</label>
                <div className="relative">
                    <input
                    type="time"
                    value={coachingEnd}
                    onChange={(e) => setCoachingEnd(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* School/College Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-700 font-bold uppercase text-xs tracking-wider">
                    <Building2 size={16} />
                    <span>School / College</span>
                </div>
                
                {/* Toggle Switch */}
                <button 
                  onClick={() => setSchoolEnabled(!schoolEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${schoolEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${schoolEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${schoolEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div className="relative group">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Starts</label>
                <div className="relative">
                    <input
                    type="time"
                    value={schoolStart}
                    onChange={(e) => setSchoolStart(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Ends</label>
                <div className="relative">
                    <input
                    type="time"
                    value={schoolEnd}
                    onChange={(e) => setSchoolEnd(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Sleep Cycle Section */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-slate-700 font-bold uppercase text-xs tracking-wider">
              <Moon size={16} />
              <span>Sleep Cycle</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Wake Up</label>
                <div className="relative">
                    <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="relative group">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Bed Time</label>
                <div className="relative">
                    <input
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </section>

          {/* Action Button */}
          <div className="pt-4">
            <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-slate-900 text-white font-bold text-sm rounded-lg shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
                {isGenerating ? (
                    <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                    </>
                ) : (
                    <>
                    <CalendarClock size={18} />
                    Generate Timetable
                    </>
                )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;
