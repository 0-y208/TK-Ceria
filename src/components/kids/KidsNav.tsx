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
  inactiveBg: string;
  inactiveBorder: string;
  inactiveText: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'alfabet',
    label: 'Alfabet A-Z',
    sublabel: 'Fonik & Kata',
    emoji: '🔤',
    color: 'from-amber-400 via-orange-400 to-amber-500',
    ringColor: 'ring-amber-300',
    inactiveBg: 'bg-gradient-to-br from-amber-50 to-orange-100/60 hover:from-amber-100 hover:to-orange-100',
    inactiveBorder: 'border-amber-300/80',
    inactiveText: 'text-amber-950',
  },
  {
    id: 'hijaiyah',
    label: 'Huruf Hijaiyah',
    sublabel: 'Iqra & Harakat',
    emoji: '🕌',
    color: 'from-emerald-500 via-teal-500 to-emerald-600',
    ringColor: 'ring-emerald-300',
    inactiveBg: 'bg-gradient-to-br from-emerald-50 to-teal-100/60 hover:from-emerald-100 hover:to-teal-100',
    inactiveBorder: 'border-emerald-300/80',
    inactiveText: 'text-emerald-950',
  },
  {
    id: 'angka',
    label: '123 Berhitung',
    sublabel: 'Benda & Tambah',
    emoji: '🔢',
    color: 'from-cyan-400 via-teal-400 to-cyan-500',
    ringColor: 'ring-cyan-300',
    inactiveBg: 'bg-gradient-to-br from-cyan-50 to-teal-100/60 hover:from-cyan-100 hover:to-teal-100',
    inactiveBorder: 'border-cyan-300/80',
    inactiveText: 'text-cyan-950',
  },
  {
    id: 'warna',
    label: 'Warna & Bentuk',
    sublabel: 'Geometri Ceria',
    emoji: '🎨',
    color: 'from-purple-500 via-fuchsia-500 to-pink-500',
    ringColor: 'ring-purple-300',
    inactiveBg: 'bg-gradient-to-br from-purple-50 to-fuchsia-100/60 hover:from-purple-100 hover:to-fuchsia-100',
    inactiveBorder: 'border-purple-300/80',
    inactiveText: 'text-purple-950',
  },
  {
    id: 'mewarnai',
    label: 'Studio Mewarnai',
    sublabel: 'Lukis & Stempel',
    emoji: '🖌️',
    color: 'from-pink-500 via-rose-500 to-red-400',
    ringColor: 'ring-pink-300',
    inactiveBg: 'bg-gradient-to-br from-pink-50 to-rose-100/60 hover:from-pink-100 hover:to-rose-100',
    inactiveBorder: 'border-pink-300/80',
    inactiveText: 'text-pink-950',
  },
  {
    id: 'lagu',
    label: 'Lagu & Dongeng',
    sublabel: 'Karaoke & Fabel',
    emoji: '🎶',
    color: 'from-blue-500 via-indigo-500 to-blue-600',
    ringColor: 'ring-blue-300',
    inactiveBg: 'bg-gradient-to-br from-blue-50 to-indigo-100/60 hover:from-blue-100 hover:to-indigo-100',
    inactiveBorder: 'border-blue-300/80',
    inactiveText: 'text-blue-950',
  },
  {
    id: 'game',
    label: 'Teka-Teki Cilik',
    sublabel: 'Suara & Memori',
    emoji: '🎮',
    color: 'from-lime-500 via-emerald-500 to-teal-500',
    ringColor: 'ring-lime-300',
    inactiveBg: 'bg-gradient-to-br from-lime-50 to-emerald-100/60 hover:from-lime-100 hover:to-emerald-100',
    inactiveBorder: 'border-lime-300/80',
    inactiveText: 'text-lime-950',
  },
];

export function KidsNav({ activeModule, onChangeModule }: KidsNavProps) {
  const handleSelect = (id: KidModuleType, label: string) => {
    soundService.playPop();
    soundService.speakIndonesian(`Buka ${label}!`);
    onChangeModule(id);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      {NAV_ITEMS.map((item) => {
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id, item.label)}
            className={`p-3.5 rounded-3xl transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer kid-card ${
              isActive
                ? `bg-gradient-to-b ${item.color} text-white shadow-xl scale-105 ring-4 ${item.ringColor} border-3 border-white/80`
                : `${item.inactiveBg} ${item.inactiveText} border-3 ${item.inactiveBorder} shadow-sm hover:shadow-md`
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
                isActive ? 'text-white/95' : 'text-slate-500'
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
