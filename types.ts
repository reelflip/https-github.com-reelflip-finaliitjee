export type Role = 'student' | 'parent' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  // Optional fields for detailed profiles
  institute?: string;
  targetYear?: string;
  phone?: string;
}

export type TopicStatus = 'not_started' | 'in_progress' | 'completed' | 'revision_required';

export interface Topic {
  id: number;
  name: string;
  status: TopicStatus;
  estHours: number;
  exercises: {
    ex1: number;
    ex2: number;
    ex3: number;
    ex4: number;
    ex1_total: number;
    ex2_total: number;
    ex3_total: number;
    ex4_total: number;
  };
}

export interface Chapter {
  id: number;
  name: string;
  phase: string;
  topics: Topic[];
}

export interface Subject {
  id: number;
  name: string; // Physics, Chemistry, Maths
  chapters: Chapter[];
}

export interface Test {
  id: number;
  title: string;
  type: 'mock' | 'pyq';
  duration: number; // minutes
  totalMarks: number;
  questionsCount: number;
  questionIds?: number[]; // IDs of specific questions from the bank
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  subject?: string;
  topic?: string;
}

export interface TestAttempt {
  id: number;
  studentId: number;
  testId: number;
  testTitle: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  timeSpent: number; // seconds
  date: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'alert' | 'reminder' | 'invite';
}