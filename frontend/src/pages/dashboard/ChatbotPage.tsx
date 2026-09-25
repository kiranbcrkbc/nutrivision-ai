import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User as UserIcon,
  ShieldAlert,
  Sparkles,
  MapPin,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';
import { chatService, ChatMessageResponse } from '../../services/chatService';
import { showToast } from '../../services/toastStore';

interface Message {
  id: string;
  sender: 'BOT' | 'USER';
  text: string;
  time: string;
  suggestions?: string[];
  isEmergency?: boolean;
}

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'BOT',
      text: "Hello! I am your Vitamin Deficiency Assistant. I can help explain vitamin functions, decode visible symptoms (such as a sore tongue or spoon nails) into plain English, suggest everyday Indian food sources, or help you locate a nearby doctor in Bengaluru.\n\nPlease remember that I provide educational information only, not clinical diagnoses.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'What is Vitamin B12?',
        'What did my previous assessment show?',
        'Foods that contain iron',
        'I am vegetarian',
        'Find a doctor in Bengaluru',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText ?? inputText).trim();
    if (!textToSend || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response: ChatMessageResponse = await chatService.sendMessage(textToSend);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
        isEmergency: response.isEmergency,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'BOT',
        text: "I am having difficulty retrieving that information right now. Please try again or consult our nutrition guide and doctor directory.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['What is Vitamin B12?', 'Find a doctor in Bengaluru'],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'BOT',
        text: "Conversation reset. How can I help you with your nutritional questions or assessment results today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What is Vitamin B12?',
          'What did my previous assessment show?',
          'Foods that contain iron',
          'Why is my tongue sore?',
          'Find a doctor in Bengaluru',
        ],
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Nutrition questions"
          subtitle="A rule-based educational guide to vitamins, foods, terminology, and finding care. It cannot diagnose or interpret photos."
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-xs text-slate-500"
        >
          Reset Chat
        </Button>
      </div>

      <MedicalDisclaimer variant="compact" />

      {/* Chat Messages Panel */}
      <Card variant="default" className="flex-1 p-4 flex flex-col justify-between overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col gap-2 max-w-[88%] ${
                m.sender === 'USER' ? 'ml-auto items-end' : 'items-start'
              }`}
            >
              <div
                className={`flex gap-3 ${
                  m.sender === 'USER' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    m.sender === 'USER'
                      ? 'bg-health-600 text-white'
                      : m.isEmergency
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-health-600 dark:text-health-400'
                  }`}
                >
                  {m.sender === 'USER' ? (
                    <UserIcon className="w-4 h-4" />
                  ) : m.isEmergency ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    m.sender === 'USER'
                      ? 'bg-health-600 text-white rounded-tr-none'
                      : m.isEmergency
                      ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 rounded-tl-none font-medium'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[10px] mt-2 font-mono ${
                      m.sender === 'USER' ? 'text-health-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>

              {/* Follow-up suggestions */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-11 pt-1">
                  {m.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      disabled={isTyping}
                      className="text-[11px] bg-slate-50 dark:bg-slate-900 hover:bg-health-50 dark:hover:bg-health-950/50 text-health-700 dark:text-health-300 border border-slate-200 dark:border-slate-800 hover:border-health-400 px-3 py-1 rounded-full transition-colors font-medium select-none"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%] items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-health-600 dark:text-health-400 flex items-center justify-center text-xs font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-health-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-health-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-health-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask about Vitamin B12, iron foods, tongue soreness, doctor referrals..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-health-500 text-slate-900 dark:text-slate-100"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputText.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
