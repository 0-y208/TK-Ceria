import { SchoolProfile, Student, ClassRoom, RaporAssessment, ActivityLog, NurserySong, FableStory, DailyAttendance, AttendanceStatus, AppUser, UserRole } from '../types/paud';

export const DEFAULT_USERS: AppUser[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    namaLengkap: 'Nurhikmah Umami, S.Pd., M.Psi.',
    role: 'admin',
    jabatan: 'Kepala Sekolah / Administrator PAUD',
    avatar: '👩🏻‍💼',
    email: 'admin.paud@cimanggu.sch.id',
    password: 'admin', // Kata sandi default admin
  },
  {
    id: 'usr-guru-siti',
    username: 'siti_rahmawati',
    namaLengkap: 'Siti Rahmawati, S.Pd.',
    role: 'guru',
    jabatan: 'Wali Kelas Kelompok A1 (Bunga Melati)',
    avatar: '🧕🏻',
    email: 'siti.rahmawati@cimanggu.sch.id',
    password: 'guru', // Kata sandi default guru
    kelasId: 'cls-1',
    kelasNama: 'Kelompok A1 (Bunga Melati)',
  },
  {
    id: 'usr-guru-dewi',
    username: 'dewi_astuti',
    namaLengkap: 'Dewi Astuti, S.Pd.',
    role: 'guru',
    jabatan: 'Wali Kelas Kelompok A2 (Bunga Mawar)',
    avatar: '👩🏻‍🏫',
    email: 'dewi.astuti@cimanggu.sch.id',
    password: 'guru',
    kelasId: 'cls-2',
    kelasNama: 'Kelompok A2 (Bunga Mawar)',
  },
  {
    id: 'usr-guru-sri',
    username: 'sri_wahyuni',
    namaLengkap: 'Sri Wahyuni, S.Pd.AUD',
    role: 'guru',
    jabatan: 'Wali Kelas Kelompok B1 (Bintang Cemerlang)',
    avatar: '🧕🏽',
    email: 'sri.wahyuni@cimanggu.sch.id',
    password: 'guru',
    kelasId: 'cls-3',
    kelasNama: 'Kelompok B1 (Bintang Cemerlang)',
  },
  {
    id: 'usr-guru-anisa',
    username: 'anisa_putri',
    namaLengkap: 'Anisa Putri, S.Pd.',
    role: 'guru',
    jabatan: 'Wali Kelas Kelompok Bermain (KB Ceria)',
    avatar: '🧕🏼',
    email: 'anisa.putri@cimanggu.sch.id',
    password: 'guru',
    kelasId: 'cls-4',
    kelasNama: 'Kelompok Bermain (KB Ceria)',
  },
];

const DEFAULT_ATTENDANCE: DailyAttendance[] = [
  { id: 'att-1', date: '2026-10-29', studentId: 'std-1', status: 'H', note: 'Hadir ceria', temperature: '36.4' },
  { id: 'att-2', date: '2026-10-29', studentId: 'std-2', status: 'H', note: 'Hadir tepat waktu', temperature: '36.5' },
  { id: 'att-3', date: '2026-10-29', studentId: 'std-3', status: 'H', note: 'Suhu normal', temperature: '36.5' },
  { id: 'att-4', date: '2026-10-29', studentId: 'std-4', status: 'I', note: 'Izin acara keluarga', temperature: '-' },
  { id: 'att-5', date: '2026-10-29', studentId: 'std-5', status: 'H', note: 'Hadir ceria', temperature: '36.3' },
  { id: 'att-6', date: '2026-10-29', studentId: 'std-6', status: 'H', note: 'Hadir aktif', temperature: '36.5' },
  { id: 'att-7', date: '2026-10-29', studentId: 'std-7', status: 'S', note: 'Sakit flu istirahat di rumah', temperature: '37.4' },
];

const DEFAULT_SCHOOL: SchoolProfile = {
  namaSekolah: 'TK MASYITHOH CIMANGGU',
  npsn: '12345678',
  alamat: 'Jl. Pemuda',
  kecamatan: 'Cimanggu',
  kabKota: 'Cilacap',
  provinsi: 'Jawa Tengah',
  kepalaSekolah: 'NURHIKMAH UMAMI, S.Pd., M.Psi.',
  hp: '089667770666',
  email: 'paudcimanggu@yahoo.com',
  tahunAjaran: '2025/2026',
  semester: 'I (Gasal)',
  akreditasi: 'A (Unggul)',
};


