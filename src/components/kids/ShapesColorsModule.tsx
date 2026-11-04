import { useState } from 'react';
import { Sparkles, Volume2, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';
import { StorageService } from '../../services/storageService';

interface ColorItem {
  name: string;
  hex: string;
  sampleItem: string;
  emoji: string;
  bgClass: string;
}

interface ShapeItem {
  name: string;
  description: string;
  sampleItem: string;
  iconSvg: string; // SVG path or representation
  color: string;
}

const COLORS: ColorItem[] = [
  { name: 'Merah', hex: '#ef4444', sampleItem: 'Apel & Stroberi', emoji: '🍎', bgClass: 'bg-red-500' },
  { name: 'Kuning', hex: '#eab308', sampleItem: 'Pisang & Matahari', emoji: '🍌', bgClass: 'bg-yellow-400' },
  { name: 'Biru', hex: '#3b82f6', sampleItem: 'Langit & Lautan', emoji: '🌊', bgClass: 'bg-blue-500' },
  { name: 'Hijau', hex: '#22c55e', sampleItem: 'Daun & Rumput', emoji: '🍃', bgClass: 'bg-green-500' },
  { name: 'Oranye / Jingga', hex: '#f97316', sampleItem: 'Jeruk & Wortel', emoji: '🍊', bgClass: 'bg-orange-500' },
  { name: 'Ungu', hex: '#a855f7', sampleItem: 'Anggur & Terong', emoji: '🍇', bgClass: 'bg-purple-500' },
  { name: 'Merah Muda', hex: '#ec4899', sampleItem: 'Bunga Sakura', emoji: '🌸', bgClass: 'bg-pink-400' },
  { name: 'Cokelat', hex: '#78350f', sampleItem: 'Cokelat Lezat', emoji: '🍫', bgClass: 'bg-amber-900' },
];

const SHAPES: ShapeItem[] = [
  {
    name: 'Lingkaran',
    description: 'Bulat sempurna seperti bola dan roda sepeda',
    sampleItem: '⚽ Bola & 🍩 Donat',
    color: 'from-amber-400 to-orange-500',
    iconSvg: 'circle',
  },
  {
    name: 'Segitiga',
    description: 'Punya 3 sudut lancip seperti sepotong pizza',
    sampleItem: '🍕 Pizza & ⛺ Tenda',
    color: 'from-emerald-400 to-teal-500',
    iconSvg: 'triangle',
  },
  {
    name: 'Persegi (Kotak)',
    description: 'Keempat sisinya sama panjang seperti kotak kado',
    sampleItem: '🎁 Kado & 🪟 Jendela',
    color: 'from-blue-400 to-indigo-500',
    iconSvg: 'square',
  },
  {
    name: 'Bintang',
    description: 'Punya 5 sudut runcing yang bersinar gemerlap',
    sampleItem: '⭐ Bintang Malam & 🌟 Bintang Laut',
    color: 'from-yellow-400 to-amber-500',
    iconSvg: 'star',
  },
  {
    name: 'Bentuk Hati',
    description: 'Lambang cinta kasih sayang untuk orang tua dan sahabat',
    sampleItem: '💖 Kasih Sayang & 🎈 Balon Hati',
    color: 'from-rose-400 to-pink-500',
    iconSvg: 'heart',
  },
  {
    name: 'Awan',
    description: 'Gumpalan lembut seperti permen kapas di langit',
    sampleItem: '☁️ Awan di Langit',
    color: 'from-sky-300 to-cyan-400',
    iconSvg: 'cloud',
  },
];

export function ShapesColorsModule({ onStarEarned }: { onStarEarned: (count: number) => void }) {
  const [mode, setMode] = useState<'warna' | 'bentuk' | 'kuis'>('warna');
  const [selectedColor, setSelectedColor] = useState<ColorItem>(COLORS[0]);
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(SHAPES[0]);

  // Quiz State
  const [quizColor, setQuizColor] = useState<ColorItem>(COLORS[1]);
  const [quizColorOptions, setQuizColorOptions] = useState<ColorItem[]>(() => {
    const target = COLORS[1];
    const distractors = COLORS.filter((c) => c.name !== target.name).slice(0, 3);
    return [target, ...distractors].sort(() => Math.random() - 0.5);
  });

  const [quizShape, setQuizShape] = useState<ShapeItem>(SHAPES[0]);
  const [quizShapeOptions, setQuizShapeOptions] = useState<ShapeItem[]>(() => {
    const target = SHAPES[0];
    const distractors = SHAPES.filter((s) => s.name !== target.name).slice(0, 3);
    return [target, ...distractors].sort(() => Math.random() - 0.5);
  });

  const [quizMode, setQuizMode] = useState<'color' | 'shape'>('color');
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const handleSelectColor = (c: ColorItem) => {
    soundService.playPop();
    setSelectedColor(c);
    soundService.speakIndonesian(`Warna ${c.name}! Seperti ${c.sampleItem}.`);
  };

  const handleSelectShape = (s: ShapeItem) => {
    soundService.playPop();
    setSelectedShape(s);
    soundService.speakIndonesian(`Bentuk ${s.name}! ${s.description}.`);
  };

  const startQuiz = () => {
    const isColorQuiz = Math.random() > 0.5;
    if (isColorQuiz) {
      setQuizMode('color');
      const target = COLORS[Math.floor(Math.random() * COLORS.length)];
      setQuizColor(target);

      // Pick 3 distractors from COLORS excluding target
      const otherColors = COLORS.filter((c) => c.name !== target.name).sort(() => Math.random() - 0.5);
      const distractors = otherColors.slice(0, 3);
      // Combine target with distractors and shuffle so target is guaranteed present and positioned randomly
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      setQuizColorOptions(options);

      soundService.speakIndonesian(`Yang mana warna ${target.name}? Sentuh kotaknya ya!`);
    } else {
      setQuizMode('shape');
      const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      setQuizShape(target);

      // Pick 3 distractors from SHAPES excluding target
      const otherShapes = SHAPES.filter((s) => s.name !== target.name).sort(() => Math.random() - 0.5);
      const distractors = otherShapes.slice(0, 3);
      // Combine target with distractors and shuffle
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      setQuizShapeOptions(options);

      soundService.speakIndonesian(`Yang mana bentuk ${target.name}? Ayo sentuh bentuknya!`);
    }
    setQuizFeedback(null);
  };

  const handleAnswerColor = (c: ColorItem) => {
    if (c.name === quizColor.name) {
      soundService.playVictory();
      confetti({ particleCount: 45, spread: 65 });
      setQuizFeedback(`Tepat sekali! Ini adalah warna ${quizColor.name} 🎉`);
      soundService.speakIndonesian(`Tepat sekali! Ini warna ${quizColor.name}!`);
      onStarEarned(1);
      StorageService.logActivity(StorageService.getActiveStudent().namaLengkap, 'Dunia Warna & Bentuk', `Menebak warna ${quizColor.name}`, 1);
      setTimeout(startQuiz, 2200);
    } else {
      soundService.playBoing();
      setQuizFeedback(`Itu warna ${c.name}. Ayo cari yang warna ${quizColor.name}!`);
      soundService.speakIndonesian(`Itu warna ${c.name}. Ayo cari warna ${quizColor.name}!`);
    }
  };

  const handleAnswerShape = (s: ShapeItem) => {
    if (s.name === quizShape.name) {
      soundService.playVictory();
      confetti({ particleCount: 45, spread: 65 });
      setQuizFeedback(`Pintar sekali! Ini adalah bentuk ${quizShape.name} 🌟`);
      soundService.speakIndonesian(`Pintar sekali! Ini bentuk ${quizShape.name}!`);
      onStarEarned(1);
      StorageService.logActivity(StorageService.getActiveStudent().namaLengkap, 'Dunia Warna & Bentuk', `Menebak bentuk ${quizShape.name}`, 1);
      setTimeout(startQuiz, 2200);
    } else {
      soundService.playBoing();
      setQuizFeedback(`Itu bentuk ${s.name}. Coba cari ${quizShape.name} ya!`);
      soundService.speakIndonesian(`Itu bentuk ${s.name}. Coba cari ${quizShape.name}!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 p-6 rounded-3xl text-white shadow-xl shadow-purple-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-bounce-slow">
            🎨
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white drop-shadow-sm">
              Dunia Warna Warni & Bentuk Geometri
            </h2>
            <p className="text-purple-100 font-medium text-sm md:text-base">
              Kenali aneka warna indah di sekitarmu dan berbagai macam bentuk!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/20 p-1.5 rounded-2xl backdrop-blur-sm">
          <button
            onClick={() => {
              soundService.playPop();
              setMode('warna');
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              mode === 'warna' ? 'bg-white text-purple-700 shadow-md scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            Mengenal Warna
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setMode('bentuk');
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              mode === 'bentuk' ? 'bg-white text-purple-700 shadow-md scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            Mengenal Bentuk
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setMode('kuis');
              startQuiz();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'kuis' ? 'bg-white text-purple-700 shadow-md scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" /> Kuis Tebak
          </button>
        </div>
      </div>

      {mode === 'warna' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spotlight Color */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-4 border-purple-200 shadow-xl flex flex-col items-center text-center justify-between">
            <div className="w-full">
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-black uppercase mb-3">
                Warna Pilihan
              </span>
              <div
                className="w-36 h-36 mx-auto rounded-full shadow-2xl flex items-center justify-center text-6xl my-4 border-4 border-white transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: selectedColor.hex }}
              >
                {selectedColor.emoji}
              </div>
              <h3 className="text-3xl font-black text-slate-800">{selectedColor.name}</h3>
              <p className="text-sm font-bold text-slate-500 mt-2 bg-slate-50 py-2 px-4 rounded-xl inline-block border border-slate-100">
                Contoh: {selectedColor.sampleItem}
              </p>
            </div>

            <button
              onClick={() => soundService.speakIndonesian(`Ini adalah warna ${selectedColor.name}. Contohnya adalah ${selectedColor.sampleItem}. Indah sekali ya!`)}
              className="w-full mt-4 py-3.5 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-black text-base shadow-lg shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              Dengarkan Suara Warna
            </button>
          </div>

          {/* Color Palettes */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-4 border-purple-200 shadow-md">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" /> Sentuh salah satu warna di bawah:
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COLORS.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => handleSelectColor(color)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer kid-card ${
                      isSelected
                        ? 'border-purple-600 ring-4 ring-purple-200 shadow-xl scale-105'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl shadow-inner flex items-center justify-center text-2xl border-2 border-white/50 mb-2"
                      style={{ backgroundColor: color.hex }}
                    >
                      {color.emoji}
                    </div>
                    <span className="font-black text-sm text-slate-800">{color.name}</span>
                    <span className="text-[11px] text-slate-400 font-medium truncate w-full text-center">
                      {color.sampleItem}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {mode === 'bentuk' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spotlight Shape */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-4 border-pink-200 shadow-xl flex flex-col items-center text-center justify-between">
            <div className="w-full">
              <span className="inline-block px-4 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-black uppercase mb-3">
                Bentuk Pilihan
              </span>

              <div className="my-6 flex justify-center items-center">
                {selectedShape.iconSvg === 'circle' && (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xl flex items-center justify-center text-4xl border-4 border-white animate-pulse-glow">
                    😊
                  </div>
                )}
                {selectedShape.iconSvg === 'triangle' && (
                  <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[110px] border-b-emerald-500 filter drop-shadow-xl relative flex justify-center items-center">
                    <span className="absolute top-14 text-2xl">😄</span>
                  </div>
                )}
                {selectedShape.iconSvg === 'square' && (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-blue-400 to-indigo-500 shadow-xl flex items-center justify-center text-4xl border-4 border-white animate-pulse-glow">
                    🤩
                  </div>
                )}
                {selectedShape.iconSvg === 'star' && (
                  <div className="text-8xl text-amber-400 filter drop-shadow-lg animate-bounce-slow">
                    ⭐
                  </div>
                )}
                {selectedShape.iconSvg === 'heart' && (
                  <div className="text-8xl text-rose-500 filter drop-shadow-lg animate-bounce-slow">
                    💖
                  </div>
                )}
                {selectedShape.iconSvg === 'cloud' && (
                  <div className="text-8xl text-sky-400 filter drop-shadow-lg animate-float">
                    ☁️
                  </div>
                )}
              </div>

              <h3 className="text-3xl font-black text-slate-800">{selectedShape.name}</h3>
              <p className="text-sm font-semibold text-slate-500 mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                "{selectedShape.description}"
              </p>
              <p className="text-xs font-bold text-pink-600 mt-2">
                Contoh di sekitar kita: {selectedShape.sampleItem}
              </p>
            </div>

            <button
              onClick={() => soundService.speakIndonesian(`Bentuk ${selectedShape.name}! ${selectedShape.description}. Seperti ${selectedShape.sampleItem}.`)}
              className="w-full mt-4 py-3.5 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-black text-base shadow-lg shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              Dengarkan Bentuk
            </button>
          </div>

          {/* Shapes Grid */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-4 border-pink-200 shadow-md">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span>📐</span> Sentuh bentuk untuk mengenal ciri-cirinya:
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SHAPES.map((shape) => {
                const isSelected = selectedShape.name === shape.name;
                return (
                  <button
                    key={shape.name}
                    onClick={() => handleSelectShape(shape)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer kid-card ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 ring-4 ring-pink-200 shadow-lg scale-105'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="h-16 flex items-center justify-center my-1 text-4xl">
                      {shape.iconSvg === 'circle' && '🟡'}
                      {shape.iconSvg === 'triangle' && '🔺'}
                      {shape.iconSvg === 'square' && '🟦'}
                      {shape.iconSvg === 'star' && '⭐'}
                      {shape.iconSvg === 'heart' && '💖'}
                      {shape.iconSvg === 'cloud' && '☁️'}
                    </div>
                    <span className="font-black text-base text-slate-800">{shape.name}</span>
                    <span className="text-[11px] text-slate-500 text-center mt-1">
                      {shape.sampleItem}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {mode === 'kuis' && (
        <div className="bg-white rounded-3xl p-8 border-4 border-purple-300 shadow-xl max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <span className="text-xs uppercase tracking-widest font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Kuis Warna & Bentuk
            </span>
            <button
              onClick={startQuiz}
              className="text-xs text-slate-600 hover:text-purple-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ganti Soal
            </button>
          </div>

          {quizMode === 'color' ? (
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 my-2">
                Manakah yang berwarna <span className="text-purple-600 underline">{quizColor.name}</span>?
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Sentuh kotak warna yang tepat di bawah ini ya!
              </p>

              {quizFeedback && (
                <div className="p-3 bg-purple-100 text-purple-800 font-bold rounded-2xl mb-4">
                  {quizFeedback}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                {quizColorOptions.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => handleAnswerColor(col)}
                    className="p-4 rounded-2xl border-4 border-white shadow-lg text-white font-black text-base flex flex-col items-center justify-center h-28 kid-card cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    style={{ backgroundColor: col.hex }}
                  >
                    <span className="text-3xl mb-1">{col.emoji}</span>
                    <span className="bg-black/35 px-3 py-0.5 rounded-full text-xs shadow-sm font-bold tracking-wide">
                      {col.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 my-2">
                Manakah yang merupakan bentuk <span className="text-purple-600 underline">{quizShape.name}</span>?
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Sentuh bentuk yang sesuai ya!
              </p>

              {quizFeedback && (
                <div className="p-3 bg-purple-100 text-purple-800 font-bold rounded-2xl mb-4">
                  {quizFeedback}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                {quizShapeOptions.map((shp) => (
                  <button
                    key={shp.name}
                    onClick={() => handleAnswerShape(shp)}
                    className="p-4 bg-purple-50 hover:bg-purple-100 border-3 border-purple-200 hover:border-purple-400 rounded-2xl shadow flex flex-col items-center justify-center kid-card cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  >
                    <span className="text-5xl mb-2">
                      {shp.iconSvg === 'circle' && '🟡'}
                      {shp.iconSvg === 'triangle' && '🔺'}
                      {shp.iconSvg === 'square' && '🟦'}
                      {shp.iconSvg === 'star' && '⭐'}
                      {shp.iconSvg === 'heart' && '💖'}
                      {shp.iconSvg === 'cloud' && '☁️'}
                    </span>
                    <span className="font-black text-purple-900 text-sm">{shp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
