import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, FileText, UserCheck, Star } from 'lucide-react';
import { Student, ClassRoom } from '../../types/paud';
import { soundService } from '../../services/soundService';

interface StudentsViewProps {
  students: Student[];
  classes: ClassRoom[];
  onAddStudent: (st: Omit<Student, 'id' | 'bintangTerkumpul' | 'lencana'>) => void;
  onUpdateStudent: (st: Student) => void;
  onDeleteStudent: (id: string) => void;
  onOpenRaporForStudent: (studentId: string) => void;
}

export function StudentsView({
  students,
  classes,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onOpenRaporForStudent,
}: StudentsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formNamaLengkap, setFormNamaLengkap] = useState('');
  const [formNamaPanggilan, setFormNamaPanggilan] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formJenisKelamin, setFormJenisKelamin] = useState<'L' | 'P'>('L');
  const [formTanggalLahir, setFormTanggalLahir] = useState('2021-01-01');
  const [formTempatLahir, setFormTempatLahir] = useState('Semarang');
  const [formNamaAyah, setFormNamaAyah] = useState('');
  const [formNamaIbu, setFormNamaIbu] = useState('');
  const [formNoHpOrtu, setFormNoHpOrtu] = useState('');
  const [formAlamat, setFormAlamat] = useState('');
  const [formKelasId, setFormKelasId] = useState(classes[0]?.id || 'cls-1');
  const [formAvatar, setFormAvatar] = useState('👦🏻');
  const [formTb, setFormTb] = useState(105);
  const [formBb, setFormBb] = useState(17.5);

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.namaPanggilan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm);
    const matchClass = filterClass === 'ALL' || s.kelasId === filterClass;
    return matchSearch && matchClass;
  });

  const handleOpenNewModal = () => {
    soundService.playPop();
    setEditingStudent(null);
    setFormNamaLengkap('');
    setFormNamaPanggilan('');
    setFormNisn(`00192837${Math.floor(10 + Math.random() * 89)}`);
    setFormNik('337401' + Math.floor(1000000000 + Math.random() * 9000000000));
    setFormJenisKelamin('L');
    setFormTanggalLahir('2021-05-10');
    setFormTempatLahir('Semarang');
    setFormNamaAyah('');
    setFormNamaIbu('');
    setFormNoHpOrtu('08');
    setFormAlamat('Jl. ');
    setFormKelasId(classes[0]?.id || 'cls-1');
    setFormAvatar('👦🏻');
    setFormTb(105);
    setFormBb(17.5);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (st: Student) => {
    soundService.playPop();
    setEditingStudent(st);
    setFormNamaLengkap(st.namaLengkap);
    setFormNamaPanggilan(st.namaPanggilan);
    setFormNisn(st.nisn);
    setFormNik(st.nik);
    setFormJenisKelamin(st.jenisKelamin);
    setFormTanggalLahir(st.tanggalLahir);
    setFormTempatLahir(st.tempatLahir);
    setFormNamaAyah(st.namaAyah);
    setFormNamaIbu(st.namaIbu);
    setFormNoHpOrtu(st.noHpOrtu);
    setFormAlamat(st.alamat);
    setFormKelasId(st.kelasId);
    setFormAvatar(st.fotoAvatar);
    setFormTb(st.tinggiBadanCm);
    setFormBb(st.beratBadanKg);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playVictory();

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        namaLengkap: formNamaLengkap,
        namaPanggilan: formNamaPanggilan,
        nisn: formNisn,
        nik: formNik,
        jenisKelamin: formJenisKelamin,
        tanggalLahir: formTanggalLahir,
        tempatLahir: formTempatLahir,
        namaAyah: formNamaAyah,
        namaIbu: formNamaIbu,
        noHpOrtu: formNoHpOrtu,
        alamat: formAlamat,
        kelasId: formKelasId,
        fotoAvatar: formAvatar,
        tinggiBadanCm: Number(formTb),
        beratBadanKg: Number(formBb),
      });
    } else {
      onAddStudent({
        namaLengkap: formNamaLengkap,
        namaPanggilan: formNamaPanggilan,
        nisn: formNisn,
        nik: formNik,
        jenisKelamin: formJenisKelamin,
        tanggalLahir: formTanggalLahir,
        tempatLahir: formTempatLahir,
        namaAyah: formNamaAyah,
        namaIbu: formNamaIbu,
        noHpOrtu: formNoHpOrtu,
        alamat: formAlamat,
        kelasId: formKelasId,
        fotoAvatar: formAvatar,
        tinggiBadanCm: Number(formTb),
        beratBadanKg: Number(formBb),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Buku Induk Siswa TK</h3>
          <p className="text-xs text-slate-500">
            Data identitas anak didik, orang tua, pertumbuhan antropometri, dan rekaman belajar.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Registrasi Siswa Baru
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Rombel:</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:border-blue-500 outline-none"
          >
            <option value="ALL">Semua Kelas ({students.length})</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.namaKelas}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Anak Didik</th>
                <th className="py-3.5 px-4">NISN / NIK</th>
                <th className="py-3.5 px-4">Rombel Kelas</th>
                <th className="py-3.5 px-4">Nama Orang Tua</th>
                <th className="py-3.5 px-4 text-center">Fisik (TB/BB)</th>
                <th className="py-3.5 px-4 text-center">Bintang Belajar</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ditemukan data siswa yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const cls = classes.find((c) => c.id === st.kelasId);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-1 bg-amber-50 rounded-xl border border-amber-200">
                            {st.fotoAvatar}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{st.namaLengkap}</div>
                            <div className="text-[11px] text-slate-400">
                              Panggilan: <span className="font-semibold text-slate-600">{st.namaPanggilan}</span> ({st.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-slate-800">{st.nisn}</div>
                        <div className="text-[10px] text-slate-400">NIK: {st.nik}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] inline-block border border-blue-200">
                          {cls ? cls.namaKelas : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">Ayah: {st.namaAyah}</div>
                        <div className="text-[11px] text-slate-500">Ibu: {st.namaIbu}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-semibold text-slate-800">
                          {st.tinggiBadanCm} cm / {st.beratBadanKg} kg
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {st.bintangTerkumpul}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenRaporForStudent(st.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                            title="Buka Lembar Rapor"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(st)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                            title="Edit Data Siswa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data ${st.namaLengkap}?`)) {
                                soundService.playBoing();
                                onDeleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <h4 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b">
              {editingStudent ? `Ubah Data Murid: ${editingStudent.namaLengkap}` : 'Registrasi Peserta Didik Baru (TK)'}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 uppercase mb-1">Nama Lengkap Anak</label>
                  <input
                    type="text"
                    required
                    value={formNamaLengkap}
                    onChange={(e) => setFormNamaLengkap(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                    placeholder="Contoh: Muhammad Rayyan Al-Fatih"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    required
                    value={formNamaPanggilan}
                    onChange={(e) => setFormNamaPanggilan(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                    placeholder="Rayyan"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">NISN</label>
                  <input
                    type="text"
                    required
                    value={formNisn}
                    onChange={(e) => setFormNisn(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">NIK (Keluarga)</label>
                  <input
                    type="text"
                    value={formNik}
                    onChange={(e) => setFormNik(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Jenis Kelamin</label>
                  <select
                    value={formJenisKelamin}
                    onChange={(e) => setFormJenisKelamin(e.target.value as 'L' | 'P')}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  >
                    <option value="L">Laki-laki 👦</option>
                    <option value="P">Perempuan 👧</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Rombel Kelas</label>
                  <select
                    value={formKelasId}
                    onChange={(e) => setFormKelasId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.namaKelas}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formTanggalLahir}
                    onChange={(e) => setFormTanggalLahir(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formTempatLahir}
                    onChange={(e) => setFormTempatLahir(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={formNamaAyah}
                    onChange={(e) => setFormNamaAyah(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={formNamaIbu}
                    onChange={(e) => setFormNamaIbu(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={formTb}
                    onChange={(e) => setFormTb(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formBb}
                    onChange={(e) => setFormBb(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 uppercase mb-1">Alamat Rumah</label>
                  <input
                    type="text"
                    value={formAlamat}
                    onChange={(e) => setFormAlamat(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-normal"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
