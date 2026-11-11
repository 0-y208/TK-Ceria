import { useState } from 'react';
import { Volume2, VolumeX, Award, ShieldAlert, ChevronDown, Shield, GraduationCap, Check, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Student, SchoolProfile, UserRole, AppUser } from '../../types/paud';
import { soundService } from '../../services/soundService';

interface KidsHeaderProps {
  school: SchoolProfile;
  students: Student[];
  activeStudent: Student;
  allUsers: AppUser[];
  onSelectStudent: (id: string) => void;
  onOpenStickers: () => void;
  onSwitchToAdmin: (user?: AppUser) => void;
  starsCount: number;
}

export function KidsHeader({
  school,
  students,
  activeStudent,
  allUsers,
  onSelectStudent,
  onOpenStickers,
  onSwitchToAdmin,
  starsCount,
}: KidsHeaderProps) {
  const [isMuted, setIsMuted] = useState(soundService.getIsMuted());
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>(allUsers[0]?.id || 'usr-admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const adminUser = allUsers.find((u) => u.role === 'admin') || allUsers[0];
  const teacherUsers = allUsers.filter((u) => u.role === 'guru');
  const currentSelectedUser = allUsers.find((u) => u.id === selectedUserId) || adminUser;

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundService.playPop();
    }
  };

  const handleAdminClick = () => {
    soundService.playPop();
    setPasswordInput('');
    setPasswordError(false);
    setShowPinModal(true);
  };

  const handleSelectUser = (userId: string) => {
    soundService.playPop();
    setSelectedUserId(userId);
    setPasswordError(false);
    setPasswordInput('');
  };

  const handleProceedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = allUsers.find((u) => u.id === selectedUserId) || adminUser;
    const requiredPassword = targetUser.password || (targetUser.role === 'admin' ? 'admin' : 'guru');

    // Case-insensitive / trimmed match; default hint is provided
    if (passwordInput.trim().toLowerCase() === requiredPassword.toLowerCase()) {
      setShowPinModal(false);
      setPasswordError(false);
      setPasswordInput('');
      soundService.playVictory();
      onSwitchToAdmin(targetUser);
    } else {
      soundService.playBoing();
      setPasswordError(true);
    }
  };

  return (
    <>
      {/* Playful Rainbow Top Ribbon */}
      <div className="h-2.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-sky-400 via-blue-500 to-purple-500 shadow-xs" />
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b-4 border-amber-400 shadow-md px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-3xl shadow-lg border-2 border-white ring-3 ring-amber-300/70 animate-bounce-slow shrink-0">
              🐰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text tracking-wide font-['Fredoka']">
                  TK Pintar Ceria
                </h1>
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Kurikulum Merdeka
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold">
                {school.namaSekolah} • E-Learning & Sistem Penilaian Anak Ceria
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Student Switcher */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 py-1.5 px-3 rounded-2xl shadow-xs">
                <span className="text-xl">{activeStudent.fotoAvatar}</span>
                <select
                  value={activeStudent.id}
                  onChange={(e) => {
                    soundService.playPop();
                    onSelectStudent(e.target.value);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-black text-slate-700 outline-none cursor-pointer pr-1"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.namaPanggilan} ({s.namaLengkap.split(' ')[0]})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Stars Counter */}
            <button
              onClick={() => {
                soundService.playSparkle();
                onOpenStickers();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-white font-black px-4 py-2 rounded-2xl shadow-md shadow-amber-300/50 text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer border-2 border-white ring-2 ring-amber-300"
              title="Lihat Bintang & Piagam"
            >
              <span className="text-xl animate-spin-slow filter drop-shadow">⭐</span>
              <span className="tracking-wide">{starsCount} Bintang</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}
              title={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Switch to Teacher / Admin Portal */}
            <button
              onClick={handleAdminClick}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-black px-3.5 py-2 rounded-2xl shadow transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>🏫 Portal Admin & Guru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Role & Specific User Selection Modal WITH PASSWORD AUTHENTICATION */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border-4 border-slate-300 shadow-2xl space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner mb-2 border border-blue-100">
                🔐
              </div>
              <h3 className="text-xl font-black text-slate-800">
                Login Akun Portal PAUD
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih akun pengguna di bawah lalu masukkan <strong>kata sandi</strong>:
              </p>
            </div>

            <form onSubmit={handleProceedLogin} className="space-y-4">
              {/* Admin Choice Button */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  1. Administrator Utama:
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectUser(adminUser.id)}
                  className={`w-full p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-left ${
                    selectedUserId === adminUser.id
                      ? 'border-rose-500 bg-rose-50/80 shadow-md ring-2 ring-rose-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-white rounded-xl shadow-xs border border-rose-200">
                      {adminUser.avatar}
                    </span>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        {adminUser.namaLengkap}
                        <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[9px] font-black rounded uppercase">
                          Super Admin
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Akses Penuh: Dashboard, Profil, Kelas, Buku Induk, Absensi & Rapor
                      </div>
                    </div>
                  </div>
                  {selectedUserId === adminUser.id && (
                    <Check className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              </div>

              {/* 4 Teacher Users Choice */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                  2. Pilih User Guru (Wali Kelas):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {teacherUsers.map((teacher) => {
                    const isSelected = selectedUserId === teacher.id;
                    return (
                      <button
                        key={teacher.id}
                        type="button"
                        onClick={() => handleSelectUser(teacher.id)}
                        className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-left ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl p-1 bg-white rounded-xl shadow-xs border border-emerald-200 shrink-0">
                            {teacher.avatar}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 truncate">
                              {teacher.namaLengkap}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold truncate">
                              {teacher.kelasNama || teacher.jabatan}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Password Input Section */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                    Kata Sandi untuk <strong>{currentSelectedUser.namaLengkap.split(',')[0]}</strong>:
                  </label>
                  <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Sandi default: <strong>{currentSelectedUser.role === 'admin' ? 'admin' : 'guru'}</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    placeholder={`Masukkan kata sandi (contoh: ${currentSelectedUser.role === 'admin' ? 'admin' : 'guru'})`}
                    className={`w-full py-2.5 pl-3.5 pr-10 rounded-xl border-2 text-xs font-bold outline-none bg-white transition-all ${
                      passwordError
                        ? 'border-rose-400 focus:border-rose-600 ring-2 ring-rose-100'
                        : 'border-slate-300 focus:border-blue-500'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-rose-600 text-xs font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    Kata sandi keliru! Gunakan kata sandi <strong>"{currentSelectedUser.role === 'admin' ? 'admin' : 'guru'}"</strong>.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-black cursor-pointer shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
                    currentSelectedUser.role === 'admin'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Masuk sebagai {currentSelectedUser.namaLengkap.split(',')[0]}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
