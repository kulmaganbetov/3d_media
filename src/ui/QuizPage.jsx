import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from './PageLayout';

const QUESTIONS = [
  { q: 'Күн жүйесіндегі ең үлкен планета қайсы?', options: ['Сатурн', 'Юпитер', 'Нептун', 'Уран'], answer: 1 },
  { q: 'Ғарышқа ұшқан алғашқы адам кім?', options: ['Нил Армстронг', 'Алексей Леонов', 'Юрий Гагарин', 'Джон Гленн'], answer: 2 },
  { q: 'Қайсы планетаның сақинасы бар?', options: ['Юпитер', 'Марс', 'Сатурн', 'Венера'], answer: 2 },
  { q: 'Жерге ең жақын жұлдыз қайсы?', options: ['Сириус', 'Вега', 'Проксима Центавр', 'Бетелгейзе'], answer: 2 },
  { q: 'Айға аяқ басқан алғашқы адам кім?', options: ['Базз Олдрин', 'Нил Армстронг', 'Юрий Гагарин', 'Алан Шепард'], answer: 1 },
  { q: 'Күн жүйесіндегі ең ыстық планета?', options: ['Меркурий', 'Марс', 'Юпитер', 'Венера'], answer: 3 },
  { q: 'Ең жарық жұлдыз қайсы? (түнгі аспанда)', options: ['Полярлық жұлдыз', 'Сириус', 'Вега', 'Ригель'], answer: 1 },
  { q: 'Алғашқы қазақ ғарышкер кім?', options: ['Айдын Айымбетов', 'Тоқтар Аубакиров', 'Талғат Мұсабаев', 'Нұрсұлтан Назарбаев'], answer: 1 },
  { q: 'Қара тесіктің суретін алғаш рет қай жылы түсірді?', options: ['2015', '2019', '2021', '2017'], answer: 1 },
  { q: 'Марстағы ең биік тау қалай аталады?', options: ['Эверест', 'Олимп тауы', 'Максвелл тауы', 'Гималай тауы'], answer: 1 },
  { q: 'Күн негізінен неден тұрады?', options: ['Гелий', 'Оттегі', 'Сутегі', 'Азот'], answer: 2 },
  { q: 'Жарықтың жылдамдығы шамамен қанша?', options: ['150,000 км/с', '300,000 км/с', '500,000 км/с', '1,000,000 км/с'], answer: 1 },
  { q: 'Қайсы серік мұз астында мұхитқа ие?', options: ['Ай', 'Фобос', 'Европа', 'Деймос'], answer: 2 },
  { q: 'Ғалам қанша жаста (шамамен)?', options: ['4.6 млрд жыл', '10 млрд жыл', '13.8 млрд жыл', '20 млрд жыл'], answer: 2 },
  { q: 'ХҒС (МКС) қай жылы құрыла бастады?', options: ['1990', '1995', '1998', '2001'], answer: 2 },
  { q: 'Күн жүйесінен шыққан алғашқы аппарат?', options: ['Pioneer 10', 'Вояджер 1', 'New Horizons', 'Кассини'], answer: 1 },
  { q: 'Қайсы планета бүйірімен жатып айналады?', options: ['Нептун', 'Юпитер', 'Уран', 'Сатурн'], answer: 2 },
  { q: 'Ең көп серігі бар планета?', options: ['Юпитер', 'Уран', 'Сатурн', 'Нептун'], answer: 2 },
  { q: 'Джеймс Уэбб телескопы қай жылы ұшырылды?', options: ['2019', '2020', '2021', '2022'], answer: 2 },
  { q: 'Плутон қазір не деп саналады?', options: ['Планета', 'Жұлдыз', 'Ергежейлі планета', 'Астероид'], answer: 2 },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const [state, setState] = useState('start'); // start, playing, result
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const startQuiz = useCallback(() => {
    setQuestions(shuffleArray(QUESTIONS).slice(0, 10));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    setStreak(0);
    setBestStreak(0);
    setState('playing');
  }, []);

  const selectAnswer = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    const correct = idx === questions[current].answer;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setState('result');
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  const getGrade = () => {
    if (score >= 9) return { text: 'Ғарыш ғалымы!', emoji: '', color: 'text-yellow-400' };
    if (score >= 7) return { text: 'Ғарыш зерттеушісі!', emoji: '', color: 'text-cyan-400' };
    if (score >= 5) return { text: 'Ғарыш әуесқойы', emoji: '', color: 'text-blue-400' };
    if (score >= 3) return { text: 'Ғарыш жаңабастаушы', emoji: '', color: 'text-emerald-400' };
    return { text: 'Ғарышты тану керек!', emoji: '', color: 'text-gray-400' };
  };

  return (
    <PageLayout title="ҒАРЫШ ВИКТОРИНАСЫ" subtitle="Білімді тексер!" gradient="from-amber-400 to-orange-500">
      <AnimatePresence mode="wait">
        {state === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg mx-auto text-center py-16"
          >
            <div className="text-7xl mb-6">
              <span className="inline-block animate-bounce">?</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Ғарыш туралы қаншалықты білесіз?</h3>
            <p className="text-gray-400 mb-8">
              20 сұрақтан кездейсоқ 10-ы таңдалады. Дұрыс жауаптар санын жинаңыз!
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-2xl font-bold text-accent">10</div>
                <div className="text-xs text-gray-400">сұрақ</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-2xl font-bold text-amber-400">20</div>
                <div className="text-xs text-gray-400">деректер базасы</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-2xl font-bold text-emerald-400">4</div>
                <div className="text-xs text-gray-400">нұсқа</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startQuiz}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-shadow"
            >
              Бастау
            </motion.button>
          </motion.div>
        )}

        {state === 'playing' && questions.length > 0 && (
          <motion.div
            key={`q-${current}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl mx-auto py-8"
          >
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-400">
                Сұрақ <span className="text-accent font-bold">{current + 1}</span> / {questions.length}
              </span>
              <div className="flex items-center gap-3">
                {streak > 1 && (
                  <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
                    {streak}x combo!
                  </span>
                )}
                <span className="text-sm font-mono text-accent">{score} / {questions.length}</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Question */}
            <h3 className="text-xl sm:text-2xl font-bold mb-8 text-center leading-relaxed">
              {questions[current].q}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {questions[current].options.map((opt, idx) => {
                let cls = 'bg-white/5 border-white/10 hover:border-accent/30 hover:bg-white/10';
                if (showAnswer) {
                  if (idx === questions[current].answer) {
                    cls = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300';
                  } else if (idx === selected && idx !== questions[current].answer) {
                    cls = 'bg-red-500/15 border-red-500/50 text-red-300';
                  } else {
                    cls = 'bg-white/[0.02] border-white/5 opacity-50';
                  }
                }
                return (
                  <motion.button
                    key={idx}
                    whileHover={!showAnswer ? { scale: 1.02 } : {}}
                    whileTap={!showAnswer ? { scale: 0.98 } : {}}
                    onClick={() => selectAnswer(idx)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${cls}`}
                  >
                    <span className="text-xs text-gray-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Next button */}
            {showAnswer && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className={`text-sm mb-4 ${selected === questions[current].answer ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selected === questions[current].answer ? 'Дұрыс!' : `Қате! Дұрыс жауап: ${questions[current].options[questions[current].answer]}`}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextQuestion}
                  className="px-6 py-2.5 bg-accent/20 text-accent rounded-xl hover:bg-accent/30 transition-colors font-medium"
                >
                  {current + 1 >= questions.length ? 'Нәтижені көру' : 'Келесі сұрақ'}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            {(() => {
              const grade = getGrade();
              return (
                <>
                  <motion.div
                    className="text-6xl mb-4"
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    {grade.emoji}
                  </motion.div>
                  <h3 className={`text-3xl font-bold mb-2 ${grade.color}`}>{grade.text}</h3>
                  <div className="text-5xl font-bold text-white my-6">
                    <span className="text-accent">{score}</span>
                    <span className="text-gray-500 text-3xl"> / {questions.length}</span>
                  </div>

                  {/* Score circle */}
                  <div className="relative w-40 h-40 mx-auto mb-8">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <motion.circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(score / questions.length) * 327} 327`}
                        initial={{ strokeDasharray: '0 327' }}
                        animate={{ strokeDasharray: `${(score / questions.length) * 327} 327` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{Math.round((score / questions.length) * 100)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="text-lg font-bold text-accent">{score}</div>
                      <div className="text-xs text-gray-400">дұрыс жауап</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="text-lg font-bold text-amber-400">{bestStreak}</div>
                      <div className="text-xs text-gray-400">ең ұзақ combo</div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startQuiz}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl text-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-shadow"
                  >
                    Қайта бастау
                  </motion.button>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
