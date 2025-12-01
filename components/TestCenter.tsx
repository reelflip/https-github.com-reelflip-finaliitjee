import React, { useState, useEffect } from 'react';
import { Test, Question, User } from '../types';
import { PlayCircle, Clock, CheckCircle, Plus, Save, Trash2, X, FileText, List, ChevronRight } from 'lucide-react';

interface TestCenterProps {
    user: User;
}

const INITIAL_TESTS: Test[] = [
  { id: 1, title: 'JEE Main Full Mock 1', type: 'mock', duration: 180, totalMarks: 300, questionsCount: 90 },
  { id: 2, title: 'JEE Advanced Paper 1 (2022)', type: 'pyq', duration: 180, totalMarks: 180, questionsCount: 54 },
  { id: 3, title: 'Physics - Rotational Mechanics', type: 'mock', duration: 60, totalMarks: 100, questionsCount: 25 },
];

const SAMPLE_QUESTION: Question = {
  id: 1,
  text: "A particle of mass m moves in a circular orbit of radius r with a uniform speed v. The angular momentum of the particle relative to the center of the orbit is L. If the speed of the particle is doubled and radius is halved, the new angular momentum will be:",
  options: [
    "L",
    "2L",
    "L/2",
    "4L"
  ],
  correctOption: 0
};

