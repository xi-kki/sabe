import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../lib/types';
import { processSourcingRequest, generateFollowUpResponse } from '../lib/agent';
import { SupplierList } from './SupplierList';
import { HumanEscalation } from './HumanEscalation';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 **Welcome to Sabe** — your supplier intelligence agent.\n\nTell me what you need to source, and I'll find vetted suppliers with pricing signals and risk flags.\n\n**Example:** \"I need 500kg of packaging film in Lagos\"",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Check if this is a follow-up
      const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant' && m.suppliers);
      
      if (lastAssistant?.suppliers && lastAssistant.suppliers.length > 0) {
        // Follow-up response
        const responseText = generateFollowUpResponse(input, lastAssistant.suppliers);
        
        if (responseText.toLowerCase().includes('escalating')) {
          setShowEscalation(true);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: responseText,
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: responseText,
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        // New sourcing request
        const { message, suppliers } = await processSourcingRequest(input, messages);
        
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: message,
            suppliers,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sabe</h1>
            <p className="text-xs text-gray-500">Supplier Intelligence Agent</p>
          </div>
          <div className="text-xs text-gray-400">
            Food-tech sourcing • Africa
          </div>
        </div>
      </header>
      
      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {/* Message content */}
                <div className="whitespace-pre-wrap text-sm">
                  {message.content.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </div>
                
                {/* Supplier cards */}
                {message.suppliers && message.suppliers.length > 0 && (
                  <div className="mt-4">
                    <SupplierList suppliers={message.suppliers} />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {/* Human Escalation Modal */}
      {showEscalation && (
        <HumanEscalation onClose={() => setShowEscalation(false)} />
      )}
      
      {/* Input */}
      <footer className="bg-white border-t px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your sourcing need..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Search
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400 text-center">
            Try: "I need 500kg of packaging film in Lagos" or "Find garri suppliers in West Africa"
          </p>
        </form>
      </footer>
    </div>
  );
}
