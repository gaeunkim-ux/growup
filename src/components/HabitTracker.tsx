import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check, Flame, Trophy, Award, BookOpen } from "lucide-react";
import { Habit } from "../types";

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");

  // Load habits from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("college-selfdev-habits");
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse habits", e);
        loadDefaultHabits();
      }
    } else {
      loadDefaultHabits();
    }
  }, []);

  const loadDefaultHabits = () => {
    const defaults: Habit[] = [
      { id: "1", name: "전공 개발 공부 / 전공 책 읽기 (1시간)", streak: 3, completedToday: false, history: [] },
      { id: "2", name: "영어 단어 또는 어학 오디오 수강 (20분)", streak: 1, completedToday: false, history: [] },
      { id: "3", name: "매일 코딩 잔디 심기 (GitHub 커밋)", streak: 5, completedToday: true, history: [getTodayString()] },
    ];
    setHabits(defaults);
    localStorage.setItem("college-selfdev-habits", JSON.stringify(defaults));
  };

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem("college-selfdev-habits", JSON.stringify(updated));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      streak: 0,
      completedToday: false,
      history: []
    };

    const updated = [newHabit, ...habits];
    saveHabits(updated);
    setNewHabitName("");
  };

  const handleToggleHabit = (id: string) => {
    const today = getTodayString();
    const updated = habits.map((habit) => {
      if (habit.id === id) {
        const isCompleted = habit.history.includes(today);
        let newHistory = [...habit.history];
        let newStreak = habit.streak;

        if (isCompleted) {
          // Untoggle
          newHistory = newHistory.filter((date) => date !== today);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          // Completed
          newHistory.push(today);
          newStreak = newStreak + 1;
          triggerBeepSound();
        }

        return {
          ...habit,
          history: newHistory,
          completedToday: !isCompleted,
          streak: newStreak
        };
      }
      return habit;
    });
    saveHabits(updated);
  };

  const handleDeleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
  };

  const triggerBeepSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  const today = getTodayString();
  const completedCount = habits.filter((h) => h.history.includes(today)).length;
  const totalCount = habits.length;
  const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div id="habit-tracker-segment" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 space-y-6">
      
      {/* Metrics Banner */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Trophy size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">오늘의 습관 성취율</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">매일 작게 시작해 지속하는 것이 습관의 정수입니다.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{successRate}%</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 block">({completedCount}/{totalCount} 완료)</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-950/60 flex items-center justify-center relative">
            <div 
              style={{
                background: `conic-gradient(#4f46e5 ${successRate}%, transparent ${successRate}% 100%)`
              }}
              className="absolute inset-0 rounded-full opacity-80"
              id="radial-gauge"
            />
            <div className="absolute inset-1 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center">
              <Award className="text-indigo-500" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const isDoneToday = habit.history.includes(today);
          return (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                isDoneToday
                  ? "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              }`}
              id={`habit-row-${habit.id}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                <button
                  type="button"
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border cursor-pointer transition-colors ${
                    isDoneToday
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                  }`}
                  id={`habit-check-${habit.id}`}
                >
                  {isDoneToday && <Check size={14} strokeWidth={3} />}
                </button>
                <span className={`text-sm font-sans truncate ${isDoneToday ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-200"}`}>
                  {habit.name}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Streak Badge */}
                {habit.streak > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <Flame size={12} className="fill-amber-500 text-amber-500 animate-pulse" />
                    <span>{habit.streak}일 연속</span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="습관 삭제"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
            등록된 습관이 없습니다. 매일 꾸준히 해낼 루틴을 맨 아래에 추가해보세요!
          </div>
        )}
      </div>

      {/* Add New Habit Form */}
      <form onSubmit={handleAddHabit} className="flex gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="나만의 새로운 습관 작성 (예: 기상 후 물 마시기, 복습 20분)..."
          className="flex-1 px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-400 rounded-xl outline-none placeholder-slate-400 dark:placeholder-slate-600 dark:text-slate-100"
          maxLength={40}
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition shadow-sm cursor-pointer scale-100 active:scale-95 text-sm font-semibold"
        >
          <Plus size={16} />
          <span className="hidden sm:inline ml-1">추가</span>
        </button>
      </form>

    </div>
  );
}
