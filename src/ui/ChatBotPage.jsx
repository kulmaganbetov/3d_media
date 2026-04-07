import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from './PageLayout';

const SUGGESTIONS = [
  'Қара тесік дегеніміз не?',
  'Марста өмір бар ма?',
  'Ең үлкен жұлдыз қайсы?',
  'Ғарышта дыбыс бар ма?',
  'Жарық жылы дегеніміз не?',
  'Қазақстандық ғарышкерлер кім?',
];

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-accent/20 text-white rounded-br-sm border border-accent/20'
            : 'bg-white/[0.06] text-gray-200 rounded-bl-sm border border-white/10'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">AI</div>
            <span className="text-[10px] text-gray-500">Ғарыш AI</span>
          </div>
        )}
        <div className="whitespace-pre-wrap">{msg.content}</div>
      </div>
    </motion.div>
  );
}

export default function ChatBotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Сәлеметсіз бе! Мен ғарыш туралы AI көмекшімін. Ғарыш, планеталар, жұлдыздар, қара тесіктер — кез келген сұрақ қоя аласыз!\n\nТөмендегі сұрақтардан бастай аласыз немесе өзіңіздің сұрағыңызды жазыңыз.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', content: msg };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs
            .filter((m) => m.role !== 'system')
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Қателік орын алды: ${err.message}. API кілтін тексеріңіз немесе кейінірек қайталаңыз.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="AI КӨМЕКШІ" subtitle="Ғарыш туралы сұрақ қойыңыз" gradient="from-emerald-400 to-cyan-500">
      <div className="max-w-3xl mx-auto">
        {/* Chat container */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
          {/* Messages area */}
          <div className="h-[55vh] overflow-y-auto p-4 sm:p-6 space-y-1">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-3"
              >
                <div className="bg-white/[0.06] border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">AI</div>
                    <span className="text-[10px] text-gray-500">Ғарыш AI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-accent/50 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 sm:px-6 pb-3">
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-white/10 p-3 sm:p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ғарыш туралы сұрақ жазыңыз..."
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center hover:bg-accent/30 transition-colors disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          AI жауаптары ақпараттық мақсатта ғана. Нақты деректер үшін ғылыми дереккөздерді тексеріңіз.
        </p>
      </div>
    </PageLayout>
  );
}