const DEFAULT_CLASSES: ClassRoom[] = [
  {
    id: 'cls-1',
    namaKelas: 'Kelompok A1 (Bunga Melati)',
    kelompokUsia: '4-5 Tahun (Kelompok A)',
    waliKelas: 'Siti Rahmawati, S.Pd.',
    ruang: 'Ruang Melati Lantai 1',
    kapasitas: 15,
  },
  {
    id: 'cls-2',
    namaKelas: 'Kelompok A2 (Bunga Mawar)',
    kelompokUsia: '4-5 Tahun (Kelompok A)',
    waliKelas: 'Dewi Astuti, S.Pd.',
    ruang: 'Ruang Mawar Lantai 1',
    kapasitas: 15,
  },
  {
    id: 'cls-3',
    namaKelas: 'Kelompok B1 (Bintang Cemerlang)',
    kelompokUsia: '5-6 Tahun (Kelompok B)',
    waliKelas: 'Sri Wahyuni, S.Pd.AUD',
    ruang: 'Ruang Bintang Lantai 2',
    kapasitas: 15,
  },
  {
    id: 'cls-4',
    namaKelas: 'Kelompok Bermain (KB Ceria)',
    kelompokUsia: '2-4 Tahun (KB/Playgroup)',
    waliKelas: 'Anisa Putri, S.Pd.',
    ruang: 'Ruang Ceria Sentra Balok',
    kapasitas: 12,
  },
];

const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'std-1',
    namaLengkap: 'Muhammad Rayyan Al-Fatih',
    namaPanggilan: 'Rayyan',
    nisn: '0019283741',
    nik: '3374011203200001',
    jenisKelamin: 'L',
    tanggalLahir: '2020-03-12',
    tempatLahir: 'Semarang',
    namaAyah: 'Bambang Supriyanto',
    namaIbu: 'Retno Wulandari',
    noHpOrtu: '081234567891',
    alamat: 'Jl. Pandanaran No. 12, Semarang',
    kelasId: 'cls-3',
    fotoAvatar: '👦🏻',
    tinggiBadanCm: 110,
    beratBadanKg: 19.5,
    bintangTerkumpul: 28,
    lencana: ['Bintang Huruf', 'Jago Berhitung', 'Anak Sopan'],
  },
  {
    id: 'std-2',
    namaLengkap: 'Aisyah Putri Zahra',
    namaPanggilan: 'Aisyah',
    nisn: '0019283742',
    nik: '3374015408200002',
    jenisKelamin: 'P',
    tanggalLahir: '2020-08-14',
    tempatLahir: 'Semarang',
    namaAyah: 'Ahmad Fauzi',
    namaIbu: 'Dewi Sartika',
    noHpOrtu: '081234567892',
    alamat: 'Jl. Gajah Mada No. 45, Semarang',
    kelasId: 'cls-3',
    fotoAvatar: '👧🏻',
    tinggiBadanCm: 108,
    beratBadanKg: 18.0,
    bintangTerkumpul: 35,
    lencana: ['Bintang Huruf', 'Seniman Cilik', 'Sahabat Ceria', 'Jago Berhitung'],
  },
  {
    id: 'std-3',
    namaLengkap: 'Bilal Habibi Ramadhan',
    namaPanggilan: 'Bilal',
    nisn: '0019283743',
    nik: '3374012004210003',
    jenisKelamin: 'L',
    tanggalLahir: '2021-04-20',
    tempatLahir: 'Semarang',
    namaAyah: 'Hendra Gunawan',
    namaIbu: 'Fitri Handayani',
    noHpOrtu: '081234567893',
    alamat: 'Jl. Pemuda No. 88, Semarang Tengah',
    kelasId: 'cls-1',
    fotoAvatar: '👦🏽',
    tinggiBadanCm: 104,
    beratBadanKg: 17.2,
    bintangTerkumpul: 22,
    lencana: ['Bintang Huruf', 'Juara Mewarnai'],
  },
  {
    id: 'std-4',
    namaLengkap: 'Naura Syakira Azzahra',
    namaPanggilan: 'Naura',
    nisn: '0019283744',
    nik: '3374016007210004',
    jenisKelamin: 'P',
    tanggalLahir: '2021-07-22',
    tempatLahir: 'Semarang',
    namaAyah: 'Rian Prasetyo',
    namaIbu: 'Maya Kusuma',
    noHpOrtu: '081234567894',
    alamat: 'Jl. Imam Bonjol No. 102, Semarang',
    kelasId: 'cls-1',
    fotoAvatar: '👧🏽',
    tinggiBadanCm: 102,
    beratBadanKg: 16.8,
    bintangTerkumpul: 19,
    lencana: ['Penyanyi Cilik', 'Bintang Huruf'],
  },
  {
    id: 'std-5',
    namaLengkap: 'Kenzo Arkan Al-Ghifari',
    namaPanggilan: 'Kenzo',
    nisn: '0019283745',
    nik: '3374011801210005',
    jenisKelamin: 'L',
    tanggalLahir: '2021-01-18',
    tempatLahir: 'Semarang',
    namaAyah: 'Deni Setiawan',
    namaIbu: 'Nurul Hidayah',
    noHpOrtu: '081234567895',
    alamat: 'Jl. Thamrin No. 34, Semarang',
    kelasId: 'cls-2',
    fotoAvatar: '👦🏼',
    tinggiBadanCm: 105,
    beratBadanKg: 17.8,
    bintangTerkumpul: 24,
    lencana: ['Jago Berhitung', 'Petualang Cilik'],
  },
  {
    id: 'std-6',
    namaLengkap: 'Salsabila Khairunisa',
    namaPanggilan: 'Salsa',
    nisn: '0019283746',
    nik: '3374014911200006',
    jenisKelamin: 'P',
    tanggalLahir: '2020-11-09',
    tempatLahir: 'Semarang',
    namaAyah: 'Agus Purnomo',
    namaIbu: 'Indah Lestari',
    noHpOrtu: '081234567896',
    alamat: 'Jl. MT Haryono No. 56, Semarang',
    kelasId: 'cls-3',
    fotoAvatar: '👧🏼',
    tinggiBadanCm: 109,
    beratBadanKg: 18.4,
    bintangTerkumpul: 31,
    lencana: ['Bintang Huruf', 'Seniman Cilik', 'Pemberani'],
  },
  {
    id: 'std-7',
    namaLengkap: 'Arka Danendra Wijaya',
    namaPanggilan: 'Arka',
    nisn: '0019283747',
    nik: '3374010502220007',
    jenisKelamin: 'L',
    tanggalLahir: '2022-02-05',
    tempatLahir: 'Semarang',
    namaAyah: 'Budi Wijaya',
    namaIbu: 'Rina Marlina',
    noHpOrtu: '081234567897',
    alamat: 'Jl. Pemuda No. 15, Semarang Tengah',
    kelasId: 'cls-4',
    fotoAvatar: '👶🏻',
    tinggiBadanCm: 96,
    beratBadanKg: 14.5,
    bintangTerkumpul: 14,
    lencana: ['Balita Riang', 'Bintang Warna'],
  },
];

