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

export default function App() {
  const [appMode, setAppMode] = useState<'kids' | 'admin'>('kids');
  const [kidModule, setKidModule] = useState<KidModuleType>('alfabet');
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
        <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-pink-50/30 flex flex-col justify-between">
          <div>
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
          <footer className="mt-12 py-5 px-6 border-t-2 border-amber-200 bg-white/70 backdrop-blur-sm text-center text-xs text-slate-500 font-bold flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
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
