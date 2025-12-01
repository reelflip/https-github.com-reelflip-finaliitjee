import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BrainCircuit, CheckCircle2, Coffee, Zap, BookOpen } from 'lucide-react';
import { User } from '../types';

interface FocusZoneProps {
    user?: User; // Optional for now
}

type TimerMode = 'pomodoro' | 'deep_work' | 'short_break';

const MODES: Record<TimerMode, { label: string; minutes: number; color: string; icon: any }> = {
    pomodoro: { label: 'Pomodoro', minutes: 25, color: 'text-blue-500', icon: Zap },
    deep_work: { label: 'Deep Work', minutes: 50, color: 'text-indigo-600', icon: BrainCircuit },
    short_break: { label: 'Short Break', minutes: 5, color: 'text-green-500', icon: Coffee },
};

const FocusZone: React.FC<FocusZoneProps> = () => {
    const [mode, setMode] = useState<TimerMode>('pomodoro');
    const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('Physics');
    const [sessionState, setSessionState] = useState<'idle' | 'running' | 'paused' | 'recall' | 'completed'>('idle');
    const [recallText, setRecallText] = useState('');

    useEffect(() => {
        let interval: any;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if (mode !== 'short_break') {
                setSessionState('recall'); // Trigger Active Recall
                playAlarm();
            } else {
                setSessionState('idle'); // Break over
                setMode('pomodoro');
                setTimeLeft(25 * 60);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const playAlarm = () => {
        // Simple beep using Web Audio API to avoid external file dependencies
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
        setSessionState(prev => prev === 'running' ? 'paused' : 'running');
    };

    const resetTimer = () => {
        setIsActive(false);
        setSessionState('idle');
        setTimeLeft(MODES[mode].minutes * 60);
    };

    const handleModeChange = (newMode: TimerMode) => {
        setMode(newMode);
        setIsActive(false);
        setSessionState('idle');
        setTimeLeft(MODES[newMode].minutes * 60);
    };

    const handleRecallSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would save the session and recall notes to the DB
        setSessionState('completed');
        setTimeout(() => {
            setSessionState('idle');
            setRecallText('');
            setMode('short_break'); // Auto suggest break
            setTimeLeft(MODES.short_break.minutes * 60);
        }, 3000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((MODES[mode].minutes * 60 - timeLeft) / (MODES[mode].minutes * 60)) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Focus Zone</h2>
                    <p className="text-slate-500">Boost retention with Pomodoro & Active Recall.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timer Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background Glow */}
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${mode === 'short_break' ? 'from-green-400 to-emerald-500' : 'from-blue-500 to-indigo-600'}`}></div>

                    {sessionState !== 'recall' && sessionState !== 'completed' ? (
                        <>
                            {/* Mode Selector */}
                            <div className="flex gap-2 bg-slate-50 p-1 rounded-lg mb-8">
                                {(Object.keys(MODES) as TimerMode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => handleModeChange(m)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                            mode === m ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {MODES[m].label}
                                    </button>
                                ))}
                            </div>

                            {/* Subject Selector */}
                            {mode !== 'short_break' && (
                                <div className="mb-8 w-full max-w-xs">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 text-center">Focus Subject</label>
                                    <select 
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        disabled={isActive}
                                        className="w-full text-center bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                                    >
                                        <option>Physics</option>
                                        <option>Chemistry</option>
                                        <option>Mathematics</option>
                                    </select>
                                </div>
                            )}

                            {/* Timer Display */}
                            <div className="relative mb-8 group cursor-default">
                                {/* Circular Progress SVG */}
                                <svg className="w-64 h-64 transform -rotate-90">
                                    <circle
                                        cx="128"
                                        cy="128"
                                        r="120"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="128"
                                        cy="128"
                                        r="120"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 120}
                                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                        className={`${MODES[mode].color} transition-all duration-1000 ease-linear`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <span className="text-6xl font-bold text-slate-800 font-mono tracking-tighter block">
                                        {formatTime(timeLeft)}
                                    </span>
                                    <span className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-2 block">
                                        {isActive ? 'Focusing...' : 'Ready'}
                                    </span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleTimer}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                                        isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                >
                                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                                </button>
                                <button
                                    onClick={resetTimer}
                                    className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
                                >
                                    <RotateCcw size={20} />
                                </button>
                            </div>
                        </>
                    ) : sessionState === 'recall' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in py-10">
                            <BrainCircuit size={48} className="text-indigo-600 mb-4" />
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Active Recall</h3>
                            <p className="text-slate-500 text-center mb-6 max-w-xs">
                                Before taking a break, quickly type out 3 key things you learned in this session.
                            </p>
                            <form onSubmit={handleRecallSubmit} className="w-full max-w-sm">
                                <textarea
                                    value={recallText}
                                    onChange={(e) => setRecallText(e.target.value)}
                                    placeholder="1. Formula for Torque...&#10;2. Lenz's Law concept...&#10;3. Mistake in Q5..."
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-4 resize-none text-sm"
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Save & Take Break
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in py-20">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Session Recorded!</h3>
                            <p className="text-slate-500">Great job. Time to recharge.</p>
                        </div>
                    )}
                </div>

                {/* Instructions & Benefits */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-blue-500" />
                            Why this works?
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="mt-1 bg-blue-100 text-blue-600 p-1.5 rounded-lg shrink-0 h-fit">
                                    <Zap size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700 text-sm">Pomodoro Technique</p>
                                    <p className="text-xs text-slate-500 mt-1">Short, intense bursts of focus (25m) followed by breaks prevents mental fatigue and keeps your brain fresh.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 bg-indigo-100 text-indigo-600 p-1.5 rounded-lg shrink-0 h-fit">
                                    <BrainCircuit size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700 text-sm">Active Recall</p>
                                    <p className="text-xs text-slate-500 mt-1">Forcing your brain to retrieve information immediately after study strengthens neural pathways more than re-reading.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Study Streak</h3>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-4xl font-bold">4.5</span>
                            <span className="text-indigo-300 text-sm mb-1.5">Hours today</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-400 h-full w-[65%]"></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Target: 7 Hours</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusZone;