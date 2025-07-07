import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Plus, Moon, Sun, Upload, FileText, Image, ChevronLeft, ChevronRight, MessageSquare, Brain, BookOpen, HelpCircle, Target, Edit3, Lightbulb, Copy, ThumbsUp, RotateCcw, Zap } from 'lucide-react';

const GoalAIDashboard = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'goalai',
      content: "Hello! I'm your Goal AI Study Assistant. I'm here to help you with your academic questions, study plans, and any doubts you might have. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
      isTyping: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'OS Concepts Discussion', lastMessage: '2 hours ago', active: true },
    { id: 2, title: 'DSA Binary Trees', lastMessage: '1 day ago', active: false },
    { id: 3, title: 'React Hooks Explained', lastMessage: '2 days ago', active: false }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick prompt templates
  const quickPrompts = [
    {
      id: 'doubts',
      icon: <HelpCircle className="w-4 h-4" />,
      title: 'Ask Doubts',
      description: 'Get help with academic questions',
      prompt: 'I have a doubt about: '
    },
    {
      id: 'explain',
      icon: <BookOpen className="w-4 h-4" />,
      title: 'Explain Topic',
      description: 'Break down complex concepts',
      prompt: 'Please explain this topic in simple terms: '
    },
    {
      id: 'test-prep',
      icon: <Target className="w-4 h-4" />,
      title: 'Test Prep Help',
      description: 'Practice questions and tips',
      prompt: 'Help me prepare for my test on: '
    },
    {
      id: 'motivation',
      icon: <Lightbulb className="w-4 h-4" />,
      title: 'Motivation Quotes',
      description: 'Get inspired to study',
      prompt: 'Give me some motivational quotes for studying '
    },
    {
      id: 'study-plan',
      icon: <Brain className="w-4 h-4" />,
      title: 'Smart Study Plans',
      description: 'Create personalized schedules',
      prompt: 'Create a study plan for: '
    },
    {
      id: 'rephrase',
      icon: <Edit3 className="w-4 h-4" />,
      title: 'Rephrase Notes',
      description: 'Improve your notes',
      prompt: 'Please rephrase and improve these notes: '
    }
  ];

  // Prompt templates
  const promptTemplates = [
    'Summarize this concept',
    'Explain in simple terms',
    'Give me MCQs on this topic',
    'Compare with real-world analogy',
    'Provide step-by-step solution',
    'Give pros and cons',
    'Create a mind map structure'
  ];

  // Follow-up suggestions
  const followUpSuggestions = [
    'Ask a follow-up question',
    'Explain again with an example',
    'Rephrase it simpler',
    'Give a practical application',
    'Provide more details'
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing animation
  const typeMessage = (content) => {
    const newMessage = {
      id: Date.now(),
      type: 'ai',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      isTyping: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < content.length) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, content: content.slice(0, index + 1) }
              : msg
          )
        );
        index++;
      } else {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, isTyping: false }
              : msg
          )
        );
        setShowFollowUp(true);
        clearInterval(typeInterval);
      }
    }, 20);
  };

  // Simulate Ollama API call
  const sendToOllama = async (message) => {
    setIsLoading(true);
    setShowFollowUp(false);
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock AI responses based on keywords
      let response = "I understand you're asking about that topic. Let me help you with a comprehensive explanation...";
      
      if (message.toLowerCase().includes('operating system') || message.toLowerCase().includes('os')) {
        response = "An Operating System (OS) is system software that manages computer hardware and software resources. It acts as an intermediary between users and the computer hardware. Key functions include:\n\n1. **Process Management** - Managing running programs\n2. **Memory Management** - Allocating RAM to programs\n3. **File System** - Organizing and storing data\n4. **Device Management** - Controlling hardware devices\n\nCommon examples include Windows, macOS, Linux, and Android.";
      } else if (message.toLowerCase().includes('data structure') || message.toLowerCase().includes('dsa')) {
        response = "Data Structures are ways of organizing and storing data in computers so that it can be accessed and modified efficiently. Common types include:\n\n• **Arrays** - Sequential collection of elements\n• **Linked Lists** - Dynamic linear data structure\n• **Stacks** - LIFO (Last In, First Out) structure\n• **Queues** - FIFO (First In, First Out) structure\n• **Trees** - Hierarchical structure\n• **Graphs** - Network of connected nodes\n\nEach has different time and space complexities for various operations.";
      } else if (message.toLowerCase().includes('motivation') || message.toLowerCase().includes('quote')) {
        response = "Here are some motivational quotes to fuel your studies:\n\n💪 \"Success is not final, failure is not fatal: it is the courage to continue that counts.\" - Winston Churchill\n\n🎯 \"The expert in anything was once a beginner.\" - Helen Hayes\n\n🌟 \"Education is the most powerful weapon which you can use to change the world.\" - Nelson Mandela\n\n🚀 \"The only way to do great work is to love what you do.\" - Steve Jobs\n\nRemember: Every expert was once a beginner. Keep pushing forward!";
      } else if (message.toLowerCase().includes('study plan')) {
        response = "Here's a smart study plan framework:\n\n**📅 Daily Structure:**\n• 25-min focused study + 5-min break (Pomodoro)\n• 2-3 subjects per day max\n• Review previous day's notes for 10 mins\n\n**📚 Weekly Planning:**\n• Monday-Wednesday: New concepts\n• Thursday-Friday: Practice problems\n• Weekend: Review and mock tests\n\n**🎯 Monthly Goals:**\n• Week 1-2: Theory and understanding\n• Week 3: Application and practice\n• Week 4: Revision and testing\n\nAdjust based on your specific subjects and goals!";
      }
      
      typeMessage(response);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendToOllama(inputMessage);
      setInputMessage('');
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const handleTemplateSelect = (template) => {
    setInputMessage(template + ': ');
    setSelectedTemplate('');
    inputRef.current?.focus();
  };

  const handleFollowUp = (suggestion) => {
    setInputMessage(suggestion + ' about the previous topic: ');
    setShowFollowUp(false);
    inputRef.current?.focus();
  };

  const startNewChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: "Hello! I'm your Goal AI Study Assistant. Ready for a new conversation. What would you like to learn about today?",
        timestamp: new Date().toLocaleTimeString(),
        isTyping: false
      }
    ]);
    setShowFollowUp(false);
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-blue-600" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Goal AI Assistant</h2>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {sidebarOpen && (
          <>
            {/* New Chat Button */}
            <div className="p-4">
              <button
                onClick={startNewChat}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Prompts</h3>
              <div className="space-y-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-600">{prompt.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{prompt.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{prompt.description}</p>
                  </button>
                ))}
              </div>

              {/* Recent Conversations */}
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 mt-6">Recent Chats</h3>
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      conv.active ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm truncate">{conv.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{conv.lastMessage}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b border-gray-200 dark:border-gray-700 p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white">Goal AI Study Assistant</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="">Quick Templates</option>
                {promptTemplates.map((template, index) => (
                  <option key={index} value={template}>{template}</option>
                ))}
              </select>
              <button
                onClick={() => setShowUploadModal(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Upload Files"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                {/* Message Content */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.isTyping && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                  <div className="text-xs opacity-70 mt-2">{message.timestamp}</div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Follow-up Suggestions */}
        {showFollowUp && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400 py-2">Follow up:</span>
              {followUpSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleFollowUp(suggestion)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question or doubt here..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Files</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Drop files here or click to browse</p>
                <p className="text-sm text-gray-400 mt-1">Images, PDFs, Text files up to 10MB</p>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center">
                  <Image className="w-4 h-4" />
                  Image
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center">
                  <FileText className="w-4 h-4" />
                  Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalAIDashboard;