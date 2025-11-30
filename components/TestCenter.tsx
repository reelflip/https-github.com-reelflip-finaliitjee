import React, { useState, useEffect } from 'react';
import { Test, Question } from '../types';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';

const MOCK_TESTS: Test[] = [
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

const TestCenter: React.FC = () => {
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Timer Ticking Effect
  useEffect(() => {
    if (!activeTest || isFinished) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, isFinished]);

  // Timer Expiry Check
  useEffect(() => {
    if (activeTest && !isFinished && timeRemaining === 0) {
      submitTest();
    }
  }, [timeRemaining, activeTest, isFinished]);

  const startTest = (test: Test) => {
    setActiveTest(test);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTimeRemaining(test.duration * 60);
  };

  const submitTest = () => {
    setIsFinished(true);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (activeTest) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
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
                onClick={() => setActiveTest(null)}
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
          <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50">
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Test Center</h2>
          <p className="text-slate-500">Attempt mocks and previous year papers.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          Avg. Accuracy: 82%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TESTS.map(test => (
          <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                test.type === 'mock' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {test.type}
              </span>
              <span className="text-slate-400 text-xs">{test.totalMarks} Marks</span>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-2">{test.title}</h3>
            
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
              className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <PlayCircle size={16} /> Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCenter;