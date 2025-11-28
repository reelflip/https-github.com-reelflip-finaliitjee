import React, { useState } from 'react';
import { Subject, Topic, TopicStatus } from '../types';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock } from 'lucide-react';

const INITIAL_SYLLABUS: Subject[] = [
  {
    id: 1,
    name: 'Physics',
    chapters: [
      {
        id: 101,
        name: 'Mechanics',
        phase: 'Phase 1',
        topics: [
          { id: 1011, name: 'Kinematics', status: 'completed', estHours: 12 },
          { id: 1012, name: 'Laws of Motion', status: 'in_progress', estHours: 10 },
          { id: 1013, name: 'Rotational Motion', status: 'revision_required', estHours: 18 },
        ]
      },
      {
        id: 102,
        name: 'Electrodynamics',
        phase: 'Phase 2',
        topics: [
          { id: 1021, name: 'Electrostatics', status: 'not_started', estHours: 15 },
          { id: 1022, name: 'Current Electricity', status: 'not_started', estHours: 12 },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Chemistry',
    chapters: [
      {
        id: 201,
        name: 'Physical Chemistry',
        phase: 'Phase 1',
        topics: [
          { id: 2011, name: 'Mole Concept', status: 'completed', estHours: 8 },
          { id: 2012, name: 'Atomic Structure', status: 'completed', estHours: 10 },
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Mathematics',
    chapters: [
      {
        id: 301,
        name: 'Calculus',
        phase: 'Phase 2',
        topics: [
          { id: 3011, name: 'Limits & Continuity', status: 'in_progress', estHours: 14 },
          { id: 3012, name: 'Derivatives', status: 'not_started', estHours: 10 },
        ]
      }
    ]
  }
];

const StatusBadge: React.FC<{ status: TopicStatus }> = ({ status }) => {
  const styles = {
    not_started: 'bg-slate-100 text-slate-500',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    revision_required: 'bg-orange-100 text-orange-700',
  };
  
  const labels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    revision_required: 'Revise',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const Syllabus: React.FC = () => {
  const [syllabus, setSyllabus] = useState<Subject[]>(INITIAL_SYLLABUS);
  const [activeSubject, setActiveSubject] = useState<number>(1);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([101]);

  const toggleChapter = (id: number) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const updateStatus = (chapterId: number, topicId: number, newStatus: TopicStatus) => {
    const updated = syllabus.map(subject => ({
      ...subject,
      chapters: subject.chapters.map(chapter => {
        if (chapter.id !== chapterId) return chapter;
        return {
          ...chapter,
          topics: chapter.topics.map(topic => {
            if (topic.id !== topicId) return topic;
            return { ...topic, status: newStatus };
          })
        };
      })
    }));
    setSyllabus(updated);
  };

  const currentSubject = syllabus.find(s => s.id === activeSubject);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Syllabus Tracker</h2>
           <p className="text-slate-500">Track your progress chapter by chapter.</p>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        {syllabus.map(sub => (
          <button
            key={sub.id}
            onClick={() => setActiveSubject(sub.id)}
            className={`pb-3 px-4 text-sm font-medium transition-all relative ${
              activeSubject === sub.id 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {sub.name}
            {activeSubject === sub.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {currentSubject?.chapters.map(chapter => (
          <div key={chapter.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedChapters.includes(chapter.id) ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">{chapter.name}</h3>
                  <span className="text-xs text-slate-500 bg-white border px-2 py-0.5 rounded">{chapter.phase}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>{chapter.topics.filter(t => t.status === 'completed').length}/{chapter.topics.length} Topics</span>
              </div>
            </button>

            {expandedChapters.includes(chapter.id) && (
              <div className="divide-y divide-slate-100">
                {chapter.topics.map(topic => (
                  <div key={topic.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {topic.status === 'completed' 
                        ? <CheckCircle2 size={20} className="text-green-500" />
                        : topic.status === 'revision_required'
                        ? <Circle size={20} className="text-orange-500" />
                        : <Circle size={20} className="text-slate-300" />
                      }
                      <div>
                        <p className="font-medium text-slate-700">{topic.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> Est. {topic.estHours} hrs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <select 
                        value={topic.status}
                        onChange={(e) => updateStatus(chapter.id, topic.id, e.target.value as TopicStatus)}
                        className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                       >
                         <option value="not_started">Not Started</option>
                         <option value="in_progress">In Progress</option>
                         <option value="completed">Completed</option>
                         <option value="revision_required">Revision Required</option>
                       </select>
                       <StatusBadge status={topic.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Syllabus;
