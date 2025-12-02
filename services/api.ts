
import { User, Test, TestAttempt, Question } from '../types';

const API_BASE_URL = '/backend';

export const api = {
  // --- SYLLABUS ---
  updateTopicProgress: async (userId: number, topicId: number, status: string, exercises: any) => {
    try {
      await fetch(`${API_BASE_URL}/api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_progress',
          student_id: userId,
          topic_id: topicId,
          status,
          exercises
        }),
      });
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  },

  // --- TESTS ---
  createTest: async (test: Test) => {
    try {
      await fetch(`${API_BASE_URL}/api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_test',
          ...test,
          question_ids: test.questionIds // Ensure camelCase maps to what PHP expects
        }),
      });
    } catch (e) {
      console.error("Failed to create test", e);
    }
  },

  saveTestAttempt: async (attempt: TestAttempt) => {
    try {
      await fetch(`${API_BASE_URL}/api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_attempt',
          ...attempt
        }),
      });
    } catch (e) {
      console.error("Failed to save attempt", e);
    }
  },

  // --- TIMETABLE ---
  saveTimetableConfig: async (userId: number, studentType: string, configData: any) => {
    try {
      await fetch(`${API_BASE_URL}/api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_timetable_config',
          student_id: userId,
          student_type: studentType,
          config_data: configData
        }),
      });
    } catch (e) {
      console.error("Failed to save timetable config", e);
    }
  },

  // --- FOCUS ZONE ---
  saveStudySession: async (userId: number, subject: string, duration: number, type: string, notes: string) => {
    try {
      await fetch(`${API_BASE_URL}/api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_study_session',
          student_id: userId,
          subject,
          duration,
          session_type: type,
          notes
        }),
      });
    } catch (e) {
      console.error("Failed to save session", e);
    }
  }
};
