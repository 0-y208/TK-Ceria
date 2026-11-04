import { useState } from 'react';
import { BookOpen, KeyRound, Info, Download, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { soundService } from '../../services/soundService';

interface UserGuideViewProps {
  initialTab?: 'manual' | 'api' | 'tentang';
}

export function UserGuideView({ initialTab = 'manual' }: UserGuideViewProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'api' | 'tentang'>(initialTab);
  const [backupDownloaded, setBackupDownloaded] = useState(false);

  const handleExportData = () => {
    soundService.playVictory();
    const backup = {
      school: StorageService.getSchoolProfile(),
      classes: StorageService.getClasses(),
      students: StorageService.getStudents(),
      assessments: StorageService.getAssessments(),
      exportDate: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup-rapor-paud-${Date.now()}.json`);
    downloadAnchor.click();
    setBackupDownloaded(true);
    setTimeout(() => setBackupDownloaded(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke kondisi bawaan awal?')) {
      soundService.playBoing();
      StorageService.resetDemoData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer ${
            activeTab === 'manual' ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Manual Pengguna
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer ${
            activeTab === 'api' ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" /> Pengaturan API & Backup
        </button>
        <button
          onClick={() => setActiveTab('tentang')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer ${
            activeTab === 'tentang' ? 'bg-blue-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Info className="w-4 h-4" /> Tentang Aplikasi
        </button>
      </div>

      {activeTab === 'manual' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Panduan Penggunaan Sistem Informasi E-Learning & Rapor PAUD
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Petunjuk operasional bagi Guru PAUD, Kepala Sekolah, dan Pendamping Anak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 block text-sm">
                1. Mode Petualangan Belajar Anak 🐰
              </span>
              <p>
                Mode interaktif dirancang ramah anak usia dini (PAUD/TK) dengan navigasi visual besar, animasi ceria, audio narasi bahasa Indonesia, dan Web Audio sound effects.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Modul Alfabet: Pengenalan fonik & contoh kata bergambar.</li>
                <li>Modul 123 Berhitung: Interaktif tap untuk menghitung jumlah objek.</li>
                <li>Modul Warna & Bentuk: Geometri ceria & tebak warna.</li>
                <li>Studio Mewarnai: Kanvas digital dengan kuas cat & stiker stempel.</li>
                <li>Karaoke & Dongeng: Nyanyian anak Indonesia & cerita budi pekerti.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <span className="font-bold text-blue-900 block text-sm">
                2. Buku Induk & Penilaian Rapor 📝
              </span>
              <p>
                Rapor disusun sesuai pedoman Kurikulum Merdeka PAUD Kemendikbudristek:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>3 Elemen Capaian: Nilai Agama, Jati Diri, Dasar Literasi/STEAM.</li>
                <li>Skala Capaian: BB, MB, BSH, BSB.</li>
                <li>Asisten AI Guru: Menghasilkan narasi deskriptif yang positif dan komprehensif secara otomatis.</li>
                <li>Format Cetak Resmi: Lengkap dengan kop surat, presensi, dan tanda tangan kepala sekolah.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Pengaturan API & Ekspor Data Backup
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sinkronisasi data e-learning, integrasi layanan, dan pencadangan data sekolah.
            </p>
          </div>

          {backupDownloaded && (
            <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              File backup JSON berhasil diunduh ke komputermu!
            </div>
          )}

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800">Cadangkan Seluruh Data (JSON)</h4>
                <p className="text-xs text-slate-500">
                  Simpan seluruh data profil sekolah, murid, kelas, dan lembar rapor ke file cadangan.
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <Download className="w-4 h-4" /> Download Backup
              </button>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-rose-900">Reset Data Bawaan (Demo)</h4>
                <p className="text-xs text-rose-700">
                  Mengembalikan semua data ke kondisi awal (7 Siswa, 4 Kelas, TK MASYITHOH CIMANGGU).
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <RotateCcw className="w-4 h-4" /> Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tentang' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-4xl mx-auto border-2 border-amber-300">
            📚
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">TK MASYITHOH CIMANGGU & E-Learning Ceria</h3>
            <span className="inline-block bg-[#f39c12] text-white px-3 py-1 rounded-full text-xs font-bold mt-1">
              Kurikulum Merdeka • Version 2.6.1
            </span>
          </div>


          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            Aplikasi Sistem Informasi E-Learning & Manajemen Rapor Berbasis AI untuk Lembaga Pendidikan Anak Usia Dini (PAUD / TK). Menghubungkan pengalaman belajar bermain anak yang bermakna dengan pencatatan perkembangan asesmen yang akuntabel.
          </p>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            Kunjungi portal resmi:{' '}
            <a href="https://www.paud.id" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">
              https://www.paud.id
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
