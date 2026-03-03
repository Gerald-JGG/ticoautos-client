import api from '@/lib/api';
import { Question, Answer } from '@/types';

export const questionsApi = {
  // Get all questions for a vehicle (public)
  getByVehicle: async (vehicleId: string): Promise<Question[]> => {
    const res = await api.get(`/vehicles/${vehicleId}/questions`);
    return res.data;
  },

  // Ask a question (authenticated)
  create: async (vehicleId: string, content: string): Promise<Question> => {
    const res = await api.post(`/vehicles/${vehicleId}/questions`, { content });
    return res.data;
  },

  // My questions as a buyer
  getMine: async (): Promise<Question[]> => {
    const res = await api.get('/questions/my');
    return res.data;
  },

  // Inbox for vehicle owners
  getInbox: async (): Promise<Question[]> => {
    const res = await api.get('/questions/inbox');
    return res.data;
  },
};

export const answersApi = {
  // Answer a question (vehicle owner only)
  create: async (questionId: string, content: string): Promise<Answer> => {
    const res = await api.post(`/questions/${questionId}/answer`, { content });
    return res.data;
  },

  // Get answer for a question
  getByQuestion: async (questionId: string): Promise<Answer | null> => {
    try {
      const res = await api.get(`/questions/${questionId}/answer`);
      return res.data;
    } catch {
      return null;
    }
  },
};
