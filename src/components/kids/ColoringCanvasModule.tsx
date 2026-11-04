import React, { useRef, useState, useEffect } from 'react';
import { Download, Trash2, Undo, Sparkles, Paintbrush, Stamp, Eraser, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';
import { StorageService } from '../../services/storageService';

const PALETTE = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#facc15', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#854d0e', // Brown
  '#1e293b', // Dark Slate
  '#ffffff', // White
];

interface TemplateOutline {
  id: string;
  name: string;
  emoji: string;
  drawOutline: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const TEMPLATES: TemplateOutline[] = [
  {
    id: 'blank',
    name: 'Kertas Kosong (Bebas)',
    emoji: '📄',
    drawOutline: () => {},
  },
  {
    id: 'kucing',
    name: 'Kucing Imut',
    emoji: '🐱',
    drawOutline: (ctx, w, h) => {
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const cx = w / 2;
      const cy = h / 2 - 20;

      // Head
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.stroke();

      // Left Ear
      ctx.beginPath();
      ctx.moveTo(cx - 70, cy - 50);
      ctx.lineTo(cx - 85, cy - 130);
      ctx.lineTo(cx - 20, cy - 85);
      ctx.stroke();

      // Right Ear
      ctx.beginPath();
      ctx.moveTo(cx + 70, cy - 50);
      ctx.lineTo(cx + 85, cy - 130);
      ctx.lineTo(cx + 20, cy - 85);
      ctx.stroke();

      // Eyes
      ctx.beginPath();
      ctx.arc(cx - 35, cy - 15, 12, 0, Math.PI * 2);
      ctx.arc(cx + 35, cy - 15, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();

      // Nose & Mouth
      ctx.beginPath();
      ctx.moveTo(cx, cy + 10);
      ctx.lineTo(cx - 10, cy + 5);
      ctx.lineTo(cx + 10, cy + 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx - 15, cy + 25, 15, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 15, cy + 25, 15, 0, Math.PI);
      ctx.stroke();

      // Whiskers
      ctx.beginPath();
      ctx.moveTo(cx - 45, cy + 15);
      ctx.lineTo(cx - 100, cy + 10);
      ctx.moveTo(cx - 45, cy + 25);
      ctx.lineTo(cx - 95, cy + 30);
      ctx.moveTo(cx + 45, cy + 15);
      ctx.lineTo(cx + 100, cy + 10);
      ctx.moveTo(cx + 45, cy + 25);
      ctx.lineTo(cx + 95, cy + 30);
      ctx.stroke();

      ctx.restore();
    },
  },
  {
    id: 'roket',
    name: 'Roket Luar Angkasa',
    emoji: '🚀',
    drawOutline: (ctx, w, h) => {
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const cx = w / 2;
      const cy = h / 2 - 20;

      // Rocket body
      ctx.beginPath();
      ctx.moveTo(cx, cy - 140);
      ctx.bezierCurveTo(cx + 60, cy - 60, cx + 50, cy + 60, cx + 45, cy + 110);
      ctx.lineTo(cx - 45, cy + 110);
      ctx.bezierCurveTo(cx - 50, cy + 60, cx - 60, cy - 60, cx, cy - 140);
      ctx.stroke();

      // Window
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 28, 0, Math.PI * 2);
      ctx.stroke();

      // Wings
      ctx.beginPath();
      ctx.moveTo(cx - 45, cy + 40);
      ctx.lineTo(cx - 95, cy + 110);
      ctx.lineTo(cx - 45, cy + 105);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 45, cy + 40);
      ctx.lineTo(cx + 95, cy + 110);
      ctx.lineTo(cx + 45, cy + 105);
      ctx.stroke();

      // Flames
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy + 110);
      ctx.lineTo(cx, cy + 160);
      ctx.lineTo(cx + 30, cy + 110);
      ctx.stroke();

      ctx.restore();
    },
  },
  {
    id: 'kupu',
    name: 'Kupu-kupu Manis',
    emoji: '🦋',
    drawOutline: (ctx, w, h) => {
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      const cx = w / 2;
      const cy = h / 2;

      // Body
      ctx.beginPath();
      ctx.ellipse(cx, cy, 14, 75, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Antennae
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy - 70);
      ctx.quadraticCurveTo(cx - 35, cy - 110, cx - 40, cy - 90);
      ctx.moveTo(cx + 5, cy - 70);
      ctx.quadraticCurveTo(cx + 35, cy - 110, cx + 40, cy - 90);
      ctx.stroke();

      // Upper Wings
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - 30);
      ctx.bezierCurveTo(cx - 120, cy - 130, cx - 140, cy - 10, cx - 14, cy + 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 14, cy - 30);
      ctx.bezierCurveTo(cx + 120, cy - 130, cx + 140, cy - 10, cx + 14, cy + 10);
      ctx.stroke();

      // Lower Wings
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy + 15);
      ctx.bezierCurveTo(cx - 100, cy + 30, cx - 80, cy + 110, cx - 14, cy + 50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 14, cy + 15);
      ctx.bezierCurveTo(cx + 100, cy + 30, cx + 80, cy + 110, cx + 14, cy + 50);
      ctx.stroke();

      ctx.restore();
    },
  },
  {
    id: 'rumah',
    name: 'Rumah Ceria',
    emoji: '🏠',
    drawOutline: (ctx, w, h) => {
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      const cx = w / 2;
      const cy = h / 2 + 10;

      // Roof
      ctx.beginPath();
      ctx.moveTo(cx, cy - 120);
      ctx.lineTo(cx - 120, cy - 20);
      ctx.lineTo(cx + 120, cy - 20);
      ctx.closePath();
      ctx.stroke();

      // Walls
      ctx.beginPath();
      ctx.rect(cx - 95, cy - 20, 190, 130);
      ctx.stroke();

      // Door
      ctx.beginPath();
      ctx.rect(cx - 25, cy + 30, 50, 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 15, cy + 70, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();

      // Windows
      ctx.beginPath();
      ctx.rect(cx - 80, cy + 10, 35, 35);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(cx + 45, cy + 10, 35, 35);
      ctx.stroke();

      ctx.restore();
    },
  },
];

