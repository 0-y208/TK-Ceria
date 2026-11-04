import { useState } from 'react';
import { Users2, Plus, Edit2, CheckCircle2 } from 'lucide-react';
import { ClassRoom, Student } from '../../types/paud';
import { soundService } from '../../services/soundService';

interface ClassesViewProps {
  classes: ClassRoom[];
  students: Student[];
  onSaveClasses: (updated: ClassRoom[]) => void;
}

export function ClassesView({ classes, students, onSaveClasses }: ClassesViewProps) {
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleOpenEdit = (c: ClassRoom) => {
    soundService.playPop();
    setEditingClass({ ...c });
    setIsNew(false);
  };

  const handleOpenNew = () => {
    soundService.playPop();
    setEditingClass({
      id: `cls-${Date.now()}`,
      namaKelas: '',
      kelompokUsia: '4-5 Tahun (Kelompok A)',
      waliKelas: '',
      ruang: '',
      kapasitas: 15,
    });
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    soundService.playVictory();

    let updated: ClassRoom[];
    if (isNew) {
      updated = [...classes, editingClass];
    } else {
      updated = classes.map((c) => (c.id === editingClass.id ? editingClass : c));
    }

    onSaveClasses(updated);
    setEditingClass(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Daftar Kelas & Guru Walikelas</h3>
          <p className="text-xs text-slate-500">
            Pengelolaan rombongan belajar (rombel), kelompok usia anak, dan guru penanggung jawab.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Rombel Kelas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => {
          const studentCount = students.filter((s) => s.kelasId === cls.id).length;
          return (
            <div
              key={cls.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{cls.namaKelas}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full inline-block mt-1">
                      {cls.kelompokUsia}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                    title="Ubah Kelas"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 border-b border-slate-100 pb-1.5">
                    <span className="font-medium">Guru Walikelas</span>
                    <span className="font-bold text-slate-800">{cls.waliKelas}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 border-b border-slate-100 pb-1.5">
                    <span className="font-medium">Lokasi Ruang</span>
                    <span className="text-slate-800">{cls.ruang}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium">Jumlah Murid Terdaftar</span>
                    <span className="font-bold text-emerald-600">
                      {studentCount} / {cls.kapasitas} Siswa
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / New Class Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-800 mb-4">
              {isNew ? 'Tambah Kelas Baru' : 'Ubah Data Kelas'}
            </h4>
            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 uppercase mb-1">Nama Rombel Kelas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kelompok A1 (Bunga Melati)"
                  value={editingClass.namaKelas}
                  onChange={(e) => setEditingClass({ ...editingClass, namaKelas: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase mb-1">Kelompok Usia</label>
                <select
                  value={editingClass.kelompokUsia}
                  onChange={(e) => setEditingClass({ ...editingClass, kelompokUsia: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                >
                  <option value="2-4 Tahun (KB/Playgroup)">2-4 Tahun (KB / Kelompok Bermain)</option>
                  <option value="4-5 Tahun (Kelompok A)">4-5 Tahun (TK Kelompok A)</option>
                  <option value="5-6 Tahun (Kelompok B)">5-6 Tahun (TK Kelompok B)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 uppercase mb-1">Nama Guru Walikelas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siti Rahmawati, S.Pd."
                  value={editingClass.waliKelas}
                  onChange={(e) => setEditingClass({ ...editingClass, waliKelas: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase mb-1">Ruangan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ruang Melati Lantai 1"
                  value={editingClass.ruang}
                  onChange={(e) => setEditingClass({ ...editingClass, ruang: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