const DEFAULT_ASSESSMENTS: RaporAssessment[] = [
  {
    id: 'rap-1',
    studentId: 'std-1',
    tahunAjaran: '2025/2026',
    semester: 'I (Gasal)',
    agamaBudiPekerti: {
      capaian: 'BSB',
      narasi: 'Ananda Rayyan menunjukkan sikap religius yang sangat baik. Mampu melafalkan doa sebelum dan sesudah kegiatan belajar, serta senantiasa mengucapkan salam dengan santun dan menyayangi sesama teman di kelas.',
    },
    jatiDiri: {
      capaian: 'BSH',
      narasi: 'Rayyan mampu mengekspresikan emosi dengan wajar, terbiasa mencuci tangan sebelum makan, dan menunjukkan rasa percaya diri yang tinggi saat memimpin barisan teman-temannya.',
    },
    dasarLiterasiSteam: {
      capaian: 'BSB',
      narasi: 'Kemampuan literasi dan numerasi Rayyan berkembang sangat pesat. Sudah mampu mengenal simbol huruf A-Z, menghubungkan bunyi huruf dengan kata, serta mahir membilang benda 1 sampai 20 dengan antusias.',
    },
    catatanGuru: 'Pertahankan semangat belajarmu ya Rayyan sayang. Rayyan calon pemimpin cilik yang hebat dan cerdas!',
    kehadiranSakit: 1,
    kehadiranIzin: 0,
    kehadiranAlfa: 0,
    tanggalRapor: '2026-10-25',
  },
  {
    id: 'rap-2',
    studentId: 'std-2',
    tahunAjaran: '2025/2026',
    semester: 'I (Gasal)',
    agamaBudiPekerti: {
      capaian: 'BSB',
      narasi: 'Aisyah sangat fasih menghafal surat pendek dan doa harian. Menunjukkan empati yang tinggi dengan suka berbagi bekal dan menolong teman yang sedang membutuhkan bantuan.',
    },
    jatiDiri: {
      capaian: 'BSB',
      narasi: 'Motorik halus dan kasar Aisyah sangat matang. Piawai menggunting pola, meronce manik-manik, serta gemar melompat dan menari mengikuti irama musik dengan luwes.',
    },
    dasarLiterasiSteam: {
      capaian: 'BSB',
      narasi: 'Aisyah sangat menyukai dongeng dan mampu menceritakan kembali isi buku cerita dengan bahasanya sendiri. Karyanya dalam melukis warna sangat imajinatif dan penuh variasi warna.',
    },
    catatanGuru: 'Aisyah adalah bintang kelas yang selalu menebarkan senyum ceria. Teruslah berkarya dan berkilau!',
    kehadiranSakit: 0,
    kehadiranIzin: 1,
    kehadiranAlfa: 0,
    tanggalRapor: '2026-10-25',
  },
];

const DEFAULT_SONGS: NurserySong[] = [
  {
    id: 'song-1',
    title: 'Balonku Ada Lima',
    composer: 'A.T. Mahmud',
    lyrics: [
      'Balonku ada lima 🎈',
      'Rupa-rupa warnanya 🌈',
      'Hijau, kuning, kelabu 💚💛🩶',
      'Merah muda dan biru 💖💙',
      'Meletus balon hijau... DOR! 💥',
      'Hatiku sangat kacau 🥺',
      'Balonku tinggal empat 🎈🎈🎈🎈',
      'Kupegang erat-erat! 🤗',
    ],
    melodyBeats: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 523.25],
    tempo: 120,
    color: 'from-pink-500 to-rose-400',
    icon: '🎈',
  },
  {
    id: 'song-2',
    title: 'Pelangi-Pelangi',
    composer: 'A.T. Mahmud',
    lyrics: [
      'Pelangi-pelangi, alangkah indahmu! 🌈',
      'Merah, kuning, hijau di langit yang biru ⛅',
      'Pelukismu agung, siapa gerangan? 🎨',
      'Pelangi-pelangi, ciptaan Tuhan! ✨',
    ],
    melodyBeats: [329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63],
    tempo: 105,
    color: 'from-amber-400 to-emerald-400',
    icon: '🌈',
  },
  {
    id: 'song-3',
    title: 'Bintang Kecil',
    composer: 'Daljono',
    lyrics: [
      'Bintang kecil di langit yang tinggi 🌟',
      'Amat banyak menghias angkasa ✨',
      'Aku ingin terbang dan menari 🚀',
      'Jauh tinggi ke tempat kau berada 🌙',
    ],
    melodyBeats: [261.63, 261.63, 392.0, 392.0, 440.0, 440.0, 392.0],
    tempo: 100,
    color: 'from-blue-600 to-indigo-500',
    icon: '⭐',
  },
  {
    id: 'song-4',
    title: 'Naik Kereta Api',
    composer: 'Saridjah Niung (Ibu Sud)',
    lyrics: [
      'Naik kereta api... tut tut tut! 🚂',
      'Siapa hendak turut? 🙋‍♂️',
      'Ke Bandung, Surabaya 🏙️',
      'Bolehlah naik dengan percuma 🎫',
      'Ayo kawanku lekas naik! 🚆',
      'Keretaku tak berhenti lama! ⏰',
    ],
    melodyBeats: [392.0, 440.0, 493.88, 523.25, 392.0, 329.63],
    tempo: 130,
    color: 'from-violet-500 to-purple-600',
    icon: '🚂',
  },
  {
    id: 'song-5',
    title: 'Lihat Kebonku',
    composer: 'Ibu Sud',
    lyrics: [
      'Lihat kebonku, penuh dengan bunga 🌺',
      'Ada yang putih dan ada yang merah 🌸',
      'Setiap hari kusiram semua 💦',
      'Mawar melati, semuanya indah! 🌹',
    ],
    melodyBeats: [329.63, 349.23, 392.0, 440.0, 523.25],
    tempo: 110,
    color: 'from-emerald-500 to-teal-400',
    icon: '🌻',
  },
];

