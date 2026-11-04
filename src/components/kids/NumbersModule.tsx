import { useState } from 'react';
import { Volume2, Award, RotateCcw, Plus, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';
import { StorageService } from '../../services/storageService';

interface NumberItem {
  num: number;
  word: string;
  emoji: string;
  itemName: string;
  color: string;
}

const NUMBERS: NumberItem[] = [
  { num: 1, word: 'Satu', emoji: '☀️', itemName: 'Matahari', color: 'from-amber-400 to-yellow-500' },
  { num: 2, word: 'Dua', emoji: '🐥', itemName: 'Anak Bebek', color: 'from-emerald-400 to-teal-500' },
  { num: 3, word: 'Tiga', emoji: '🍎', itemName: 'Apel Manis', color: 'from-rose-400 to-red-500' },
  { num: 4, word: 'Empat', emoji: '🚗', itemName: 'Mobil Cilik', color: 'from-blue-400 to-indigo-500' },
  { num: 5, word: 'Lima', emoji: '⭐️', itemName: 'Bintang Emas', color: 'from-purple-400 to-violet-500' },
  { num: 6, word: 'Enam', emoji: '🎈', itemName: 'Balon Ceria', color: 'from-pink-400 to-rose-500' },
  { num: 7, word: 'Tujuh', emoji: '🍓', itemName: 'Stroberi Merah', color: 'from-red-400 to-rose-600' },
  { num: 8, word: 'Delapan', emoji: '🌸', itemName: 'Bunga Mekar', color: 'from-fuchsia-400 to-pink-500' },
  { num: 9, word: 'Sembilan', emoji: '🐟', itemName: 'Ikan Berenang', color: 'from-cyan-400 to-blue-500' },
  { num: 10, word: 'Sepuluh', emoji: '🍪', itemName: 'Kue Cokelat', color: 'from-amber-500 to-orange-600' },
];

export function NumbersModule({ onStarEarned }: { onStarEarned: (count: number) => void }) {
  const [activeTab, setActiveTab] = useState<'belajar' | 'kuis' | 'tambah'>('belajar');
  const [selectedNum, setSelectedNum] = useState<NumberItem>(NUMBERS[2]); // 3 default
  const [countedCount, setCountedCount] = useState<number>(0);

  // Quiz State
  const [quizTargetCount, setQuizTargetCount] = useState<number>(4);
  const [quizEmoji, setQuizEmoji] = useState<string>('🍓');
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Addition State
  const [addNum1, setAddNum1] = useState(2);
  const [addNum2, setAddNum2] = useState(1);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  const handleSelectNumber = (item: NumberItem) => {
    soundService.playPop();
    setSelectedNum(item);
    setCountedCount(0);
    soundService.speakIndonesian(`Angka ${item.num}! ${item.word} ${item.itemName}.`);
  };

  const handleTapCountItem = (index: number) => {
    const nextCount = index + 1;
    setCountedCount(nextCount);
    soundService.playSparkle();
    const indonesianNums = ['Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh'];
    soundService.speakIndonesian(`${indonesianNums[index]}!`);
  };

  const startNewQuiz = () => {
    const randomCount = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const emojis = ['🍎', '🐥', '🚗', '⭐', '🎈', '🍓', '🍪', '🐱', '🐸'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setQuizTargetCount(randomCount);
    setQuizEmoji(randomEmoji);
    setQuizFeedback(null);
    soundService.speakIndonesian(`Ayo hitung ada berapa banyak di layar ya?`);
  };

  const handleQuizAnswer = (num: number) => {
    if (num === quizTargetCount) {
      soundService.playVictory();
      confetti({ particleCount: 40, spread: 60 });
      setQuizFeedback({
        isCorrect: true,
        message: `Horeee! Pintar sekali! Benar ada ${quizTargetCount}! 🎉`,
      });
      soundService.speakIndonesian(`Horeee! Jawabanmu benar, ada ${quizTargetCount}!`);
      onStarEarned(1);
      StorageService.logActivity(StorageService.getActiveStudent().namaLengkap, '123 Berhitung', `Berhasil kuis berhitung jumlah ${quizTargetCount}`, 1);
      setTimeout(startNewQuiz, 2400);
    } else {
      soundService.playBoing();
      setQuizFeedback({
        isCorrect: false,
        message: `Bukan ${num}, coba sentuh dan hitung satu per satu lagi ya! 💪`,
      });
      soundService.speakIndonesian(`Bukan ${num}, coba hitung lagi ya!`);
    }
  };

  const generateNewAddition = () => {
    const n1 = Math.floor(Math.random() * 4) + 1;
    const n2 = Math.floor(Math.random() * 4) + 1;
    setAddNum1(n1);
    setAddNum2(n2);
    setAddFeedback(null);
    soundService.speakIndonesian(`Berapa ya hasil ${n1} ditambah ${n2}?`);
  };

  const checkAdditionAnswer = (ans: number) => {
    const correctSum = addNum1 + addNum2;
    if (ans === correctSum) {
      soundService.playVictory();
      confetti({ particleCount: 50, spread: 70 });
      setAddFeedback(`Hebat sekali! ${addNum1} ditambah ${addNum2} sama dengan ${correctSum} 🌟`);
      soundService.speakIndonesian(`Hebat! ${addNum1} tambah ${addNum2} sama dengan ${correctSum}!`);
      onStarEarned(1);
      setTimeout(generateNewAddition, 2500);
    } else {
      soundService.playBoing();
      setAddFeedback(`Belum tepat sayang. Coba hitung semua buahnya bersama-sama ya!`);
      soundService.speakIndonesian(`Coba hitung gabungan buahnya lagi ya.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 rounded-3xl text-white shadow-xl shadow-teal-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-bounce-slow">
            🔢
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white drop-shadow-sm">
              Petualangan Angka 1 - 10 & Berhitung
            </h2>
            <p className="text-emerald-100 font-medium text-sm md:text-base">
              Ayo belajar membilang benda dan bermain teka-teki berhitung seru!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 bg-white/20 p-1.5 rounded-2xl backdrop-blur-sm">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('belajar');
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'belajar' ? 'bg-white text-teal-700 shadow-md scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            Mengenal Angka
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('kuis');
              startNewQuiz();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kuis' ? 'bg-white text-teal-700 shadow-md scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" /> Kuis Berhitung
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('tambah');
              generateNewAddition();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tambah' ? 'bg-white text-teal-700 shadow-md scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <Plus className="w-4 h-4" /> Tambah Bergambar
          </button>
        </div>
      </div>

      {activeTab === 'belajar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Number Interactive Stage */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-4 border-teal-300 shadow-xl flex flex-col items-center text-center justify-between">
            <div className="w-full">
              <span className="inline-block px-4 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-black uppercase mb-2">
                Kartu Angka
              </span>
              <div className="text-8xl md:text-9xl font-black text-teal-600 drop-shadow-md my-2">
                {selectedNum.num}
              </div>
              <h3 className="text-3xl font-black text-slate-800">{selectedNum.word}</h3>
              <p className="text-base font-bold text-slate-500 mt-1">
                {selectedNum.num} {selectedNum.itemName}
              </p>

              {/* Tap to count objects container */}
              <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 my-4">
                <p className="text-xs font-bold text-teal-700 mb-2">
                  👉 Sentuh setiap benda untuk berhitung:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {Array.from({ length: selectedNum.num }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTapCountItem(idx)}
                      className={`text-4xl p-2 rounded-2xl transition-all cursor-pointer ${
                        idx < countedCount
                          ? 'bg-amber-300 scale-125 shadow-md ring-2 ring-amber-400 rotate-6'
                          : 'bg-white hover:bg-teal-100 shadow-sm'
                      }`}
                    >
                      {selectedNum.emoji}
                    </button>
                  ))}
                </div>
                {countedCount > 0 && (
                  <div className="mt-3 text-sm font-black text-teal-800 bg-white py-1 px-3 rounded-full inline-block shadow-sm">
                    Sudah terhitung: {countedCount} dari {selectedNum.num}!
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => soundService.speakIndonesian(`Angka ${selectedNum.num}! Ayo kita hitung: ${selectedNum.word} ${selectedNum.itemName}!`)}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-2xl font-black text-base shadow-lg shadow-teal-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              Dengarkan Bunyi Angka
            </button>
          </div>

          {/* Numbers 1-10 Grid */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-4 border-teal-200 shadow-md">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span>🎯</span> Pilih angka untuk mulai menjelajah:
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
              {NUMBERS.map((item) => {
                const isSelected = selectedNum.num === item.num;
                return (
                  <button
                    key={item.num}
                    onClick={() => handleSelectNumber(item)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer kid-card ${
                      isSelected
                        ? 'border-teal-500 bg-teal-100 ring-4 ring-teal-200 shadow-lg scale-105'
                        : 'border-slate-200 bg-slate-50 hover:bg-teal-50'
                    }`}
                  >
                    <span className="text-4xl md:text-5xl font-black text-teal-700">{item.num}</span>
                    <span className="text-3xl my-1">{item.emoji}</span>
                    <span className="text-xs font-bold text-slate-700">{item.word}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kuis' && (
        <div className="bg-white rounded-3xl p-8 border-4 border-teal-300 shadow-xl max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <span className="text-xs uppercase tracking-widest font-black text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
              Kuis Berhitung Ceria
            </span>
            <button
              onClick={startNewQuiz}
              className="text-xs text-slate-600 hover:text-teal-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ganti Soal
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-800 my-2">
            Berapa banyak benda di dalam kotak ini?
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            Sentuh bendanya untuk menghitung, lalu tekan angka yang benar!
          </p>

          {/* Items Display Box */}
          <div className="bg-teal-50 border-4 border-teal-200 border-dashed rounded-3xl p-6 my-4 min-h-36 flex flex-wrap items-center justify-center gap-4">
            {Array.from({ length: quizTargetCount }).map((_, idx) => (
              <span
                key={idx}
                className="text-5xl md:text-6xl animate-bounce-slow transform hover:scale-125 transition-transform inline-block"
              >
                {quizEmoji}
              </span>
            ))}
          </div>

          {quizFeedback && (
            <div
              className={`p-3 rounded-2xl my-3 font-bold text-sm ${
                quizFeedback.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {quizFeedback.message}
            </div>
          )}

          {/* Number choices 1-8 */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 my-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                onClick={() => handleQuizAnswer(n)}
                className="py-3 bg-white border-2 border-teal-300 hover:bg-teal-200 hover:border-teal-500 rounded-2xl text-2xl font-black text-teal-800 shadow-md cursor-pointer kid-card active:scale-90"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tambah' && (
        <div className="bg-white rounded-3xl p-8 border-4 border-cyan-300 shadow-xl max-w-2xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest font-black text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">
            Penjumlahan Bergambar
          </span>
          <h3 className="text-2xl font-black text-slate-800 my-3">
            Berapa hasil penjumlahan buah ini?
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-6 bg-cyan-50 p-6 rounded-3xl border-2 border-cyan-200">
            {/* Group 1 */}
            <div className="text-center">
              <div className="flex gap-1 justify-center text-4xl mb-1">
                {Array.from({ length: addNum1 }).map((_, i) => (
                  <span key={i}>🍎</span>
                ))}
              </div>
              <span className="text-3xl font-black text-cyan-800">{addNum1}</span>
            </div>

            <span className="text-4xl font-black text-cyan-500">+</span>

            {/* Group 2 */}
            <div className="text-center">
              <div className="flex gap-1 justify-center text-4xl mb-1">
                {Array.from({ length: addNum2 }).map((_, i) => (
                  <span key={i}>🍎</span>
                ))}
              </div>
              <span className="text-3xl font-black text-cyan-800">{addNum2}</span>
            </div>

            <span className="text-4xl font-black text-cyan-500">=</span>

            <div className="w-16 h-16 rounded-2xl border-4 border-dashed border-cyan-400 bg-white flex items-center justify-center text-3xl font-black text-cyan-600">
              ?
            </div>
          </div>

          {addFeedback && (
            <div className="p-3 bg-emerald-100 text-emerald-800 font-bold rounded-2xl mb-4 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              {addFeedback}
            </div>
          )}

          {/* Choice options */}
          <div className="flex justify-center gap-3">
            {[addNum1 + addNum2 - 1, addNum1 + addNum2, addNum1 + addNum2 + 1]
              .filter((v) => v > 0)
              .sort(() => Math.random() - 0.5)
              .map((val) => (
                <button
                  key={val}
                  onClick={() => checkAdditionAnswer(val)}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-b from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-white font-black text-3xl shadow-lg cursor-pointer kid-card active:scale-95"
                >
                  {val}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
