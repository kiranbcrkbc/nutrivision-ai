import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User as UserIcon, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { MedicalDisclaimer } from '../../components/common/MedicalDisclaimer';

interface ChatMessage {
  id: number;
  sender: 'BOT' | 'USER';
  text: string;
  time: string;
}

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'BOT',
      text: 'Hello! I am your NutriVision AI Assistant. I can help explain vitamin deficiencies, clarify nutrition terms, or give dietary guidance. Please remember that I provide educational information only, not medical diagnoses.',
      time: '07:15 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'USER',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Safe simulated educational response
    setTimeout(() => {
      const botReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'BOT',
        text: 'Iron deficiency occurs when the body lacks sufficient iron to produce hemoglobin. Common non-heme dietary sources include spinach, lentils, pumpkin seeds, and fortified cereals. Pairing them with Vitamin C (like lemon juice) greatly enhances absorption. Always consult a physician for clinical confirmation.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
      <PageHeader
        title="AI Nutrition Assistant"
        subtitle="Ask questions about symptoms, vitamin functions, and dietary food sources."
      />

      <MedicalDisclaimer variant="compact" />

      {/* Chat Messages Panel */}
      <Card variant="default" className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${
                m.sender === 'USER' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  m.sender === 'USER'
                    ? 'bg-health-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-health-600 dark:text-health-400'
                }`}
              >
                {m.sender === 'USER' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'USER'
                    ? 'bg-health-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`block text-[10px] mt-1 ${
                    m.sender === 'USER' ? 'text-health-100 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Ask about vitamins, iron absorption, or symptoms..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-health-500 text-slate-900 dark:text-slate-100"
          />
          <Button type="submit" variant="primary" size="md">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
