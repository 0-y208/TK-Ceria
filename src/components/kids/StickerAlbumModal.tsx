import { useState } from 'react';
import { X, Award, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { Student, SchoolProfile } from '../../types/paud';
import { soundService } from '../../services/soundService';

interface StickerAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  school: SchoolProfile;
}

const ALL_BADGES = [
  { id: 'bintang_huruf', title: 'Bintang Huruf', desc: 'Mengenal simbol & bunyi alfabet A-Z', emoji: '🔤', color: 'from-amber-400 to-orange-400' },
  { id: 'jago_hitung', title: 'Jago Berhitung', desc: 'Membilang benda & angka 1-10', emoji: '🔢', color: 'from-teal-400 to-emerald-400' },
  { id: 'seniman_cilik', title: 'Seniman Cilik', desc: 'Mewarnai & menggambar karya indah', emoji: '🎨', color: 'from-pink-400 to-rose-400' },
  { id: 'penyanyi_ceria', title: 'Penyanyi Ceria', desc: 'Menyanyikan lagu anak Indonesia', emoji: '🎶', color: 'from-blue-400 to-indigo-400' },
  { id: 'sahabat_santun', title: 'Sahabat Santun', desc: 'Berbudi pekerti & suka berbagi', emoji: '💖', color: 'from-purple-400 to-violet-400' },
  { id: 'petualang_pintar', title: 'Petualang Cilik', desc: 'Menyelesaikan teka-teki logika', emoji: '🏆', color: 'from-yellow-400 to-amber-500' },
];

export function StickerAlbumModal({ isOpen, onClose, student, school }: StickerAlbumModalProps) {
  const [showCertificate, setShowCertificate] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundService.playSparkle();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-300 shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <h3 className="text-xl font-black text-white drop-shadow">
                Papan Prestasi & Bintang Ceria
              </h3>
              <p className="text-amber-100 text-xs font-bold">
                Milik: {student.namaLengkap} ({student.namaPanggilan})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playPop();
              onClose();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!showCertificate ? (
            <>
              {/* Star Summary Card */}
              <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-3xl shadow-md">
                    {student.fotoAvatar}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800">{student.namaLengkap}</h4>
                    <p className="text-xs font-bold text-amber-700">TK PAUD: {school.namaSekolah}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-amber-600 flex items-center gap-1 justify-end">
                    <span>⭐</span> {student.bintangTerkumpul}
                  </div>
                  <span className="text-xs font-bold text-slate-400">Total Bintang Emas</span>
                </div>
              </div>

              {/* Badges Collection Grid */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Koleksi Lencana Capaian Belajar:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ALL_BADGES.map((b) => {
                    const isUnlocked = student.bintangTerkumpul >= 15; // Unlocked based on progression
                    return (
                      <div
                        key={b.id}
                        className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                          isUnlocked
                            ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <span className="text-3xl mb-1">{b.emoji}</span>
                        <h5 className="font-black text-xs text-slate-800">{b.title}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{b.desc}</p>
                        {isUnlocked ? (
                          <span className="mt-2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terkumpul
                          </span>
                        ) : (
                          <span className="mt-2 text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                            Terkunci
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action: Open Certificate */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundService.playVictory();
                    setShowCertificate(true);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <Award className="w-5 h-5" /> Lihat & Cetak Piagam Penghargaan Anak Pintar
                </button>
              </div>
            </>
          ) : (
            /* Printable Certificate View */
            <div className="space-y-4">
              <div
                id="printable-certificate"
                className="p-8 rounded-3xl border-8 border-amber-400 bg-amber-50/60 relative text-center shadow-lg"
              >
                {/* Decorative corners */}
                <span className="absolute top-2 left-3 text-3xl">🌟</span>
                <span className="absolute top-2 right-3 text-3xl">🌟</span>
                <span className="absolute bottom-2 left-3 text-3xl">🌟</span>
                <span className="absolute bottom-2 right-3 text-3xl">🌟</span>

                <div className="text-xs uppercase font-black tracking-widest text-amber-700">
                  {school.namaSekolah} • SEMARANG
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-amber-800 my-2 tracking-wide font-['Fredoka']">
                  PIAGAM BINTANG CERIA
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Diberikan dengan penuh rasa bangga dan cinta kepada:
                </p>

                <div className="my-4 py-2 border-b-2 border-amber-300 max-w-sm mx-auto">
                  <h3 className="text-2xl font-black text-slate-900">{student.namaLengkap}</h3>
                  <p className="text-xs font-bold text-amber-700">NISN: {student.nisn}</p>
                </div>

                <p className="text-xs md:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Telah aktif, kreatif, dan bersemangat dalam menyelesaikan petualangan belajar mengenal huruf, angka, mewarnai, serta menunjukkan budi pekerti yang santun di TK PAUD.
                </p>

                <div className="flex justify-between items-end mt-8 pt-4 text-xs font-bold text-slate-700 px-6">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">Guru Wali Kelas</p>
                    <div className="h-10 flex items-center justify-center font-['Nunito'] italic text-slate-500">
                      (Tertanda)
                    </div>
                    <p className="border-t border-slate-300 pt-1">Siti Rahmawati, S.Pd.</p>
                  </div>

                  <div className="text-4xl filter drop-shadow">
                    🏅
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] text-slate-400">Kepala Sekolah</p>
                    <div className="h-10 flex items-center justify-center font-['Nunito'] italic text-slate-500">
                      (Tertanda)
                    </div>
                    <p className="border-t border-slate-300 pt-1">{school.kepalaSekolah}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Kembali ke Album
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-200"
                >
                  <Printer className="w-4 h-4" /> Cetak Piagam (Print / PDF)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
