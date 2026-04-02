import { useState, useEffect, useRef } from 'react';
import * as chatApi from '../../api/chat';
import { DUMMY_CONVERSATIONS, DUMMY_MESSAGES, DUMMY_GROUP_CHATS } from '../../utils/constants';

const DUMMY_USERS = [
  { id: 'u1', name: 'Dr. Sarah Johnson', role: 'supervisor', department: 'Computer Science' },
  { id: 'u2', name: 'Ahmed Khan', role: 'student', department: 'Software Engineering' },
  { id: 'u3', name: 'Fatima Ali', role: 'student', department: 'Data Science' },
  { id: 'u4', name: 'Prof. Michael Chen', role: 'supervisor', department: 'AI Research' },
  { id: 'u5', name: 'Zara Rashid', role: 'student', department: 'Cybersecurity' },
];

export default function StudentChat() {
  const [chatMode, setChatMode] = useState('direct');
  const [conversations, setConversations] = useState(DUMMY_CONVERSATIONS);
  const [groupChats] = useState(DUMMY_GROUP_CHATS);
  const [selected, setSelected] = useState(DUMMY_CONVERSATIONS[0]);
  const [selectedGroup, setSelectedGroup] = useState(DUMMY_GROUP_CHATS[0]);
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [attachedFile, setAttachedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConvModal, setShowNewConvModal] = useState(false);
  const [newConvSearch, setNewConvSearch] = useState('');
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    chatApi.getConversations()
      .then((r) => { 
        const convs = r?.data?.length > 0 ? r.data : DUMMY_CONVERSATIONS;
        setConversations(convs);
        setSelected(convs[0]);
      })
      .catch(() => { 
        setConversations(DUMMY_CONVERSATIONS);
        setSelected(DUMMY_CONVERSATIONS[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (chatMode === 'group' && selectedGroup) {
      setMessages(DUMMY_MESSAGES);
      return;
    }
    if (!selected) { setMessages([]); return; }
    chatApi.getMessages(selected.id)
      .then((r) => setMessages(r?.data?.length > 0 ? r.data : DUMMY_MESSAGES))
      .catch(() => setMessages(DUMMY_MESSAGES));
  }, [selected, chatMode, selectedGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const newMessage = { 
      id: 'msg' + Date.now(), 
      body: input, 
      sender: 'Me', 
      createdAt: new Date().toISOString() 
    };
    setMessages((m) => [...m, newMessage]);
    setInput('');
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleStartConversation = (user) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.participants?.[0]?.name === user.name);
    
    if (existingConv) {
      setSelected(existingConv);
      setChatMode('direct');
      setToast({ message: `Switched to conversation with ${user.name}` });
    } else {
      // Create new conversation
      const newConv = {
        id: 'conv' + Date.now(),
        participants: [{ id: user.id, name: user.name }],
        lastMessage: 'No messages yet',
        lastAt: new Date().toISOString(),
        unread: 0,
      };
      setConversations(prev => [newConv, ...prev]);
      setSelected(newConv);
      setChatMode('direct');
      setToast({ message: `Started conversation with ${user.name}` });
    }
    
    setShowNewConvModal(false);
    setNewConvSearch('');
    setTimeout(() => setToast(null), 3000);
  };

  const filterList = (list) => {
    if (!searchQuery) return list;
    return list.filter(c => {
      const name = chatMode === 'direct' ? c.participants?.[0]?.name : c.name;
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex items-center gap-3 text-[#1F2E5A]">
        <div className="w-5 h-5 border-2 border-[#1F2E5A]/20 border-t-[#F4B400] rounded-full animate-spin"></div>
        Loading conversations...
      </div>
    </div>
  );

  const list = chatMode === 'direct' ? conversations : groupChats;
  const filteredList = filterList(list);
  const isGroup = chatMode === 'group';
  const activeSelected = isGroup ? selectedGroup : selected;

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-[#1F2E5A]">Messages</h1>
              <p className="text-xs text-[#1F2E5A]/60">{conversations.length + groupChats.length} conversations</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..." 
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-0 text-sm focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-3 py-3 border-b border-[#E2E8F0]">
          <div className="flex gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <button 
              type="button" 
              onClick={() => setChatMode('direct')} 
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${chatMode === 'direct' ? 'bg-[#1F2E5A] text-white shadow-sm' : 'text-[#1F2E5A]/70 hover:text-[#1F2E5A]'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Direct
            </button>
            <button 
              type="button" 
              onClick={() => setChatMode('group')} 
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${chatMode === 'group' ? 'bg-[#1F2E5A] text-white shadow-sm' : 'text-[#1F2E5A]/70 hover:text-[#1F2E5A]'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Groups
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredList.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#1F2E5A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-[#1F2E5A]/60">No conversations found</p>
            </div>
          ) : (
            filteredList.map((c) => {
              const isActive = isGroup ? selectedGroup?.id === c.id : selected?.id === c.id;
              const name = isGroup ? c.name : c.participants?.[0]?.name;
              const avatar = getInitials(name);
              
              return (
                <button
                  key={c.id}
                  onClick={() => isGroup ? setSelectedGroup(c) : setSelected(c)}
                  className={`w-full text-left p-4 transition flex items-center gap-3 hover:bg-[#F8FAFC] ${isActive ? 'bg-[#F4B400]/10 border-r-4 border-[#F4B400]' : ''}`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold ${
                      isActive ? 'bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B]' : 'bg-gradient-to-br from-[#94A3B8] to-[#64748B]'
                    }`}>
                      {avatar}
                    </div>
                    {c.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F4B400] rounded-full text-white text-xs flex items-center justify-center font-medium ring-2 ring-white">
                        {c.unread}
                      </span>
                    )}
                    {!isGroup && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#F4B400] rounded-full ring-2 ring-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`font-semibold truncate ${isActive ? 'text-[#1F2E5A]' : 'text-[#1F2E5A]/80'}`}>{name}</p>
                      <span className="text-xs text-[#1F2E5A]/40">{formatTime(c.lastAt)}</span>
                    </div>
                    <p className={`text-sm truncate ${c.unread > 0 ? 'text-[#1F2E5A] font-medium' : 'text-[#1F2E5A]/60'}`}>
                      {c.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-[#E2E8F0]">
          <button 
            onClick={() => setShowNewConvModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F4B400] text-white font-medium hover:bg-[#E6A700] transition shadow-lg shadow-[#F4B400]/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Conversation
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC]">
        {activeSelected ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(isGroup ? selectedGroup?.name : selected.participants?.[0]?.name)}
                  </div>
                  {!isGroup && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#F4B400] rounded-full ring-2 ring-white"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2E5A] text-lg">
                    {isGroup ? selectedGroup?.name : selected.participants?.[0]?.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F4B400] animate-pulse"></span>
                    <p className="text-sm text-[#F4B400] font-medium">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-[#F8FAFC] rounded-xl transition text-[#1F2E5A]/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2.5 hover:bg-[#F8FAFC] rounded-xl transition text-[#1F2E5A]/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2.5 hover:bg-[#F8FAFC] rounded-xl transition text-[#1F2E5A]/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {messages.map((msg, index) => {
                const isMe = msg.sender === 'Me';
                const showAvatar = !isMe && (index === 0 || messages[index - 1].sender !== msg.sender);
                
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[75%] ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && (
                        <div className="flex-shrink-0">
                          {showAvatar ? (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#94A3B8] to-[#64748B] flex items-center justify-center text-white text-sm font-bold">
                              {getInitials(msg.sender)}
                            </div>
                          ) : <div className="w-9" />}
                        </div>
                      )}
                      <div className={`px-5 py-3 rounded-2xl ${
                        isMe 
                          ? 'bg-gradient-to-r from-[#1F2E5A] to-[#2E3A6B] text-white rounded-tr-sm' 
                          : 'bg-white text-[#1F2E5A] shadow-sm border border-[#E2E8F0] rounded-tl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 bg-white border-t border-[#E2E8F0]">
              {attachedFile && (
                <div className="mb-3 flex items-center gap-3 text-sm bg-[#F8FAFC] rounded-xl px-4 py-3 border border-[#E2E8F0]">
                  <svg className="w-5 h-5 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="truncate flex-1 text-[#1F2E5A] font-medium">{attachedFile.name}</span>
                  <button 
                    type="button" 
                    onClick={() => setAttachedFile(null)} 
                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="p-3 hover:bg-[#F8FAFC] rounded-xl transition cursor-pointer text-[#1F2E5A]/40 hover:text-[#F4B400]" title="Attach file">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <input type="file" className="hidden" onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} />
                </label>
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-3.5 pr-12 text-sm focus:ring-2 focus:ring-[#1F2E5A]/20 focus:border-[#1F2E5A] focus:bg-white transition"
                    placeholder="Type your message..."
                  />
                  <button 
                    type="button" 
                    onClick={send}
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#F4B400] text-white rounded-xl hover:bg-[#E6A700] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#1F2E5A]/40 mt-2 ml-14">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1F2E5A]/10 to-[#F4B400]/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-[#1F2E5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1F2E5A] mb-2">Select a conversation</h3>
              <p className="text-[#1F2E5A]/60">Choose someone from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-[#1F2E5A] text-white rounded-xl shadow-xl text-sm font-medium animate-slide-down">
          {toast.message}
        </div>
      )}

      {/* New Conversation Modal */}
      {showNewConvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowNewConvModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">New Conversation</h2>
                  <p className="text-sm text-slate-500">Select someone to start chatting</p>
                </div>
              </div>
              
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  value={newConvSearch}
                  onChange={(e) => setNewConvSearch(e.target.value)}
                  placeholder="Search users..." 
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-0 text-sm focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-medium text-[#1F2E5A]/40 uppercase tracking-wide mb-3 px-2">Available Users</p>
              <div className="space-y-1">
                {DUMMY_USERS.filter(u => u.name.toLowerCase().includes(newConvSearch.toLowerCase())).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleStartConversation(user)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition text-left"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold ${
                      user.role === 'supervisor' 
                        ? 'bg-gradient-to-br from-[#F4B400] to-[#E6A700]' 
                        : 'bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B]'
                    }`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1F2E5A]">{user.name}</p>
                      <p className="text-sm text-[#1F2E5A]/60">{user.department}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      user.role === 'supervisor' 
                        ? 'bg-[#F4B400]/10 text-[#B38600]' 
                        : 'bg-[#1F2E5A]/10 text-[#1F2E5A]'
                    }`}>
                      {user.role === 'supervisor' ? 'Supervisor' : 'Student'}
                    </span>
                  </button>
                ))}
                
                {DUMMY_USERS.filter(u => u.name.toLowerCase().includes(newConvSearch.toLowerCase())).length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-[#1F2E5A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#1F2E5A]/60">No users found</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={() => setShowNewConvModal(false)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
