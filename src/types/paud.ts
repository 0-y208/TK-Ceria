export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  kecamatan: string;
  kabKota: string;
  provinsi: string;
  kepalaSekolah: string;
  hp: string;
  email: string;
  tahunAjaran: string;
  semester: string; // 'I (Gasal)' | 'II (Genap)'
  akreditasi: string;
}

export interface Student {
  id: string;
  namaLengkap: string;
  namaPanggilan: string;
  nisn: string;
  nik: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string;
  tempatLahir: string;
  namaAyah: string;
  namaIbu: string;
  noHpOrtu: string;
  alamat: string;
  kelasId: string;
  fotoAvatar: string;
  tinggiBadanCm: number;
  beratBadanKg: number;
  bintangTerkumpul: number;
  lencana: string[];
}

export interface ClassRoom {
  id: string;
  namaKelas: string;
  kelompokUsia: string; // e.g. "4-5 Tahun (Kelompok A)", "5-6 Tahun (Kelompok B)", "2-4 Tahun (KB)"
  waliKelas: string;
  ruang: string;
  kapasitas: number;
}

export type UserRole = 'admin' | 'guru';

export interface AppUser {
  id: string;
  username: string;
  namaLengkap: string;
  role: UserRole;
  jabatan: string;
  avatar: string;
  email: string;
  password?: string;
  kelasId?: string;
  kelasNama?: string;
}

export type NilaiCapaian = 'BB' | 'MB' | 'BSH' | 'BSB';

export interface RaporAssessment {
  id: string;
  studentId: string;
  tahunAjaran: string;
  semester: string;
  // Elemen 1: Nilai Agama dan Budi Pekerti
  agamaBudiPekerti: {
    capaian: NilaiCapaian;
    narasi: string;
  };
  // Elemen 2: Jati Diri
  jatiDiri: {
    capaian: NilaiCapaian;
    narasi: string;
  };
  // Elemen 3: Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, Seni (STEAM)
  dasarLiterasiSteam: {
    capaian: NilaiCapaian;
    narasi: string;
  };
  // Catatan Khusus Guru & Pertumbuhan
  catatanGuru: string;
  kehadiranSakit: number;
  kehadiranIzin: number;
  kehadiranAlfa: number;
  tanggalRapor: string;
}

export interface NurserySong {
  id: string;
  title: string;
  composer: string;
  lyrics: string[];
  melodyBeats: number[]; // relative note pitches for Web Audio synthesis
  tempo: number;
  color: string;
  icon: string;
}

export interface FableStory {
  id: string;
  title: string;
  characters: string;
  moral: string;
  pages: {
    text: string;
    illustrationEmoji: string;
    soundPrompt?: string;
  }[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  studentName: string;
  module: string;
  activity: string;
  starsEarned: number;
}

export type AttendanceStatus = 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alfa

export interface DailyAttendance {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: AttendanceStatus;
  note?: string;
  temperature?: string; // e.g. "36.5"
}