const STAMPS = ['⭐', '🌸', '☀️', '🐾', '🎈', '💖', '🌈', '🍦'];

export function ColoringCanvasModule({ onStarEarned }: { onStarEarned: (count: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeColor, setActiveColor] = useState<string>('#ef4444');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [toolMode, setToolMode] = useState<'brush' | 'eraser' | 'stamp'>('brush');
  const [activeStamp, setActiveStamp] = useState<string>('⭐');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOutline>(TEMPLATES[1]); // Kucing default
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize canvas with template
  useEffect(() => {
    initCanvas();
  }, [selectedTemplate]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw chosen template outline
    selectedTemplate.drawOutline(ctx, canvas.width, canvas.height);

    // Save initial state
    saveHistoryState();
  };

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), imgData]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    soundService.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current
    const prev = newHistory[newHistory.length - 1];
    if (prev) {
      ctx.putImageData(prev, 0, 0);
      setHistory(newHistory);
    }
  };

  const handleClear = () => {
    soundService.playBoing();
    initCanvas();
  };

  // Drawing Handlers (Mouse & Touch)
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    if (toolMode === 'stamp') {
      soundService.playPop();
      ctx.font = '48px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeStamp, x, y);
      saveHistoryState();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (toolMode === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || toolMode === 'stamp') return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveHistoryState();
  };

  const handleDownloadAndSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    soundService.playVictory();
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.6 },
    });

    const activeKid = StorageService.getActiveStudent();
    StorageService.logActivity(
      activeKid.namaLengkap,
      'Studio Mewarnai',
      `Menyelesaikan lukisan ${selectedTemplate.name}`,
      5
    );
    onStarEarned(5);

    // Speech praise
    soundService.speakIndonesian(
      `Luar biasa sekali! Lukisan ${selectedTemplate.name} karya ${activeKid.namaPanggilan} sangat indah dan penuh warna!`
    );

    // Download image
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `karya-${selectedTemplate.id}-${activeKid.namaPanggilan}.png`;
    a.click();

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 p-6 rounded-3xl text-white shadow-xl shadow-pink-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-bounce-slow">
            🖌️
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white drop-shadow-sm">
              Studio Mewarnai & Menggambar Cilik
            </h2>
            <p className="text-pink-100 font-medium text-sm md:text-base">
              Warnai gambar lucu, tempel stiker stempel, dan simpan karyamu!
            </p>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                soundService.playPop();
                setSelectedTemplate(tpl);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTemplate.id === tpl.id
                  ? 'bg-white text-pink-600 shadow-md scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span>{tpl.emoji}</span> {tpl.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Toolbar: Colors, Brushes, Stamps */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border-4 border-pink-200 shadow-lg space-y-5">
          {/* Tool Modes */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              Pilihan Alat
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  soundService.playPop();
                  setToolMode('brush');
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  toolMode === 'brush'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-pink-50'
                }`}
              >
                <Paintbrush className="w-4 h-4" /> Kuas Cat
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  setToolMode('eraser');
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  toolMode === 'eraser'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-pink-50'
                }`}
              >
                <Eraser className="w-4 h-4" /> Penghapus
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  setToolMode('stamp');
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  toolMode === 'stamp'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-pink-50'
                }`}
              >
                <Stamp className="w-4 h-4" /> Stempel
              </button>
            </div>
          </div>

          {/* Color Palette (When in brush mode) */}
          {toolMode === 'brush' && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Pilihan Warna
              </h4>
              <div className="grid grid-cols-4 gap-2.5">
                {PALETTE.map((color) => {
                  const isCurrent = activeColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        soundService.playPop();
                        setActiveColor(color);
                      }}
                      className={`w-9 h-9 rounded-full shadow transition-transform cursor-pointer flex items-center justify-center border-2 border-white ${
                        isCurrent ? 'ring-4 ring-pink-400 scale-110 shadow-md' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {isCurrent && <Check className="w-4 h-4 text-white drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stamps Palette (When in stamp mode) */}
          {toolMode === 'stamp' && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Pilih Stiker Stempel
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {STAMPS.map((stamp) => (
                  <button
                    key={stamp}
                    onClick={() => {
                      soundService.playPop();
                      setActiveStamp(stamp);
                    }}
                    className={`text-2xl p-2 rounded-xl transition-all cursor-pointer ${
                      activeStamp === stamp
                        ? 'bg-pink-100 ring-2 ring-pink-400 scale-110 shadow'
                        : 'bg-slate-50 hover:bg-pink-50'
                    }`}
                  >
                    {stamp}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                👉 Sentuh kanvas untuk menempelkan stiker!
              </p>
            </div>
          )}

          {/* Brush Sizes */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              Ukuran Kuas
            </h4>
            <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              {[8, 14, 22, 32].map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    soundService.playPop();
                    setBrushSize(sz);
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                    brushSize === sz ? 'bg-pink-500 text-white shadow' : 'bg-white hover:bg-pink-100 text-slate-600'
                  }`}
                >
                  <div
                    className="rounded-full bg-current"
                    style={{ width: sz / 2 + 2, height: sz / 2 + 2 }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Undo and Clear */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Undo className="w-4 h-4" /> Batal Goresan
            </button>
            <button
              onClick={handleClear}
              className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              title="Bersihkan Kanvas"
            >
              <Trash2 className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* Center Drawing Canvas */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border-4 border-pink-200 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedTemplate.emoji}</span>
              <span className="font-black text-slate-800 text-base">{selectedTemplate.name}</span>
            </div>

            <button
              onClick={handleDownloadAndSave}
              className="py-2.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" /> Simpan Hasil Karyaku (+5 ⭐)
            </button>
          </div>

          {savedSuccess && (
            <div className="w-full bg-emerald-100 border border-emerald-300 text-emerald-800 p-3 rounded-2xl mb-3 text-center font-bold text-sm flex items-center justify-center gap-2 animate-bounce-slow">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Lukisan berhasil disimpan ke komputermu dan rapor aktivitasmu! Horee! 🎉
            </div>
          )}

          {/* HTML5 Canvas with touch action none for smooth drawing */}
          <div className="w-full border-4 border-dashed border-pink-300 rounded-3xl overflow-hidden shadow-inner bg-white flex justify-center items-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={460}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair max-w-full h-auto touch-none bg-white"
            />
          </div>

          <p className="text-xs text-slate-400 font-semibold mt-3 text-center">
            💡 Tips: Tekan & geser jari atau mouse untuk mewarnai. Sentuh tombol "Simpan Hasil Karyaku" untuk mengunduh lukisanmu!
          </p>
        </div>
      </div>
    </div>
  );
}
