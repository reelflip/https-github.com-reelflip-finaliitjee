import React, { useState, useRef } from 'react';
import { Clock, BookOpen, Building2, Moon, CalendarClock, Loader2, Coffee, Zap, ChevronDown, CheckCircle2 } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ScheduleBlock {
  time: string;
  activity: string;
  type: 'fixed' | 'study' | 'break' | 'sleep';
  duration?: string;
}

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
  const [generatedSchedule, setGeneratedSchedule] = useState<ScheduleBlock[] | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const toggleDay = (day: string) => {
    setCoachingDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const generateDailySchedule = () => {
    // Simple logic to generate a typical day based on constraints
    // In a real app, this would calculate time gaps dynamically using Date objects
    
    const schedule: ScheduleBlock[] = [];

    // Morning
    schedule.push({ time: wakeTime, activity: 'Wake Up & Morning Routine', type: 'break' });
    
    // Early Study Slot (if enough time before school)
    schedule.push({ time: addMinutes(wakeTime, 45), activity: 'Quick Revision (Formulas/Notes)', type: 'study', duration: '45m' });

    // School Block
    if (schoolEnabled) {
        schedule.push({ time: schoolStart, activity: 'School / College', type: 'fixed', duration: '6h' });
        // After School
        schedule.push({ time: schoolEnd, activity: 'Lunch & Power Nap', type: 'break', duration: '1h' });
        schedule.push({ time: addMinutes(schoolEnd, 60), activity: 'Self Study: Problem Solving', type: 'study', duration: '2h' });
    } else {
        // Full Day Self Study Structure
        schedule.push({ time: addMinutes(wakeTime, 90), activity: 'Deep Work Session 1 (Physics)', type: 'study', duration: '3h' });
        schedule.push({ time: '12:00', activity: 'Lunch Break', type: 'break', duration: '1h' });
        schedule.push({ time: '13:00', activity: 'Deep Work Session 2 (Maths)', type: 'study', duration: '3h' });
    }

    // Coaching Block
    schedule.push({ time: coachingStart, activity: 'Coaching Classes', type: 'fixed', duration: '3h' });

    // Evening
    schedule.push({ time: coachingEnd, activity: 'Dinner & Relax', type: 'break', duration: '45m' });
    
    // Late Night Study
    schedule.push({ time: addMinutes(coachingEnd, 60), activity: 'Self Study: Review & Homework', type: 'study', duration: '1.5h' });

    // Sleep
    schedule.push({ time: bedTime, activity: 'Sleep', type: 'sleep' });

    return schedule;
  };

  // Helper to simulate time addition for display
  const addMinutes = (time: string, mins: number) => {
    // Very basic string manipulation for demo purposes
    // Returns a dummy time string roughly calculated
    const [h, m] = time.split(':').map(Number);
    let newM = m + mins;
    let newH = h + Math.floor(newM / 60);
    newM = newM % 60;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedSchedule(null); // Clear previous

    setTimeout(() => {
        const schedule = generateDailySchedule();
        setGeneratedSchedule(schedule);
        setIsGenerating(false);
        // Scroll to result
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto font-sans space-y-8 pb-12">
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
                    Calculating Best Slots...
                    </>
                ) : (
                    <>
                    <CalendarClock size={18} />
                    {generatedSchedule ? 'Regenerate Timetable' : 'Generate Timetable'}
                    </>
                )}
            </button>
          </div>
        </div>
      </div>

      {/* RESULT SECTION */}
      {generatedSchedule && (
        <div ref={resultRef} className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 animate-fade-in-up">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-green-500" />
                    <h2 className="text-lg font-bold text-slate-800">Your Personalized Schedule</h2>
                </div>
                <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                    Typical Weekday
                </div>
            </div>
            
            <div className="p-0">
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-24 top-0 bottom-0 w-px bg-slate-100"></div>

                    {generatedSchedule.map((block, index) => {
                        let bgClass = "bg-white";
                        let borderClass = "border-slate-100";
                        let textClass = "text-slate-800";
                        let Icon = Clock;

                        if (block.type === 'study') {
                            bgClass = "bg-blue-50";
                            borderClass = "border-blue-100";
                            textClass = "text-blue-800";
                            Icon = Zap;
                        } else if (block.type === 'fixed') {
                            bgClass = "bg-slate-100";
                            borderClass = "border-slate-200";
                            textClass = "text-slate-600";
                            Icon = Building2;
                        } else if (block.type === 'sleep') {
                            bgClass = "bg-indigo-900";
                            borderClass = "border-indigo-800";
                            textClass = "text-indigo-100";
                            Icon = Moon;
                        } else { // break
                            bgClass = "bg-orange-50";
                            borderClass = "border-orange-100";
                            textClass = "text-orange-800";
                            Icon = Coffee;
                        }

                        return (
                            <div key={index} className="flex group">
                                {/* Time Column */}
                                <div className="w-24 shrink-0 py-6 pr-6 text-right relative">
                                    <span className="text-sm font-bold text-slate-600 font-mono">{block.time}</span>
                                    {/* Dot on timeline */}
                                    <div className={`absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white ring-1 ring-slate-200 ${block.type === 'study' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                </div>
                                
                                {/* Content Column */}
                                <div className="flex-1 py-4 pr-6">
                                    <div className={`p-4 rounded-xl border ${bgClass} ${borderClass} transition-transform group-hover:translate-x-1`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className={`flex items-center gap-2 font-bold ${textClass}`}>
                                                <Icon size={16} />
                                                {block.activity}
                                            </div>
                                            {block.duration && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50 border border-black/5 opacity-70`}>
                                                    {block.duration}
                                                </span>
                                            )}
                                        </div>
                                        {block.type === 'study' && (
                                            <p className="text-xs opacity-70 mt-1 pl-6">
                                                Focus deeply. Put phone away.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-4">
                    "Consistency is not about perfection. It is about refusing to give up."
                </p>
                <button 
                  onClick={() => window.print()}
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                    Print / Save as PDF
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default TimetableGenerator;