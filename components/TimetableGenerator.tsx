import React, { useState } from 'react';
import { Clock, BookOpen, Building2, Moon, CalendarClock, Loader2, Coffee, Zap, School, Backpack, CheckCircle2, SlidersHorizontal, ListChecks } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface ScheduleBlock {
  time: string;
  activity: string;
  type: 'fixed' | 'study' | 'break' | 'sleep';
  duration?: string;
}

const TimetableGenerator: React.FC = () => {
  // State for Coaching (Evening/Regular)
  const [coachingDays, setCoachingDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [coachingStart, setCoachingStart] = useState('17:30');
  const [coachingEnd, setCoachingEnd] = useState('20:30');
  
  // State for Schooling Type
  const [studentType, setStudentType] = useState<'regular' | 'dummy'>('regular');
  
  // Regular School State
  const [schoolStart, setSchoolStart] = useState('08:00');
  const [schoolEnd, setSchoolEnd] = useState('14:00');

  // Dummy School State (Morning Coaching)
  const [hasMorningCoaching, setHasMorningCoaching] = useState(false);
  const [morningCoachingStart, setMorningCoachingStart] = useState('09:00');
  const [morningCoachingEnd, setMorningCoachingEnd] = useState('13:00');

  // State for Sleep
  const [wakeTime, setWakeTime] = useState('06:00');
  const [bedTime, setBedTime] = useState('23:00');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<ScheduleBlock[] | null>(null);
  
  // View Control: 'setup' = Form, 'result' = Timetable
  const [view, setView] = useState<'setup' | 'result'>('setup');

  const toggleDay = (day: string) => {
    setCoachingDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const generateDailySchedule = () => {
    const schedule: ScheduleBlock[] = [];

    // Morning
    schedule.push({ time: wakeTime, activity: 'Wake Up & Morning Routine', type: 'break' });
    
    // Determine Morning Block based on Student Type
    if (studentType === 'regular') {
        // Early Study Slot (if enough time before school)
        schedule.push({ time: addMinutes(wakeTime, 45), activity: 'Quick Revision (Formulas/Notes)', type: 'study', duration: '45m' });
        // School Block
        schedule.push({ time: schoolStart, activity: 'Regular School', type: 'fixed', duration: '6h' });
        // After School
        schedule.push({ time: schoolEnd, activity: 'Lunch & Power Nap', type: 'break', duration: '1h' });
        schedule.push({ time: addMinutes(schoolEnd, 60), activity: 'Self Study: Problem Solving', type: 'study', duration: '2h' });
    } else {
        // Dummy School Logic
        if (hasMorningCoaching) {
            schedule.push({ time: addMinutes(wakeTime, 45), activity: 'Commute / Prep', type: 'break', duration: '30m' });
            schedule.push({ time: morningCoachingStart, activity: 'Morning Coaching / Full-Time Batch', type: 'fixed', duration: '4-5h' });
            schedule.push({ time: morningCoachingEnd, activity: 'Lunch & Relax', type: 'break', duration: '1h' });
            schedule.push({ time: addMinutes(morningCoachingEnd, 60), activity: 'Self Study: Class Review', type: 'study', duration: '2h' });
        } else {
            // Full Day Self Study Structure
            schedule.push({ time: addMinutes(wakeTime, 60), activity: 'Deep Work Session 1 (Physics)', type: 'study', duration: '3h' });
            schedule.push({ time: '12:00', activity: 'Lunch Break', type: 'break', duration: '1h' });
            schedule.push({ time: '13:00', activity: 'Deep Work Session 2 (Maths)', type: 'study', duration: '3h' });
            schedule.push({ time: '16:30', activity: 'Power Nap / Tea Break', type: 'break', duration: '30m' });
        }
    }

    // Evening Coaching Block
    schedule.push({ time: coachingStart, activity: 'Evening Coaching / Test Series', type: 'fixed', duration: '3h' });

    // Evening
    schedule.push({ time: coachingEnd, activity: 'Dinner & Relax', type: 'break', duration: '45m' });
    
    // Late Night Study
    schedule.push({ time: addMinutes(coachingEnd, 60), activity: 'Self Study: Chemistry / Revision', type: 'study', duration: '1.5h' });

    // Sleep
    schedule.push({ time: bedTime, activity: 'Sleep', type: 'sleep' });

    return schedule;
  };

  // Helper to simulate time addition for display
  const addMinutes = (time: string, mins: number) => {
    const [h, m] = time.split(':').map(Number);
    let newM = m + mins;
    let newH = h + Math.floor(newM / 60);
    newM = newM % 60;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
        const schedule = generateDailySchedule();
        setGeneratedSchedule(schedule);
        setIsGenerating(false);
        setView('result'); // Automatically switch to result view
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto font-sans space-y-6 pb-12">
      
      {/* Unified Main Container */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col">
        
        {/* Common Header with View Toggle */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                    <CalendarClock size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-wide">Timetable Generator</h2>
                    <p className="text-orange-100 text-xs font-medium opacity-90">
                        {view === 'setup' ? 'Define your commitments' : 'Your optimized schedule'}
                    </p>
                </div>
            </div>

            {/* Toggle Controls - Only visible if a schedule exists */}
            {generatedSchedule && (
                <div className="flex bg-black/20 p-1 rounded-lg backdrop-blur-sm self-start md:self-auto">
                    <button 
                        onClick={() => setView('setup')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                            view === 'setup' 
                                ? 'bg-white text-orange-600 shadow-sm' 
                                : 'text-white/80 hover:bg-white/10'
                        }`}
                    >
                        <SlidersHorizontal size={14} /> Configure
                    </button>
                    <button 
                        onClick={() => setView('result')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                            view === 'result' 
                                ? 'bg-white text-orange-600 shadow-sm' 
                                : 'text-white/80 hover:bg-white/10'
                        }`}
                    >
                        <ListChecks size={14} /> Schedule
                    </button>
                </div>
            )}
        </div>

        {/* Content Area - Switches based on View State */}
        <div className="flex-1 p-0">
            {view === 'result' && generatedSchedule ? (
                // === RESULT VIEW ===
                <div className="animate-fade-in">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                             <CheckCircle2 size={16} className="text-green-500" />
                             <span className="font-semibold">Optimized for {studentType === 'regular' ? 'Regular School' : 'Dummy School'}</span>
                        </div>
                        <button 
                            onClick={() => window.print()}
                            className="text-xs font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50"
                        >
                            Print PDF
                        </button>
                    </div>

                    <div className="p-8">
                         <div className="relative max-w-2xl mx-auto">
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
                                    bgClass = "bg-slate-50";
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
                                    <div key={index} className="flex group mb-2 last:mb-0">
                                        {/* Time Column */}
                                        <div className="w-24 shrink-0 py-4 pr-6 text-right relative">
                                            <span className="text-sm font-bold text-slate-600 font-mono">{block.time}</span>
                                            {/* Dot on timeline */}
                                            <div className={`absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white ring-1 ring-slate-200 ${block.type === 'study' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                        </div>
                                        
                                        {/* Content Column */}
                                        <div className="flex-1">
                                            <div className={`p-3 rounded-xl border ${bgClass} ${borderClass} transition-transform group-hover:translate-x-1`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className={`flex items-center gap-2 font-bold ${textClass} text-sm`}>
                                                        <Icon size={14} />
                                                        {block.activity}
                                                    </div>
                                                    {block.duration && (
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50 border border-black/5 opacity-70`}>
                                                            {block.duration}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="mt-8 text-center">
                            <button 
                                onClick={() => setView('setup')}
                                className="text-sm text-slate-500 hover:text-blue-600 underline"
                            >
                                Not happy? Tweaking settings
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // === SETUP VIEW (Form) ===
                <div className="p-8 space-y-10 animate-fade-in">
                    
                    {/* Schooling Type Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold uppercase text-xs tracking-wider">
                            <School size={16} />
                            <span>Schooling Type</span>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <button 
                                onClick={() => setStudentType('regular')}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${studentType === 'regular' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                            >
                                <Backpack size={18} />
                                <div className="text-left">
                                    <span className="block text-sm font-bold">Regular School</span>
                                    <span className="block text-[10px] opacity-70 font-medium">Attending daily classes</span>
                                </div>
                            </button>
                            <button 
                                onClick={() => setStudentType('dummy')}
                                className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${studentType === 'dummy' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                            >
                                <Building2 size={18} />
                                <div className="text-left">
                                    <span className="block text-sm font-bold">Dummy School</span>
                                    <span className="block text-[10px] opacity-70 font-medium">Full-time Coaching / Self Study</span>
                                </div>
                            </button>
                        </div>

                        {/* Conditional Inputs */}
                        {studentType === 'regular' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                <div className="relative group">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">School Starts</label>
                                    <div className="relative">
                                        <input type="time" value={schoolStart} onChange={(e) => setSchoolStart(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm" />
                                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">School Ends</label>
                                    <div className="relative">
                                        <input type="time" value={schoolEnd} onChange={(e) => setSchoolEnd(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm" />
                                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold text-purple-800">Do you attend Morning Coaching?</span>
                                    <button 
                                    onClick={() => setHasMorningCoaching(!hasMorningCoaching)}
                                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${hasMorningCoaching ? 'bg-purple-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${hasMorningCoaching ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                                
                                {hasMorningCoaching ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-purple-400 uppercase mb-1.5">Coaching Starts</label>
                                            <input type="time" value={morningCoachingStart} onChange={(e) => setMorningCoachingStart(e.target.value)} className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-purple-200" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-purple-400 uppercase mb-1.5">Coaching Ends</label>
                                            <input type="time" value={morningCoachingEnd} onChange={(e) => setMorningCoachingEnd(e.target.value)} className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-purple-200" />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-purple-600 italic">
                                        Great! Your morning will be allocated for Self Study and Revision.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    <hr className="border-slate-100" />

                    {/* Coaching Schedule Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold uppercase text-xs tracking-wider">
                        <BookOpen size={16} />
                        <span>Evening Coaching / Test Series</span>
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

                    {/* Generate Action */}
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
                                {generatedSchedule ? 'Update & Regenerate' : 'Generate Timetable'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerator;