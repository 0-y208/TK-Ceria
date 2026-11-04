import { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';
import { StorageService } from '../../services/storageService';

interface AlphabetCard {
  letter: string;
  word: string;
  emoji: string;
  color: string;
  textColor: string;
  phonicSound: string;
}

const ALPHABET_DATA: AlphabetCard[] = [
  { letter: 'A', word: 'Apel', emoji: '🍎', color: 'bg-red-100 border-red-300 hover:bg-red-200', textColor: 'text-red-700', phonicSound: 'A seperti Apel segar yang manis' },
  { letter: 'B', word: 'Bebek', emoji: '🦆', color: 'bg-amber-100 border-amber-300 hover:bg-amber-200', textColor: 'text-amber-800', phonicSound: 'B seperti Bebek kwek kwek' },
  { letter: 'C', word: 'Ceri', emoji: '🍒', color: 'bg-rose-100 border-rose-300 hover:bg-rose-200', textColor: 'text-rose-700', phonicSound: 'C seperti Ceri merah ceria' },
  { letter: 'D', word: 'Domba', emoji: '🐑', color: 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200', textColor: 'text-emerald-800', phonicSound: 'D seperti Domba berbulu lembut' },
  { letter: 'E', word: 'Es Krim', emoji: '🍦', color: 'bg-sky-100 border-sky-300 hover:bg-sky-200', textColor: 'text-sky-800', phonicSound: 'E seperti Es Krim yang dingin dan lezat' },
  { letter: 'F', word: 'Flamingo', emoji: '🦩', color: 'bg-pink-100 border-pink-300 hover:bg-pink-200', textColor: 'text-pink-700', phonicSound: 'F seperti Flamingo anggun berwarna merah muda' },
  { letter: 'G', word: 'Gajah', emoji: '🐘', color: 'bg-slate-100 border-slate-300 hover:bg-slate-200', textColor: 'text-slate-800', phonicSound: 'G seperti Gajah berbelalai panjang' },
  { letter: 'H', word: 'Harimau', emoji: '🐯', color: 'bg-orange-100 border-orange-300 hover:bg-orange-200', textColor: 'text-orange-800', phonicSound: 'H seperti Harimau pemberani' },
  { letter: 'I', word: 'Ikan', emoji: '🐟', color: 'bg-cyan-100 border-cyan-300 hover:bg-cyan-200', textColor: 'text-cyan-800', phonicSound: 'I seperti Ikan berenang di air jernih' },
  { letter: 'J', word: 'Jeruk', emoji: '🍊', color: 'bg-amber-100 border-amber-400 hover:bg-amber-200', textColor: 'text-amber-800', phonicSound: 'J seperti Jeruk manis kaya vitamin' },
  { letter: 'K', word: 'Kucing', emoji: '🐱', color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200', textColor: 'text-yellow-800', phonicSound: 'K seperti Kucing meong meong lucu' },
  { letter: 'L', word: 'Lebah', emoji: '🐝', color: 'bg-yellow-100 border-amber-300 hover:bg-yellow-200', textColor: 'text-amber-700', phonicSound: 'L seperti Lebah penghasil madu manis' },
  { letter: 'M', word: 'Monyet', emoji: '🐵', color: 'bg-stone-100 border-stone-300 hover:bg-stone-200', textColor: 'text-stone-800', phonicSound: 'M seperti Monyet yang lincah' },
  { letter: 'N', word: 'Nanas', emoji: '🍍', color: 'bg-lime-100 border-lime-300 hover:bg-lime-200', textColor: 'text-lime-800', phonicSound: 'N seperti Nanas segar bersari manis' },
  { letter: 'O', word: 'Onta', emoji: '🐪', color: 'bg-orange-100 border-orange-300 hover:bg-orange-200', textColor: 'text-orange-900', phonicSound: 'O seperti Onta yang kuat di padang pasir' },
  { letter: 'P', word: 'Pisang', emoji: '🍌', color: 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200', textColor: 'text-yellow-800', phonicSound: 'P seperti Pisang kuning yang sedap' },
  { letter: 'Q', word: 'Quran', emoji: '📖', color: 'bg-teal-100 border-teal-300 hover:bg-teal-200', textColor: 'text-teal-800', phonicSound: 'Q seperti Al-Quran kitab suci yang mulia' },
  { letter: 'R', word: 'Rusa', emoji: '🦌', color: 'bg-amber-100 border-amber-300 hover:bg-amber-200', textColor: 'text-amber-900', phonicSound: 'R seperti Rusa yang bertanduk indah' },
  { letter: 'S', word: 'Sapi', emoji: '🐄', color: 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200', textColor: 'text-emerald-800', phonicSound: 'S seperti Sapi sehat penghasil susu' },
  { letter: 'T', word: 'Tomat', emoji: '🍅', color: 'bg-red-100 border-red-300 hover:bg-red-200', textColor: 'text-red-800', phonicSound: 'T seperti Tomat merah bergizi' },
  { letter: 'U', word: 'Udang', emoji: '🦐', color: 'bg-pink-100 border-pink-300 hover:bg-pink-200', textColor: 'text-pink-800', phonicSound: 'U seperti Udang berenang meliuk-liuk' },
  { letter: 'V', word: 'Vas Bunga', emoji: '🏺', color: 'bg-purple-100 border-purple-300 hover:bg-purple-200', textColor: 'text-purple-800', phonicSound: 'V seperti Vas bunga penghias meja' },
  { letter: 'W', word: 'Wortel', emoji: '🥕', color: 'bg-orange-100 border-orange-300 hover:bg-orange-200', textColor: 'text-orange-800', phonicSound: 'W seperti Wortel makanan kelinci' },
  { letter: 'X', word: 'Xilofon', emoji: '🎵', color: 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200', textColor: 'text-indigo-800', phonicSound: 'X seperti Xilofon alat musik berbunyi riang' },
  { letter: 'Y', word: 'Yo-yo', emoji: '🪀', color: 'bg-rose-100 border-rose-300 hover:bg-rose-200', textColor: 'text-rose-800', phonicSound: 'Y seperti Yo-yo mainan berputar seru' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', color: 'bg-slate-100 border-slate-300 hover:bg-slate-200', textColor: 'text-slate-800', phonicSound: 'Z seperti Zebra bergaris hitam putih' },
];

export function AlphabetModule({ onStarEarned }: { onStarEarned: (count: number) => void }) {
  const [selectedCard, setSelectedCard] = useState<AlphabetCard | null>(ALPHABET_DATA[0]);
  const [activeTab, setActiveTab] = useState<'belajar' | 'kuis'>('belajar');
  
  // Quiz state
  const [quizTarget, setQuizTarget] = useState<AlphabetCard>(ALPHABET_DATA[0]);
  const [quizOptions, setQuizOptions] = useState<AlphabetCard[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const handleSelectCard = (item: AlphabetCard) => {
    soundService.playPop();
    setSelectedCard(item);
    soundService.speakIndonesian(`Huruf ${item.letter}. ${item.word}!`);
  };

  const handlePlayVoice = (item: AlphabetCard) => {
    soundService.playSparkle();
    soundService.speakIndonesian(`Huruf ${item.letter}! ${item.phonicSound}.`);
  };

  const startNewQuizRound = () => {
    const targetIdx = Math.floor(Math.random() * ALPHABET_DATA.length);
    const target = ALPHABET_DATA[targetIdx];
    
    // Pick 2 random distractors
    const otherOptions: AlphabetCard[] = [];
    while (otherOptions.length < 2) {
      const rand = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      if (rand.letter !== target.letter && !otherOptions.some(o => o.letter === rand.letter)) {
        otherOptions.push(rand);
      }
    }
    const combined = [target, ...otherOptions].sort(() => Math.random() - 0.5);
    setQuizTarget(target);
    setQuizOptions(combined);
    setQuizFeedback(null);

    soundService.speakIndonesian(`Ayo cari huruf ${target.letter}! Yang mana huruf ${target.letter} untuk ${target.word}?`);
  };

  const handleStartQuizMode = () => {
    soundService.playPop();
    setActiveTab('kuis');
    startNewQuizRound();
  };

  const handleAnswerQuiz = (selected: AlphabetCard) => {
    if (selected.letter === quizTarget.letter) {
      soundService.playVictory();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      setQuizScore(prev => prev + 1);
      setQuizFeedback({
        isCorrect: true,
        message: `Horeee! Benar sekali! Huruf ${quizTarget.letter} untuk ${quizTarget.word} 🎉`,
      });
      soundService.speakIndonesian(`Horeee! Hebat sekali! Ini huruf ${quizTarget.letter} untuk ${quizTarget.word}!`);
      onStarEarned(1);
      StorageService.logActivity(StorageService.getActiveStudent().namaLengkap, 'Alfabet Ceria', `Menjawab benar huruf ${quizTarget.letter}`, 1);
      
      setTimeout(() => {
        startNewQuizRound();
      }, 2500);
    } else {
      soundService.playBoing();
      setQuizFeedback({
        isCorrect: false,
        message: `Hampir benar! Itu huruf ${selected.letter}. Ayo coba cari huruf ${quizTarget.letter} lagi ya! 😊`,
      });
      soundService.speakIndonesian(`Itu huruf ${selected.letter}. Ayo cari huruf ${quizTarget.letter} lagi ya!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Mode Switcher */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 rounded-3xl text-white shadow-xl shadow-amber-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-bounce-slow">
            🔤
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white drop-shadow-sm">
              Petualangan Huruf A - Z
            </h2>
            <p className="text-amber-100 font-medium text-sm md:text-base">
              Klik huruf di bawah untuk mendengarkan bunyinya dan belajar kata baru!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/20 p-1.5 rounded-2xl backdrop-blur-sm">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('belajar');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'belajar'
                ? 'bg-white text-orange-600 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Belajar Huruf
          </button>
          <button
            onClick={handleStartQuizMode}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'kuis'
                ? 'bg-white text-orange-600 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" /> Tebak Huruf (Kuis)
          </button>
        </div>
      </div>

      {activeTab === 'belajar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spotlight Card */}
          {selectedCard && (
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-xl flex flex-col items-center text-center justify-between">
              <div className="w-full">
                <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                  Kartu Pilihan
                </div>
                <div className="relative group">
                  <div className="text-8xl md:text-9xl font-black text-amber-500 drop-shadow-md my-2 transform group-hover:scale-105 transition-transform">
                    {selectedCard.letter}
                    <span className="text-5xl md:text-6xl text-amber-400 font-bold ml-2">
                      {selectedCard.letter.toLowerCase()}
                    </span>
                  </div>
                  <div className="text-7xl my-3 animate-float">{selectedCard.emoji}</div>
                </div>

                <div className="my-3">
                  <h3 className="text-3xl font-black text-slate-800">{selectedCard.word}</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    "{selectedCard.phonicSound}"
                  </p>
                </div>
              </div>

              <div className="w-full space-y-2 mt-4">
                <button
                  onClick={() => handlePlayVoice(selectedCard)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-300/60 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  Dengarkan Suara
                </button>
                <p className="text-xs text-slate-400 font-medium text-center">
                  Suara didukung Teknologi Ucapan Bahasa Indonesia
                </p>
              </div>
            </div>
          )}

          {/* 26 Letters Alphabet Grid */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-4 border-amber-200 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <span>📚</span> Klik salah satu huruf untuk menjelajah:
              </h3>
              <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
                26 Huruf
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-3">
              {ALPHABET_DATA.map((item) => {
                const isSelected = selectedCard?.letter === item.letter;
                return (
                  <button
                    key={item.letter}
                    onClick={() => handleSelectCard(item)}
                    className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer kid-card ${
                      isSelected
                        ? 'border-orange-500 bg-orange-100 ring-4 ring-orange-200 shadow-md scale-105'
                        : `${item.color}`
                    }`}
                  >
                    <span className={`text-2xl md:text-3xl font-black ${item.textColor}`}>
                      {item.letter}
                    </span>
                    <span className="text-2xl mt-0.5">{item.emoji}</span>
                    <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center mt-1">
                      {item.word}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="bg-white rounded-3xl p-8 border-4 border-orange-300 shadow-xl max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="flex items-center gap-2 text-amber-600 font-bold">
              <Award className="w-6 h-6" /> Skor Jawaban Benar: <span className="text-xl font-black">{quizScore}</span>
            </div>
            <button
              onClick={startNewQuizRound}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ganti Soal
            </button>
          </div>

          <div className="my-4">
            <span className="text-xs uppercase tracking-widest font-black text-orange-500 bg-orange-100 px-4 py-1.5 rounded-full">
              Tantangan Tebak Huruf
            </span>
            <div className="text-8xl my-4 animate-bounce-slow">{quizTarget.emoji}</div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800">
              Mana huruf awal untuk <span className="text-orange-600 underline underline-offset-4">{quizTarget.word}</span>?
            </h3>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Ayo tekan tombol huruf yang tepat di bawah ini ya!
            </p>
          </div>

          {/* Feedback Message */}
          {quizFeedback && (
            <div
              className={`p-4 rounded-2xl my-4 text-base font-bold flex items-center justify-center gap-2 ${
                quizFeedback.isCorrect
                  ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300 animate-pulse'
                  : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
              }`}
            >
              {quizFeedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : '🤔'}
              {quizFeedback.message}
            </div>
          )}

          {/* 3 Large Choices */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto my-6">
            {quizOptions.map((opt) => (
              <button
                key={opt.letter}
                onClick={() => handleAnswerQuiz(opt)}
                className="h-28 md:h-36 rounded-3xl bg-amber-50 hover:bg-amber-100 border-4 border-amber-300 hover:border-amber-400 shadow-lg text-5xl md:text-6xl font-black text-amber-700 flex flex-col items-center justify-center cursor-pointer kid-card active:scale-95 transition-all"
              >
                <span>{opt.letter}</span>
                <span className="text-xs font-bold text-amber-600 uppercase mt-1">
                  huruf {opt.letter}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => soundService.speakIndonesian(`Ayo cari huruf ${quizTarget.letter} untuk kata ${quizTarget.word}`)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 font-bold bg-slate-100 px-4 py-2 rounded-xl cursor-pointer"
          >
            <Volume2 className="w-4 h-4" /> Ulangi Pertanyaan Suara
          </button>
        </div>
      )}
    </div>
  );
}
