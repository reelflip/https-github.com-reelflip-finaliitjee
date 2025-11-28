export type Role = 'student' | 'parent' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type TopicStatus = 'not_started' | 'in_progress' | 'completed' | 'revision_required';

export interface Topic {
  id: number;
  name: string;
  status: TopicStatus;
  estHours: number;
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
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'alert' | 'reminder' | 'invite';
}
