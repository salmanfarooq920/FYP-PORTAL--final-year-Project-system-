import { useState, useEffect, useRef } from 'react';
import * as chatApi from '../../api/chat';
import { DUMMY_CONVERSATIONS, DUMMY_MESSAGES } from '../../utils/constants';

const ENHANCED_CONVERSATIONS = [
  { id: 1, name: 'Team Alpha', avatar: 'TA', lastMessage: 'We have submitted the milestone', time: '2 min ago', unread: 3, online: true },
  { id: 2, name: 'Team Beta', avatar: 'TB', lastMessage: 'Can you review our proposal?', time: '15 min ago', unread: 1, online: true },
  { id: 3, name: 'Team Gamma', avatar: 'TG', lastMessage: 'Thank you for the feedback!', time: '1 hour ago', unread: 0, online: false },
  { id: 4, name: 'Team Delta', avatar: 'TD', lastMessage: 'Meeting scheduled for tomorrow', time: '3 hours ago', unread: 0, online: false },
  { id: 5, name: 'Team Epsilon', avatar: 'TE', lastMessage: 'Need clarification on requirements', time: '5 hours ago', unread: 2, online: true },
];

const ENHANCED_MESSAGES = [
  { id: 1, body: 'Hi Dr. Smith, we have completed the milestone submission', sender: 'them', time: '10:30 AM' },
  { id: 2, body: 'Great! I will review it shortly', sender: 'me', time: '10:32 AM' },
  { id: 3, body: 'Thank you! Looking forward to your feedback', sender: 'them', time: '10:33 AM' },
  { id: 4, body: 'The documentation looks comprehensive. Good work!', sender: 'me', time: '10:45 AM' },
];

export default function MentorChat() {
  const [conversations, setConversations] = useState(ENHANCED_CONVERSATIONS);
  const [selected, setSelected] = useState(ENHANCED_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(ENHANCED_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    chatApi.getConversations()
      .then((r) => { setConversations(r.data || ENHANCED_CONVERSATIONS); setLoading(false); })
      .catch(() => { setConversations(ENHANCED_CONVERSATIONS); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!selected) { setMessages([]); return; }
    chatApi.getMessages(selected.id)
      .then((r) => setMessages(r.data || ENHANCED_MESSAGES))
      .catch(() => setMessages(ENHANCED_MESSAGES));
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !selected) return;
    try {
      await chatApi.sendMessage(selected.id, input);
      setMessages((m) => [...m, { id: Date.now(), body: input, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setInput('');
    } catch (_) {
      setMessages((m) => [...m, { id: Date.now(), body: input, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setInput('');
    }
  };

  const filteredConversations = conversations.filter(c => {
    const name = c.name || c.participants?.[0]?.name || 'Unknown';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D99C00', borderTopColor: 'transparent' }}></div>
          <span className="font-medium" style={{ color: '#0F172A' }}>Loading conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#0F172A' }}>Chat with Students</h1>
        <p className="text-sm" style={{ color: '#64748B' }}>Real-time messaging with your supervised teams</p>
      </div>

      {/* Chat Container */}
      <div className="flex rounded-3xl overflow-hidden shadow-2xl" style={{ height: 'calc(100vh - 16rem)', background: '#FFFFFF' }}>
        {/* Sidebar - Conversations List */}
        <div className="w-80 flex flex-col" style={{ backgroundColor: '#F8FAFC', borderRight: '1px solid #E2E8F0' }}>
          {/* Search */}
          <div className="p-4 border-b" style={{ borderColor: '#E2E8F0' }}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A' }}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredConversations.map((conv) => {
              const name = conv.name || conv.participants?.[0]?.name || 'Unknown';
              const avatar = conv.avatar || name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              const time = conv.time || (conv.lastAt ? new Date(conv.lastAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
              const lastMessage = conv.lastMessage || 'No messages';
              const isOnline = conv.online || false;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className="w-full p-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-left"
                  style={{ 
                    backgroundColor: selected?.id === conv.id ? '#0F172A' : 'transparent',
                    boxShadow: selected?.id === conv.id ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none'
                  }}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ 
                        background: selected?.id === conv.id 
                          ? 'linear-gradient(135deg, #D99C00 0%, #F4B400 100%)'
                          : 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
                        color: selected?.id === conv.id ? '#0F172A' : '#64748B'
                      }}
                    >
                      {avatar}
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-sm truncate" style={{ color: selected?.id === conv.id ? '#FFFFFF' : '#0F172A' }}>{name}</h3>
                      <span className="text-xs flex-shrink-0" style={{ color: selected?.id === conv.id ? 'rgba(255,255,255,0.7)' : '#94A3B8' }}>{time}</span>
                    </div>
                    <p className="text-xs truncate" style={{ color: selected?.id === conv.id ? 'rgba(255,255,255,0.7)' : '#64748B' }}>{lastMessage}</p>
                  </div>

                  {/* Unread Badge */}
                  {conv.unread > 0 && (
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: selected?.id === conv.id ? '#D99C00' : '#0F172A', color: selected?.id === conv.id ? '#0F172A' : '#FFFFFF' }}
                    >
                      {conv.unread}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
          {selected ? (
            <>
              {/* Chat Header */}
              <div 
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF' }}
                  >
                    {selected.avatar || (selected.name || selected.participants?.[0]?.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: '#0F172A' }}>{selected.name || selected.participants?.[0]?.name || 'Unknown'}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      <span className="text-xs" style={{ color: '#64748B' }}>Active now</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg transition-all duration-200 hover:bg-slate-100">
                    <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg transition-all duration-200 hover:bg-slate-100">
                    <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg transition-all duration-200 hover:bg-slate-100">
                    <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: '#F8FAFC' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender !== 'me' && (
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)', color: '#64748B' }}
                      >
                        {selected.avatar || (selected.name || selected.participants?.[0]?.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className={`max-w-sm ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                      <div 
                        className="px-4 py-2.5 rounded-2xl shadow-sm"
                        style={{ 
                          background: msg.sender === 'me' ? '#0F172A' : '#FFFFFF',
                          color: msg.sender === 'me' ? '#FFFFFF' : '#0F172A',
                          border: msg.sender !== 'me' ? '1px solid #E2E8F0' : 'none',
                          borderRadius: msg.sender === 'me' ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                        }}
                      >
                        <p className="text-sm">{msg.body}</p>
                      </div>
                      <span className="text-xs mt-1 block" style={{ color: '#94A3B8' }}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div 
                className="px-6 py-4 border-t"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
              >
                <div className="flex items-center gap-3">
                  <button className="p-2.5 rounded-xl transition-all duration-200 hover:bg-slate-100">
                    <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <div className="flex-1 relative">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && send()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none pr-10"
                      style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 hover:bg-slate-200">
                      <svg className="w-4 h-4" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <button 
                    onClick={send}
                    disabled={!input.trim()}
                    className="p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                    style={{ 
                      background: input.trim() ? '#0F172A' : '#E2E8F0',
                      color: input.trim() ? '#FFFFFF' : '#64748B'
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
              <div className="text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)' }}
                >
                  <svg className="w-10 h-10" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#0F172A' }}>Select a conversation</h3>
                <p className="text-sm" style={{ color: '#64748B' }}>Choose a team to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
