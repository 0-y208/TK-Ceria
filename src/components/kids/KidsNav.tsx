import { soundService } from '../../services/soundService';

export type KidModuleType = 'alfabet' | 'hijaiyah' | 'angka' | 'warna' | 'mewarnai' | 'lagu' | 'game';

interface KidsNavProps {
  activeModule: KidModuleType;
  onChangeModule: (mod: KidModuleType) => void;
}

interface NavItem {
  id: KidModuleType;
  label: string;
  sublabel: string;
  emoji: string;
  color: string;
  ringColor: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'alfabet',
    label: 'Alfabet A-Z',
    sublabel: 'Fonik & Kata',
    emoji: '🔤',
    color: 'from-amber-400 to-orange-500',
    ringColor: 'ring-orange-300',
  },
  {
    id: 'hijaiyah',
    label: 'Huruf Hijaiyah',
    sublabel: 'Iqra & Harakat',
    emoji: '🕌',
    color: 'from-emerald-400 to-teal-600',
    ringColor: 'ring-emerald-300',
  },
  {
    id: 'angka',
    label: '123 Berhitung',
    sublabel: 'Benda & Tambah',
    emoji: '🔢',
    color: 'from-teal-400 to-emerald-500',
    ringColor: 'ring-teal-300',
  },
  {
    id: 'warna',
    label: 'Warna & Bentuk',
    sublabel: 'Geometri Ceria',
    emoji: '🎨',
    color: 'from-purple-400 to-pink-500',
    ringColor: 'ring-purple-300',
  },
  {
    id: 'mewarnai',
    label: 'Studio Mewarnai',
    sublabel: 'Lukis & Stempel',
    emoji: '🖌️',
    color: 'from-pink-400 to-rose-500',
    ringColor: 'ring-pink-300',
  },
  {
    id: 'lagu',
    label: 'Lagu & Dongeng',
    sublabel: 'Karaoke & Fabel',
    emoji: '🎶',
    color: 'from-blue-400 to-indigo-500',
    ringColor: 'ring-blue-300',
  },
  {
    id: 'game',
    label: 'Teka-Teki Cilik',
    sublabel: 'Suara & Memori',
    emoji: '🎮',
    color: 'from-emerald-400 to-cyan-500',
    ringColor: 'ring-emerald-300',
  },
];

export function KidsNav({ activeModule, onChangeModule }: KidsNavProps) {
  const handleSelect = (id: KidModuleType, label: string) => {
    soundService.playPop();
    soundService.speakIndonesian(`Buka ${label}!`);
    onChangeModule(id);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {NAV_ITEMS.map((item) => {
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id, item.label)}
            className={`p-3.5 rounded-3xl transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer kid-card ${
              isActive
                ? `bg-gradient-to-b ${item.color} text-white shadow-xl scale-105 ring-4 ${item.ringColor}`
                : 'bg-white hover:bg-amber-50 text-slate-700 border-2 border-amber-200 shadow-sm'
            }`}
          >
            <span className="text-3xl sm:text-4xl mb-1 filter drop-shadow animate-bounce-slow">
              {item.emoji}
            </span>
            <span className="font-black text-sm sm:text-base leading-tight">
              {item.label}
            </span>
            <span
              className={`text-[11px] font-bold mt-0.5 ${
                isActive ? 'text-white/90' : 'text-slate-400'
              }`}
            >
              {item.sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
