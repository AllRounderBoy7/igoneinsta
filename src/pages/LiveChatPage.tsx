import { useState } from 'react';
import { Send, Search, Circle, Paperclip, Smile, MoreVertical, Tag, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  time: string;
}

interface ChatConversation {
  id: string;
  username: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

const demoChats: ChatConversation[] = [
  { id: '1', username: 'sarah_designs', name: 'Sarah Johnson', lastMessage: 'Hey, I want to know about pricing!', time: '2m ago', unread: 3, isOnline: true, messages: [
    { id: '1', text: 'Hey! I saw your post about the new collection 😍', sender: 'user', time: '10:30 AM' },
    { id: '2', text: 'Hi Sarah! Thanks for reaching out! 🎉 Welcome to our page!', sender: 'bot', time: '10:30 AM' },
    { id: '3', text: 'I want to know about pricing!', sender: 'user', time: '10:32 AM' },
  ]},
  { id: '2', username: 'mike_photo', name: 'Mike Chen', lastMessage: 'Thanks for the info!', time: '15m ago', unread: 0, isOnline: true, messages: [
    { id: '1', text: 'INFO', sender: 'user', time: '9:00 AM' },
    { id: '2', text: 'Thanks for your interest! Here are the details...', sender: 'bot', time: '9:00 AM' },
    { id: '3', text: 'Thanks for the info!', sender: 'user', time: '9:05 AM' },
  ]},
  { id: '3', username: 'emma.style', name: 'Emma Wilson', lastMessage: 'Can I get a discount?', time: '1h ago', unread: 1, isOnline: false, messages: [
    { id: '1', text: 'Hi! Do you ship internationally?', sender: 'user', time: '8:00 AM' },
    { id: '2', text: 'Yes! We ship worldwide 🌍 Free shipping on orders over $50!', sender: 'bot', time: '8:00 AM' },
    { id: '3', text: 'Can I get a discount?', sender: 'user', time: '8:15 AM' },
  ]},
  { id: '4', username: 'alex_fitness', name: 'Alex Rivera', lastMessage: 'Just placed my order! 🎉', time: '3h ago', unread: 0, isOnline: false, messages: [
    { id: '1', text: 'SHOP', sender: 'user', time: '6:00 AM' },
    { id: '2', text: 'Welcome to our shop! What are you looking for?', sender: 'bot', time: '6:00 AM' },
    { id: '3', text: 'Running shoes', sender: 'user', time: '6:02 AM' },
    { id: '4', text: 'Just placed my order! 🎉', sender: 'user', time: '6:30 AM' },
  ]},
];

export function LiveChatPage() {
  const [chats] = useState(demoChats);
  const [activeChat, setActiveChat] = useState<string>(demoChats[0].id);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(
    Object.fromEntries(demoChats.map(c => [c.id, c.messages]))
  );

  const currentChat = chats.find(c => c.id === activeChat);
  const currentMessages = chatMessages[activeChat] || [];

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = { id: Date.now().toString(), text: message, sender: 'agent', time: 'Just now' };
    setChatMessages({ ...chatMessages, [activeChat]: [...currentMessages, newMsg] });
    setMessage('');
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-[calc(100vh-120px)] flex rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3">Live Chat</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${activeChat === chat.id ? 'bg-purple-50 border-l-2 border-l-purple-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">{chat.name[0]}</div>
                  {chat.isOnline && <Circle size={10} className="absolute bottom-0 right-0 text-green-500 fill-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{chat.name}</p>
                    <span className="text-[10px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] flex items-center justify-center font-bold">{chat.unread}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {currentChat && (
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">{currentChat.name[0]}</div>
              <div>
                <p className="font-semibold text-gray-900">{currentChat.name}</p>
                <p className="text-xs text-gray-500">@{currentChat.username} {currentChat.isOnline && <span className="text-green-500">● online</span>}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500"><Tag size={16} /></button>
              <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500"><User size={16} /></button>
              <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500"><MoreVertical size={16} /></button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {currentMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                msg.sender === 'user' ? 'bg-gray-100 text-gray-900 rounded-bl-md' :
                msg.sender === 'bot' ? 'bg-purple-100 text-purple-900 rounded-br-md' :
                'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
              }`}>
                <div className="flex items-center gap-1 mb-1">
                  {msg.sender === 'bot' && <Bot size={10} className="text-purple-600" />}
                  <span className="text-[10px] opacity-70">{msg.sender === 'user' ? currentChat?.name : msg.sender === 'bot' ? 'Bot' : 'You'} · {msg.time}</span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <Paperclip size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <Smile size={18} />
            </button>
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button onClick={handleSend} className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
