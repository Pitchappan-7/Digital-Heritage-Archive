import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatbotRole, GeminiChatModel } from '../types';
import { Icon } from './Icon';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRecord?: (accessionId: string) => void;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        'Greetings. I am the Chief Archival Historian of the Digital Heritage Archive. I am grounded in over 12,450 verified primary source manuscripts, constituent assembly proceedings, and historical correspondences. How may I assist your scholarly research today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
      roleTitle: 'Chief Archival Historian',
    },
  ]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState<ChatbotRole>('chief_historian');
  const [model, setModel] = useState<GeminiChatModel>('gemini-3.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roleMeta: Record<ChatbotRole, { name: string; icon: string; desc: string }> = {
    chief_historian: {
      name: 'Chief Archival Historian',
      icon: 'history_edu',
      desc: 'Expert in Dr. Ambedkar’s life, speeches, Mahad satyagraha, and colonial-era archives.',
    },
    constitutional_scholar: {
      name: 'Constitutional Scholar',
      icon: 'gavel',
      desc: 'Constituent Assembly debates, Fundamental Rights drafting, and legal jurisprudence.',
    },
    paleographic_archivist: {
      name: 'Paleographic Archivist',
      icon: 'verified',
      desc: 'Manuscript preservation, iron gall ink analysis, watermarks, and ISO-16363 standards.',
    },
    research_synthesis: {
      name: 'Research Synthesis Specialist',
      icon: 'hub',
      desc: 'Multi-document synthesis, verified Chicago/BibTeX citations, and ontology linking.',
    },
  };

  const modelMeta: Record<GeminiChatModel, { name: string; taskType: string; badge: string }> = {
    'gemini-3.1-pro-preview': {
      name: 'gemini-3.1-pro-preview',
      taskType: 'Complex Scholarly Reasoning',
      badge: 'Complex',
    },
    'gemini-3.5-flash': {
      name: 'gemini-3.5-flash',
      taskType: 'General Archival Tasks',
      badge: 'General',
    },
    'gemini-3.1-flash-lite': {
      name: 'gemini-3.1-flash-lite',
      taskType: 'Fast Response Tasks',
      badge: 'Fast',
    },
  };

  const suggestedInquiries = [
    "What were Dr. Ambedkar's economic arguments in his Columbia thesis?",
    'Trace the drafting history of Article 17 (Abolition of Untouchability).',
    'Explain the significance of the 1927 Mahad Chavdar Tale Satyagraha.',
    'Compare Ambedkar and John Dewey’s views on education and democracy.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          role,
          model,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to receive response from archival chatbot.');
      }

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || model,
        roleTitle: roleMeta[role].name,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Archival chatbot failed to respond.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl h-full bg-[#fff8f3] shadow-2xl flex flex-col border-l border-[#ede7e2] animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 bg-[#540414] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#721d28] border border-[#ffb3b5]/30 flex items-center justify-center">
              <Icon name={roleMeta[role].icon} size={20} className="text-[#ffddb3]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold leading-tight flex items-center gap-1.5">
                <span>Gemini Archival Intelligence</span>
              </h3>
              <p className="font-sans text-[11px] text-[#ffb3b5] leading-none mt-0.5">
                Role: {roleMeta[role].name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages(messages.slice(0, 1))}
              className="p-1.5 rounded hover:bg-[#721d28] text-white/80 hover:text-white transition-colors cursor-pointer text-xs"
              title="Reset conversation"
            >
              <Icon name="restart_alt" size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#721d28] text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        {/* Role & Model Controls Configuration Toolbar */}
        <div className="p-3 bg-[#f3ede7] border-b border-[#ede7e2] space-y-2 text-xs">
          {/* Role System Instruction Selector */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#554242] shrink-0 font-semibold">
              Chatbot Role:
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as ChatbotRole)}
              className="flex-1 bg-white border border-[#ede7e2] rounded px-2.5 py-1 text-xs text-[#1d1b18] font-sans focus:outline-none cursor-pointer"
            >
              {Object.entries(roleMeta).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector (Required Feature: gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite) */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#554242] shrink-0 font-semibold">
              Gemini Model:
            </span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as GeminiChatModel)}
              className="flex-1 bg-white border border-[#ede7e2] rounded px-2.5 py-1 text-xs text-[#1d1b18] font-mono focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.5-flash">
                gemini-3.5-flash (General Tasks • Balanced)
              </option>
              <option value="gemini-3.1-pro-preview">
                gemini-3.1-pro-preview (Complex Hermeneutics &amp; Deep Research)
              </option>
              <option value="gemini-3.1-flash-lite">
                gemini-3.1-flash-lite (Fast Queries • High Speed)
              </option>
            </select>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#fdc576] text-[#633f00] font-bold">
              {modelMeta[model].badge}
            </span>
          </div>
        </div>

        {/* Scrollable Message Thread (Required Feature) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[92%] ${
                  isUser ? 'ml-auto' : 'mr-auto'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-mono text-[#554242]">
                  <span>{isUser ? 'Researcher' : m.roleTitle || 'Archival Intelligence'}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                  {m.modelUsed && (
                    <span className="px-1.5 py-0.2 rounded bg-[#ede7e2] text-[10px] text-[#805610]">
                      {m.modelUsed}
                    </span>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#540414] text-white rounded-tr-none'
                      : 'bg-white text-[#1d1b18] border border-[#ede7e2] rounded-tl-none font-sans'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-2 text-xs text-[#554242] font-mono bg-white p-3 rounded-xl border border-[#ede7e2] w-fit shadow-xs">
              <span className="w-3.5 h-3.5 border-2 border-[#540414]/20 border-t-[#540414] rounded-full animate-spin"></span>
              <span>{roleMeta[role].name} analyzing repository with {model}...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-mono flex items-start gap-2">
              <Icon name="error" size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Starter Chips */}
        {messages.length <= 2 && (
          <div className="p-3 bg-[#f9f2ed] border-t border-[#ede7e2] space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#805610] font-semibold">
              Suggested Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedInquiries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-[#ede7e2] text-[#1d1b18] text-[11px] font-sans transition-colors cursor-pointer border border-[#ede7e2] text-left"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Console */}
        <div className="p-3 bg-[#f3ede7] border-t border-[#ede7e2]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${roleMeta[role].name} using ${model}...`}
              className="flex-1 py-2.5 px-3 rounded-lg bg-white border border-[#dbc0c0] font-sans text-xs text-[#1d1b18] focus:outline-none focus:border-[#540414] transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3.5 py-2.5 rounded-lg bg-[#540414] hover:bg-[#721d28] disabled:opacity-50 text-white font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
            >
              <Icon name="send" size={18} />
            </button>
          </form>
          <div className="flex items-center justify-between pt-1.5 px-1 font-mono text-[10px] text-[#554242]">
            <span>Multi-turn memory active</span>
            <span className="text-[#805610]">Role-conditioned responses</span>
          </div>
        </div>
      </div>
    </div>
  );
};
