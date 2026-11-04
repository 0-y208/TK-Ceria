import React, { useState } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  School,
  Calendar,
  Users2,
  BookMarked,
  UserCheck,
  FileSpreadsheet,
  KeyRound,
  BookOpen,
  Info,
  Sparkles,
  Shield,
  GraduationCap,
  ChevronDown,
  LogOut,
  User,
  Check,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
} from 'lucide-react';
import { SchoolProfile, AppUser, UserRole } from '../../types/paud';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';

export type AdminSection =
  | 'dashboard'
  | 'profil'
  | 'tahun_ajaran'
  | 'kelas'
  | 'buku_induk'
  | 'absensi'
  | 'rapor'
  | 'api_setting'
  | 'manual'
  | 'tentang';

interface AdminLayoutProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onSwitchToKidMode: () => void;
  currentUser: AppUser;
  allUsers: AppUser[];
  onSelectUser: (user: AppUser) => void;
  school: SchoolProfile;
  children: React.ReactNode;
}

export function AdminLayout({
  currentSection,
  onSelectSection,
  onSwitchToKidMode,
  currentUser,
  allUsers,
  onSelectUser,
  school,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Password confirmation modal state when switching users inside portal
  const [pendingUserToSwitch, setPendingUserToSwitch] = useState<AppUser | null>(null);
  const [switchPasswordInput, setSwitchPasswordInput] = useState('');
  const [switchPasswordError, setSwitchPasswordError] = useState(false);
  const [showSwitchPassword, setShowSwitchPassword] = useState(false);

  // All menu items available in the system
  const allMenuItems: {
    id: AdminSection;
    label: string;
    icon: React.ReactNode;
    allowedRoles: UserRole[]; // 'admin' | 'guru'
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      allowedRoles: ['admin'],
    },
    {
      id: 'profil',
      label: 'Profil Sekolah',
      icon: <School className="w-5 h-5" />,
      allowedRoles: ['admin'],
    },
    {
      id: 'tahun_ajaran',
      label: 'Tahun Ajaran',
      icon: <Calendar className="w-5 h-5" />,
      allowedRoles: ['admin'],
    },
    {
      id: 'kelas',
      label: 'Kelas Walikelas',
      icon: <Users2 className="w-5 h-5" />,
      allowedRoles: ['admin'],
    },
    {
      id: 'buku_induk',
      label: 'Buku Induk',
      icon: <BookMarked className="w-5 h-5" />,
      allowedRoles: ['admin'],
    },
    {
      id: 'absensi',
      label: 'Absensi Murid',
      icon: <UserCheck className="w-5 h-5" />,
      allowedRoles: ['admin', 'guru'],
      badge: 'Guru & Admin',
    },
    {
      id: 'rapor',
      label: 'Manajemen Rapor',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      allowedRoles: ['admin', 'guru'],
      badge: 'Guru & Admin',
    },
    {
      id: 'api_setting',
      label: 'Pengaturan API',
      icon: <KeyRound className="w-5 h-5" />,
      allowedRoles: ['admin'],
    },
    {
      id: 'manual',
      label: 'Manual Pengguna',
      icon: <BookOpen className="w-5 h-5" />,
      allowedRoles: ['admin', 'guru'],
    },
    {
      id: 'tentang',
      label: 'Tentang Aplikasi',
      icon: <Info className="w-5 h-5" />,
      allowedRoles: ['admin', 'guru'],
    },
  ];

  // Filter items based on active user role:
  // Admin has access to all items
  // Guru has access to absensi, rapor, manual, tentang
  const visibleMenuItems = allMenuItems.filter((item) =>
    item.allowedRoles.includes(currentUser.role)
  );

  const handleNavClick = (id: AdminSection) => {
    soundService.playPop();
    onSelectSection(id);
    setSidebarOpen(false);
  };

  // Open password modal before switching user
  const handleInitiateUserSwitch = (targetUser: AppUser) => {
    if (targetUser.id === currentUser.id) {
      setShowRoleDropdown(false);
      return;
    }
    soundService.playPop();
    setPendingUserToSwitch(targetUser);
    setSwitchPasswordInput('');
    setSwitchPasswordError(false);
    setShowRoleDropdown(false);
  };

  const handleConfirmSwitchPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUserToSwitch) return;

    const requiredPassword = pendingUserToSwitch.password || (pendingUserToSwitch.role === 'admin' ? 'admin' : 'guru');

    if (switchPasswordInput.trim().toLowerCase() === requiredPassword.toLowerCase()) {
      soundService.playVictory();
      onSelectUser(pendingUserToSwitch);
      setPendingUserToSwitch(null);
      setSwitchPasswordInput('');
      setSwitchPasswordError(false);

      // If switching to Guru and current section is admin-only, redirect to 'absensi'
      if (pendingUserToSwitch.role === 'guru' && !['absensi', 'rapor', 'manual', 'tentang'].includes(currentSection)) {
        onSelectSection('absensi');
      }
    } else {
      soundService.playBoing();
      setSwitchPasswordError(true);
    }
  };

  const adminUser = allUsers.find((u) => u.role === 'admin') || allUsers[0];
  const teacherUsers = allUsers.filter((u) => u.role === 'guru');

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-800">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Matching screenshot style */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2f353b] text-slate-200 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-16 px-5 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl shrink-0">📚</span>
              <div className="leading-tight">
                <span className="font-extrabold text-sm text-white tracking-tight block">
                  TK MASYITHOH
                </span>
                <span className="font-black text-xs text-amber-400 tracking-wider block">
                  CIMANGGU
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card inside Sidebar (Matches user's screenshot exactly!) */}
          <div className="p-3 mx-3 my-2 bg-slate-800/80 rounded-xl border border-slate-700 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl p-1 bg-slate-700 rounded-lg shrink-0">
                  {currentUser.avatar}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {currentUser.namaLengkap.split(',')[0]}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        currentUser.role === 'admin'
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {currentUser.role === 'admin' ? 'SUPER ADMIN' : 'GURU KELAS'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dropdown Toggle to switch between Admin or 4 Teachers */}
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
                title="Ganti Akun Pengguna (Kata Sandi diperlukan)"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown Menu listing Admin & 4 Teachers */}
            {showRoleDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                {/* Administrator Section */}
                <div className="px-3 py-1 text-[10px] uppercase font-black text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Administrator PAUD</span>
                  <Shield className="w-3 h-3 text-rose-500" />
                </div>

                <button
                  onClick={() => handleInitiateUserSwitch(adminUser)}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${
                    currentUser.id === adminUser.id ? 'bg-rose-50/80 font-bold text-rose-900' : 'text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{adminUser.avatar}</span>
                    <div className="truncate">
                      <div className="font-bold text-xs">{adminUser.namaLengkap.split(',')[0]}</div>
                      <div className="text-[10px] text-slate-400">Super Admin (Sandi: admin)</div>
                    </div>
                  </div>
                  {currentUser.id === adminUser.id ? (
                    <Check className="w-4 h-4 text-rose-600 shrink-0 ml-1" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </button>

                {/* 4 Guru Section */}
                <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-black text-slate-400 border-t border-b border-slate-100 mt-1 flex items-center justify-between">
                  <span>4 User Guru (Wali Kelas)</span>
                  <GraduationCap className="w-3 h-3 text-emerald-600" />
                </div>

                <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
                  {teacherUsers.map((teacher) => {
                    const isSelected = currentUser.id === teacher.id;
                    return (
                      <button
                        key={teacher.id}
                        onClick={() => handleInitiateUserSwitch(teacher)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-emerald-50/80 font-bold text-emerald-950' : 'text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{teacher.avatar}</span>
                          <div className="truncate">
                            <div className="font-bold text-xs">{teacher.namaLengkap}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold truncate">
                              {teacher.kelasNama || teacher.jabatan} (Sandi: guru)
                            </div>
                          </div>
                        </div>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 overflow-y-auto py-2 px-2.5 space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{currentUser.role === 'admin' ? 'Menu Administrator' : 'Menu Guru / Walikelas'}</span>
              {currentUser.role === 'guru' && (
                <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded font-normal">
                  2 Fitur Utama
                </span>
              )}
            </div>

            {visibleMenuItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#007bff] text-white shadow font-semibold'
                      : 'text-slate-300 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && currentUser.role === 'admin' && (
                    <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-normal">
                      Guru
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Bottom: Switch to Kids Mode */}
          <div className="p-3 border-t border-slate-700/60 bg-[#262c31]">
            <button
              onClick={() => {
                soundService.playVictory();
                onSwitchToKidMode();
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Buka Ruang Belajar Anak 🐰
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-slate-800 capitalize hidden sm:block">
                {currentSection === 'dashboard'
                  ? 'Dashboard'
                  : allMenuItems.find((m) => m.id === currentSection)?.label}
              </h2>
            </div>

            {/* Topbar User Switcher & Info */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick User Selector Dropdown in Topbar */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                  title="Ganti akun pengguna (Kata Sandi diperlukan)"
                >
                  <span className="text-base">{currentUser.avatar}</span>
                  <div className="text-left hidden sm:block">
                    <span className="block font-black text-xs leading-tight">
                      {currentUser.namaLengkap}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-semibold leading-tight">
                      {currentUser.role === 'admin' ? 'Super Administrator' : (currentUser.kelasNama || 'Guru Kelas')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hidden lg:block">
                {school.namaSekolah}
              </span>

              <button
                onClick={() => {
                  soundService.playVictory();
                  onSwitchToKidMode();
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>🐰 Mode Anak</span>
              </button>
            </div>
          </header>

          {/* Guru Role Notification Bar when active */}
          {currentUser.role === 'guru' && (
            <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentUser.avatar}</span>
                <span>
                  Login sebagai <strong>{currentUser.namaLengkap}</strong> ({currentUser.kelasNama || 'Guru Kelas'}). Hak akses aktif: <strong>Presensi / Absensi Murid</strong> dan <strong>Manajemen Rapor Siswa</strong>.
                </span>
              </div>
              <button
                onClick={() => handleInitiateUserSwitch(adminUser)}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Beralih ke Admin ➔</span>
              </button>
            </div>
          )}

          {/* Dynamic Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50">
            {children}
          </main>

          {/* Footer - Exactly like screenshot */}
          <footer className="bg-white border-t border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span className="font-semibold text-slate-700">TK MASYITHOH CIMANGGU</span> - Aplikasi Rapor PAUD Berbasis AI •{' '}
              <a href="https://www.paud.id" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                https://www.paud.id
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-[#f39c12] text-white px-2.5 py-1 rounded font-bold text-[11px] flex items-center gap-1">
                <span>📖</span> Kurikulum Merdeka
              </span>
              <span className="text-slate-500 font-medium">Version 2.6.1</span>
            </div>
          </footer>
        </div>
      </div>

      {/* PASSWORD VERIFICATION MODAL WHEN SWITCHING USER IN ADMIN PORTAL */}
      {pendingUserToSwitch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border-4 border-slate-300 shadow-2xl space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner mb-2 border border-amber-200">
                🔒
              </div>
              <h3 className="text-xl font-black text-slate-800">
                Konfirmasi Kata Sandi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan kata sandi untuk beralih ke akun <strong>{pendingUserToSwitch.namaLengkap}</strong>:
              </p>
            </div>

            {/* Target Account Badge */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <span className="text-3xl p-1 bg-white rounded-xl shadow-xs border border-slate-200">
                {pendingUserToSwitch.avatar}
              </span>
              <div className="min-w-0">
                <div className="font-extrabold text-xs text-slate-900 truncate">
                  {pendingUserToSwitch.namaLengkap}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {pendingUserToSwitch.role === 'admin' ? 'Super Administrator' : (pendingUserToSwitch.kelasNama || 'Guru Kelas')}
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmSwitchPassword} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Kata Sandi:
                  </label>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Sandi default: <strong>{pendingUserToSwitch.role === 'admin' ? 'admin' : 'guru'}</strong>
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showSwitchPassword ? 'text' : 'password'}
                    value={switchPasswordInput}
                    onChange={(e) => {
                      setSwitchPasswordInput(e.target.value);
                      setSwitchPasswordError(false);
                    }}
                    placeholder={`Masukkan sandi (${pendingUserToSwitch.role === 'admin' ? 'admin' : 'guru'})`}
                    className={`w-full py-2.5 pl-3.5 pr-10 rounded-xl border-2 text-xs font-bold outline-none bg-white transition-all ${
                      switchPasswordError
                        ? 'border-rose-400 focus:border-rose-600 ring-2 ring-rose-100'
                        : 'border-slate-300 focus:border-blue-500'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowSwitchPassword(!showSwitchPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSwitchPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {switchPasswordError && (
                  <p className="text-rose-600 text-xs font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    Kata sandi keliru! Gunakan kata sandi <strong>"{pendingUserToSwitch.role === 'admin' ? 'admin' : 'guru'}"</strong>.
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPendingUserToSwitch(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-black cursor-pointer shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
                    pendingUserToSwitch.role === 'admin'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Buka Akses</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
