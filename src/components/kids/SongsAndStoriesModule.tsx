import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, BookOpen, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NurserySong, FableStory } from '../../types/paud';
import { soundService } from '../../services/soundService';
import { StorageService } from '../../services/storageService';

export function SongsAndStoriesModule({ onStarEarned }: { onStarEarned: (count: number) => void }) {
  const [section, setSection] = useState<'lagu' | 'dongeng'>('lagu');
  const songs = StorageService.getSongs();
  const stories = StorageService.getStories();

  // Song state
  const [activeSong, setActiveSong] = useState<NurserySong>(songs[0]);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [completedSong, setCompletedSong] = useState<boolean>(false);
  
  const isPlayingRef = useRef<boolean>(false);
  const currentLineRef = useRef<number>(0);
  const nextLineTimerRef = useRef<number | null>(null);

  // Story state
  const [activeStory, setActiveStory] = useState<FableStory>(stories[0]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Stop any playing audio on unmount
  useEffect(() => {
    return () => {
      stopSongPlayback();
      soundService.stopSpeech();
    };
  }, []);

  const clearTimer = () => {
    if (nextLineTimerRef.current) {
      window.clearTimeout(nextLineTimerRef.current);
      nextLineTimerRef.current = null;
    }
  };

  const stopSongPlayback = () => {
    isPlayingRef.current = false;
    clearTimer();
    setIsPlayingSong(false);
    soundService.stopSpeech();
  };

  const handleSelectSong = (song: NurserySong) => {
    stopSongPlayback();
    soundService.playPop();
    setActiveSong(song);
    setCurrentLineIndex(0);
    currentLineRef.current = 0;
    setCompletedSong(false);
  };

  const handleTogglePlaySong = () => {
    if (isPlayingSong) {
      stopSongPlayback();
    } else {
      // If was completed or at end, restart from beginning
      if (currentLineIndex >= activeSong.lyrics.length - 1 && completedSong) {
        startSongPlayback(0);
      } else {
        startSongPlayback(currentLineIndex);
      }
    }
  };

  const handleJumpToLine = (index: number) => {
    soundService.playPop();
    startSongPlayback(index);
  };

  const startSongPlayback = (startFromIndex: number = 0) => {
    clearTimer();
    soundService.stopSpeech();
    
    isPlayingRef.current = true;
    setIsPlayingSong(true);
    setCompletedSong(false);
    currentLineRef.current = startFromIndex;
    setCurrentLineIndex(startFromIndex);

    const singStep = (index: number) => {
      if (!isPlayingRef.current) return;

      // Check if finished all lyrics
      if (index >= activeSong.lyrics.length) {
        isPlayingRef.current = false;
        setIsPlayingSong(false);
        setCompletedSong(true);
        setCurrentLineIndex(activeSong.lyrics.length - 1);
        
        soundService.playVictory();
        confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
        onStarEarned(3);
        StorageService.logActivity(
          StorageService.getActiveStudent().namaLengkap,
          'Lagu Ceria',
          `Menyanyikan lagu "${activeSong.title}" hingga baris terakhir`,
          3
        );
        soundService.speakIndonesian(`Horeee! Lagu ${activeSong.title} sudah selesai dinyanyikan sampai akhir! Hebat sekali!`);
        return;
      }

      currentLineRef.current = index;
      setCurrentLineIndex(index);

      // Play melodic musical flourish for this line
      soundService.playSongLineMelody(activeSong.melodyBeats, index);

      // Strip emojis from lyric line so speech is clear and fluent
      const textToSing = activeSong.lyrics[index]
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .trim();

      soundService.speakIndonesian(textToSing, () => {
        if (!isPlayingRef.current) return;

        // Brief melodic interval of 400ms before singing the next line
        clearTimer();
        nextLineTimerRef.current = window.setTimeout(() => {
          if (isPlayingRef.current) {
            singStep(index + 1);
          }
        }, 400);
      });
    };

    singStep(startFromIndex);
  };

  const handleReadStoryPage = (pageIdx: number) => {
    const page = activeStory.pages[pageIdx];
    soundService.playSparkle();
    soundService.speakIndonesian(page.text);
  };

  const handleNextPage = () => {
    if (currentPage < activeStory.pages.length - 1) {
      soundService.playPop();
      const next = currentPage + 1;
      setCurrentPage(next);
      handleReadStoryPage(next);
      if (next === activeStory.pages.length - 1) {
        // finished story
        soundService.playVictory();
        confetti({ particleCount: 40, spread: 60 });
        onStarEarned(4);
        StorageService.logActivity(
          StorageService.getActiveStudent().namaLengkap,
          'Dongeng Fabel',
          `Menamatkan cerita ${activeStory.title}`,
          4
        );
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      soundService.playPop();
      const prev = currentPage - 1;
      setCurrentPage(prev);
      handleReadStoryPage(prev);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-bounce-slow">
            🎶
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white drop-shadow-sm">
              Pojok Bernyanyi & Dongeng Budi Pekerti
            </h2>
            <p className="text-blue-100 font-medium text-sm md:text-base">
              Lagu anak Indonesia bernyanyi otomatis sampai akhir lirik & cerita dongeng fabel berkarakter!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/20 p-1.5 rounded-2xl backdrop-blur-sm">
          <button
            onClick={() => {
              soundService.playPop();
              setSection('lagu');
              stopSongPlayback();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              section === 'lagu' ? 'bg-white text-indigo-700 shadow-md scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <Music className="w-4 h-4" /> Karaoke Lagu Anak
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setSection('dongeng');
              stopSongPlayback();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              section === 'dongeng' ? 'bg-white text-indigo-700 shadow-md scale-105' : 'text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Cerita Dongeng Fabel
          </button>
        </div>
      </div>

      {section === 'lagu' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Song Karaoke Player */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border-4 border-indigo-200 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-5 gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{activeSong.icon}</span>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{activeSong.title}</h3>
                    <p className="text-xs font-bold text-indigo-600">Ciptaan: {activeSong.composer}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlaySong}
                    className={`px-5 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95 ${
                      isPlayingSong
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 animate-pulse'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
                    }`}
                  >
                    {isPlayingSong ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlayingSong ? 'Jeda Karaoke' : completedSong ? 'Ulangi Bernyanyi' : 'Putar & Nyanyi'}
                  </button>
                  <button
                    onClick={() => {
                      stopSongPlayback();
                      startSongPlayback(0);
                    }}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                    title="Ulangi dari Awal"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and Progress Bar */}
              <div className="mb-4 bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <span className="text-base">{isPlayingSong ? '🎤' : '🎵'}</span>
                  <span>
                    {isPlayingSong
                      ? `Sedang Bernyanyi: Baris ${currentLineIndex + 1} dari ${activeSong.lyrics.length}`
                      : completedSong
                      ? `🎉 Lagu "${activeSong.title}" Selesai Dinyanyikan!`
                      : `Siap bernyanyi • Tekan tombol untuk mulai`}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-full shadow-xs">
                  {Math.round(((currentLineIndex + 1) / activeSong.lyrics.length) * 100)}% Lirik
                </span>
              </div>

              {/* Karaoke Animated Lyrics */}
              <div className="space-y-2.5 my-3">
                {activeSong.lyrics.map((line, idx) => {
                  const isCurrent = idx === currentLineIndex;
                  const isPassed = idx < currentLineIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleJumpToLine(idx)}
                      title="Klik untuk bernyanyi dari baris ini"
                      className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between gap-3 text-base sm:text-lg font-black cursor-pointer ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-200 border-2 border-amber-400 text-amber-950 shadow-md scale-102 pl-5 ring-4 ring-amber-200'
                          : isPassed
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 opacity-90'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCurrent ? (
                          <span className="text-2xl animate-bounce">🎤</span>
                        ) : isPassed ? (
                          <span className="text-xs bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                            {idx + 1}
                          </span>
                        )}
                        <span>{line}</span>
                      </div>

                      {isCurrent && isPlayingSong && (
                        <span className="text-xs uppercase tracking-wider bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-black animate-pulse whitespace-nowrap">
                          Sedang Nyanyi...
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {completedSong && (
                <div className="mt-4 p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center font-black text-emerald-900 text-sm animate-bounce-slow">
                  🎉 Horeee! Lagu "{activeSong.title}" selesai dinyanyikan sampai akhir! Kamu mendapatkan +3 Bintang Emas! ⭐⭐⭐
                </div>
              )}
            </div>

            <div className="mt-5 p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-indigo-700 font-bold gap-2">
              <span>💡 Tips: Suara akan bernyanyi berurutan baris demi baris sampai bait terakhir lagu.</span>
              <span className="text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">+3 ⭐ Setiap Lagu Selesai</span>
            </div>
          </div>

          {/* Song Selection List */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-4 border-indigo-200 shadow-md">
            <h4 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Daftar Lagu Pilihan:
            </h4>

            <div className="space-y-3">
              {songs.map((song) => {
                const isSelected = activeSong.id === song.id;
                return (
                  <button
                    key={song.id}
                    onClick={() => handleSelectSong(song)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer kid-card ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 ring-3 ring-indigo-200 shadow-md'
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{song.icon}</span>
                      <div>
                        <h5 className="font-black text-slate-800 text-sm">{song.title}</h5>
                        <p className="text-[11px] font-semibold text-slate-400">{song.composer}</p>
                      </div>
                    </div>
                    {isSelected && isPlayingSong ? (
                      <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full font-bold animate-pulse">
                        Bernyanyi...
                      </span>
                    ) : (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                        Pilih
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Stories View */
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 border-4 border-violet-200 shadow-xl">
          {/* Story Selector Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Koleksi Dongeng Fabel ({stories.length} Cerita Penuh Karakter)
              </span>
              <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">
                Pilih cerita untuk mulai membaca
              </span>
            </div>

            {/* Story Selector tabs */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {stories.map((st, idx) => (
                <button
                  key={st.id}
                  onClick={() => {
                    soundService.playPop();
                    soundService.stopSpeech();
                    setActiveStory(st);
                    setCurrentPage(0);
                  }}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border-2 ${
                    activeStory.id === st.id
                      ? 'bg-violet-600 text-white border-violet-700 shadow-md scale-102'
                      : 'bg-violet-50/80 text-violet-800 border-violet-100 hover:bg-violet-100 hover:border-violet-200'
                  }`}
                >
                  <span className="text-base">
                    {idx === 0
                      ? '🦌'
                      : idx === 1
                      ? '🐜'
                      : idx === 2
                      ? '🐰'
                      : idx === 3
                      ? '🦁'
                      : idx === 4
                      ? '🐦'
                      : idx === 5
                      ? '🐥'
                      : '🐘'}
                  </span>
                  <span>{st.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-black text-slate-800">{activeStory.title}</h3>
            <p className="text-xs font-bold text-violet-600 mt-1">Tokoh: {activeStory.characters}</p>
          </div>

          {/* Book Page Card */}
          <div className="bg-amber-50/70 border-4 border-amber-200 rounded-3xl p-8 min-h-72 flex flex-col items-center justify-center text-center relative shadow-inner">
            <div className="text-7xl md:text-8xl my-4 animate-float">
              {activeStory.pages[currentPage].illustrationEmoji}
            </div>

            <p className="text-lg md:text-2xl font-bold text-slate-800 max-w-2xl leading-relaxed my-4">
              "{activeStory.pages[currentPage].text}"
            </p>

            <button
              onClick={() => handleReadStoryPage(currentPage)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-full shadow border border-amber-200 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-600" /> Baca Halaman Ini dengan Suara
            </button>
          </div>

          {/* Moral Message on Last Page */}
          {currentPage === activeStory.pages.length - 1 && (
            <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center">
              <span className="text-xs uppercase font-black tracking-wider text-emerald-700">
                Pesan Budi Pekerti & Karakter:
              </span>
              <p className="text-base font-black text-emerald-900 mt-1">
                🌟 {activeStory.moral}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 text-sm font-black flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Halaman Sebelumnya
            </button>

            <span className="text-sm font-black text-slate-500">
              Halaman {currentPage + 1} dari {activeStory.pages.length}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === activeStory.pages.length - 1}
              className="px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-30 text-white text-sm font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-200"
            >
              Halaman Selanjutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