const TestCenter: React.FC<TestCenterProps> = ({ user }) => {
  const [tests, setTests] = useState<Test[]>(INITIAL_TESTS);
  const [view, setView] = useState<'list' | 'take' | 'create'>('list');
  
  // Taking Test State
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Creating Test State
  const [newTestMeta, setNewTestMeta] = useState<Partial<Test>>({
      title: '', type: 'mock', duration: 180, totalMarks: 300
  });
  const [newQuestions, setNewQuestions] = useState<Question[]>([]);
  const [currentNewQuestion, setCurrentNewQuestion] = useState<Partial<Question>>({
      text: '', options: ['', '', '', ''], correctOption: 0
  });

  // --- TIMER LOGIC ---
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

  // --- ACTIONS ---

  const startTest = (test: Test) => {
    setActiveTest(test);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTimeRemaining(test.duration * 60);
    setView('take');
  };

  const submitTest = () => {
    setIsFinished(true);
  };

  const handleAddQuestion = () => {
      if (!currentNewQuestion.text || currentNewQuestion.options?.some(o => !o)) {
          alert("Please fill in question text and all options.");
          return;
      }
      const q: Question = {
          id: Date.now(),
          text: currentNewQuestion.text!,
          options: currentNewQuestion.options as string[],
          correctOption: currentNewQuestion.correctOption || 0
      };
      setNewQuestions([...newQuestions, q]);
      // Reset form
      setCurrentNewQuestion({ text: '', options: ['', '', '', ''], correctOption: 0 });
  };

  const handlePublishTest = () => {
      if (!newTestMeta.title || newQuestions.length === 0) {
          alert("Please add a title and at least one question.");
          return;
      }
      const newTest: Test = {
          id: Date.now(),
          title: newTestMeta.title!,
          type: newTestMeta.type as 'mock' | 'pyq',
          duration: newTestMeta.duration || 180,
          totalMarks: newTestMeta.totalMarks || 300,
          questionsCount: newQuestions.length
      };
      setTests([...tests, newTest]);
      setView('list');
      setNewQuestions([]);
      setNewTestMeta({ title: '', type: 'mock', duration: 180, totalMarks: 300 });
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- RENDER VIEWS ---

  if (view === 'take' && activeTest) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-bold">{activeTest.title}</h2>
            <p className="text-xs text-slate-400">Question {currentQuestionIndex + 1} of {activeTest.questionsCount}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
              timeRemaining < 300 ? 'bg-red-500/20 text-red-200 animate-pulse' : 'bg-slate-800'
          }`}>
            <Clock size={16} className={timeRemaining < 300 ? "text-red-400" : "text-blue-400"}/>
            <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {isFinished ? (
             <div className="text-center py-12">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle size={32} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">Test Submitted!</h3>
               <p className="text-slate-500 mb-6">
                   {timeRemaining === 0 ? "Time's up! " : ""}
                   Your responses have been recorded for analytics.
               </p>
               <button 
                onClick={() => { setActiveTest(null); setView('list'); }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
               >
                 Back to Dashboard
               </button>
             </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-slate-800 font-medium mb-6 leading-relaxed">
                {currentQuestionIndex + 1}. {SAMPLE_QUESTION.text}
              </p>

              <div className="space-y-3">
                {SAMPLE_QUESTION.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedOption === idx 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold mr-3 text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isFinished && (
          <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50 shrink-0">
            <button 
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(p => p - 1)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            
            {currentQuestionIndex < activeTest.questionsCount - 1 ? (
               <button 
               onClick={() => {
                 setCurrentQuestionIndex(p => p + 1);
                 setSelectedOption(null);
               }}
               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
             >
               Save & Next
             </button>
            ) : (
              <button 
               onClick={submitTest}
               className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
             >
               Submit Test
             </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (view === 'create') {
      return (
          <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">Create New Mock Test</h2>
                  <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-700">
                      <X size={24} />
                  </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Config & Question Form */}
                  <div className="lg:col-span-2 space-y-6">
                      {/* Test Metadata */}
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText size={18}/> Test Details</h3>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Test Title</label>
                                  <input 
                                    type="text" 
                                    value={newTestMeta.title} 
                                    onChange={e => setNewTestMeta({...newTestMeta, title: e.target.value})}
                                    placeholder="e.g. JEE Main Full Test 05"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (mins)</label>
                                  <input 
                                    type="number" 
                                    value={newTestMeta.duration} 
                                    onChange={e => setNewTestMeta({...newTestMeta, duration: Number(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Marks</label>
                                  <input 
                                    type="number" 
                                    value={newTestMeta.totalMarks} 
                                    onChange={e => setNewTestMeta({...newTestMeta, totalMarks: Number(e.target.value)})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Question Builder */}
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18}/> Add Question</h3>
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question Text</label>
                                  <textarea 
                                    rows={3}
                                    value={currentNewQuestion.text}
                                    onChange={e => setCurrentNewQuestion({...currentNewQuestion, text: e.target.value})}
                                    placeholder="Enter the question here..."
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                                  ></textarea>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {[0, 1, 2, 3].map((idx) => (
                                      <div key={idx} className="flex gap-2">
                                          <div className="pt-2">
                                              <input 
                                                type="radio" 
                                                name="correctOption" 
                                                checked={currentNewQuestion.correctOption === idx}
                                                onChange={() => setCurrentNewQuestion({...currentNewQuestion, correctOption: idx})}
                                              />
                                          </div>
                                          <div className="flex-1">
                                              <input 
                                                type="text"
                                                value={currentNewQuestion.options?.[idx] || ''}
                                                onChange={e => {
                                                    const newOpts = [...(currentNewQuestion.options || [])];
                                                    newOpts[idx] = e.target.value;
                                                    setCurrentNewQuestion({...currentNewQuestion, options: newOpts});
                                                }}
                                                placeholder={`Option ${String.fromCharCode(65+idx)}`}
                                                className={`w-full px-3 py-2 border rounded-lg outline-none text-sm ${currentNewQuestion.correctOption === idx ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
                                              />
                                          </div>
                                      </div>
                                  ))}
                              </div>

                              <button 
                                onClick={handleAddQuestion}
                                className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
                              >
                                Add to Test
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Preview */}
                  <div className="space-y-4">
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><List size={18}/> Question List</h3>
                          
                          <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-2">
                              {newQuestions.length === 0 ? (
                                  <div className="text-center text-slate-400 py-10 text-sm italic">
                                      No questions added yet.
                                  </div>
                              ) : (
                                  newQuestions.map((q, idx) => (
                                      <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm group relative">
                                          <p className="font-semibold text-slate-700 truncate pr-6">{idx + 1}. {q.text}</p>
                                          <p className="text-slate-500 text-xs mt-1">Answer: Option {String.fromCharCode(65 + q.correctOption)}</p>
                                          <button 
                                            onClick={() => setNewQuestions(newQuestions.filter(nq => nq.id !== q.id))}
                                            className="absolute right-2 top-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                              <Trash2 size={14} />
                                          </button>
                                      </div>
                                  ))
                              )}
                          </div>

                          <div className="pt-6 border-t border-slate-100 mt-4">
                              <div className="flex justify-between text-sm mb-4 font-medium text-slate-600">
                                  <span>Total Questions:</span>
                                  <span>{newQuestions.length}</span>
                              </div>
                              <button 
                                onClick={handlePublishTest}
                                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                              >
                                <Save size={18} /> Publish Test
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- MAIN LIST VIEW ---

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Test Center</h2>
          <p className="text-slate-500">Attempt mocks and previous year papers.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                Avg. Accuracy: 82%
            </div>
            {user.role === 'admin' && (
                <button 
                    onClick={() => setView('create')}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                    <Plus size={18} /> Create Test
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => (
          <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                test.type === 'mock' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {test.type}
              </span>
              <span className="text-slate-400 text-xs">{test.totalMarks} Marks</span>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{test.title}</h3>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-1">
                <Clock size={14} /> {test.duration} min
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={14} /> {test.questionsCount} Qs
              </div>
            </div>

            <button 
              onClick={() => startTest(test)}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2 transition-all"
            >
              <PlayCircle size={18} /> Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCenter;