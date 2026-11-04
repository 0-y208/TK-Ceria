import { Users, School, Calendar, BookOpen, ArrowRightCircle, Sparkles, Activity } from 'lucide-react';
import { SchoolProfile, Student, ClassRoom, ActivityLog } from '../../types/paud';
import { AdminSection } from './AdminLayout';
import { soundService } from '../../services/soundService';

interface AdminDashboardProps {
  school: SchoolProfile;
  students: Student[];
  classes: ClassRoom[];
  logs: ActivityLog[];
  onNavigate: (section: AdminSection) => void;
}

export function AdminDashboard({
  school,
  students,
  classes,
  logs,
  onNavigate,
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 4 Colored Metric Cards - Exactly like screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Siswa (Cyan) */}
        <div className="rounded-xl overflow-hidden shadow-sm bg-[#17a2b8] text-white flex flex-col justify-between">
          <div className="p-4 flex justify-between items-start">
            <div>
              <div className="text-4xl font-extrabold">{students.length}</div>
              <div className="text-sm font-semibold mt-1">Total Siswa</div>
            </div>
            <Users className="w-14 h-14 opacity-30" />
          </div>
          <button
            onClick={() => {
              soundService.playPop();
              onNavigate('buku_induk');
            }}
            className="w-full bg-black/15 hover:bg-black/25 text-white/95 text-xs py-2 px-3 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            Lihat Detail <ArrowRightCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Total Kelas (Green) */}
        <div className="rounded-xl overflow-hidden shadow-sm bg-[#28a745] text-white flex flex-col justify-between">
          <div className="p-4 flex justify-between items-start">
            <div>
              <div className="text-4xl font-extrabold">{classes.length}</div>
              <div className="text-sm font-semibold mt-1">Total Kelas</div>
            </div>
            <School className="w-14 h-14 opacity-30" />
          </div>
          <button
            onClick={() => {
              soundService.playPop();
              onNavigate('kelas');
            }}
            className="w-full bg-black/15 hover:bg-black/25 text-white/95 text-xs py-2 px-3 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            Info <ArrowRightCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Tahun Ajaran (Yellow) */}
        <div className="rounded-xl overflow-hidden shadow-sm bg-[#ffc107] text-slate-900 flex flex-col justify-between">
          <div className="p-4 flex justify-between items-start">
            <div>
              <div className="text-2xl font-extrabold">{school.tahunAjaran}</div>
              <div className="text-sm font-semibold mt-1">Tahun Ajaran</div>
            </div>
            <Calendar className="w-14 h-14 opacity-30 text-slate-800" />
          </div>
          <button
            onClick={() => {
              soundService.playPop();
              onNavigate('tahun_ajaran');
            }}
            className="w-full bg-black/15 hover:bg-black/25 text-slate-900 text-xs py-2 px-3 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            Pengaturan <ArrowRightCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Semester (Red) */}
        <div className="rounded-xl overflow-hidden shadow-sm bg-[#dc3545] text-white flex flex-col justify-between">
          <div className="p-4 flex justify-between items-start">
            <div>
              <div className="text-2xl font-extrabold">{school.semester}</div>
              <div className="text-sm font-semibold mt-1">Semester</div>
            </div>
            <BookOpen className="w-14 h-14 opacity-30" />
          </div>
          <button
            onClick={() => {
              soundService.playPop();
              onNavigate('rapor');
            }}
            className="w-full bg-black/15 hover:bg-black/25 text-white/95 text-xs py-2 px-3 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            Rapor <ArrowRightCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Informasi Sekolah Card - Exactly like screenshot */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-800">Informasi Sekolah</h3>
          <button
            onClick={() => onNavigate('profil')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            Edit Profil ➔
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">Nama Sekolah</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="font-bold text-slate-800">{school.namaSekolah}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">NPSN</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="text-slate-800">{school.npsn}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">Alamat</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="text-slate-800">{school.alamat}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">Kecamatan</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="text-slate-800">{school.kecamatan}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">Kab/Kota</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="text-slate-800">{school.kabKota}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">Provinsi</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="text-slate-800">{school.provinsi}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">Kepala Sekolah</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="font-bold text-slate-900">{school.kepalaSekolah}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">HP.</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="text-slate-800 font-mono">{school.hp}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">Email</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="text-blue-600 underline">{school.email}</span>
            </div>

            <div className="flex items-start">
              <span className="w-36 font-semibold text-slate-700">Akreditasi</span>
              <span className="text-slate-500 mr-3">:</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {school.akreditasi}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Extra Overview: E-Learning Activity Feed & Kurikulum Merdeka Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live E-Learning Child Activity Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> Aktivitas E-Learning Siswa Terbaru
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Real-time
            </span>
          </div>

          <div className="p-6 divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{log.studentName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Modul <span className="font-semibold text-blue-600">{log.module}</span>: {log.activity}
                  </p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1 justify-end">
                    ⭐ +{log.starsEarned}
                  </span>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Kurikulum Merdeka Core Elements Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Capaian Pembelajaran Kurikulum Merdeka
            </h3>
            <button
              onClick={() => onNavigate('rapor')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Kelola Rapor ➔
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-amber-900">1. Nilai Agama & Budi Pekerti</span>
                <span className="text-[11px] font-bold text-amber-700">86% BSB/BSH</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '86%' }} />
              </div>
              <p className="text-[11px] text-amber-800 mt-1.5">
                Doa harian, rasa syukur, sikap santun, dan saling menyayangi sesama teman.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-emerald-900">2. Jati Diri & Kemandirian</span>
                <span className="text-[11px] font-bold text-emerald-700">92% BSB/BSH</span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
              <p className="text-[11px] text-emerald-800 mt-1.5">
                Regulasi emosi, motorik halus menggunting/mewarnai, kebersihan diri & fisik sehat.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-blue-900">3. Dasar Literasi & STEAM</span>
                <span className="text-[11px] font-bold text-blue-700">88% BSB/BSH</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
              <p className="text-[11px] text-blue-800 mt-1.5">
                Mengenal fonik huruf A-Z, membilang angka 1-10, eksplorasi warna & karya seni.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
