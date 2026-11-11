/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SchoolProfile, Student, ClassRoom, RaporAssessment, ActivityLog, AppUser, UserRole } from './types/paud';
import { StorageService } from './services/storageService';
import { soundService } from './services/soundService';

// Kid Components
import { KidsHeader } from './components/kids/KidsHeader';
import { KidsNav, KidModuleType } from './components/kids/KidsNav';
import { AlphabetModule } from './components/kids/AlphabetModule';
import { HijaiyahModule } from './components/kids/HijaiyahModule';
import { NumbersModule } from './components/kids/NumbersModule';
import { ShapesColorsModule } from './components/kids/ShapesColorsModule';
import { ColoringCanvasModule } from './components/kids/ColoringCanvasModule';
import { SongsAndStoriesModule } from './components/kids/SongsAndStoriesModule';
import { MiniGamesModule } from './components/kids/MiniGamesModule';
import { StickerAlbumModal } from './components/kids/StickerAlbumModal';

// Admin Components
import { AdminLayout, AdminSection } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SchoolProfileView } from './components/admin/SchoolProfileView';
import { ClassesView } from './components/admin/ClassesView';
import { StudentsView } from './components/admin/StudentsView';
import { AttendanceView } from './components/admin/AttendanceView';
import { RaporManagementView } from './components/admin/RaporManagementView';
import { AcademicYearView } from './components/admin/AcademicYearView';
import { UserGuideView } from './components/admin/UserGuideView';

export type KidTheme = 'pelangi' | 'permen' | 'safari' | 'angkasa';

