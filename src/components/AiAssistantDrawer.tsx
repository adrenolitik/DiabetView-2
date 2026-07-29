import React, { useState } from 'react';
import { PatientProfile, CounterfactualScenario } from '../types';
import { Sparkles, Send, Bot, User, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';
import { generateLocalAiResponse } from '../utils/aiAssistant';

interface AiAssistantDrawerProps {
  patient: PatientProfile;
  currentScenario?: CounterfactualScenario;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  patient,
  currentScenario,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Здравствуйте, ${patient.name}! Я ваш виртуальный ИИ-ассистент эндокринолог в система DiabetView 2.

Я помогу вам разобрать причинно-следственные модели вашей гликемии, найти минимальные изменения в рационе и движении (MVR) и ответить на любые вопросы по приверженности лечению.

Чем я могу помочь вам сегодня?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const QUICK_QUESTIONS = [
    'Объясни просто: почему 20 мин ходьбы после еды так сильно сглаживают пик сахара?',
    'Чем заменить макароны и быстрые углеводы на ужин без чувства голода?',
    'Какой мой главный рычаг (Leverage Point) для снижения HbA1c с ' + patient.hba1c + '% до 7.5%?',
    'Безопасно ли снижать углеводы при моем текущем приеме препаратов?',
  ];

  const handleSendQuestion = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputQuestion;
    if (!promptToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputQuestion('');
    setLoading(true);

    // This app runs fully client-side (static hosting on Netlify) — there is no
    // backend AI server and no external network calls are made. The response
    // below is generated locally using structured, rule-based logic so the
    // assistant works instantly, offline, and without any API keys.
    try {
      const analysisText = generateLocalAiResponse(patient, currentScenario, promptToSend);

      // Small artificial delay so the "thinking" indicator is visible and the
      // interaction feels natural, without making any real network request.
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 400));

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: analysisText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Не удалось сформировать ответ. Попробуйте сформулировать вопрос иначе.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col h-[720px] max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white flex items-center justify-between border-b border-indigo-900/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">ИИ-Консультант DiabetView 2</h3>
            <span className="text-[11px] text-indigo-300 font-medium">
              Локальный демо-режим | Контрфактический эндокринолог
            </span>
          </div>
        </div>

        <div className="text-xs bg-indigo-900/80 px-3 py-1.5 rounded-full border border-indigo-700 text-indigo-200 font-bold">
          Пациент: {patient.name} (HbA1c {patient.hba1c}%)
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-indigo-300 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[10px] text-right font-bold ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-600 font-bold p-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Формируется ответ...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-white border-t border-slate-100 overflow-x-auto">
        <div className="flex space-x-2 no-scrollbar">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuestion(q)}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Задайте вопрос по диабету, питанию или контрфактическим сценариям..."
            disabled={loading}
            className="flex-1 p-3.5 text-xs font-medium border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />

          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md shadow-indigo-200 transition-all disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1 font-medium">
          <ShieldAlert className="w-3 h-3 text-amber-500" />
          <span>
            Консультация ИИ носит информационно-образовательный характер и не заменяет очный визит к эндокринологу.
          </span>
        </p>
      </div>
    </div>
  );
};
