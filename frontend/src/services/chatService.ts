import { api } from './api';

export interface ChatMessageRequest {
  message: string;
  assessmentId?: number;
}

export interface ChatMessageResponse {
  reply: string;
  intentCategory: string;
  suggestions: string[];
  disclaimer: string;
  isEmergency: boolean;
}

export const chatService = {
  sendMessage: async (message: string, assessmentId?: number, previousTopic?: string): Promise<ChatMessageResponse> => {
    const res = await api.post('/chat/message', {
      message,
      assessmentId,
      previousTopic,
    });
    return res.data?.data;
  },
};
