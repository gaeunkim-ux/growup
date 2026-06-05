export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  history: string[]; // dates of completion, e.g. ["2026-06-04", "2026-06-05"]
}

export interface Goal {
  id: string;
  text: string;
  category: string;
  deadline: string;
  isCompleted: boolean;
}

export interface AdviceRequest {
  major: string;
  goals: string[];
  struggle: string;
}

export interface MentorStory {
  id: string;
  name: string;
  role: string;
  major: string;
  quote: string;
  story: string;
  avatarColor: string;
}
