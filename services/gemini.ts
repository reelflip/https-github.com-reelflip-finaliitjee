// This service now provides static content and heuristic responses 
// to remove dependency on external AI tools.

const QUOTES = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "There is no elevator to success. You have to take the stairs.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "It always seems impossible until it's done.",
  "Discipline is doing what needs to be done, even if you don't want to.",
  "Your time is limited, don't waste it living someone else's life.",
  "Dream big and dare to fail.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Believe you can and you're halfway there."
];

const TIPS = [
  "Physics: Focus on understanding concepts rather than memorizing formulas.",
  "Chemistry: NCERT is your bible for Inorganic Chemistry. Read it thoroughly.",
  "Maths: Practice at least 20 problems daily from Calculus.",
  "General: Analyze your mock tests to identify weak areas.",
  "Revision: Make short notes for last-minute revision.",
  "Health: Ensure you get at least 6-7 hours of sleep for memory retention.",
  "Strategy: Attempt the subject you are most confident in first during exams."
];

export const generateMotivation = async (studentName: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[randomIndex];
};

export const generateStudyTip = async (subject: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const randomIndex = Math.floor(Math.random() * TIPS.length);
  return TIPS[randomIndex];
};

export const askTutor = async (question: string): Promise<string> => {
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerQ = question.toLowerCase();

    // Simple Rule-Based Response Engine
    if (lowerQ.includes("physics") || lowerQ.includes("mechanics") || lowerQ.includes("newton")) {
        return "For Physics, visualize the problem. Draw free-body diagrams for mechanics problems. Focus on HC Verma concepts.";
    }
    
    if (lowerQ.includes("chemistry") || lowerQ.includes("organic") || lowerQ.includes("reaction")) {
        return "Organic Chemistry requires understanding reaction mechanisms. Practice named reactions daily.";
    }
    
    if (lowerQ.includes("math") || lowerQ.includes("calculus") || lowerQ.includes("algebra")) {
        return "Maths is all about practice. Solve previous year questions (PYQs) to understand the pattern.";
    }

    if (lowerQ.includes("timetable") || lowerQ.includes("schedule")) {
        return "A balanced timetable includes school, coaching, and self-study. Use the Timetable Generator tab to create one.";
    }

    if (lowerQ.includes("stress") || lowerQ.includes("tired") || lowerQ.includes("give up")) {
        return "It's normal to feel overwhelmed. Take a short break, drink water, and remember why you started. You got this!";
    }

    return "That's a good question. As a static helper, I recommend checking your textbooks or asking your coaching professor for a detailed explanation.";
}