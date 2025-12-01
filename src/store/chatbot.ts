import { create } from "zustand";
import { useAppStore } from "./auth";
import { api } from "@/services/api";
import { AI_ROUTES } from "@/services/chat/constants";
import { AxiosResponse } from "axios";

export interface ChatbotRequest {
  user_id: string;
  message: string;
}

export interface ChatbotResponse {
  user_id: string;
  response: string;
}

const chatApi = (
  data: ChatbotRequest
): Promise<AxiosResponse<ChatbotResponse>> => {
  return api.post(AI_ROUTES.CHAT, data);
};

// Zustand store
interface ChatbotState {
  isOpen: boolean;
  messages: {
    message: string | { key: string; params?: Record<string, any> };
    isUser: boolean;
  }[];
  loading: boolean;
  toggleChatbot: () => void;
  addMessage: (
    message: string | { key: string; params?: Record<string, any> },
    isUser: boolean
  ) => void;
  sendMessage: (message: string) => Promise<void>;
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  isOpen: false,
  messages: [],
  loading: false,
  toggleChatbot: () =>
    set((state) => {
      const newIsOpen = !state.isOpen;
      if (newIsOpen && state.messages.length === 0) {
        const user = useAppStore.getState().user;
        const welcomeMessage = user?.name
          ? {
              key: "Chatbot.welcomeUser",
              params: { username: user.name },
            }
          : { key: "Chatbot.welcome" };
        return {
          isOpen: newIsOpen,
          messages: [{ message: welcomeMessage, isUser: false }],
        };
      }
      return { isOpen: newIsOpen };
    }),
  addMessage: (message, isUser) =>
    set((state) => ({
      messages: [...state.messages, { message, isUser }],
    })),
  sendMessage: async (message) => {
    const { addMessage } = get();
    addMessage(message, true);
    set({ loading: true });
    try {
      const user = useAppStore.getState().user;
      const request: ChatbotRequest = {
        user_id: user?.id?.toString() || "1",
        message,
      };
      const response = await chatApi(request);
      addMessage(response.data.response, false);
    } catch (error) {
      addMessage("Sorry, I am having trouble connecting.", false);
    } finally {
      set({ loading: false });
    }
  },
}));
