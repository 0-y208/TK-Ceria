import { useState, useEffect } from 'react';
import { Volume2, Award, RotateCcw, Sparkles, HelpCircle, Heart, Star, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';
import { StorageService } from '../../services/storageService';

export interface AnimalItem {
  id: string;
  name: string;
  soundType: string;
  soundText: string;
  emoji: string;
  category: 'ternak' | 'liar' | 'rumah';
  categoryLabel: string;
  fact: string;
  colorGrad: string;
  borderClass: string;
  shadowClass: string;
}

const ALL_ANIMALS: AnimalItem[] = [
  {
    id: 'kucing',
    name: 'Kucing Imut',
    soundType: 'kucing',
    soundText: 'Meoong... meoong! 🐾',
    emoji: '🐱',
    category: 'rumah',
    categoryLabel: 'Hewan Rumah 🏡',
    fact: 'Suka dielus dan pandai menangkap bola wol!',
    colorGrad: 'from-amber-400 via-orange-300 to-yellow-400',
    borderClass: 'border-amber-300 hover:border-amber-400',
    shadowClass: 'shadow-amber-200/60',
  },
  {
    id: 'anjing',
    name: 'Anjing Ceria',
    soundType: 'anjing',
    soundText: 'Guk guk guk! 🦴',
    emoji: '🐶',
    category: 'rumah',
    categoryLabel: 'Hewan Rumah 🏡',
    fact: 'Sahabat setia manusia yang suka bermain lempar tangkap.',
    colorGrad: 'from-orange-400 via-amber-400 to-yellow-500',
    borderClass: 'border-orange-300 hover:border-orange-400',
    shadowClass: 'shadow-orange-200/60',
  },
  {
    id: 'burung',
    name: 'Burung Pipit',
    soundType: 'burung',
    soundText: 'Cuit... cuit... cuit! 🎵',
    emoji: '🐦',
    category: 'rumah',
    categoryLabel: 'Hewan Rumah 🏡',
    fact: 'Memiliki sayap indah dan gemar berkicau di pagi hari.',
    colorGrad: 'from-sky-400 via-cyan-300 to-blue-400',
    borderClass: 'border-sky-300 hover:border-sky-400',
    shadowClass: 'shadow-sky-200/60',
  },
  {
    id: 'bebek',
    name: 'Bebek Berenang',
    soundType: 'bebek',
    soundText: 'Kwek kwek kwek! 🌊',
    emoji: '🦆',
    category: 'ternak',
    categoryLabel: 'Hewan Ternak 🚜',
    fact: 'Memiliki selaput kaki sehingga sangat pandai berenang.',
    colorGrad: 'from-yellow-400 via-amber-300 to-yellow-500',
    borderClass: 'border-yellow-300 hover:border-yellow-400',
    shadowClass: 'shadow-yellow-200/60',
  },
  {
    id: 'sapi',
    name: 'Sapi Gemuk',
    soundType: 'sapi',
    soundText: 'Moooo... moooo! 🥛',
    emoji: '🐄',
    category: 'ternak',
    categoryLabel: 'Hewan Ternak 🚜',
    fact: 'Suka makan rumput segar dan menghasilkan susu yang menyehatkan.',
    colorGrad: 'from-emerald-400 via-teal-300 to-green-400',
    borderClass: 'border-emerald-300 hover:border-emerald-400',
    shadowClass: 'shadow-emerald-200/60',
  },
  {
    id: 'domba',
    name: 'Domba Putih',
    soundType: 'domba',
    soundText: 'Mbeeek... mbeeek! ☁️',
    emoji: '🐑',
    category: 'ternak',
    categoryLabel: 'Hewan Ternak 🚜',
    fact: 'Memiliki bulu wol yang tebal, lembut, dan hangat.',
    colorGrad: 'from-purple-400 via-indigo-300 to-pink-400',
    borderClass: 'border-purple-300 hover:border-purple-400',
    shadowClass: 'shadow-purple-200/60',
  },
  {
    id: 'ayam',
    name: 'Ayam Jago',
    soundType: 'ayam',
    soundText: 'Kukuruyuuuk! ☀️',
    emoji: '🐔',
    category: 'ternak',
    categoryLabel: 'Hewan Ternak 🚜',
    fact: 'Berkokok lantang menyambut matahari terbit setiap pagi.',
    colorGrad: 'from-rose-400 via-red-400 to-orange-400',
    borderClass: 'border-rose-300 hover:border-rose-400',
    shadowClass: 'shadow-rose-200/60',
  },
  {
    id: 'kuda',
    name: 'Kuda Tangguh',
    soundType: 'kuda',
    soundText: 'Hiiihhh... taplak taplak! 🏇',
    emoji: '🐴',
    category: 'ternak',
    categoryLabel: 'Hewan Ternak 🚜',
    fact: 'Hewan gagah yang mampu berlari sangat kencang dan lincah.',
    colorGrad: 'from-amber-600 via-amber-500 to-yellow-600',
    borderClass: 'border-amber-400 hover:border-amber-500',
    shadowClass: 'shadow-amber-300/60',
  },
  {
    id: 'singa',
    name: 'Singa Raja Hutan',
    soundType: 'singa',
    soundText: 'Rooaaarrr... grrr! 👑',
    emoji: '🦁',
    category: 'liar',
    categoryLabel: 'Hewan Rimba 🌴',
    fact: 'Raja rimba berani dengan surai emas yang mempesona.',
    colorGrad: 'from-amber-500 via-orange-500 to-yellow-500',
    borderClass: 'border-orange-400 hover:border-orange-500',
    shadowClass: 'shadow-orange-300/60',
  },
  {
    id: 'gajah',
    name: 'Gajah Belalai',
    soundType: 'gajah',
    soundText: 'Trrruuuuuttt... terompet! 🎺',
    emoji: '🐘',
    category: 'liar',
    categoryLabel: 'Hewan Rimba 🌴',
    fact: 'Hewan darat terbesar dengan belalai ajaib dan telinga lebar.',
    colorGrad: 'from-slate-400 via-slate-500 to-zinc-400',
    borderClass: 'border-slate-300 hover:border-slate-400',
    shadowClass: 'shadow-slate-300/60',
  },
  {
    id: 'monyet',
    name: 'Monyet Lincah',
    soundType: 'monyet',
    soundText: 'Uu... aa... uu... aa! 🍌',
    emoji: '🐵',
    category: 'liar',
    categoryLabel: 'Hewan Rimba 🌴',
    fact: 'Suka bergelantungan di dahan pohon dan gemar makan pisang manis.',
    colorGrad: 'from-amber-500 via-yellow-400 to-orange-400',
    borderClass: 'border-amber-400 hover:border-amber-500',
    shadowClass: 'shadow-amber-200/60',
  },
  {
    id: 'kodok',
    name: 'Katak Hijau',
    soundType: 'kodok',
    soundText: 'Kroook... kroook! 🌿',
    emoji: '🐸',
    category: 'liar',
    categoryLabel: 'Hewan Rimba 🌴',
    fact: 'Pandai melompat tinggi dan suka berenang di kolam teratai.',
    colorGrad: 'from-emerald-400 via-lime-300 to-green-400',
    borderClass: 'border-lime-300 hover:border-lime-400',
    shadowClass: 'shadow-lime-200/60',
  },
];

const MEMORY_CARDS = [
  { pairId: 1, emoji: '🐱', name: 'Kucing' },
  { pairId: 2, emoji: '🦆', name: 'Bebek' },
  { pairId: 3, emoji: '🦁', name: 'Singa' },
  { pairId: 4, emoji: '🐘', name: 'Gajah' },
  { pairId: 5, emoji: '🐄', name: 'Sapi' },
  { pairId: 6, emoji: '🐸', name: 'Katak' },
];

interface CardState {
  id: number;
  pairId: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MiniGamesModule({ onStarEarned }: { onStarEarned: (count: number) => void }) {
  // Navigation tabs: 'tebak' | 'safari' | 'memori'
  const [activeTab, setActiveTab] = useState<'tebak' | 'safari' | 'memori'>('tebak');

  // Safari Park filter state
  const [safariCategory, setSafariCategory] = useState<'all' | 'ternak' | 'liar' | 'rumah'>('all');
  const [activeTappedAnimalId, setActiveTappedAnimalId] = useState<string | null>(null);

  // Guess Animal Game state
  const [targetAnimal, setTargetAnimal] = useState<AnimalItem>(ALL_ANIMALS[0]);
  const [quizChoices, setQuizChoices] = useState<AnimalItem[]>([]);
  const [soundFeedback, setSoundFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  // Memory Game state
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchesFound, setMatchesFound] = useState<number>(0);

  useEffect(() => {
    startAnimalSoundRound();
    initMemoryGame();
  }, []);

  // START A NEW GUESS ROUND
  const startAnimalSoundRound = () => {
    const randomTarget = ALL_ANIMALS[Math.floor(Math.random() * ALL_ANIMALS.length)];
    
    // Pick 3 distractors
    const distractors: AnimalItem[] = [];
    while (distractors.length < 3) {
      const candidate = ALL_ANIMALS[Math.floor(Math.random() * ALL_ANIMALS.length)];
      if (candidate.id !== randomTarget.id && !distractors.some(d => d.id === candidate.id)) {
        distractors.push(candidate);
      }
    }

    const shuffled = [randomTarget, ...distractors].sort(() => Math.random() - 0.5);

    setTargetAnimal(randomTarget);
    setQuizChoices(shuffled);
    setSoundFeedback(null);
    setIsPlayingAudio(true);

    // Play prompt & sound
    soundService.speakIndonesian(`Dengarkan baik-baik ya! Hewan apakah yang bersuara seperti ini?`, () => {
      soundService.playAnimalSound(randomTarget.soundType);
      setTimeout(() => setIsPlayingAudio(false), 800);
    });
  };

  const handlePlayCurrentAnimalSound = () => {
    soundService.playPop();
    setIsPlayingAudio(true);
    soundService.playAnimalSound(targetAnimal.soundType);
    setTimeout(() => setIsPlayingAudio(false), 900);
  };

  const handleGuessAnimal = (chosen: AnimalItem) => {
    if (chosen.id === targetAnimal.id) {
      soundService.playVictory();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
      });

      const newStreak = streakCount + 1;
      const newScore = totalScore + 1;
      setStreakCount(newStreak);
      setTotalScore(newScore);

      setSoundFeedback({
        isCorrect: true,
        text: `Horeee! Benar sekali! Itu suara ${targetAnimal.name} (${targetAnimal.soundText}) 🎉`,
      });

      soundService.speakIndonesian(
        `Horeee! Jawabanmu tepat sekali! Itu suara ${targetAnimal.name}! ${targetAnimal.soundText}!`,
        () => {
          setTimeout(startAnimalSoundRound, 2000);
        }
      );

      onStarEarned(1);
      StorageService.logActivity(
        StorageService.getActiveStudent().namaLengkap,
        'Tebak Suara Hewan',
        `Menebak dengan benar suara ${targetAnimal.name}`,
        1
      );
    } else {
      soundService.playBoing();
      setStreakCount(0);
      setSoundFeedback({
        isCorrect: false,
        text: `Bukan ${chosen.name}. Coba dengarkan suara pengeras suaranya lagi ya! 😊`,
      });
      soundService.speakIndonesian(`Bukan ${chosen.name}. Ayo dengarkan suaranya lagi yuk!`);
    }
  };

  // SAFARI PARK EXPLORATION
  const handleTapSafariAnimal = (animal: AnimalItem) => {
    soundService.playPop();
    setActiveTappedAnimalId(animal.id);

    // Play animal synthesized frequency + speech
    soundService.playAnimalSound(animal.soundType);
    
    setTimeout(() => {
      soundService.speakIndonesian(`${animal.name}! ${animal.soundText}. ${animal.fact}`);
    }, 450);

    setTimeout(() => {
      setActiveTappedAnimalId(null);
    }, 2800);
  };

  // MEMORY GAME
  const initMemoryGame = () => {
    const deck: CardState[] = [];
    let currentId = 0;

    MEMORY_CARDS.forEach((item) => {
      deck.push({ id: currentId++, pairId: item.pairId, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: currentId++, pairId: item.pairId, emoji: item.emoji, name: item.name, isFlipped: false, isMatched: false });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchesFound(0);
  };

  const handleFlipCard = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    soundService.playPop();
    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (updated[firstIdx].pairId === updated[secondIdx].pairId) {
        // Matched!
        soundService.playSparkle();
        updated[firstIdx].isMatched = true;
        updated[secondIdx].isMatched = true;
        setCards(updated);
        setFlippedIndices([]);
        const total = matchesFound + 1;
        setMatchesFound(total);

        if (total === 6) {
          soundService.playVictory();
          confetti({ particleCount: 70, spread: 80 });
          onStarEarned(5);
          soundService.speakIndonesian(`Horeee! Luar biasa! Kamu berhasil mencocokkan semua kartu hewan!`);
          StorageService.logActivity(
            StorageService.getActiveStudent().namaLengkap,
            'Kartu Memori Hewan',
            'Menyelesaikan puzzle kartu memori 6 pasang',
            5
          );
        }
      } else {
        setTimeout(() => {
          soundService.playBoing();
          const reset = [...cards];
          reset[firstIdx].isFlipped = false;
          reset[secondIdx].isFlipped = false;
          setCards(reset);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const filteredSafariAnimals = ALL_ANIMALS.filter(
    (a) => safariCategory === 'all' || a.category === safariCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Safari Wonderland Theme */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 p-6 sm:p-7 rounded-3xl text-white shadow-xl shadow-teal-200/50 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        {/* Decorative backdrop shapes */}
        <span className="absolute -top-6 -right-6 text-9xl opacity-20 pointer-events-none select-none">
          🌴
        </span>
        <span className="absolute -bottom-6 left-1/3 text-8xl opacity-15 pointer-events-none select-none">
          🦁
        </span>

        <div className="flex items-center gap-4 text-center md:text-left z-10">
          <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-bounce-slow border-2 border-white/40">
            🦁
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white drop-shadow">
                Taman Safari Suara Hewan Ceria
              </h2>
              <span className="bg-amber-300 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow">
                12 Suara Hewan!
              </span>
            </div>
            <p className="text-emerald-100 font-medium text-xs sm:text-sm mt-1">
              Dengarkan aneka suara hewan realistis, tebak hewan misteri, dan jelajahi kebun binatang ceria!
            </p>
          </div>
        </div>

        {/* 3 Nav Subtabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white/20 p-1.5 rounded-2xl backdrop-blur-md z-10">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('tebak');
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tebak'
                ? 'bg-white text-emerald-800 shadow-md scale-105'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <span>🎯</span> Tebak Suara
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('safari');
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'safari'
                ? 'bg-white text-emerald-800 shadow-md scale-105'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <span>🐾</span> Safari 12 Hewan
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('memori');
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'memori'
                ? 'bg-white text-emerald-800 shadow-md scale-105'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <span>🃏</span> Kartu Pasangan
          </button>
        </div>
      </div>

      {/* ================= MODE 1: TEBAK SUARA HEWAN (PANGGUNG MISTERI) ================= */}
      {activeTab === 'tebak' && (
        <div className="bg-gradient-to-b from-amber-50 via-white to-orange-50/50 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl max-w-3xl mx-auto text-center relative overflow-hidden">
          {/* Top Bar Info: Streak & Score */}
          <div className="flex items-center justify-between border-b-2 border-amber-200 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-black text-amber-800 bg-amber-200/70 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                Skor: <span className="text-sm font-black text-amber-950">{totalScore}</span>
              </span>

              {streakCount >= 2 && (
                <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1.5 rounded-full animate-bounce-slow flex items-center gap-1 border border-orange-300">
                  🔥 {streakCount}x Benar Beruntun!
                </span>
              )}
            </div>

            <button
              onClick={startAnimalSoundRound}
              className="text-xs bg-white hover:bg-amber-100 text-amber-800 border-2 border-amber-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ganti Soal
            </button>
          </div>

          {/* Mystery Box Stage */}
          <div className="relative py-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide font-['Fredoka']">
              Hewan Apakah yang Bersuara Seperti Ini?
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-medium max-w-md mx-auto">
              Sentuh tombol pengeras suara warna-warni di bawah untuk mendengarkan, lalu pilih hewannya!
            </p>

            {/* Big Tactile Animated Speaker Button */}
            <div className="my-6 relative flex justify-center items-center">
              {/* Pulsing rings when audio is playing */}
              {isPlayingAudio && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-teal-400/30 animate-ping" />
                  <div className="absolute w-44 h-44 rounded-full bg-amber-400/20 animate-pulse" />
                </>
              )}

              <button
                onClick={handlePlayCurrentAnimalSound}
                className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-teal-400 via-cyan-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 border-4 border-white ${
                  isPlayingAudio ? 'ring-8 ring-amber-300 scale-105 animate-pulse' : 'hover:scale-105'
                }`}
                title="Dengarkan Suara Hewan"
              >
                <span className="text-5xl sm:text-6xl drop-shadow filter animate-bounce-slow">
                  {isPlayingAudio ? '🔊' : '📢'}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider mt-1 bg-black/20 px-2.5 py-0.5 rounded-full">
                  {isPlayingAudio ? 'Memutar...' : 'Putar Suara'}
                </span>
              </button>
            </div>

            <p className="text-xs font-black text-teal-800 bg-teal-100/70 py-1.5 px-4 rounded-full inline-block border border-teal-200">
              👉 Sentuh pengeras suara untuk memutar ulang suara hewan!
            </p>
          </div>

          {/* Feedback Banner */}
          {soundFeedback && (
            <div
              className={`p-4 rounded-2xl my-4 text-sm sm:text-base font-black flex items-center justify-center gap-2 ${
                soundFeedback.isCorrect
                  ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400 animate-bounce-slow'
                  : 'bg-rose-100 text-rose-900 border-2 border-rose-300'
              }`}
            >
              {soundFeedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : '🤔'}
              {soundFeedback.text}
            </div>
          )}

          {/* 4 Choices Grid (Attractive 3D Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-6">
            {quizChoices.map((animal) => (
              <button
                key={animal.id}
                onClick={() => handleGuessAnimal(animal)}
                className={`p-4 rounded-3xl border-3 bg-white transition-all flex flex-col items-center justify-center cursor-pointer kid-card hover:scale-105 shadow-md active:scale-95 ${animal.borderClass}`}
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${animal.colorGrad} flex items-center justify-center text-5xl shadow-md border-2 border-white mb-2`}
                >
                  <span className="filter drop-shadow-sm transform hover:scale-110 transition-transform">
                    {animal.emoji}
                  </span>
                </div>
                <span className="font-black text-sm text-slate-800">{animal.name}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                  {animal.categoryLabel}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-bold">
            <span>💡 Dengarkan baik-baik ciri nada suaranya ya!</span>
            <span className="bg-amber-100 px-3 py-1 rounded-full text-amber-800">+1 ⭐ Setiap Tebakan Tepat</span>
          </div>
        </div>
      )}

      {/* ================= MODE 2: KEBUN SAFARI 12 HEWAN (EKSPLORASI BEBAS) ================= */}
      {activeTab === 'safari' && (
        <div className="space-y-6">
          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐾</span>
              <span className="text-xs font-black text-slate-700 uppercase">Kategori Hewan:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  soundService.playPop();
                  setSafariCategory('all');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  safariCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🌈 Semua ({ALL_ANIMALS.length})
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  setSafariCategory('ternak');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  safariCategory === 'ternak'
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🚜 Hewan Ternak
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  setSafariCategory('liar');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  safariCategory === 'liar'
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🌴 Hewan Rimba
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  setSafariCategory('rumah');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  safariCategory === 'rumah'
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🏡 Hewan Rumah
              </button>
            </div>
          </div>

          {/* 12 Animals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSafariAnimals.map((animal) => {
              const isTapped = activeTappedAnimalId === animal.id;
              return (
                <div
                  key={animal.id}
                  onClick={() => handleTapSafariAnimal(animal)}
                  className={`bg-white rounded-3xl p-5 border-3 transition-all flex flex-col justify-between text-center cursor-pointer kid-card relative overflow-hidden ${
                    animal.borderClass
                  } ${isTapped ? 'ring-4 ring-amber-400 scale-105 shadow-xl bg-amber-50/50' : 'shadow-md'}`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                      {animal.categoryLabel}
                    </span>
                    <button
                      className="p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                      title="Bunyikan Suara"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Animal Animated Avatar */}
                  <div className="my-2 relative flex justify-center">
                    <div
                      className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${animal.colorGrad} flex items-center justify-center text-6xl shadow-md border-3 border-white ${
                        isTapped ? 'animate-bounce' : 'transform hover:scale-110 transition-transform'
                      }`}
                    >
                      {animal.emoji}
                    </div>

                    {isTapped && (
                      <span className="absolute -top-3 -right-2 text-2xl animate-ping">
                        ✨
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-black text-base text-slate-900">{animal.name}</h4>
                    <p className="text-xs font-black text-amber-700 bg-amber-100/80 py-1 px-2.5 rounded-xl mt-1 inline-block">
                      {animal.soundText}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-2 line-clamp-2">
                      {animal.fact}
                    </p>
                  </div>

                  <button className="mt-3 w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-black shadow flex items-center justify-center gap-1.5 transition-transform active:scale-95">
                    <Volume2 className="w-3.5 h-3.5" /> Sentuh & Bunyikan
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODE 3: KARTU PASANGAN MEMORI ================= */}
      {activeTab === 'memori' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-xl max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Pasangan Ditemukan: {matchesFound} / 6
              </span>
            </div>
            <button
              onClick={initMemoryGame}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Acak Ulang Kartu
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-800 my-2">
            Buka & Temukan Pasangan Kartu yang Sama!
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mb-4">
            Buka dua kartu sekaligus. Jika gambarnya sama, kartunya akan tetap terbuka!
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 my-6">
            {cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleFlipCard(idx)}
                className={`h-24 sm:h-28 rounded-2xl text-4xl sm:text-5xl flex flex-col items-center justify-center font-bold cursor-pointer transition-all duration-300 kid-card ${
                  card.isFlipped || card.isMatched
                    ? 'bg-amber-100 border-4 border-amber-400 rotate-0 scale-100 shadow-md'
                    : 'bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-white text-white shadow hover:scale-105'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <>
                    <span>{card.emoji}</span>
                    <span className="text-[10px] font-black text-amber-900 mt-1">{card.name}</span>
                  </>
                ) : (
                  '❓'
                )}
              </button>
            ))}
          </div>

          {matchesFound === 6 && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-base sm:text-lg animate-bounce-slow">
              🎉 Horeee! Kamu Menang dan Mendapat +5 Bintang Emas! ⭐⭐⭐⭐⭐
            </div>
          )}
        </div>
      )}
    </div>
  );
}