const DEFAULT_STORIES: FableStory[] = [
  {
    id: 'story-1',
    title: 'Kancil yang Cerdik dan Buaya yang Sabar',
    characters: 'Kancil & Kumpulan Buaya',
    moral: 'Gunakan kecerdasan untuk kebaikan dan jangan lupa berterima kasih kepada sesama.',
    pages: [
      {
        illustrationEmoji: '🦌🌳',
        text: 'Di sebuah hutan yang hijau dan sejuk, hiduplah seekor Kancil yang periang dan suka menolong. Suatu pagi, Kancil ingin menyeberang sungai untuk memetik buah apel yang ranum.',
      },
      {
        illustrationEmoji: '🐊🌊',
        text: 'Namun, sungai itu sangat dalam dan ada sekawanan buaya yang sedang berjemur. Kancil dengan sopan menyapa, "Hai sahabat Buaya, bolehkah aku minta tolong berbaris agar aku bisa menghitung jumlah sahabat baikku di sungai ini?"',
      },
      {
        illustrationEmoji: '🪜✨',
        text: 'Para buaya pun berbaris rapi. Kancil melompat dengan riang sambil berhitung: "Satu, dua, tiga, empat, lima, sampai di seberang!" Kancil tersenyum manis.',
      },
      {
        illustrationEmoji: '🍎🤝',
        text: 'Kancil memetik banyak buah apel dan membagikannya kepada sahabat buaya di sungai. Semua bersahabat dengan rukun dan gembira!',
      },
    ],
  },
  {
    id: 'story-2',
    title: 'Kisah Semut Rajin dan Belalang Bernyanyi',
    characters: 'Semut & Belalang',
    moral: 'Rajin belajar dan bekerja sama akan mendatangkan keselamatan dan kebahagiaan.',
    pages: [
      {
        illustrationEmoji: '🐜🍁',
        text: 'Di taman bunga sekolah TK Ceria, kawanan Semut kecil berbaris rapi mengumpulkan butir-butir biji bunga dengan riang gembira saling membantu.',
      },
      {
        illustrationEmoji: '🦗🎸',
        text: 'Seekor Belalang hijau sedang asyik bermain biola dan bernyanyi merdu. Belalang mengajak Semut untuk hanya bersantai sepanjang hari.',
      },
      {
        illustrationEmoji: '🌧️🍃',
        text: 'Tiba-tiba hujan lebat turun mengguyur taman! Belalang kedinginan dan kelaparan karena belum mempersiapkan makanan dan tempat berteduh.',
      },
      {
        illustrationEmoji: '🍵🏠',
        text: 'Semut yang baik hati membuka pintu sarangnya yang hangat, memberikan teh madu hangat dan kue lezat kepada Belalang. Belalang berjanji akan menjadi anak yang rajin seperti kawanan semut.',
      },
    ],
  },
  {
    id: 'story-3',
    title: 'Lomba Lari Kelinci dan Kura-Kura yang Rendah Hati',
    characters: 'Kelinci Lincah & Kura-Kura Sabar',
    moral: 'Jangan pernah sombong dan meremehkan orang lain. Ketekunan dan kesabaran selalu membawa kesuksesan.',
    pages: [
      {
        illustrationEmoji: '🐰💨🐢',
        text: 'Kelinci yang merasa dirinya pelari tercepat di hutan menantang Kura-Kura untuk berlomba lari di padang rumput hijau yang luas.',
      },
      {
        illustrationEmoji: '🏁🌱',
        text: 'Lomba pun dimulai! Kelinci melesat cepat ke depan, sedangkan Kura-Kura melangkah pelan tapi pasti tanpa pernah berhenti dan tanpa mengeluh sedikit pun.',
      },
      {
        illustrationEmoji: '🌳😴',
        text: 'Karena merasa sudah sangat jauh memimpin, Kelinci memutuskan untuk tidur siang sejenak di bawah pohon rindang yang sepoi-sepoi.',
      },
      {
        illustrationEmoji: '🏆🤝✨',
        text: 'Kura-Kura terus berjalan dengan sabar dan melewati Kelinci hingga menyentuh garis finish lebih dulu! Kelinci terbangun, meminta maaf atas kesombongannya, dan memberi selamat kepada Kura-Kura.',
      },
    ],
  },
  {
    id: 'story-4',
    title: 'Kisah Singa Perkasa dan Tikus Kecil yang Setia',
    characters: 'Singa Rimba & Tikus Mungil',
    moral: 'Kebaikan sekecil apa pun sangat bernilai. Sahabat sejati selalu siap menolong tanpa memandang rupa atau ukuran.',
    pages: [
      {
        illustrationEmoji: '🦁🐭💤',
        text: 'Seekor Tikus kecil tanpa sengaja berlari melintasi hidung Singa besar yang sedang tidur pulas di bawah gua batu rindang.',
      },
      {
        illustrationEmoji: '🐾💬',
        text: 'Singa terbangun dan menangkap Tikus dengan cakarnya. Tikus memohon dengan sopan: "Tolong ampuni aku Tuan Singa, kelak aku berjanji akan membalas kebaikanmu!" Singa tertawa geli lalu melepaskan Tikus.',
      },
      {
        illustrationEmoji: '🕸️🦁📢',
        text: 'Beberapa hari kemudian, Singa terperangkap dalam jaring pemburu yang sangat kuat di tengah hutan. Singa mengaum kencang meminta pertolongan.',
      },
      {
        illustrationEmoji: '💖🐭✨',
        text: 'Mendengar auman itu, Tikus kecil segera datang dan menggigit tali jaring satu per satu dengan giginya yang tajam sampai Singa terbebas. Singa dan Tikus pun bersahabat erat selamanya!',
      },
    ],
  },
  {
    id: 'story-5',
    title: 'Burung Gagak Cerdik dan Kendi Air',
    characters: 'Burung Gagak Pintar',
    moral: 'Saat menghadapi kesulitan, tetaplah tenang dan gunakan akal pikiran. Jangan pernah mudah menyerah.',
    pages: [
      {
        illustrationEmoji: '☀️🐦🏜️',
        text: 'Pada siang hari yang sangat terik di musim kemarau, seekor Burung Gagak terbang ke sana ke mari mencari seteguk air karena tenggorokannya sangat kering.',
      },
      {
        illustrationEmoji: '🏺💧',
        text: 'Gagak menemukan sebuah kendi tanah liat di dekat pohon. Di dalam kendi ada sedikit air, namun leher kendi terlalu sempit sehingga paruhnya tidak bisa mencapainya.',
      },
      {
        illustrationEmoji: '💡🪨',
        text: 'Gagak tidak putus asa. Ia melihat banyak batu kerikil kecil di tanah. Sebuah ide cerdas muncul di kepalanya!',
      },
      {
        illustrationEmoji: '🥤🌈🎉',
        text: 'Gagak mengambil batu kerikil satu per satu dengan paruhnya dan memasukkannya ke dalam kendi. Permukaan air perlahan naik ke atas hingga Gagak bisa minum sepuasnya dengan riang gembira!',
      },
    ],
  },
  {
    id: 'story-6',
    title: 'Ciko si Anak Ayam dan Boni si Bebek Berenang',
    characters: 'Ciko (Ayam) & Boni (Bebek)',
    moral: 'Saling menghargai kelebihan masing-masing dan tolong-menolong membuat persahabatan terasa hangat dan indah.',
    pages: [
      {
        illustrationEmoji: '🐥🦆🌻',
        text: 'Di tepi sawah pedesaan yang asri, Ciko si anak ayam berbulu kuning dan Boni si anak bebek senang bermain petak umpet bersama di rerumputan.',
      },
      {
        illustrationEmoji: '🏊‍♂️💧',
        text: 'Boni sangat mahir berenang di kolam jernih, sedangkan Ciko takut air karena kakinya tidak memiliki selaput untuk berenang.',
      },
      {
        illustrationEmoji: '🌽🌊😢',
        text: 'Suatu hari, bekal jagung manis kesukaan Ciko tergelincir jatuh ke tengah kolam dan hanyut terbawa riak air. Ciko merasa sangat sedih.',
      },
      {
        illustrationEmoji: '🤗🌽🌟',
        text: 'Tanpa ragu, Boni langsung melompat ke air dan berenang lincah mengambil jagung manis itu untuk sahabatnya. Mereka pun menikmati jagung bersama dengan penuh rasa syukur.',
      },
    ],
  },
  {
    id: 'story-7',
    title: 'Tomi si Gajah Ramah dan Sahabat Hutan',
    characters: 'Tomi si Gajah & Hewan Hutan',
    moral: 'Kekuatan dan kemampuan yang kita miliki harus digunakan untuk menolong sesama yang sedang membutuhkan bantuan.',
    pages: [
      {
        illustrationEmoji: '🐘🌸🍃',
        text: 'Tomi adalah seekor anak gajah yang bertubuh besar dan kuat, namun memiliki hati yang sangat ramah, penyayang, dan suka tersenyum kepada siapa saja.',
      },
      {
        illustrationEmoji: '🌬️🪵🌧️',
        text: 'Tiba-tiba badai angin kencang meniup hutan hingga sebuah batang pohon tumbang menghalangi jalan pulang kawanan kelinci dan tupai kecil.',
      },
      {
        illustrationEmoji: '🐿️🐰❓',
        text: 'Hewan-hewan kecil kebingungan dan sedih karena hari mulai gelap, sedangkan batang kayu itu terlalu berat untuk mereka geser.',
      },
      {
        illustrationEmoji: '🎉🐘💖',
        text: 'Tomi datang dengan langkah riang. Menggunakan belalainya yang kuat, Tomi mengangkat batang pohon itu dan membersihkan jalan. Semua hewan hutan bersorak gembira dan memeluk Tomi!',
      },
    ],
  },
];

