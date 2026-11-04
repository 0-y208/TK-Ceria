import { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Award,
  BookOpen,
  HelpCircle,
  PenTool,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Eraser,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../../services/soundService';
import { StorageService } from '../../services/storageService';

export interface HijaiyahCard {
  letter: string;          // Arabic glyph (e.g. 'ا')
  name: string;            // Latin name (e.g. 'Alif')
  arabicName: string;      // Arabic name text (e.g. 'أَلِف')
  transliteration: string; // Phonetic read
  wordExample: string;     // Indonesian / Islamic example (e.g. 'Al-Quran')
  wordArabic: string;      // Example in Arabic (e.g. 'قُرْآن')
  emoji: string;           // Cheerful kid emoji
  description: string;     // Friendly audio prompt
  color: string;           // Tailored pastel card gradient
  textColor: string;       // Text accent
  borderColor: string;     // Border tint
  fathah: string;          // Harakat fathah variation (e.g. 'أَ' - 'A')
  kasrah: string;          // Harakat kasrah variation (e.g. 'إِ' - 'I')
  dhammah: string;         // Harakat dhammah variation (e.g. 'أُ' - 'U')
}

export const HIJAIYAH_DATA: HijaiyahCard[] = [
  {
    letter: 'ا',
    name: 'Alif',
    arabicName: 'أَلِف',
    transliteration: 'A',
    wordExample: 'Al-Quran',
    wordArabic: 'قُرْآن',
    emoji: '📖',
    description: 'Alif seperti kitab suci Al-Quran yang mulia.',
    color: 'from-amber-100 to-amber-200',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    fathah: 'أَ (A)',
    kasrah: 'إِ (I)',
    dhammah: 'أُ (U)',
  },
  {
    letter: 'ب',
    name: 'Ba',
    arabicName: 'بَاء',
    transliteration: 'Ba',
    wordExample: 'Baitullah (Ka\'bah)',
    wordArabic: 'بَيْتُ الله',
    emoji: '🕋',
    description: 'Ba memiliki satu titik di bawah, seperti Baitullah Ka\'bah yang suci.',
    color: 'from-teal-100 to-teal-200',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-300',
    fathah: 'بَ (Ba)',
    kasrah: 'بِ (Bi)',
    dhammah: 'بُ (Bu)',
  },
  {
    letter: 'ت',
    name: 'Ta',
    arabicName: 'تَاء',
    transliteration: 'Ta',
    wordExample: 'Tamar (Kurma manis)',
    wordArabic: 'تَمْر',
    emoji: '🌴',
    description: 'Ta memiliki dua titik di atas yang manis seperti senyuman anak sholeh.',
    color: 'from-rose-100 to-rose-200',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-300',
    fathah: 'تَ (Ta)',
    kasrah: 'تِ (Ti)',
    dhammah: 'تُ (Tu)',
  },
  {
    letter: 'ث',
    name: 'Tsa',
    arabicName: 'ثَاء',
    transliteration: 'Tsa',
    wordExample: 'Tsaub (Pakaian bersih)',
    wordArabic: 'ثَوْب',
    emoji: '👕',
    description: 'Tsa memiliki tiga titik di atas, ujung lidah menyentuh gigi depan.',
    color: 'from-purple-100 to-purple-200',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    fathah: 'ثَ (Tsa)',
    kasrah: 'ثِ (Tsi)',
    dhammah: 'ثُ (Tsu)',
  },
  {
    letter: 'ج',
    name: 'Jim',
    arabicName: 'جِيم',
    transliteration: 'Ja',
    wordExample: 'Jamal (Unta gurun)',
    wordArabic: 'جَمَل',
    emoji: '🐪',
    description: 'Jim memiliki satu titik di dalam perutnya seperti unta yang kuat.',
    color: 'from-emerald-100 to-emerald-200',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    fathah: 'جَ (Ja)',
    kasrah: 'جِ (Ji)',
    dhammah: 'جُ (Ju)',
  },
  {
    letter: 'ح',
    name: 'Ha',
    arabicName: 'حَاء',
    transliteration: 'Ha',
    wordExample: 'Hajj (Ibadah Haji)',
    wordArabic: 'حَجّ',
    emoji: '🤍',
    description: 'Ha dibaca bersih dari tengah tenggorokan tanpa ada titik.',
    color: 'from-sky-100 to-sky-200',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-300',
    fathah: 'حَ (Ha)',
    kasrah: 'حِ (Hi)',
    dhammah: 'حُ (Hu)',
  },
  {
    letter: 'خ',
    name: 'Kha',
    arabicName: 'خَاء',
    transliteration: 'Kha',
    wordExample: 'Khubz (Roti lezat)',
    wordArabic: 'خُبْز',
    emoji: '🥖',
    description: 'Kha memiliki satu titik di atas kepalanya, bunyinya tebal.',
    color: 'from-orange-100 to-orange-200',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    fathah: 'خَ (Kha)',
    kasrah: 'خِ (Khi)',
    dhammah: 'خُ (Khu)',
  },
  {
    letter: 'د',
    name: 'Dal',
    arabicName: 'دَال',
    transliteration: 'Da',
    wordExample: 'Dua (Doa harian)',
    wordArabic: 'دُعَاء',
    emoji: '🤲',
    description: 'Dal seperti dua tangan yang menengadah memohon doa pada Allah.',
    color: 'from-indigo-100 to-indigo-200',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-300',
    fathah: 'دَ (Da)',
    kasrah: 'دِ (Di)',
    dhammah: 'دُ (Du)',
  },
  {
    letter: 'ذ',
    name: 'Dzal',
    arabicName: 'ذَال',
    transliteration: 'Dza',
    wordExample: 'Dzahab (Emas kemilau)',
    wordArabic: 'ذَهَب',
    emoji: '✨',
    description: 'Dzal seperti Dal yang bertitik satu di atas, dibaca lembut dengan ujung lidah.',
    color: 'from-yellow-100 to-yellow-200',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    fathah: 'ذَ (Dza)',
    kasrah: 'ذِ (Dzi)',
    dhammah: 'ذُ (Dzu)',
  },
  {
    letter: 'ر',
    name: 'Ra',
    arabicName: 'رَاء',
    transliteration: 'Ra',
    wordExample: 'Rahmat (Kasih sayang)',
    wordArabic: 'رَحْمَة',
    emoji: '🌸',
    description: 'Ra melengkung indah seperti pelangi, bergetar lembut.',
    color: 'from-lime-100 to-lime-200',
    textColor: 'text-lime-800',
    borderColor: 'border-lime-300',
    fathah: 'رَ (Ra)',
    kasrah: 'رِ (Ri)',
    dhammah: 'رُ (Ru)',
  },
  {
    letter: 'ز',
    name: 'Zai',
    arabicName: 'زَاي',
    transliteration: 'Za',
    wordExample: 'Zaitun (Buah zaitun berkah)',
    wordArabic: 'زَيْتُون',
    emoji: '🫒',
    description: 'Zai seperti huruf Ra dengan titik di atasnya, berdesis riang.',
    color: 'from-cyan-100 to-cyan-200',
    textColor: 'text-cyan-800',
    borderColor: 'border-cyan-300',
    fathah: 'زَ (Za)',
    kasrah: 'زِ (Zi)',
    dhammah: 'زُ (Zu)',
  },
  {
    letter: 'س',
    name: 'Sin',
    arabicName: 'سِين',
    transliteration: 'Sa',
    wordExample: 'Salam (Kedamaian)',
    wordArabic: 'سَلَام',
    emoji: '🕊️',
    description: 'Sin memiliki tiga gigi kecil, mengajak kita selalu tersenyum dan berucap salam.',
    color: 'from-emerald-100 to-teal-200',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    fathah: 'سَ (Sa)',
    kasrah: 'سِ (Si)',
    dhammah: 'سُ (Su)',
  },
  {
    letter: 'ش',
    name: 'Syin',
    arabicName: 'شِين',
    transliteration: 'Sya',
    wordExample: 'Syams (Matahari cerah)',
    wordArabic: 'شَمْس',
    emoji: '☀️',
    description: 'Syin bertitik tiga di atas gigi-giginya, bersuara desis angin menyebar.',
    color: 'from-amber-100 to-yellow-200',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    fathah: 'شَ (Sya)',
    kasrah: 'شِ (Syi)',
    dhammah: 'شُ (Syu)',
  },
  {
    letter: 'ص',
    name: 'Shad',
    arabicName: 'صَاد',
    transliteration: 'Sha',
    wordExample: 'Shalat (Ibadah shalat)',
    wordArabic: 'صَلَاة',
    emoji: '🕌',
    description: 'Shad bersuara tebal dan penuh ketenangan saat beribadah.',
    color: 'from-blue-100 to-blue-200',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    fathah: 'صَ (Sha)',
    kasrah: 'صِ (Shi)',
    dhammah: 'صُ (Shu)',
  },
  {
    letter: 'ض',
    name: 'Dhad',
    arabicName: 'ضَاد',
    transliteration: 'Dha',
    wordExample: 'Dhiya (Cahaya terang)',
    wordArabic: 'ضِيَاء',
    emoji: '💡',
    description: 'Dhad adalah huruf istimewa Al-Quran dengan titik satu di atas.',
    color: 'from-violet-100 to-purple-200',
    textColor: 'text-violet-800',
    borderColor: 'border-violet-300',
    fathah: 'ضَ (Dha)',
    kasrah: 'ضِ (Dhi)',
    dhammah: 'ضُ (Dhu)',
  },
  {
    letter: 'ط',
    name: 'Tha',
    arabicName: 'طَاء',
    transliteration: 'Tha',
    wordExample: 'Thayyib (Baik & berkah)',
    wordArabic: 'طَيِّب',
    emoji: '🍎',
    description: 'Tha memiliki tiang tegak di atasnya, bunyinya tebal dan mantap.',
    color: 'from-fuchsia-100 to-pink-200',
    textColor: 'text-fuchsia-800',
    borderColor: 'border-fuchsia-300',
    fathah: 'طَ (Tha)',
    kasrah: 'طِ (Thi)',
    dhammah: 'طُ (Thu)',
  },
  {
    letter: 'ظ',
    name: 'Zha',
    arabicName: 'ظَاء',
    transliteration: 'Zha',
    wordExample: 'Zhilal (Naungan sejuk)',
    wordArabic: 'ظِلَال',
    emoji: '🌳',
    description: 'Zha seperti huruf Tha ditambah satu titik, dibaca tebal.',
    color: 'from-green-100 to-emerald-200',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    fathah: 'ظَ (Zha)',
    kasrah: 'ظِ (Zhi)',
    dhammah: 'ظُ (Zhu)',
  },
  {
    letter: 'ع',
    name: '\'Ain',
    arabicName: 'عَيْن',
    transliteration: '\'A',
    wordExample: '\'Ilm (Ilmu bermanfaat)',
    wordArabic: 'عِلْم',
    emoji: '📚',
    description: '\'Ain keluar dari tengah tenggorokan dengan bunyi yang bulat.',
    color: 'from-teal-100 to-cyan-200',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-300',
    fathah: 'عَ (\'A)',
    kasrah: 'عِ (\'I)',
    dhammah: 'عُ (\'U)',
  },
  {
    letter: 'غ',
    name: 'Ghain',
    arabicName: 'غَيْن',
    transliteration: 'Gha',
    wordExample: 'Ghaim (Awan putih)',
    wordArabic: 'غَيْم',
    emoji: '☁️',
    description: 'Ghain seperti \'Ain dengan satu titik di atas kepala, keluar dari tenggorokan atas.',
    color: 'from-sky-100 to-indigo-200',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-300',
    fathah: 'غَ (Gha)',
    kasrah: 'غِ (Ghi)',
    dhammah: 'غُ (Ghu)',
  },
  {
    letter: 'ف',
    name: 'Fa',
    arabicName: 'فَاء',
    transliteration: 'Fa',
    wordExample: 'Farashah (Kupu-kupu cantik)',
    wordArabic: 'فَرَاشَة',
    emoji: '🦋',
    description: 'Fa memiliki satu titik di atas lingkaran kepalanya, lembut dan indah.',
    color: 'from-pink-100 to-rose-200',
    textColor: 'text-pink-800',
    borderColor: 'border-pink-300',
    fathah: 'فَ (Fa)',
    kasrah: 'فِ (Fi)',
    dhammah: 'فُ (Fu)',
  },
  {
    letter: 'ق',
    name: 'Qaf',
    arabicName: 'قَاف',
    transliteration: 'Qa',
    wordExample: 'Qamar (Bulan purnama)',
    wordArabic: 'قَمَر',
    emoji: '🌙',
    description: 'Qaf memiliki dua titik di atas, bersuara mantap memantul di pangkal lidah.',
    color: 'from-purple-100 to-indigo-200',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    fathah: 'قَ (Qa)',
    kasrah: 'قِ (Qi)',
    dhammah: 'قُ (Qu)',
  },
  {
    letter: 'ك',
    name: 'Kaf',
    arabicName: 'كَاف',
    transliteration: 'Ka',
    wordExample: 'Kitab (Buku cerita)',
    wordArabic: 'كِتَاب',
    emoji: '📖',
    description: 'Kaf memiliki lambang hamzah kecil di tengahnya, berhembus lembut.',
    color: 'from-blue-100 to-teal-200',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    fathah: 'كَ (Ka)',
    kasrah: 'كِ (Ki)',
    dhammah: 'كُ (Ku)',
  },
  {
    letter: 'ل',
    name: 'Lam',
    arabicName: 'لَام',
    transliteration: 'La',
    wordExample: 'Laban (Susu murni sehat)',
    wordArabic: 'لَبَن',
    emoji: '🥛',
    description: 'Lam meliuk tegak tinggi lalu melengkung manis seperti cangkir susu.',
    color: 'from-emerald-100 to-lime-200',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    fathah: 'لَ (La)',
    kasrah: 'لِ (Li)',
    dhammah: 'لُ (Lu)',
  },
  {
    letter: 'م',
    name: 'Mim',
    arabicName: 'مِيم',
    transliteration: 'Ma',
    wordExample: 'Masjid (Tempat ibadah indah)',
    wordArabic: 'مَسْجِد',
    emoji: '🕌',
    description: 'Mim memiliki lingkaran kepala dan ekor ke bawah, bersuara dengung lembut di bibir.',
    color: 'from-amber-100 to-orange-200',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    fathah: 'مَ (Ma)',
    kasrah: 'مِ (Mi)',
    dhammah: 'مُ (Mu)',
  },
  {
    letter: 'ن',
    name: 'Nun',
    arabicName: 'نُون',
    transliteration: 'Na',
    wordExample: 'Najm (Bintang gemerlap)',
    wordArabic: 'نَجْم',
    emoji: '⭐',
    description: 'Nun seperti mangkuk dengan satu bintang mutiara di atasnya.',
    color: 'from-yellow-100 to-amber-200',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    fathah: 'نَ (Na)',
    kasrah: 'نِ (Ni)',
    dhammah: 'نُ (Nu)',
  },
  {
    letter: 'و',
    name: 'Wawu',
    arabicName: 'وَاو',
    transliteration: 'Wa',
    wordExample: 'Wardah (Bunga mawar semerbak)',
    wordArabic: 'وَرْدَة',
    emoji: '🌹',
    description: 'Wawu melengkung anggun dengan lingkaran kepala di atas, kedua bibir membulat.',
    color: 'from-rose-100 to-pink-200',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-300',
    fathah: 'وَ (Wa)',
    kasrah: 'وِ (Wi)',
    dhammah: 'وُ (Wu)',
  },
  {
    letter: 'هـ',
    name: 'Ha (Besar)',
    arabicName: 'هَاء',
    transliteration: 'Ha',
    wordExample: 'Hidayah (Petunjuk kebaikan)',
    wordArabic: 'هِدَايَة',
    emoji: '🌟',
    description: 'Ha besar keluar dari pangkal tenggorokan yang paling dalam, lega dan riang.',
    color: 'from-cyan-100 to-sky-200',
    textColor: 'text-cyan-800',
    borderColor: 'border-cyan-300',
    fathah: 'هَ (Ha)',
    kasrah: 'هِ (Hi)',
    dhammah: 'هُ (Hu)',
  },
  {
    letter: 'لا',
    name: 'Lam Alif',
    arabicName: 'لَام أَلِف',
    transliteration: 'Laa',
    wordExample: 'La Ilaha Illallah',
    wordArabic: 'لَا إِلَهَ إِلَّا الله',
    emoji: '🤲',
    description: 'Lam Alif adalah perpaduan dua huruf indah yang mengajarkan tauhid.',
    color: 'from-teal-100 to-emerald-200',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-300',
    fathah: 'لَا (Laa)',
    kasrah: 'لِي (Lii)',
    dhammah: 'لُو (Luu)',
  },
  {
    letter: 'ء',
    name: 'Hamzah',
    arabicName: 'هَمْزَة',
    transliteration: 'A',
    wordExample: 'Amanah (Dapat dipercaya)',
    wordArabic: 'أَمَانَة',
    emoji: '🤝',
    description: 'Hamzah kecil pemberani yang memberi suara tegas di tenggorokan.',
    color: 'from-orange-100 to-amber-200',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    fathah: 'ءَ (A)',
    kasrah: 'ءِ (I)',
    dhammah: 'ءُ (U)',
  },
  {
    letter: 'ي',
    name: 'Ya',
    arabicName: 'يَاء',
    transliteration: 'Ya',
    wordExample: 'Yad (Tangan suka menolong)',
    wordArabic: 'يَد',
    emoji: '✋',
    description: 'Ya memiliki dua titik di bawah, seperti dua tangan yang selalu suka menolong teman.',
    color: 'from-indigo-100 to-purple-200',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-300',
    fathah: 'يَ (Ya)',
    kasrah: 'يِ (Yi)',
    dhammah: 'يُ (Yu)',
  },
];

export function HijaiyahModule({ onStarEarned }: { onStarEarned: (count: number) => void }) {
  const [selectedLetter, setSelectedLetter] = useState<HijaiyahCard>(HIJAIYAH_DATA[0]);
  const [activeTab, setActiveTab] = useState<'kartu' | 'harakat' | 'tebak' | 'tulis'>('kartu');

  // Quiz state
  const [quizTarget, setQuizTarget] = useState<HijaiyahCard>(HIJAIYAH_DATA[0]);
  const [quizOptions, setQuizOptions] = useState<HijaiyahCard[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Drawing Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState<string>('#0d9488'); // Teal brand
  const [hasDrawn, setHasDrawn] = useState(false);

  // Select card handler
  const handleSelectLetter = (item: HijaiyahCard) => {
    soundService.playPop();
    setSelectedLetter(item);
    soundService.speakHijaiyah(item.letter, item.name, item.description);
  };

  // Play letter sound
  const handlePlayVoice = (item: HijaiyahCard) => {
    soundService.playSparkle();
    soundService.speakHijaiyah(item.letter, item.name, item.description);
  };

  // Play Harakat Sound (Fathah / Kasrah / Dhammah)
  const handlePlayHarakat = (harakatText: string, soundRead: string) => {
    soundService.playPop();
    soundService.speakIndonesian(soundRead);
  };

  // Start new quiz round
  const startNewQuiz = () => {
    const targetIdx = Math.floor(Math.random() * HIJAIYAH_DATA.length);
    const target = HIJAIYAH_DATA[targetIdx];

    const distractors: HijaiyahCard[] = [];
    while (distractors.length < 3) {
      const rand = HIJAIYAH_DATA[Math.floor(Math.random() * HIJAIYAH_DATA.length)];
      if (rand.name !== target.name && !distractors.some((d) => d.name === rand.name)) {
        distractors.push(rand);
      }
    }

    const shuffled = [target, ...distractors].sort(() => Math.random() - 0.5);
    setQuizTarget(target);
    setQuizOptions(shuffled);
    setQuizFeedback(null);

    soundService.speakIndonesian(
      `Ayo cari huruf ${target.name}! Yang mana huruf ${target.name}?`
    );
  };

  const handleStartQuizMode = () => {
    soundService.playPop();
    setActiveTab('tebak');
    startNewQuiz();
  };

  const handleAnswerQuiz = (selected: HijaiyahCard) => {
    if (quizFeedback) return;

    if (selected.name === quizTarget.name) {
      soundService.playVictory();
      confetti({ particleCount: 50, spread: 60 });
      setQuizFeedback({
        isCorrect: true,
        message: `Maa Syaa Allah Hebat! Benar, ini huruf ${quizTarget.name} (${quizTarget.letter})!`,
      });
      setQuizScore((prev) => prev + 1);
      onStarEarned(2);

      StorageService.logActivity(
        StorageService.getActiveStudent().namaLengkap,
        'Huruf Hijaiyah Ceria',
        `Menebak huruf ${quizTarget.name} dengan benar`,
        2
      );

      setTimeout(() => {
        startNewQuiz();
      }, 2200);
    } else {
      soundService.playBoing();
      setQuizFeedback({
        isCorrect: false,
        message: `Hampir benar! Itu huruf ${selected.name} (${selected.letter}). Ayo coba lagi cari huruf ${quizTarget.name}!`,
      });
      soundService.speakIndonesian(`Bukan sayang, itu huruf ${selected.name}. Ayo coba lagi!`);
      setTimeout(() => {
        setQuizFeedback(null);
      }, 2000);
    }
  };

  // Next / Prev navigation
  const currentIndex = HIJAIYAH_DATA.findIndex((h) => h.name === selectedLetter.name);
  const handlePrev = () => {
    soundService.playPop();
    const prevIdx = (currentIndex - 1 + HIJAIYAH_DATA.length) % HIJAIYAH_DATA.length;
    setSelectedLetter(HIJAIYAH_DATA[prevIdx]);
    soundService.speakHijaiyah(
      HIJAIYAH_DATA[prevIdx].letter,
      HIJAIYAH_DATA[prevIdx].name,
      HIJAIYAH_DATA[prevIdx].description
    );
  };

  const handleNext = () => {
    soundService.playPop();
    const nextIdx = (currentIndex + 1) % HIJAIYAH_DATA.length;
    setSelectedLetter(HIJAIYAH_DATA[nextIdx]);
    soundService.speakHijaiyah(
      HIJAIYAH_DATA[nextIdx].letter,
      HIJAIYAH_DATA[nextIdx].name,
      HIJAIYAH_DATA[nextIdx].description
    );
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    soundService.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFinishWriting = () => {
    soundService.playVictory();
    confetti({ particleCount: 50, spread: 70 });
    soundService.speakIndonesian(
      `Alhamdulillah pintar sekali! Ananda hebat meniru menulis huruf ${selectedLetter.name}!`
    );
    onStarEarned(3);
    StorageService.logActivity(
      StorageService.getActiveStudent().namaLengkap,
      'Huruf Hijaiyah Ceria',
      `Menulis huruf ${selectedLetter.name} (${selectedLetter.letter})`,
      3
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-5 sm:p-6 rounded-3xl shadow-lg border-2 border-emerald-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-inner border border-white/30 shrink-0">
            🕌
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="bg-amber-400 text-slate-900 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                PAUD Pintar Mengaji
              </span>
              <span className="text-emerald-200 text-xs font-bold">29 Huruf Lengkap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
              Taman Belajar Huruf Hijaiyah
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
              Mengenal huruf Al-Quran, suara makhraj merdu, harakat Fathah-Kasrah-Dhammah, dan latihan menulis ceria!
            </p>
          </div>
        </div>

        {/* Action Tabs in Header */}
        <div className="flex items-center gap-2 bg-emerald-900/40 p-1.5 rounded-2xl backdrop-blur-xs flex-wrap justify-center">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('kartu');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kartu'
                ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Kartu Huruf
          </button>

          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('harakat');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'harakat'
                ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Bunyi Harakat
          </button>

          <button
            onClick={handleStartQuizMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tebak'
                ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Tebak Huruf
          </button>

          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('tulis');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tulis'
                ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <PenTool className="w-4 h-4" /> Belajar Menulis
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: KARTU HURUF HIJAIYAH (INTERAKTIF & BERSUARA) */}
      {/* ========================================================================= */}
      {activeTab === 'kartu' && (
        <div className="space-y-6">
          {/* Main Focus Card (Besar & Interaktif) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-3 border-emerald-200 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background Arabic Pattern Accent */}
            <div className="absolute right-3 top-3 text-9xl opacity-5 font-serif select-none pointer-events-none">
              {selectedLetter.letter}
            </div>

            {/* Left Column: Big Arabic Glyph & Audio Button */}
            <div className="flex flex-col items-center text-center w-full lg:w-1/3">
              <div
                className={`w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-br ${selectedLetter.color} border-4 ${selectedLetter.borderColor} shadow-xl flex items-center justify-center transition-transform hover:scale-105 relative cursor-pointer`}
                onClick={() => handlePlayVoice(selectedLetter)}
                title="Klik untuk mendengarkan suara huruf"
              >
                <span className="text-8xl sm:text-9xl font-bold font-serif text-slate-900 drop-shadow-md select-none">
                  {selectedLetter.letter}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVoice(selectedLetter);
                  }}
                  className="absolute bottom-3 right-3 p-3 bg-white text-emerald-700 hover:text-emerald-900 rounded-full shadow-lg border-2 border-emerald-300 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  title="Dengarkan pengucapan huruf"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </button>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handlePrev}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold cursor-pointer transition-transform active:scale-90"
                  title="Huruf sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-slate-500">
                  {currentIndex + 1} dari {HIJAIYAH_DATA.length} Huruf
                </span>
                <button
                  onClick={handleNext}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold cursor-pointer transition-transform active:scale-90"
                  title="Huruf berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column: Name, Explanation, Word Example & Sound Button */}
            <div className="flex-1 space-y-4 text-center lg:text-left w-full">
              <div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                    Huruf ke-{currentIndex + 1}
                  </span>
                  <span className="text-2xl font-serif text-emerald-700 font-bold">
                    {selectedLetter.arabicName}
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                  Huruf {selectedLetter.name} ({selectedLetter.transliteration})
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 leading-relaxed">
                  {selectedLetter.description}
                </p>
              </div>

              {/* Islamic / Everyday Word Example Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl p-2 bg-white rounded-2xl shadow-xs border border-amber-200">
                    {selectedLetter.emoji}
                  </span>
                  <div className="text-left">
                    <span className="text-[11px] font-bold uppercase text-amber-700 block">
                      Contoh Kata ({selectedLetter.name})
                    </span>
                    <span className="text-lg font-black text-slate-900 block">
                      {selectedLetter.wordExample}
                    </span>
                    <span className="text-base font-serif font-bold text-emerald-700 block">
                      {selectedLetter.wordArabic}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handlePlayVoice(selectedLetter)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow cursor-pointer transition-transform active:scale-95 shrink-0"
                >
                  <Volume2 className="w-4 h-4" /> Suara Huruf
                </button>
              </div>

              {/* Three Harakat Preview Pills */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <button
                  onClick={() =>
                    handlePlayHarakat(
                      selectedLetter.fathah,
                      `${selectedLetter.name} berharakat fathah dibaca ${selectedLetter.fathah.split('(')[1].replace(')', '')}`
                    )
                  }
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center cursor-pointer transition-transform active:scale-95"
                >
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                    Fathah (ــَـ)
                  </span>
                  <span className="font-serif font-bold text-lg text-emerald-950 block">
                    {selectedLetter.fathah}
                  </span>
                </button>

                <button
                  onClick={() =>
                    handlePlayHarakat(
                      selectedLetter.kasrah,
                      `${selectedLetter.name} berharakat kasrah dibaca ${selectedLetter.kasrah.split('(')[1].replace(')', '')}`
                    )
                  }
                  className="p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-center cursor-pointer transition-transform active:scale-95"
                >
                  <span className="text-[10px] font-bold text-sky-700 uppercase block">
                    Kasrah (ــِـ)
                  </span>
                  <span className="font-serif font-bold text-lg text-sky-950 block">
                    {selectedLetter.kasrah}
                  </span>
                </button>

                <button
                  onClick={() =>
                    handlePlayHarakat(
                      selectedLetter.dhammah,
                      `${selectedLetter.name} berharakat dhammah dibaca ${selectedLetter.dhammah.split('(')[1].replace(')', '')}`
                    )
                  }
                  className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-center cursor-pointer transition-transform active:scale-95"
                >
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">
                    Dhammah (ــُـ)
                  </span>
                  <span className="font-serif font-bold text-lg text-amber-950 block">
                    {selectedLetter.dhammah}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid of All 29 Hijaiyah Letters (RTL Reading Order for Al-Quran) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <span>📖</span> Klik Huruf untuk Mendengarkan Suaranya
                </h4>
                <p className="text-xs text-slate-500">
                  Tersusun rapi dari Alif sampai Ya sesuai urutan membaca Al-Quran.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                29 Huruf Hijaiyah
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {HIJAIYAH_DATA.map((item, idx) => {
                const isSelected = selectedLetter.name === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSelectLetter(item)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group ${
                      isSelected
                        ? `bg-gradient-to-b ${item.color} ${item.borderColor} shadow-lg scale-105 ring-3 ring-emerald-400`
                        : 'bg-slate-50/80 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-xs text-slate-400 font-mono absolute top-1.5 left-2">
                      {idx + 1}
                    </span>
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2 filter drop-shadow-xs group-hover:scale-110 transition-transform">
                      {item.letter}
                    </span>
                    <span className="text-xs font-black text-slate-800 mt-1">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {item.transliteration}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BUNYI TIGA HARAKAT UTAMA (FATHAH, KASRAH, DHAMMAH) */}
      {/* ========================================================================= */}
      {activeTab === 'harakat' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span>✨</span> Mengenal Tiga Harakat Dasar Al-Quran
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik kartu harakat di bawah ini untuk mendengarkan perubahan bunyi huruf vokal (A - I - U).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Pilih Huruf:</span>
              <select
                value={selectedLetter.name}
                onChange={(e) => {
                  const found = HIJAIYAH_DATA.find((h) => h.name === e.target.value);
                  if (found) handleSelectLetter(found);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 cursor-pointer outline-none focus:border-emerald-500"
              >
                {HIJAIYAH_DATA.map((h) => (
                  <option key={h.name} value={h.name}>
                    {h.letter} - {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3 Harakat Interactive Big Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. FATHAH */}
            <div
              onClick={() =>
                handlePlayHarakat(
                  selectedLetter.fathah,
                  `Harakat Fathah! Terletak di atas huruf. Huruf ${selectedLetter.name} berbunyi ${selectedLetter.fathah.split('(')[1].replace(')', '')}!`
                )
              }
              className="p-6 rounded-3xl bg-gradient-to-b from-emerald-50 to-teal-100 border-3 border-emerald-300 hover:border-emerald-500 shadow-md transition-all hover:scale-102 cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                1. Fathah (ـَـ) = Bunyi "A"
              </span>
              <div className="w-28 h-28 rounded-2xl bg-white shadow-inner border border-emerald-200 flex items-center justify-center text-6xl font-serif font-bold text-emerald-900">
                {selectedLetter.fathah.split(' ')[0]}
              </div>
              <div>
                <h4 className="text-xl font-black text-emerald-950">
                  Dibaca: {selectedLetter.fathah.split('(')[1].replace(')', '')}
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Tanda garis miring di atas huruf melambangkan bunyi vokal "A".
                </p>
              </div>
              <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <Volume2 className="w-4 h-4" /> Dengarkan Bunyi Fathah
              </button>
            </div>

            {/* 2. KASRAH */}
            <div
              onClick={() =>
                handlePlayHarakat(
                  selectedLetter.kasrah,
                  `Harakat Kasrah! Terletak di bawah huruf. Huruf ${selectedLetter.name} berbunyi ${selectedLetter.kasrah.split('(')[1].replace(')', '')}!`
                )
              }
              className="p-6 rounded-3xl bg-gradient-to-b from-sky-50 to-blue-100 border-3 border-sky-300 hover:border-sky-500 shadow-md transition-all hover:scale-102 cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <span className="px-3 py-1 bg-sky-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                2. Kasrah (ـِـ) = Bunyi "I"
              </span>
              <div className="w-28 h-28 rounded-2xl bg-white shadow-inner border border-sky-200 flex items-center justify-center text-6xl font-serif font-bold text-sky-900">
                {selectedLetter.kasrah.split(' ')[0]}
              </div>
              <div>
                <h4 className="text-xl font-black text-sky-950">
                  Dibaca: {selectedLetter.kasrah.split('(')[1].replace(')', '')}
                </h4>
                <p className="text-xs text-sky-800 mt-1">
                  Tanda garis miring di bawah huruf melambangkan bunyi vokal "I".
                </p>
              </div>
              <button className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <Volume2 className="w-4 h-4" /> Dengarkan Bunyi Kasrah
              </button>
            </div>

            {/* 3. DHAMMAH */}
            <div
              onClick={() =>
                handlePlayHarakat(
                  selectedLetter.dhammah,
                  `Harakat Dhammah! Berbentuk seperti huruf wawu kecil di atas. Huruf ${selectedLetter.name} berbunyi ${selectedLetter.dhammah.split('(')[1].replace(')', '')}!`
                )
              }
              className="p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100 border-3 border-amber-300 hover:border-amber-500 shadow-md transition-all hover:scale-102 cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <span className="px-3 py-1 bg-amber-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                3. Dhammah (ـُـ) = Bunyi "U"
              </span>
              <div className="w-28 h-28 rounded-2xl bg-white shadow-inner border border-amber-200 flex items-center justify-center text-6xl font-serif font-bold text-amber-900">
                {selectedLetter.dhammah.split(' ')[0]}
              </div>
              <div>
                <h4 className="text-xl font-black text-amber-950">
                  Dibaca: {selectedLetter.dhammah.split('(')[1].replace(')', '')}
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  Tanda lengkung di atas huruf melambangkan bunyi vokal "U" dengan bibir membulat.
                </p>
              </div>
              <button className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <Volume2 className="w-4 h-4" /> Dengarkan Bunyi Dhammah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PERMAINAN TEBAK HURUF HIJAIYAH (QUIZ DENGAN REWARD BINTANG) */}
      {/* ========================================================================= */}
      {activeTab === 'tebak' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <div className="text-left">
                <h3 className="font-black text-slate-900 text-base">Permainan Tebak Huruf</h3>
                <p className="text-xs text-slate-500">Kumpulkan bintang emas dengan menebak huruf yang tepat!</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-black text-xs shadow-xs">
              <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>Skor: {quizScore}</span>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 space-y-3">
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold inline-block">
              Pertanyaan Asisten Guru
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900">
              Manakah huruf <span className="text-emerald-700 underline font-serif">{quizTarget.name}</span>?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Contoh kata: <strong>{quizTarget.wordExample}</strong> {quizTarget.emoji}
            </p>

            <button
              onClick={() =>
                soundService.speakIndonesian(
                  `Yang manakah huruf ${quizTarget.name} untuk ${quizTarget.wordExample}?`
                )
              }
              className="px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> Ulangi Suara Pertanyaan
            </button>
          </div>

          {/* Feedback Banner */}
          {quizFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-bounce-slow shadow-xs ${
                quizFeedback.isCorrect
                  ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900'
                  : 'bg-rose-100 border-2 border-rose-300 text-rose-900'
              }`}
            >
              {quizFeedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 text-rose-500 shrink-0" />
              )}
              <span>{quizFeedback.message}</span>
            </div>
          )}

          {/* Multiple Choice Letter Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {quizOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={() => handleAnswerQuiz(opt)}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-emerald-50 border-3 border-slate-200 hover:border-emerald-400 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center justify-center group"
              >
                <span className="text-6xl sm:text-7xl font-serif font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {opt.letter}
                </span>
                <span className="text-xs font-bold text-slate-600 mt-2">
                  {opt.name}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={startNewQuiz}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ganti Pertanyaan Baru
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STUDIO LATIHAN MENULIS / MENIRU HURUF HIJAIYAH (CANVAS) */}
      {/* ========================================================================= */}
      {activeTab === 'tulis' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-emerald-600" />
                Papan Latihan Menulis Huruf Hijaiyah
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Gunakan jari atau mouse untuk meniru menulis huruf <strong>{selectedLetter.name}</strong> di atas garis panduan!
              </p>
            </div>

            {/* Quick Letter Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Pilih Huruf:</span>
              <select
                value={selectedLetter.name}
                onChange={(e) => {
                  const found = HIJAIYAH_DATA.find((h) => h.name === e.target.value);
                  if (found) {
                    handleSelectLetter(found);
                    clearCanvas();
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 cursor-pointer outline-none focus:border-emerald-500"
              >
                {HIJAIYAH_DATA.map((h) => (
                  <option key={h.name} value={h.name}>
                    {h.letter} - {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Palette & Tools */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Pilihan Tinta:</span>
              {[
                { hex: '#0d9488', name: 'Teal Hijau' },
                { hex: '#2563eb', name: 'Biru' },
                { hex: '#dc2626', name: 'Merah' },
                { hex: '#d97706', name: 'Emas Kuning' },
                { hex: '#7c3aed', name: 'Ungu' },
                { hex: '#1e293b', name: 'Hitam Pekat' },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    soundService.playPop();
                    setDrawColor(c.hex);
                  }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                    drawColor === c.hex ? 'scale-125 border-white shadow-md ring-2 ring-emerald-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Eraser className="w-4 h-4" /> Hapus Papan
              </button>

              <button
                onClick={handleFinishWriting}
                disabled={!hasDrawn}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
              >
                <Check className="w-4 h-4" /> Selesai Menulis (+3 ⭐)
              </button>
            </div>
          </div>

          {/* Interactive Canvas with Background Watermark Guide */}
          <div className="relative max-w-lg mx-auto bg-amber-50/40 rounded-3xl border-4 border-dashed border-emerald-300 p-2 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Watermark trace guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[260px] font-serif font-black text-slate-300/40 opacity-70">
                {selectedLetter.letter}
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={480}
              height={360}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="relative z-10 touch-none cursor-crosshair bg-transparent rounded-2xl w-full h-[320px] sm:h-[360px]"
            />
          </div>

          <div className="text-center text-xs text-slate-500 font-medium">
            💡 <em>Petunjuk Guru & Orang Tua:</em> Ajak anak menggerakkan jari atau tetikus mengikuti lekukan huruf <strong>{selectedLetter.name}</strong> dari atas ke bawah atau kanan ke kiri.
          </div>
        </div>
      )}
    </div>
  );
}
