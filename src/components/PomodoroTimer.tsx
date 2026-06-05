import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Coffee, BookOpen } from "lucide-react";

interface Preset {
  name: string;
  minutes: number;
  type: "focus" | "shortBreak" | "longBreak";
  label: string;
  color: string;
  icon: any;
}

const PRESETS: Preset[] = [
  { name: "몰입 집중", minutes: 25, type: "focus", label: "공부 시간 🚀", color: "from-indigo-500 to-violet-600", icon: BookOpen },
  { name: "리프레시", minutes: 5, type: "shortBreak", label: "짧은 휴식 ☕", color: "from-emerald-400 to-teal-500", icon: Coffee },
  { name: "재충전", minutes: 15, type: "longBreak", label: "긴 휴식 🍃", color: "from-amber-400 to-orange-500", icon: Coffee },
];

const STUDY_QUOTES = [
  "자신을 성장시키는 데 보내는 시간은 결코 배반하지 않습니다.",
  "집중이 흐려질 땐, 딱 5분만 더 참아봅시다.",
  "비교는 오직 어제의 나와 하세요. 그것만으로 우린 자랍니다.",
  "지루하고 반복되는 일상이 비범한 전공 실력을 낳습니다.",
  "핸드폰은 잠시 비행기 모드로 전환해 보는 건 어떨까요?",
  "나머지 휴식을 가치 있게 만들기 위해, 지금은 온전히 공부합시다."
];

export default function PomodoroTimer() {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync preset change
  const handlePresetChange = (preset: Preset) => {
    setActivePreset(preset);
    setIsRunning(false);
    setSecondsLeft(preset.minutes * 60);
    // Rotate quote
    setQuoteIndex((prev) => (prev + 1) % STUDY_QUOTES.length);
  };

  // Timer Core logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playCompletionSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const playCompletionSound = () => {
    if (!audioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio warning: Audio context is restricted by the browser frame runtime.");
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(activePreset.minutes * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG Dashboard Constants
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const initialSeconds = activePreset.minutes * 60;
  const strokeDashoffset = initialSeconds > 0 
    ? circumference - (secondsLeft / initialSeconds) * circumference 
    : circumference;

  return (
    <div id="pomodoro-segment" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-center justify-between">
      
      {/* Clock Display */}
      <div className="relative flex items-center justify-center shrink-0 w-52 h-52">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="104"
            cy="104"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800 fill-none"
            strokeWidth="10"
          />
          <circle
            cx="104"
            cy="104"
            r={radius}
            className="stroke-indigo-600 dark:stroke-indigo-400 fill-none transition-all duration-300"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute text-center">
          <div className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
            {formatTime(secondsLeft)}
          </div>
          <span className="text-xs text-slate-400 font-medium font-sans">
            {activePreset.label}
          </span>
        </div>
      </div>

      {/* Timer Controls and Presets */}
      <div className="flex-1 space-y-5 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>몰입 부스터</span>
              <Sparkles size={16} className="text-indigo-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">집중 시간(25분)과 리프레시 휴식을 교대로 실천해보세요.</p>
          </div>
          
          {/* Audio toggle button */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title={audioEnabled ? "알림 소리 켜짐" : "알림 소리 꺼짐"}
          >
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        {/* Preset Selector tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = activePreset.type === preset.type;
            return (
              <button
                key={preset.type}
                onClick={() => handlePresetChange(preset)}
                className={`py-2 px-1 rounded-xl transition-all font-medium text-xs flex flex-col items-center gap-1 cursor-pointer ${
                  isSelected 
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-800" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                <Icon size={14} />
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Motivation Card */}
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-3.5 rounded-2xl border border-indigo-100/30 text-center">
          <p className="text-xs text-indigo-800 dark:text-indigo-300 font-sans leading-relaxed italic">
            "{STUDY_QUOTES[quoteIndex]}"
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3">
          <button
            onClick={toggleTimer}
            className={`flex-1 py-3 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 text-white shadow-sm transition transform active:scale-95 cursor-pointer bg-gradient-to-r ${activePreset.color}`}
          >
            {isRunning ? (
              <>
                <Pause size={16} />
                <span>일시 정지</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>집중 시작</span>
              </>
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="px-4 py-3 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-2xl flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>리셋</span>
          </button>
        </div>
      </div>

    </div>
  );
}