const DEFAULT_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: 'Baru saja',
    studentName: 'Muhammad Rayyan Al-Fatih',
    module: 'Alfabet Ceria',
    activity: 'Menyelesaikan tebak huruf A sampai Z',
    starsEarned: 3,
  },
  {
    id: 'act-2',
    timestamp: '15 menit lalu',
    studentName: 'Aisyah Putri Zahra',
    module: 'Studio Mewarnai',
    activity: 'Menyimpan karya gambar Kupu-Kupu Pelangi',
    starsEarned: 5,
  },
  {
    id: 'act-3',
    timestamp: '40 menit lalu',
    studentName: 'Bilal Habibi',
    module: '123 Berhitung',
    activity: 'Berhasil kuis menghitung buah apel 1-10',
    starsEarned: 3,
  },
  {
    id: 'act-4',
    timestamp: '1 jam lalu',
    studentName: 'Kenzo Arkan',
    module: 'Lagu Ceria',
    activity: 'Bernyanyi lagu Balonku Ada Lima dengan riang',
    starsEarned: 2,
  },
];

export class StorageService {
  private static load<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return defaultValue;
  }

  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or disabled
    }
  }

  public static getSchoolProfile(): SchoolProfile {
    const profile = this.load('paud_school_profile', DEFAULT_SCHOOL);
    if (
      profile.namaSekolah === 'TK PAUD Jateng' ||
      profile.namaSekolah === 'TK PAUD Cimanggu' ||
      profile.namaSekolah === 'Rapor PAUD Cimanggu' ||
      !profile.namaSekolah
    ) {
      profile.namaSekolah = 'TK MASYITHOH CIMANGGU';
      this.saveSchoolProfile(profile);
    }
    return profile;
  }


  public static saveSchoolProfile(profile: SchoolProfile): void {
    this.save('paud_school_profile', profile);
  }

  public static getClasses(): ClassRoom[] {
    return this.load('paud_classes', DEFAULT_CLASSES);
  }

  public static saveClasses(classes: ClassRoom[]): void {
    this.save('paud_classes', classes);
  }

  public static getStudents(): Student[] {
    return this.load('paud_students', DEFAULT_STUDENTS);
  }

  public static saveStudents(students: Student[]): void {
    this.save('paud_students', students);
  }

  public static addStudent(student: Omit<Student, 'id' | 'bintangTerkumpul' | 'lencana'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `std-${Date.now()}`,
      bintangTerkumpul: 5,
      lencana: ['Murid Baru Ceria'],
    };
    students.push(newStudent);
    this.saveStudents(students);
    return newStudent;
  }

  public static updateStudent(updatedStudent: Student): void {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === updatedStudent.id);
    if (idx !== -1) {
      students[idx] = updatedStudent;
      this.saveStudents(students);
    }
  }

  public static deleteStudent(id: string): void {
    const students = this.getStudents().filter((s) => s.id !== id);
    this.saveStudents(students);
  }

  public static getAssessments(): RaporAssessment[] {
    return this.load('paud_assessments', DEFAULT_ASSESSMENTS);
  }

  public static saveAssessments(assessments: RaporAssessment[]): void {
    this.save('paud_assessments', assessments);
  }

  public static saveAssessmentForStudent(assessment: RaporAssessment): void {
    const all = this.getAssessments();
    const idx = all.findIndex((a) => a.studentId === assessment.studentId && a.semester === assessment.semester);
    if (idx !== -1) {
      all[idx] = assessment;
    } else {
      all.push(assessment);
    }
    this.saveAssessments(all);
  }

  public static getSongs(): NurserySong[] {
    return DEFAULT_SONGS;
  }

  public static getStories(): FableStory[] {
    return DEFAULT_STORIES;
  }

  public static getActivityLogs(): ActivityLog[] {
    return this.load('paud_activity_logs', DEFAULT_ACTIVITY_LOGS);
  }

  public static logActivity(studentName: string, module: string, activity: string, starsEarned: number): void {
    const logs = this.getActivityLogs();
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Baru saja',
      studentName,
      module,
      activity,
      starsEarned,
    };
    logs.unshift(newLog);
    if (logs.length > 25) logs.pop();
    this.save('paud_activity_logs', logs);

    // Also increment active kid's stars if in kid mode
    const currentStudentId = localStorage.getItem('paud_active_student_id') || 'std-1';
    const students = this.getStudents();
    const st = students.find((s) => s.id === currentStudentId);
    if (st) {
      st.bintangTerkumpul = (st.bintangTerkumpul || 0) + starsEarned;
      this.saveStudents(students);
    }
  }

  public static getActiveStudent(): Student {
    const students = this.getStudents();
    const activeId = localStorage.getItem('paud_active_student_id');
    const found = students.find((s) => s.id === activeId);
    return found || students[0];
  }

  public static setActiveStudentId(id: string): void {
    localStorage.setItem('paud_active_student_id', id);
  }

  public static getAttendanceRecords(): DailyAttendance[] {
    return this.load('paud_attendance_records', DEFAULT_ATTENDANCE);
  }

  public static saveAttendanceRecords(records: DailyAttendance[]): void {
    this.save('paud_attendance_records', records);
  }

  public static setStudentAttendance(
    date: string,
    studentId: string,
    status: AttendanceStatus,
    note?: string,
    temperature?: string
  ): void {
    const all = this.getAttendanceRecords();
    const idx = all.findIndex((r) => r.date === date && r.studentId === studentId);
    if (idx !== -1) {
      all[idx] = {
        ...all[idx],
        status,
        note: note !== undefined ? note : all[idx].note,
        temperature: temperature !== undefined ? temperature : all[idx].temperature,
      };
    } else {
      all.push({
        id: `att-${Date.now()}-${studentId}`,
        date,
        studentId,
        status,
        note,
        temperature,
      });
    }
    this.saveAttendanceRecords(all);
  }

  public static markAllPresent(date: string, studentIds: string[]): void {
    const all = this.getAttendanceRecords();
    studentIds.forEach((sid) => {
      const idx = all.findIndex((r) => r.date === date && r.studentId === sid);
      if (idx !== -1) {
        all[idx].status = 'H';
      } else {
        all.push({
          id: `att-${Date.now()}-${sid}`,
          date,
          studentId: sid,
          status: 'H',
          note: 'Hadir tepat waktu',
          temperature: '36.5',
        });
      }
    });
    this.saveAttendanceRecords(all);
  }

  public static getStudentAttendanceSummary(studentId: string): { hadir: number; sakit: number; izin: number; alfa: number } {
    const all = this.getAttendanceRecords();
    const studentRecords = all.filter((r) => r.studentId === studentId);
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alfa = 0;
    studentRecords.forEach((r) => {
      if (r.status === 'H') hadir++;
      else if (r.status === 'S') sakit++;
      else if (r.status === 'I') izin++;
      else if (r.status === 'A') alfa++;
    });
    return { hadir, sakit, izin, alfa };
  }

  public static getUsers(): AppUser[] {
    return DEFAULT_USERS;
  }

  public static getCurrentUser(): AppUser {
    const activeUserId = localStorage.getItem('paud_active_user_id');
    if (activeUserId) {
      const byId = DEFAULT_USERS.find((u) => u.id === activeUserId);
      if (byId) return byId;
    }
    const role = (localStorage.getItem('paud_active_user_role') || 'admin') as UserRole;
    const found = DEFAULT_USERS.find((u) => u.role === role);
    return found || DEFAULT_USERS[0];
  }

  public static setCurrentUser(user: AppUser): AppUser {
    localStorage.setItem('paud_active_user_id', user.id);
    localStorage.setItem('paud_active_user_role', user.role);
    return user;
  }

  public static setCurrentUserRole(role: UserRole): AppUser {
    localStorage.setItem('paud_active_user_role', role);
    if (role === 'admin') {
      localStorage.setItem('paud_active_user_id', 'usr-admin');
    } else {
      // If switching to teacher and current user isn't teacher, default to Sri Wahyuni
      const cur = this.getCurrentUser();
      if (cur.role !== 'guru') {
        localStorage.setItem('paud_active_user_id', 'usr-guru-sri');
      }
    }
    return this.getCurrentUser();
  }

  public static resetDemoData(): void {
    localStorage.removeItem('paud_school_profile');
    localStorage.removeItem('paud_classes');
    localStorage.removeItem('paud_students');
    localStorage.removeItem('paud_assessments');
    localStorage.removeItem('paud_activity_logs');
    localStorage.removeItem('paud_attendance_records');
    localStorage.removeItem('paud_active_user_role');
    localStorage.removeItem('paud_active_user_id');
    window.location.reload();
  }

}
