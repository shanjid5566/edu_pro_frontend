import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export interface ChatUser {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
  sender?: ChatUser;
  receiver?: ChatUser;
}

export interface ConversationListItem {
  user: ChatUser;
  lastMessage: {
    id: string;
    text: string;
    createdAt: string;
    senderId: string;
    receiverId: string;
  } | null;
  unreadCount: number;
}

interface ChatState {
  conversations: ConversationListItem[];
  searchResults: ChatUser[];
  conversationMessages: ChatMessage[];
  loadingConversations: boolean;
  searching: boolean;
  loadingHistory: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  searchResults: [],
  conversationMessages: [],
  loadingConversations: false,
  searching: false,
  loadingHistory: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return maybeAxiosError.response?.data?.message || maybeAxiosError.message || fallback;
  }
  return fallback;
};

export const searchChatUsers = createAsyncThunk<
  ChatUser[],
  { query: string; limit?: number },
  { rejectValue: string }
>('chat/searchUsers', async ({ query, limit = 10 }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/v1/messages/search', {
      params: { query, limit },
    });

    if (!response.data?.success) {
      return rejectWithValue(response.data?.message || 'Search failed');
    }

    return (response.data.data || []) as ChatUser[];
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Search failed'));
  }
});

export const fetchConversations = createAsyncThunk<
  ConversationListItem[],
  { limit?: number } | void,
  { rejectValue: string }
>('chat/fetchConversations', async (payload, { rejectWithValue }) => {
  try {
    const limit = payload?.limit ?? 30;
    const response = await axiosInstance.get('/api/v1/messages/conversations', {
      params: { limit },
    });

    if (!response.data?.success) {
      return rejectWithValue(response.data?.message || 'Failed to load conversations');
    }

    return (response.data.data || []) as ConversationListItem[];
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load conversations'));
  }
});

export const fetchConversationHistory = createAsyncThunk<
  ChatMessage[],
  { userId: string; limit?: number },
  { rejectValue: string }
>('chat/fetchConversationHistory', async ({ userId, limit = 50 }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/v1/messages/conversation/${userId}`, {
      params: { limit },
    });

    if (!response.data?.success) {
      return rejectWithValue(response.data?.message || 'Failed to load history');
    }

    return (response.data.data || []) as ChatMessage[];
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load history'));
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload || 'Failed to load conversations';
      })
      .addCase(searchChatUsers.pending, (state) => {
        state.searching = true;
        state.error = null;
      })
      .addCase(searchChatUsers.fulfilled, (state, action) => {
        state.searching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchChatUsers.rejected, (state, action) => {
        state.searching = false;
        state.error = action.payload || 'Search failed';
      })
      .addCase(fetchConversationHistory.pending, (state) => {
        state.loadingHistory = true;
        state.error = null;
      })
      .addCase(fetchConversationHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.conversationMessages = action.payload;
      })
      .addCase(fetchConversationHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload || 'Failed to load history';
      });
  },
});

export const { clearChatError } = chatSlice.actions;
export default chatSlice.reducer;
