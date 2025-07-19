'use client';

import { useState, useEffect } from 'react';
import { Send, Search, Filter, MoreVertical, Reply, Archive, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    // Mock data for now - replace with API call
    const mockMessages: Message[] = [
      {
        id: '1',
        from: 'John Smith',
        to: 'Property Manager',
        subject: 'Check-in time question',
        preview: 'Hi, I was wondering if we could check in a bit earlier than the usual 3 PM time? We have a long drive and would appreciate the flexibility.',
        date: '2024-01-15 10:30',
        isRead: false,
        priority: 'high'
      },
      {
        id: '2',
        from: 'Sarah Johnson',
        to: 'Property Manager',
        subject: 'WiFi password needed',
        preview: 'Could you please provide the WiFi password for the Mountain Cabin? We arrived and can\'t connect to the internet.',
        date: '2024-01-15 09:15',
        isRead: true,
        priority: 'medium'
      },
      {
        id: '3',
        from: 'Mike Wilson',
        to: 'Property Manager',
        subject: 'Great stay!',
        preview: 'Thank you for the wonderful experience at the Beach House. Everything was perfect and we had an amazing time.',
        date: '2024-01-14 16:45',
        isRead: true,
        priority: 'low'
      },
      {
        id: '4',
        from: 'Emily Davis',
        to: 'Property Manager',
        subject: 'Maintenance issue',
        preview: 'There seems to be an issue with the hot water in the bathroom. It\'s not getting warm enough.',
        date: '2024-01-14 14:20',
        isRead: false,
        priority: 'high'
      }
    ];
    
    setMessages(mockMessages);
    setIsLoading(false);
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'all' || message.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Manage guest communications and inquiries</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <Send className="w-5 h-5" />
          <span>Send Message</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Inbox</h3>
            <p className="text-sm text-gray-600">{filteredMessages.length} messages</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                } ${!message.isRead ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.from}
                      </p>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-sm ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {message.subject}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{message.preview}</p>
                <p className="text-xs text-gray-500 mt-2">{message.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20">
          {selectedMessage ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>From: {selectedMessage.from}</span>
                    <span>To: {selectedMessage.to}</span>
                    <span>{selectedMessage.date}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority} Priority
                  </span>
                </div>
              </div>
              
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">{selectedMessage.preview}</p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2">
                  <Archive className="w-4 h-4" />
                  <span>Archive</span>
                </button>
                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
                <p className="text-gray-600">Choose a message from the list to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
} 