import React, { useState, useEffect } from 'react';
import { Test, Question, User, TestAttempt } from '../types';
import { PlayCircle, Clock, CheckCircle, Plus, Save, Trash2, X, FileText, List, ChevronRight, Database, Search, Filter, ShieldCheck, History } from 'lucide-react';

interface TestCenterProps {
    user: User;
    tests: Test[];
    setTests: (test: Test) => void;
    questionBank: Question[];
    setQuestionBank: (questions: Question[]) => void;
    testAttempts: TestAttempt[];
    onTestComplete: (attempt: TestAttempt) => void;
}

const TestCenter: React.FC<TestCenterProps> = ({ 
    user, 
    tests, 
    setTests, 
    questionBank, 
    setQuestionBank, 
    testAttempts,
    onTestComplete 
}) => {
  
  // Navigation State
  const [view, setView] = useState<'list' | 'take' | 'create' | 'bank' | 'history'>('list');
  
  // --- Taking Test State ---
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // qId -> optionIndex
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [scoreResult, setScoreResult] = useState<{score: number, accuracy: number} | null>(null);

  // --- Creating Test State ---
  const [newTestMeta, setNewTestMeta] = useState<Partial<Test>>({ title: '', type: 'mock', duration: 180, totalMarks: 300 });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [bankFilter, setBankFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // --- Bank Management State ---
  const [newBankQuestion, setNewBankQuestion] = useState<Partial<Question> & { subject: string, topic: string }>({ 
      text: '', options: ['', '', '', ''], correctOption: 0, subject: 'Physics', topic: '' 
  });

  // --- TIMERS ---
  useEffect(() => {
    if (view !== 'take' || !activeTest || isFinished) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTest, isFinished, view]);

  useEffect(() => {
    if (activeTest && !isFinished && timeRemaining === 0 && view === 'take') {
      submitTest();
    }
  }, [timeRemaining, activeTest, isFinished, view]);

  // --- HELPERS ---
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- ACTIONS: STUDENT ---
  const startTest = (test: Test) => {
    let qList: Question[] = [];

    // If test has specific questions linked, use them
    if (test.questionIds && test.questionIds.length > 0) {
        qList = questionBank.filter(q => test.questionIds?.includes(q.id));
    } else {
        // Legacy/Random fallback
        const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
        qList = shuffled.slice(0, test.questionsCount);
    }
    
    setTestQuestions(qList);
    setActiveTest(test);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScoreResult(null);
    setTimeRemaining(test.duration * 60);
    setView('take');
  };

  const handleOptionSelect = (qId: number, optionIdx: number) => {
      setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const submitTest = () => {
    if (!activeTest) return;

    let score = 0;
    let correctCount = 0;
    let attemptedCount = 0;

    testQuestions.forEach(q => {
        const userAns = answers[q.id];
        if (userAns !== undefined) {
            attemptedCount++;
            if (userAns === q.correctOption) {
                score += 4; // JEE Pattern: +4
                correctCount++;
            } else {
                score -= 1; // JEE Pattern: -1
            }
        }
    });

    const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
    const timeSpent = (activeTest.duration * 60) - timeRemaining;

    // Save Attempt
    const attempt: TestAttempt = {
        id: Date.now(),
        studentId: user.id,
        testId: activeTest.id,
        testTitle: activeTest.title,
        score: Math.max(0, score), // Ensure no negative total in UI if preferred, though JEE allows negative
        totalMarks: activeTest.questionsCount * 4,
        accuracy: Math.round(accuracy),
        timeSpent: timeSpent,
        date: new Date().toISOString().split('T')[0]
    };

    onTestComplete(attempt);
    setScoreResult({ score: score, accuracy: accuracy });
    setIsFinished(true);
  };

  // --- ACTIONS: ADMIN (BANK) ---
  const addToBank = () => {
      if (!newBankQuestion.text || newBankQuestion.options?.some(o => !o) || !newBankQuestion.topic) {
          alert("Please fill all fields.");
          return;
      }
      const q: Question = {
          id: Date.now(),
          text: newBankQuestion.text!,
          options: newBankQuestion.options as string[],
          correctOption: newBankQuestion.correctOption || 0,
          subject: newBankQuestion.subject,
          topic: newBankQuestion.topic
      };
      setQuestionBank([...questionBank, q]);
      setNewBankQuestion({ text: '', options: ['', '', '', ''], correctOption: 0, subject: 'Physics', topic: '' });
      alert("Question added to Bank successfully!");
  };

  // --- ACTIONS: ADMIN (CREATE TEST) ---
  const toggleQuestionSelection = (qId: number) => {
      setSelectedQuestionIds(prev => 
        prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
      );
  };

  const publishTest = () => {
      if (!newTestMeta.title || selectedQuestionIds.length === 0) {
          alert("Title and at least one question required.");
          return;
      }
      const newTest: Test = {
          id: Date.now(),
          title: newTestMeta.title!,
          type: newTestMeta.type as 'mock' | 'pyq',
          duration: newTestMeta.duration || 180,
          totalMarks: selectedQuestionIds.length * 4, // Auto calc based on +4
          questionsCount: selectedQuestionIds.length,
          questionIds: selectedQuestionIds
      };
      setTests(newTest);
      setView('list');
      setNewTestMeta({ title: '', type: 'mock', duration: 180, totalMarks: 300 });
      setSelectedQuestionIds([]);
  };

  // --- RENDERERS ---

  if (view === 'take' && activeTest) {
      const currentQ = testQuestions[currentQuestionIndex];
      return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-[calc(100vh-8rem)] flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
            <div>
              <h2 className="font-bold">{activeTest.title}</h2>
              <p className="text-xs text-slate-400">
                  {isFinished ? 'Result Summary' : `Question ${currentQuestionIndex + 1} of ${activeTest.questionsCount}`}
              </p>
            </div>
            {!isFinished && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
                    timeRemaining < 300 ? 'bg-red-500/20 text-red-200 animate-pulse' : 'bg-slate-800'
                }`}>
                <Clock size={16} className={timeRemaining < 300 ? "text-red-400" : "text-blue-400"}/>
                <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
                </div>
            )}
          </div>
  
          <div className="flex-1 p-8 overflow-y-auto">
            {isFinished && scoreResult ? (
               <div className="max-w-3xl mx-auto text-center py-8">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle size={40} />
                 </div>
                 <h3 className="text-3xl font-bold text-slate-800 mb-2">Test Submitted!</h3>
                 <div className="grid grid-cols-3 gap-6 my-8">
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <p className="text-slate-500 text-xs uppercase font-bold">Score</p>
                         <p className="text-3xl font-bold text-blue-600">{scoreResult.score} <span className="text-sm text-slate-400">/ {activeTest.totalMarks}</span></p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <p className="text-slate-500 text-xs uppercase font-bold">Accuracy</p>
                         <p className="text-3xl font-bold text-purple-600">{scoreResult.accuracy.toFixed(1)}%</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <p className="text-slate-500 text-xs uppercase font-bold">Questions</p>
                         <p className="text-3xl font-bold text-slate-700">{Object.keys(answers).length}/{activeTest.questionsCount}</p>
                     </div>
                 </div>
                 
                 {/* Question Review */}
                 <div className="text-left space-y-4">
                     <h4 className="font-bold text-slate-700 border-b pb-2">Question Breakdown</h4>
                     {testQuestions.map((q, idx) => {
                         const userAns = answers[q.id];
                         const isCorrect = userAns === q.correctOption;
                         const isSkipped = userAns === undefined;
                         return (
                             <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : isSkipped ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'}`}>
                                 <div className="flex justify-between mb-2">
                                     <span className="font-bold text-xs text-slate-500">Q{idx+1}</span>
                                     <span className={`text-xs font-bold px-2 py-0.5 rounded ${isCorrect ? 'bg-green-200 text-green-800' : isSkipped ? 'bg-slate-200 text-slate-600' : 'bg-red-200 text-red-800'}`}>
                                         {isCorrect ? '+4 Marks' : isSkipped ? '0 Marks' : '-1 Mark'}
                                     </span>
                                 </div>
                                 <p className="text-sm text-slate-800 font-medium mb-2">{q.text}</p>
                                 <p className="text-xs text-slate-500">Correct Answer: Option {String.fromCharCode(65 + q.correctOption)}</p>
                             </div>
                         )
                     })}
                 </div>

                 <button onClick={() => { setActiveTest(null); setView('list'); }} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg">Return to Dashboard</button>
               </div>
            ) : currentQ ? (
              <div className="max-w-3xl mx-auto">
                <div className="mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">{currentQ.subject} &bull; {currentQ.topic}</span>
                </div>
                <p className="text-lg text-slate-800 font-medium mb-6 leading-relaxed">
                  {currentQuestionIndex + 1}. {currentQ.text}
                </p>
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(currentQ.id, idx)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        answers[currentQ.id] === idx ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-semibold mr-3 text-slate-500">{String.fromCharCode(65 + idx)}.</span>{opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : <p>Loading question...</p>}
          </div>
  
          {!isFinished && (
            <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50 shrink-0">
              <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(p => p - 1)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-50">Previous</button>
              {currentQuestionIndex < activeTest.questionsCount - 1 ? (
                 <button onClick={() => setCurrentQuestionIndex(p => p + 1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next Question</button>
              ) : (
                <button onClick={submitTest} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/20">Submit Test</button>
              )}
            </div>
          )}
        </div>
      );
  }

  // --- BANK & CREATE VIEWS REMAIN MOSTLY SAME, JUST UPDATED PROPS ---
  if (view === 'bank') {
      return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Question Bank Manager</h2>
                <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-700"><X size={24} /></button>
            </div>
            {/* Same Bank UI as before... simplified for XML brevity but fully functional in logic */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18}/> Add New Question</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                        <select 
                            value={newBankQuestion.subject}
                            onChange={e => setNewBankQuestion({...newBankQuestion, subject: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option>Physics</option><option>Chemistry</option><option>Maths</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Topic</label>
                        <input 
                            type="text"
                            placeholder="e.g. Thermodynamics"
                            value={newBankQuestion.topic}
                            onChange={e => setNewBankQuestion({...newBankQuestion, topic: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>
                <div className="mb-4">
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question Text</label>
                     <textarea 
                        rows={2}
                        value={newBankQuestion.text}
                        onChange={e => setNewBankQuestion({...newBankQuestion, text: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Type question..."
                     />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                     {newBankQuestion.options?.map((opt, idx) => (
                         <div key={idx} className="flex gap-2">
                             <input type="radio" name="correct" checked={newBankQuestion.correctOption === idx} onChange={() => setNewBankQuestion({...newBankQuestion, correctOption: idx})} />
                             <input 
                                type="text" 
                                value={opt} 
                                onChange={e => {
                                    const newOpts = [...(newBankQuestion.options || [])];
                                    newOpts[idx] = e.target.value;
                                    setNewBankQuestion({...newBankQuestion, options: newOpts});
                                }}
                                className="w-full px-2 py-1 border rounded text-sm"
                                placeholder={`Option ${idx+1}`}
                             />
                         </div>
                     ))}
                </div>
                <button onClick={addToBank} className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Save to Bank</button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-2">Existing Questions ({questionBank.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {questionBank.map(q => (
                        <div key={q.id} className="bg-white p-3 rounded border border-slate-200 text-sm">
                            <span className="font-bold text-xs bg-slate-100 px-1 rounded">{q.subject}</span> {q.text.substring(0, 80)}...
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
  }

  if (view === 'create') {
      const filteredBank = questionBank.filter(q => {
          const matchSub = subjectFilter === 'All' || q.subject === subjectFilter;
          const matchText = q.text.toLowerCase().includes(bankFilter.toLowerCase()) || (q.topic?.toLowerCase().includes(bankFilter.toLowerCase()) ?? false);
          return matchSub && matchText;
      });

      return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
            {/* Same Create UI... */}
             <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-2xl font-bold text-slate-800">Test Creator</h2>
                <div className="flex gap-2">
                    <button onClick={() => setView('list')} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button onClick={publishTest} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/20 flex items-center gap-2">
                        <Save size={18} /> Publish Test
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Left: Configuration */}
                <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText size={18}/> Test Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                                <input type="text" value={newTestMeta.title} onChange={e => setNewTestMeta({...newTestMeta, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mins</label>
                                    <input type="number" value={newTestMeta.duration} onChange={e => setNewTestMeta({...newTestMeta, duration: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Qs</label>
                                    <input type="number" value={selectedQuestionIds.length} disabled className="w-full px-3 py-2 border rounded-lg bg-slate-50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><List size={18}/> Selected ({selectedQuestionIds.length})</h3>
                            <button onClick={() => setSelectedQuestionIds([])} className="text-xs text-red-500 hover:underline">Clear</button>
                        </div>
                        <div className="space-y-2">
                             {selectedQuestionIds.map((id, idx) => {
                                 const q = questionBank.find(q => q.id === id);
                                 return q ? (
                                     <div key={id} className="p-2 bg-blue-50 border border-blue-100 rounded text-sm flex justify-between items-start">
                                         <span className="mr-2 font-bold text-blue-500">{idx+1}.</span>
                                         <span className="flex-1 truncate">{q.text}</span>
                                         <button onClick={() => toggleQuestionSelection(id)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                                     </div>
                                 ) : null;
                             })}
                        </div>
                    </div>
                </div>

                {/* Right: Question Bank */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input type="text" placeholder="Search questions..." value={bankFilter} onChange={e => setBankFilter(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="px-4 py-2 border rounded-lg outline-none bg-white">
                            <option>All</option><option>Physics</option><option>Chemistry</option><option>Maths</option>
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredBank.map(q => {
                            const isSelected = selectedQuestionIds.includes(q.id);
                            return (
                                <div key={q.id} className={`p-4 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`} onClick={() => toggleQuestionSelection(q.id)}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex gap-2">
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">{q.subject}</span>
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">{q.topic || 'General'}</span>
                                        </div>
                                        {isSelected ? <CheckCircle size={18} className="text-blue-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300"></div>}
                                    </div>
                                    <p className="text-slate-800 text-sm font-medium">{q.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- HISTORY VIEW ---
  if (view === 'history') {
      return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Past Results</h2>
                <button onClick={() => setView('list')} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">Back to Tests <ChevronRight size={16}/></button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="p-4">Test Name</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Score</th>
                            <th className="p-4">Accuracy</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {testAttempts.map(attempt => (
                            <tr key={attempt.id} className="hover:bg-slate-50">
                                <td className="p-4 font-medium text-slate-800">{attempt.testTitle}</td>
                                <td className="p-4 text-slate-500 text-sm">{attempt.date}</td>
                                <td className="p-4 font-bold text-blue-600">{attempt.score} / {attempt.totalMarks}</td>
                                <td className="p-4 text-slate-600">{attempt.accuracy.toFixed(1)}%</td>
                                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">Completed</span></td>
                            </tr>
                        ))}
                        {testAttempts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">No past attempts found. Take a test first!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      {user.role === 'admin' && (
          <div className="bg-slate-900 text-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm mb-4">
              <ShieldCheck size={16} className="text-green-400" />
              <span>Admin Mode Active: You can create tests and manage the question bank.</span>
          </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Test Center</h2>
          <p className="text-slate-500">Attempt mocks and previous year papers.</p>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => setView('history')} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium text-sm mr-2">
                <History size={18} /> Past Results
            </button>
            {user.role === 'admin' && (
                <>
                <button onClick={() => setView('bank')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Database size={18} /> Question Bank
                </button>
                <button onClick={() => setView('create')} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                    <Plus size={18} /> Create Test
                </button>
                </>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => (
          <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${test.type === 'mock' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{test.type}</span>
              <span className="text-slate-400 text-xs">{test.totalMarks} Marks</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{test.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-1"><Clock size={14} /> {test.duration} min</div>
              <div className="flex items-center gap-1"><List size={14} /> {test.questionsCount} Qs</div>
            </div>
            <button onClick={() => startTest(test)} className="w-full py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2 transition-all">
              <PlayCircle size={18} /> Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCenter;