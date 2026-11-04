import { useState } from 'react';
import { Calendar, Save, CheckCircle2 } from 'lucide-react';
import { SchoolProfile } from '../../types/paud';
import { soundService } from '../../services/soundService';

interface AcademicYearViewProps {
  school: SchoolProfile;
  onUpdateSchool: (updated: SchoolProfile) => void;
}

export function AcademicYearView({ school, onUpdateSchool }: AcademicYearViewProps) {
  const [tahun, setTahun] = useState(school.tahunAjaran);
  const [semester, setSemester] = useState(school.semester);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playVictory();
    onUpdateSchool({
      ...school,
      tahunAjaran: tahun,
      semester,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800">Pengaturan Tahun Ajaran & Semester</h3>
          </div>
          {saved && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil Diperbarui
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tahun Ajaran Aktif
            </label>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-bold text-sm focus:border-blue-500 outline-none"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Semester Aktif
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSemester('I (Gasal)')}
                className={`p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  semester === 'I (Gasal)'
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Semester I (Gasal / Ganjil)
              </button>
              <button
                type="button"
                onClick={() => setSemester('II (Genap)')}
                className={`p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  semester === 'II (Genap)'
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Semester II (Genap)
              </button>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">💡 Panduan Kalender Kurikulum Merdeka PAUD:</span>
            <p>
              Perubahan semester akan menyesuaikan rekap penilaian harian, catatan anekdot, dan cetak rapor peserta didik di seluruh rombongan belajar.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow cursor-pointer"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