export default function App() {
  const [appMode, setAppMode] = useState<'kids' | 'admin'>('kids');
  const [kidModule, setKidModule] = useState<KidModuleType>('alfabet');
  const [kidTheme, setKidTheme] = useState<KidTheme>(() => {
    return (localStorage.getItem('paud_kid_theme') as KidTheme) || 'pelangi';
  });
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);
  const [raporTargetStudentId, setRaporTargetStudentId] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<AppUser>(StorageService.getCurrentUser());

  // Core Data States loaded from StorageService
  const [school, setSchool] = useState<SchoolProfile>(StorageService.getSchoolProfile());
  const [classes, setClasses] = useState<ClassRoom[]>(StorageService.getClasses());
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [assessments, setAssessments] = useState<RaporAssessment[]>(StorageService.getAssessments());
  const [logs, setLogs] = useState<ActivityLog[]>(StorageService.getActivityLogs());
  const [activeStudent, setActiveStudent] = useState<Student>(StorageService.getActiveStudent());

  const handleSelectTheme = (theme: KidTheme, name: string) => {
    soundService.playPop();
    setKidTheme(theme);
    localStorage.setItem('paud_kid_theme', theme);
    soundService.speakIndonesian(`Suasana ${name}!`);
  };

  useEffect(() => {
    // Keep active student up-to-date with student list
    const found = students.find((s) => s.id === activeStudent.id) || students[0];
    if (found) setActiveStudent(found);
  }, [students]);

  const handleSelectStudent = (id: string) => {
    StorageService.setActiveStudentId(id);
    const found = students.find((s) => s.id === id);
    if (found) {
      setActiveStudent(found);
      soundService.speakIndonesian(`Halo ${found.namaPanggilan}! Selamat bermain dan belajar!`);
    }
  };

  const handleStarEarned = (count: number) => {
    const updatedStudents = StorageService.getStudents();
    const st = updatedStudents.find((s) => s.id === activeStudent.id);
    if (st) {
      st.bintangTerkumpul = (st.bintangTerkumpul || 0) + count;
      StorageService.saveStudents(updatedStudents);
      setStudents([...updatedStudents]);
      setActiveStudent({ ...st });
    }
    setLogs(StorageService.getActivityLogs());
  };

  const handleSaveSchool = (updated: SchoolProfile) => {
    StorageService.saveSchoolProfile(updated);
    setSchool(updated);
  };

  const handleSaveClasses = (updated: ClassRoom[]) => {
    StorageService.saveClasses(updated);
    setClasses(updated);
  };

  const handleAddStudent = (newStData: Omit<Student, 'id' | 'bintangTerkumpul' | 'lencana'>) => {
    const created = StorageService.addStudent(newStData);
    setStudents(StorageService.getStudents());
    setActiveStudent(created);
  };

  const handleUpdateStudent = (updated: Student) => {
    StorageService.updateStudent(updated);
    setStudents(StorageService.getStudents());
    if (activeStudent.id === updated.id) {
      setActiveStudent(updated);
    }
  };

  const handleDeleteStudent = (id: string) => {
    StorageService.deleteStudent(id);
    const updated = StorageService.getStudents();
    setStudents(updated);
    if (activeStudent.id === id) {
      setActiveStudent(updated[0]);
    }
  };

  const handleSaveAssessment = (ass: RaporAssessment) => {
    StorageService.saveAssessmentForStudent(ass);
    setAssessments(StorageService.getAssessments());
  };

  const handleOpenRaporForStudent = (studentId: string) => {
    setRaporTargetStudentId(studentId);
    setAdminSection('rapor');
  };

  return (
    <div className="min-h-screen text-slate-800 selection:bg-amber-300 selection:text-amber-900">
      {appMode === 'kids' ? (
        /* ======================== MODE BELAJAR ANAK (KIDS WONDERLAND) ======================== */
        <div
          className={`min-h-screen flex flex-col justify-between transition-colors duration-500 relative overflow-hidden ${
            kidTheme === 'pelangi'
              ? 'bg-gradient-to-b from-sky-200 via-amber-100/70 to-rose-100/70'
              : kidTheme === 'permen'
              ? 'bg-gradient-to-b from-pink-200 via-fuchsia-100/70 to-amber-100/70'
              : kidTheme === 'safari'
              ? 'bg-gradient-to-b from-emerald-200 via-lime-100/70 to-amber-100/70'
              : 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 text-slate-100'
          }`}
        >
          {/* Subtle Floating Decorative Bubbles & Clouds in Background */}
          <div className="absolute top-24 left-8 text-4xl opacity-25 select-none pointer-events-none animate-float">
            ☁️
          </div>
          <div className="absolute top-48 right-12 text-5xl opacity-25 select-none pointer-events-none animate-bounce-slow">
            🎈
          </div>
          <div className="absolute bottom-32 left-16 text-3xl opacity-20 select-none pointer-events-none animate-float">
            ⭐
          </div>
          <div className="absolute bottom-40 right-20 text-4xl opacity-20 select-none pointer-events-none animate-pulse-glow">
            ✨
          </div>

          <div className="relative z-10">
            {/* Playful Top Header */}
            <KidsHeader
              school={school}
              students={students}
              activeStudent={activeStudent}
              allUsers={StorageService.getUsers()}
              onSelectStudent={handleSelectStudent}
              onOpenStickers={() => setIsStickerModalOpen(true)}
              starsCount={activeStudent.bintangTerkumpul || 0}
              onSwitchToAdmin={(user?: AppUser) => {
                if (user) {
                  const updatedUser = StorageService.setCurrentUser(user);
                  setCurrentUser(updatedUser);
                  if (user.role === 'guru') {
                    setAdminSection('absensi');
                  } else {
                    setAdminSection('dashboard');
                  }
                }
                setAppMode('admin');
              }}
            />

            {/* Main Interactive Kid Learning Viewport */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {/* Playful Cheerful Hero Welcome Card */}
              <div
                className={`relative mb-6 overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-xl border-4 border-white/70 ${
                  kidTheme === 'pelangi'
                    ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 shadow-orange-300/40'
                    : kidTheme === 'permen'
                    ? 'bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 shadow-pink-300/40'
                    : kidTheme === 'safari'
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-600 shadow-emerald-300/40'
                    : 'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 shadow-purple-900/50'
                }`}
              >
                {/* Floating playful background decoration */}
                <div className="absolute -right-4 -bottom-6 text-8xl opacity-20 pointer-events-none select-none animate-float">
                  🌈
                </div>
                <div className="absolute right-28 -top-6 text-7xl opacity-25 pointer-events-none select-none animate-bounce-slow">
                  ☀️
                </div>
                <div className="absolute left-2/3 top-1 text-5xl opacity-20 pointer-events-none select-none animate-pulse-glow">
                  ✨
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Left: Friendly Greeting for Child */}
                  <div className="flex items-center gap-3.5 text-center md:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border-2 border-white/80 animate-bounce-slow shrink-0">
                      {activeStudent.fotoAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="text-xs font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                          ⭐ Sahabat Cilik Ceria
                        </span>
                        <span className="text-xs font-extrabold bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full shadow-xs">
                          {activeStudent.bintangTerkumpul || 0} Bintang
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-sm mt-1">
                        Halo, Ananda {activeStudent.namaPanggilan}! 🎉
                      </h2>
                      <p className="text-xs sm:text-sm text-white/95 font-bold mt-0.5 max-w-lg">
                        Selamat datang di taman belajar ceria! Sentuh modul di bawah untuk bermain huruf, angka, warna, bernyanyi & mewarnai!
                      </p>
                    </div>
                  </div>

                  {/* Right: Fun Theme Picker (Pilih Suasana Warna Dasbor) */}
                  <div className="bg-white/25 backdrop-blur-md p-2 rounded-2xl border-2 border-white/50 flex flex-col items-center gap-1.5 shrink-0 shadow-sm">
                    <span className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1">
                      🎨 Pilih Warna Dasbor:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSelectTheme('pelangi', 'Pelangi Ceria')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-90 ${
                          kidTheme === 'pelangi'
                            ? 'bg-white text-orange-600 shadow-md ring-2 ring-white scale-105'
                            : 'bg-white/30 text-white hover:bg-white/40'
                        }`}
                        title="Tema Pelangi Ceria"
                      >
                        <span>🌈</span>
                        <span className="hidden sm:inline">Pelangi</span>
                      </button>

                      <button
                        onClick={() => handleSelectTheme('permen', 'Permen Manis')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-90 ${
                          kidTheme === 'permen'
                            ? 'bg-white text-pink-600 shadow-md ring-2 ring-white scale-105'
                            : 'bg-white/30 text-white hover:bg-white/40'
                        }`}
                        title="Tema Permen Manis"
                      >
                        <span>🍭</span>
                        <span className="hidden sm:inline">Permen</span>
                      </button>

                      <button
                        onClick={() => handleSelectTheme('safari', 'Hutan Safari')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-90 ${
                          kidTheme === 'safari'
                            ? 'bg-white text-emerald-700 shadow-md ring-2 ring-white scale-105'
                            : 'bg-white/30 text-white hover:bg-white/40'
                        }`}
                        title="Tema Hutan Safari"
                      >
                        <span>🌲</span>
                        <span className="hidden sm:inline">Safari</span>
                      </button>

                      <button
                        onClick={() => handleSelectTheme('angkasa', 'Luar Angkasa')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-90 ${
                          kidTheme === 'angkasa'
                            ? 'bg-white text-indigo-900 shadow-md ring-2 ring-white scale-105'
                            : 'bg-white/30 text-white hover:bg-white/40'
                        }`}
                        title="Tema Luar Angkasa"
                      >
                        <span>🚀</span>
                        <span className="hidden sm:inline">Angkasa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kids Navigation Bar */}
              <KidsNav
                activeModule={kidModule}
                onChangeModule={(mod) => setKidModule(mod)}
              />

              {/* Learning Modules */}
              {kidModule === 'alfabet' && (
                <AlphabetModule onStarEarned={handleStarEarned} />
              )}
              {kidModule === 'hijaiyah' && (
                <HijaiyahModule onStarEarned={handleStarEarned} />
              )}
              {kidModule === 'angka' && (
                <NumbersModule onStarEarned={handleStarEarned} />
              )}
              {kidModule === 'warna' && (
                <ShapesColorsModule onStarEarned={handleStarEarned} />
              )}
              {kidModule === 'mewarnai' && (
                <ColoringCanvasModule onStarEarned={handleStarEarned} />
              )}
              {kidModule === 'lagu' && (
                <SongsAndStoriesModule onStarEarned={handleStarEarned} />
              )}
              {kidModule === 'game' && (
                <MiniGamesModule onStarEarned={handleStarEarned} />
              )}
            </main>
          </div>

          {/* Cheerful Kids Footer */}
          <footer
            className={`mt-12 py-5 px-6 border-t-2 text-center text-xs font-bold flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2 rounded-t-3xl backdrop-blur-md transition-colors ${
              kidTheme === 'angkasa'
                ? 'border-indigo-800 bg-slate-900/80 text-slate-300'
                : 'border-white/80 bg-white/80 text-slate-600 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🐰</span>
              <span>TK Pintar Ceria • E-Learning Interaktif & Asesmen Kurikulum Merdeka</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAppMode('admin')}
                className="text-slate-600 hover:text-blue-600 underline cursor-pointer"
              >
                Masuk Sistem Informasi TK MASYITHOH CIMANGGU ➔
              </button>
            </div>
          </footer>


          {/* Sticker Album & Printable Certificate Modal */}
          <StickerAlbumModal
            isOpen={isStickerModalOpen}
            onClose={() => setIsStickerModalOpen(false)}
            student={activeStudent}
            school={school}
          />
        </div>
      ) : (
        /* ======================== SISTEM INFORMASI & RAPOR PAUD (ADMIN / GURU) ======================== */
        <AdminLayout
          currentSection={adminSection}
          onSelectSection={(sec) => {
            setAdminSection(sec);
            if (sec !== 'rapor') setRaporTargetStudentId(undefined);
          }}
          onSwitchToKidMode={() => setAppMode('kids')}
          currentUser={currentUser}
          allUsers={StorageService.getUsers()}
          onSelectUser={(user) => {
            const updated = StorageService.setCurrentUser(user);
            setCurrentUser(updated);
          }}
          school={school}
        >
          {adminSection === 'dashboard' && (
            <AdminDashboard
              school={school}
              students={students}
              classes={classes}
              logs={logs}
              onNavigate={(sec) => setAdminSection(sec)}
            />
          )}

          {adminSection === 'profil' && (
            <SchoolProfileView school={school} onSave={handleSaveSchool} />
          )}

          {adminSection === 'tahun_ajaran' && (
            <AcademicYearView school={school} onUpdateSchool={handleSaveSchool} />
          )}

          {adminSection === 'kelas' && (
            <ClassesView
              classes={classes}
              students={students}
              onSaveClasses={handleSaveClasses}
            />
          )}

          {adminSection === 'buku_induk' && (
            <StudentsView
              students={students}
              classes={classes}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onOpenRaporForStudent={handleOpenRaporForStudent}
            />
          )}

          {adminSection === 'absensi' && (
            <AttendanceView
              students={students}
              classes={classes}
              school={school}
            />
          )}

          {adminSection === 'rapor' && (
            <RaporManagementView
              school={school}
              students={students}
              classes={classes}
              assessments={assessments}
              initialStudentId={raporTargetStudentId}
              onSaveAssessment={handleSaveAssessment}
            />
          )}

          {adminSection === 'api_setting' && (
            <UserGuideView initialTab="api" />
          )}

          {adminSection === 'manual' && (
            <UserGuideView initialTab="manual" />
          )}

          {adminSection === 'tentang' && (
            <UserGuideView initialTab="tentang" />
          )}
        </AdminLayout>
      )}
    </div>
  );
}
