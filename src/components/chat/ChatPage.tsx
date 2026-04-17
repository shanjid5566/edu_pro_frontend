import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video, Circle, Users, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@/components/ui/Modal';
import { AppDispatch, RootState } from '@/store/store';
import {
  ChatMessage,
  ChatUser,
  ConversationListItem,
  fetchConversations,
  fetchConversationHistory,
  searchChatUsers,
} from '@/store/slices/chatSlice';

interface ConversationItem extends ChatUser {
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface SocketAck<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ChatPageProps {
  currentUserRole: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://edu-pro-backend.vercel.app';

const toRoleLabel = (role: string) => role.toLowerCase();

const formatClockTime = (isoOrDate: string) => {
  const date = new Date(isoOrDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const appendUniqueMessage = (items: ChatMessage[], next: ChatMessage) => {
  if (items.some((m) => m.id === next.id)) return items;
  return [...items, next].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

const mapConversationsToRecord = (
  items: ConversationListItem[],
  previous: Record<string, ConversationItem>
) => {
  const mapped: Record<string, ConversationItem> = {};

  items.forEach((item) => {
    const existing = previous[item.user.id];
    mapped[item.user.id] = {
      id: item.user.id,
      name: item.user.name,
      role: toRoleLabel(item.user.role),
      email: item.user.email,
      avatar: item.user.avatar ?? null,
      lastMessage: item.lastMessage?.text || '',
      time: item.lastMessage?.createdAt ? formatClockTime(item.lastMessage.createdAt) : '',
      unread: item.unreadCount || 0,
      online: existing?.online ?? false,
    };
  });

  return mapped;
};

const ChatPage = ({ currentUserRole }: ChatPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [selectedContact, setSelectedContact] = useState<ChatUser | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showDirectory, setShowDirectory] = useState(false);
  const [directorySearch, setDirectorySearch] = useState('');
  const [suggestions, setSuggestions] = useState<ChatUser[]>([]);
  const [conversationMap, setConversationMap] = useState<Record<string, ConversationItem>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const activeUserIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  const isParentRole = currentUserRole.toLowerCase() === 'parent';
  const authToken = token || localStorage.getItem('authToken');
  const myUserId = user?.id;

  useEffect(() => {
    activeUserIdRef.current = selectedContact?.id || null;
  }, [selectedContact]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const filteredContacts = useMemo(
    () => Object.values(conversationMap).filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [conversationMap, searchQuery]
  );

  const runUserSearch = useCallback(async (query: string) => {
    if (!authToken || !query.trim()) {
      return [] as ChatUser[];
    }

    const socket = socketRef.current;
    if (socket?.connected) {
      try {
        const socketData = await new Promise<ChatUser[]>((resolve, reject) => {
          socket.emit('users:search', { query, limit: 10 }, (res: SocketAck<ChatUser[]>) => {
            if (!res?.success) {
              reject(new Error(res?.message || 'Search failed'));
              return;
            }
            resolve(res.data || []);
          });
        });
        return socketData;
      } catch {
        // Fallback to REST below.
      }
    }

    return dispatch(searchChatUsers({ query, limit: 10 })).unwrap();
  }, [authToken, dispatch]);

  const loadConversationsList = useCallback(async () => {
    if (!authToken) {
      return;
    }

    setLoadingConversations(true);
    try {
      const items = await dispatch(fetchConversations({ limit: 30 })).unwrap();
      setConversationMap((prev) => mapConversationsToRecord(items, prev));
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  }, [authToken, dispatch]);

  const loadConversationHistory = async (otherUserId: string) => {
    if (!authToken) {
      throw new Error('Missing authentication token');
    }

    const socket = socketRef.current;
    if (socket?.connected) {
      try {
        const socketData = await new Promise<ChatMessage[]>((resolve, reject) => {
          socket.emit('messages:history', { userId: otherUserId, limit: 50 }, (res: SocketAck<ChatMessage[]>) => {
            if (!res?.success) {
              reject(new Error(res?.message || 'Failed to load history'));
              return;
            }
            resolve(res.data || []);
          });
        });
        return socketData;
      } catch {
        // Fallback to REST below.
      }
    }

    return dispatch(fetchConversationHistory({ userId: otherUserId, limit: 50 })).unwrap();
  };

  const sendMessageLive = async (receiverId: string, content: string) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      throw new Error('Socket is not connected');
    }

    return new Promise<ChatMessage>((resolve, reject) => {
      socket.emit('message:send', { receiverId, message: content }, (res: SocketAck<ChatMessage>) => {
        if (!res?.success || !res.data) {
          reject(new Error(res?.message || 'Failed to send message'));
          return;
        }
        resolve(res.data);
      });
    });
  };

  useEffect(() => {
    if (!authToken || !myUserId || isParentRole) {
      return;
    }

    loadConversationsList();

    const socket = io(API_BASE_URL, {
      transports: ['websocket'],
      withCredentials: true,
      auth: { token: authToken },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err: Error) => {
      setConnectionError(err.message || 'Socket connection failed');
      setIsConnected(false);
    });

    socket.on('socket:ready', () => {
      setConnectionError(null);
    });

    socket.on('message:new', (payload: SocketAck<ChatMessage> | ChatMessage) => {
      const wrappedPayload = payload as SocketAck<ChatMessage>;
      const incoming = wrappedPayload.data ? wrappedPayload.data : (payload as ChatMessage);
      if (!incoming) return;

      const isCurrentConversation =
        !!activeUserIdRef.current &&
        [incoming.senderId, incoming.receiverId].includes(activeUserIdRef.current) &&
        [incoming.senderId, incoming.receiverId].includes(myUserId);

      const otherParticipant = incoming.senderId === myUserId ? incoming.receiver : incoming.sender;
      if (otherParticipant?.id) {
        setConversationMap((prev) => ({
          ...prev,
          [otherParticipant.id]: {
            id: otherParticipant.id,
            name: otherParticipant.name,
            role: toRoleLabel(otherParticipant.role),
            avatar: otherParticipant.avatar ?? null,
            email: otherParticipant.email,
            lastMessage: incoming.message,
            time: formatClockTime(incoming.createdAt),
            unread: isCurrentConversation || incoming.senderId === myUserId ? 0 : (prev[otherParticipant.id]?.unread || 0) + 1,
            online: true,
          },
        }));
      }

      if (isCurrentConversation) {
        setMessages((prev) => appendUniqueMessage(prev, incoming));
      }
    });

    socket.on('conversations:refresh', () => {
      loadConversationsList();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authToken, isParentRole, loadConversationsList, myUserId]);

  useEffect(() => {
    if (!showDirectory) return;
    const q = directorySearch.trim();

    if (q.length < 1) {
      setSuggestions([]);
      return;
    }

    setSearchingUsers(true);
    setConnectionError(null);

    const timer = setTimeout(async () => {
      try {
        const found = await runUserSearch(q);
        if (mountedRef.current) {
          setSuggestions(found);
        }
      } catch (err) {
        if (mountedRef.current) {
          setConnectionError(err instanceof Error ? err.message : 'Failed to search users');
        }
      } finally {
        if (mountedRef.current) {
          setSearchingUsers(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [directorySearch, runUserSearch, showDirectory]);

  const startConversation = async (contact: ChatUser) => {
    setSelectedContact(contact);
    setShowDirectory(false);
    setLoadingHistory(true);
    setConnectionError(null);

    setConversationMap((prev) => ({
      ...prev,
      [contact.id]: {
        id: contact.id,
        name: contact.name,
        role: toRoleLabel(contact.role),
        email: contact.email,
        avatar: contact.avatar ?? null,
        lastMessage: prev[contact.id]?.lastMessage || '',
        time: prev[contact.id]?.time || '',
        unread: 0,
        online: prev[contact.id]?.online ?? true,
      },
    }));

    try {
      const history = await loadConversationHistory(contact.id);
      setMessages(history);

      const last = history[history.length - 1];
      if (last) {
        setConversationMap((prev) => ({
          ...prev,
          [contact.id]: {
            ...prev[contact.id],
            lastMessage: last.message,
            time: formatClockTime(last.createdAt),
            unread: 0,
          },
        }));
      }
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Failed to load conversation');
      setMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedContact || sending) return;

    const content = message.trim();
    setSending(true);
    setConnectionError(null);

    try {
      const sent = await sendMessageLive(selectedContact.id, content);
      setMessages((prev) => appendUniqueMessage(prev, sent));
      setMessage('');
      setConversationMap((prev) => ({
        ...prev,
        [selectedContact.id]: {
          ...prev[selectedContact.id],
          id: selectedContact.id,
          name: selectedContact.name,
          role: toRoleLabel(selectedContact.role),
          avatar: selectedContact.avatar ?? null,
          email: selectedContact.email,
          lastMessage: sent.message,
          time: formatClockTime(sent.createdAt),
          unread: 0,
          online: prev[selectedContact.id]?.online ?? true,
        },
      }));
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (isParentRole) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-xl border border-border bg-card p-6"
      >
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-foreground">Messaging is not enabled for Parent role</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This chat flow currently supports Student, Teacher, and Admin roles only.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border bg-card">
      {!selectedContact && (
        <div className="w-full md:hidden shrink-0 border-r border-border flex flex-col">
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Messages</h2>
              <button onClick={() => setShowDirectory(true)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Find Users">
                <Users className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search conversations..." className="h-9 w-full rounded-lg border border-border bg-secondary/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="px-4 py-6 text-sm text-muted-foreground">Loading conversations...</div>
            ) : null}
            {filteredContacts.map((contact) => (
              <button key={contact.id} onClick={() => startConversation(contact)} className="flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-secondary/50">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{contact.name.charAt(0)}</div>
                  {contact.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-success text-success stroke-card" strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{contact.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && <span className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{contact.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="hidden md:flex w-80 shrink-0 border-r border-border flex-col">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
            <button onClick={() => setShowDirectory(true)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Find Users">
              <Users className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search conversations..." className="h-9 w-full rounded-lg border border-border bg-secondary/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="px-4 py-6 text-sm text-muted-foreground">Loading conversations...</div>
          ) : null}
          {filteredContacts.map((contact) => (
            <button key={contact.id} onClick={() => startConversation(contact)} className={`flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors ${selectedContact?.id === contact.id ? 'bg-primary/5' : 'hover:bg-secondary/50'}`}>
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{contact.name.charAt(0)}</div>
                {contact.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-success text-success stroke-card" strokeWidth={3} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                  {contact.unread > 0 && <span className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{contact.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col w-full">
        {selectedContact ? (
          <>
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedContact(null)} className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{selectedContact.name.charAt(0)}</div>
                  {conversationMap[selectedContact.id]?.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-success text-success stroke-card" strokeWidth={3} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {conversationMap[selectedContact.id]?.online ? 'Online' : 'Offline'} · {toRoleLabel(selectedContact.role)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Phone className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Video className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {loadingHistory ? (
                <div className="text-sm text-muted-foreground">Loading conversation...</div>
              ) : null}
              {messages.map((msg) => {
                const isMine = msg.senderId === myUserId;
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMine ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-secondary-foreground rounded-bl-md'}`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`mt-1 text-[10px] ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatClockTime(msg.createdAt)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="border-t border-border p-4">
              {connectionError ? <p className="mb-2 text-xs text-destructive">{connectionError}</p> : null}
              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Paperclip className="h-5 w-5" /></button>
                <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="h-10 flex-1 rounded-lg border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Smile className="h-5 w-5" /></button>
                <button onClick={handleSend} disabled={!message.trim() || sending || !isConnected} className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground gap-2">
            <p>Select a conversation to start chatting</p>
            <p className="text-xs">Socket status: {isConnected ? 'Connected' : 'Disconnected'}</p>
          </div>
        )}
      </div>

      <Modal open={showDirectory} onClose={() => setShowDirectory(false)} title="User Directory" description="Search users and start live conversations" size="lg">
        <div className="space-y-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={directorySearch} onChange={e => setDirectorySearch(e.target.value)} placeholder="Type at least 1 character..." className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          </div>
          <div className="divide-y divide-border rounded-lg border border-border max-h-96 overflow-y-auto">
            {!directorySearch.trim() ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">Start typing to search users.</div>
            ) : null}
            {searchingUsers ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">Searching users...</div>
            ) : null}
            {!searchingUsers && directorySearch.trim() && suggestions.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">No users found.</div>
            ) : null}
            {suggestions.map((suggestion) => (
              <button key={suggestion.id} onClick={() => startConversation(suggestion)} className="flex w-full items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{suggestion.name.charAt(0)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{suggestion.name}</p>
                    <p className="text-xs text-muted-foreground">{toRoleLabel(suggestion.role)}</p>
                  </div>
                </div>
                <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">Message</span>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ChatPage;
