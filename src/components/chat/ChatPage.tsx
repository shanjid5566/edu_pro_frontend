import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video, Circle, Users, ArrowLeft } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface Contact {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMine: boolean;
}

const allUsers: Contact[] = [
  { id: '1', name: 'Emily Carter', role: 'Teacher', lastMessage: 'The exam results are ready', time: '2 min', unread: 2, online: true },
  { id: '2', name: 'Sarah Johnson', role: 'Student', lastMessage: 'Thank you for the feedback!', time: '15 min', unread: 0, online: true },
  { id: '3', name: 'Michael Davis', role: 'Parent', lastMessage: "How is Alex's progress?", time: '1 hr', unread: 1, online: false },
  { id: '4', name: 'David Park', role: 'Teacher', lastMessage: 'Meeting at 3 PM tomorrow', time: '2 hr', unread: 0, online: true },
  { id: '5', name: 'Rachel Kim', role: 'Teacher', lastMessage: 'Lab session confirmed', time: '3 hr', unread: 0, online: false },
  { id: '6', name: 'James Williams', role: 'Student', lastMessage: 'Can I submit the assignment late?', time: '5 hr', unread: 3, online: false },
  { id: '7', name: 'Lisa Anderson', role: 'Teacher', lastMessage: '', time: '', unread: 0, online: true },
  { id: '8', name: 'Michael Chen', role: 'Teacher', lastMessage: '', time: '', unread: 0, online: false },
  { id: '9', name: 'Olivia Brown', role: 'Student', lastMessage: '', time: '', unread: 0, online: true },
  { id: '10', name: 'Liam Martinez', role: 'Student', lastMessage: '', time: '', unread: 0, online: false },
  { id: '11', name: 'Carlos Martinez', role: 'Parent', lastMessage: '', time: '', unread: 0, online: false },
  { id: '12', name: 'Robert Williams', role: 'Parent', lastMessage: '', time: '', unread: 0, online: false },
];

const messageHistory: Record<string, Message[]> = {
  '1': [
    { id: '1', senderId: '1', text: 'Hi! I wanted to discuss the mid-term exam schedule.', time: '10:30 AM', isMine: false },
    { id: '2', senderId: 'me', text: 'Sure, what changes are you proposing?', time: '10:32 AM', isMine: true },
    { id: '3', senderId: '1', text: 'I think we should move the Physics exam to next week. Students need more prep time.', time: '10:33 AM', isMine: false },
    { id: '4', senderId: 'me', text: "That makes sense. Let me check the schedule and get back to you.", time: '10:35 AM', isMine: true },
    { id: '5', senderId: '1', text: 'The exam results are ready', time: '10:40 AM', isMine: false },
  ],
};

interface ChatPageProps {
  currentUserRole: string;
}

const ChatPage = ({ currentUserRole }: ChatPageProps) => {
  const contacts = allUsers.filter(u => u.lastMessage);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDirectory, setShowDirectory] = useState(false);
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryFilter, setDirectoryFilter] = useState<'all' | string>('all');

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDirectory = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(directorySearch.toLowerCase()) || u.role.toLowerCase().includes(directorySearch.toLowerCase());
    const matchRole = directoryFilter === 'all' || u.role.toLowerCase() === directoryFilter;
    return matchSearch && matchRole;
  });

  const handleSend = () => {
    if (!message.trim() || !selectedContact) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        text: 'Thanks for the message! I\'ll get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: false,
      }]);
    }, 2000);
  };

  const startConversation = (user: Contact) => {
    setSelectedContact(user);
    setMessages(messageHistory[user.id] || []);
    setShowDirectory(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border bg-card">
      {/* MOBILE: Chat list (hide when contact selected) + Chat panel (show when selected) */}
      {/* DESKTOP: Chat list (always left) + Chat panel (always right - Facebook web style) */}
      
      {/* Mobile-only chat list (hide on desktop via md:hidden) */}
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
            {filteredContacts.map(contact => (
              <button key={contact.id} onClick={() => { setSelectedContact(contact); setMessages(messageHistory[contact.id] || []); }} className="flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-secondary/50">
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

      {/* Desktop: Chat list always visible on LEFT (Facebook style) */}
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
          {filteredContacts.map(contact => (
            <button key={contact.id} onClick={() => { setSelectedContact(contact); setMessages(messageHistory[contact.id] || []); }} className={`flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors ${selectedContact?.id === contact.id ? 'bg-primary/5' : 'hover:bg-secondary/50'}`}>
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

      {/* Chat Panel - Mobile: Full screen when selected, Desktop: Always visible on RIGHT (Facebook style) */}
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
                  {selectedContact.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-success text-success stroke-card" strokeWidth={3} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedContact.online ? 'Online' : 'Offline'} · {selectedContact.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Phone className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Video className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.isMine ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-secondary-foreground rounded-bl-md'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`mt-1 text-[10px] ${msg.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Paperclip className="h-5 w-5" /></button>
                <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="h-10 flex-1 rounded-lg border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Smile className="h-5 w-5" /></button>
                <button onClick={handleSend} disabled={!message.trim()} className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      {/* User Directory Modal */}
      <Modal open={showDirectory} onClose={() => setShowDirectory(false)} title="User Directory" description="Find and start a conversation with any user" size="lg">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={directorySearch} onChange={e => setDirectorySearch(e.target.value)} placeholder="Search by name or role..." className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            </div>
            <select value={directoryFilter} onChange={e => setDirectoryFilter(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
              <option value="all">All Roles</option>
              <option value="teacher">Teachers</option>
              <option value="student">Students</option>
              <option value="parent">Parents</option>
            </select>
          </div>
          <div className="divide-y divide-border rounded-lg border border-border max-h-96 overflow-y-auto">
            {filteredDirectory.map(user => (
              <button key={user.id} onClick={() => startConversation(user)} className="flex w-full items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{user.name.charAt(0)}</div>
                    {user.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-success text-success stroke-card" strokeWidth={3} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
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
