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
  // ... (State logic remains same, focus on render layout changes)
  
  // Navigation State
  const [view, setView] = useState<'list' | 'take' | 'create' | 'bank' | 'history'>('list');
  
  // --- Taking Test State ---
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
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

  // --- ACTIONS ---
  const startTest = (test: Test) => {
    let qList: Question[] = [];
    if (test.questionIds && test.questionIds.length > 0) {
        qList = questionBank.filter(q => test.questionIds?.includes(q.id));
    } else {
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
                score += 4;
                correctCount++;
            } else {
                score -= 1;
            }
        }
    });
    const accuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
    const timeSpent = (activeTest.duration * 60) - timeRemaining;
    const attempt: TestAttempt = {
        id: Date.now(),
        studentId: user.id,
        testId: activeTest.id,
        testTitle: activeTest.title,
        score: Math.max(0, score),
        totalMarks: activeTest.questionsCount * 4,
        accuracy: Math.round(accuracy),
        timeSpent: timeSpent,
        date: new Date().toISOString().split('T')[0]
    };
    onTestComplete(attempt);
    setScoreResult({ score: score, accuracy: accuracy });
    setIsFinished(true);
  };

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
          totalMarks: selectedQuestionIds.length * 4,
          questionsCount: selectedQuestionIds.length,
          questionIds: selectedQuestionIds
      };
      setTests(newTest);
      setView('list');
      setNewTestMeta({ title: '', type: 'mock', duration: 180, totalMarks: 300 });
      setSelectedQuestionIds([]);
  };

  // --- VIEW: TAKE TEST ---
  if (view === 'take' && activeTest) {
      const currentQ = testQuestions[currentQuestionIndex];
      return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden min-h-[80vh] flex flex-col relative">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
            <div>
              <h2 className="font-bold text-sm md:text-base truncate max-w-[200px]">{activeTest.title}</h2>
              <p className="text-xs text-slate-400">
                  {isFinished ? 'Result' : `Q ${currentQuestionIndex + 1} / ${activeTest.questionsCount}`}
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
  
          {/* Body */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
            {isFinished && scoreResult ? (
               <div className="max-w-3xl mx-auto text-center py-4">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Submitted!</h3>
                 <div className="grid grid-cols-3 gap-2 md:gap-6 my-6">
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <p className="text-slate-500 text-[10px] uppercase font-bold">Score</p>
                         <p className="text-xl md:text-3xl font-bold text-blue-600">{scoreResult.score} <span className="text-xs text-slate-400">/ {activeTest.totalMarks}</span></p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <p className="text-slate-500 text-[10px] uppercase font-bold">Accuracy</p>
                         <p className="text-xl md:text-3xl font-bold text-purple-600">{scoreResult.accuracy.toFixed(0)}%</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <p className="text-slate-500 text-[10px] uppercase font-bold">Qs</p>
                         <p className="text-xl md:text-3xl font-bold text-slate-700">{Object.keys(answers).length}/{activeTest.questionsCount}</p>
                     </div>
                 </div>
                 <button onClick={() => { setActiveTest(null); setView('list'); }} className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg w-full md:w-auto">Return to Dashboard</button>
               </div>
            ) : currentQ ? (
              <div className="max-w-3xl mx-auto pb-safe-area">
                <div className="mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">{currentQ.subject}</span>
                </div>
                <p className="text-base md:text-lg text-slate-800 font-medium mb-6 leading-relaxed">
                  {currentQuestionIndex + 1}. {currentQ.text}
                </p>
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(currentQ.id, idx)}
                      className={`w-full text-left p-4 rounded-lg border transition-all touch-manipulation active:scale-[0.99] ${
                        answers[currentQ.id] === idx ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-semibold mr-3 text-slate-500">{String.fromCharCode(65 + idx)}.</span>{opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : <p>Loading...</p>}
          </div>
  
          {/* Footer Navigation */}
          {!isFinished && (
            <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50 shrink-0 sticky bottom-0 z-10 md:relative">
              <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(p => p - 1)} className="px-4 py-3 md:py-2 text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50">Prev</button>
              {currentQuestionIndex < activeTest.questionsCount - 1 ? (
                 <button onClick={() => setCurrentQuestionIndex(p => p + 1)} className="px-6 py-3 md:py-2 bg-blue-600 text-white rounded-lg font-bold">Next</button>
              ) : (
                <button onClick={submitTest} className="px-6 py-3 md:py-2 bg-green-600 text-white rounded-lg font-bold shadow-lg shadow-green-500/20">Submit</button>
              )}
            </div>
          )}
        </div>
      );
  }

  // --- VIEW: BANK ---
  if (view === 'bank') {
      return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-20">
             <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Question Bank</h2>
                <button onClick={() => setView('list')} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
             <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18}/> Add Question</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                        <select 
                            value={newBankQuestion.subject}
                            onChange={e => setNewBankQuestion({...newBankQuestion, subject: e.target.value})}
                            className="w-full px-3 py-3 border rounded-lg bg-white"
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
                            className="w-full px-3 py-3 border rounded-lg"
                        />
                    </div>
                </div>
                <div className="mb-4">
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question Text</label>
                     <textarea 
                        rows={3}
                        value={newBankQuestion.text}
                        onChange={e => setNewBankQuestion({...newBankQuestion, text: e.target.value})}
                        className="w-full px-3 py-3 border rounded-lg"
                        placeholder="Type question..."
                     />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                     {newBankQuestion.options?.map((opt, idx) => (
                         <div key={idx} className="flex gap-2 items-center">
                             <input type="radio" name="correct" className="w-5 h-5" checked={newBankQuestion.correctOption === idx} onChange={() => setNewBankQuestion({...newBankQuestion, correctOption: idx})} />
                             <input 
                                type="text" 
                                value={opt} 
                                onChange={e => {
                                    const newOpts = [...(newBankQuestion.options || [])];
                                    newOpts[idx] = e.target.value;
                                    setNewBankQuestion({...newBankQuestion, options: newOpts});
                                }}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder={`Option ${idx+1}`}
                             />
                         </div>
                     ))}
                </div>
                <button onClick={addToBank} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg">Add to Bank</button>
            </div>
        </div>
      );
  }

  // --- VIEW: CREATE TEST ---
  if (view === 'create') {
      const filteredBank = questionBank.filter(q => {
          const matchSub = subjectFilter === 'All' || q.subject === subjectFilter;
          const matchText = q.text.toLowerCase().includes(bankFilter.toLowerCase()) || (q.topic?.toLowerCase().includes(bankFilter.toLowerCase()) ?? false);
          return matchSub && matchText;
      });

      return (
        <div className="min-h-[80vh] flex flex-col animate-fade-in pb-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 shrink-0">
                <h2 className="text-2xl font-bold text-slate-800">Test Creator</h2>
                <div className="flex gap-2">
                    <button onClick={() => setView('list')} className="flex-1 md:flex-none px-4 py-2 text-slate-600 bg-white border rounded-lg">Cancel</button>
                    <button onClick={publishTest} className="flex-1 md:flex-none px-6 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 font-bold shadow-lg">
                        <Save size={18} /> Publish
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
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

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1 max-h-[300px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-2 sticky top-0 bg-white z-10 pb-2 border-b">
                            <h3 className="font-bold text-slate-800 text-sm">Selected ({selectedQuestionIds.length})</h3>
                            <button onClick={() => setSelectedQuestionIds([])} className="text-xs text-red-500">Clear</button>
                        </div>
                        <div className="space-y-2">
                             {selectedQuestionIds.map((id, idx) => {
                                 const q = questionBank.find(q => q.id === id);
                                 return q ? (
                                     <div key={id} className="p-2 bg-blue-50 border border-blue-100 rounded text-xs flex justify-between items-start">
                                         <span className="mr-2 font-bold text-blue-500">{idx+1}.</span>
                                         <span className="flex-1 truncate">{q.text}</span>
                                         <button onClick={() => toggleQuestionSelection(id)} className="text-slate-400 hover:text-red-500 p-1"><X size={14}/></button>
                                     </div>
                                 ) : null;
                             })}
                        </div>
                    </div>
                </div>

                {/* Question Bank Selection */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
                    <div className="p-3 border-b border-slate-100 flex flex-col md:flex-row gap-2 bg-slate-50">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input type="text" placeholder="Search questions..." value={bankFilter} onChange={e => setBankFilter(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg outline-none text-sm" />
                        </div>
                        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="px-4 py-2 border rounded-lg outline-none bg-white text-sm">
                            <option>All</option><option>Physics</option><option>Chemistry</option><option>Maths</option>
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {filteredBank.map(q => {
                            const isSelected = selectedQuestionIds.includes(q.id);
                            return (
                                <div key={q.id} className={`p-3 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200'}`} onClick={() => toggleQuestionSelection(q.id)}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex gap-2">
                                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">{q.subject}</span>
                                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">{q.topic || 'Gen'}</span>
                                        </div>
                                        {isSelected ? <CheckCircle size={16} className="text-blue-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300"></div>}
                                    </div>
                                    <p className="text-slate-800 text-xs md:text-sm font-medium line-clamp-2">{q.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: HISTORY ---
  if (view === 'history') {
      return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Past Results</h2>
                <button onClick={() => setView('list')} className="text-blue-600 font-bold text-sm flex items-center gap-1">Back <ChevronRight size={16}/></button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="p-4 min-w-[150px]">Test Name</th>
                                <th className="p-4">Score</th>
                                <th className="p-4">Acc%</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {testAttempts.map(attempt => (
                                <tr key={attempt.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-800 text-sm">{attempt.testTitle}</td>
                                    <td className="p-4 font-bold text-blue-600">{attempt.score}/{attempt.totalMarks}</td>
                                    <td className="p-4 text-slate-600">{attempt.accuracy.toFixed(0)}%</td>
                                    <td className="p-4 text-slate-500 text-xs">{attempt.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: LIST (DEFAULT) ---
  return (
    <div className="space-y-6 pb-20">
      {user.role === 'admin' && (
          <div className="bg-slate-900 text-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 text-xs md:text-sm mb-4">
              <ShieldCheck size={16} className="text-green-400 shrink-0" />
              <span>Admin Mode: You can create tests.</span>
          </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Test Center</h2>
          <p className="text-sm text-slate-500">Attempt mocks and previous year papers.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button onClick={() => setView('history')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                <History size={16} /> Results
            </button>
            {user.role === 'admin' && (
                <>
                <button onClick={() => setView('bank')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                    <Database size={16} /> Bank
                </button>
                <button onClick={() => setView('create')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 shadow-lg">
                    <Plus size={16} /> Create
                </button>
                </>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map(test => (
          <div key={test.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all active:scale-[0.99]">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${test.type === 'mock' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{test.type}</span>
              <span className="text-slate-400 text-xs font-bold">{test.totalMarks} Marks</span>
            </div>
            <h3 className="font-bold text-base text-slate-800 mb-2 leading-tight">{test.title}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-medium">
              <div className="flex items-center gap-1"><Clock size={14} /> {test.duration} min</div>
              <div className="flex items-center gap-1"><List size={14} /> {test.questionsCount} Qs</div>
            </div>
            <button onClick={() => startTest(test)} className="w-full py-3 bg-blue-50 text-blue-700 font-bold text-sm rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2 transition-colors">
              <PlayCircle size={18} /> Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCenter;