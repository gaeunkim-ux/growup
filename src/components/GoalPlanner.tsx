import React, { useState, useEffect } from "react";
import { Check, Trash2, Calendar, Plus, Star, ListTodo } from "lucide-react";
import { Goal } from "../types";

export default function GoalPlanner() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("전공");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("college-selfdev-goals");
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        console.error(e);
        loadDefaultGoals();
      }
    } else {
      loadDefaultGoals();
    }
  }, []);

  const loadDefaultGoals = () => {
    const defaults: Goal[] = [
      { id: "g1", text: "기말고사 전공과목 핵심 요약본 작성", category: "학업", deadline: "2026-06-15", isCompleted: false },
      { id: "g2", text: "개인 포트폴리오용 웹사이트 Vercel 1차 배포 완료", category: "프로젝트", deadline: "2026-06-10", isCompleted: true },
      { id: "g3", text: "오픽(OPIC) 시험 등록 및 기출문제 5개 답변 작성", category: "취업", deadline: "2026-06-20", isCompleted: false },
    ];
    setGoals(defaults);
    localStorage.setItem("college-selfdev-goals", JSON.stringify(defaults));
  };

  const saveGoals = (items: Goal[]) => {
    setGoals(items);
    localStorage.setItem("college-selfdev-goals", JSON.stringify(items));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      text: text.trim(),
      category: category,
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isCompleted: false,
    };

    saveGoals([newGoal, ...goals]);
    setText("");
    setDeadline("");
  };

  const toggleGoal = (id: string) => {
    const updated = goals.map((item) => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    saveGoals(updated);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((item) => item.id !== id);
    saveGoals(updated);
  };

  return (
    <div id="goal-planner-container" className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 space-y-5">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ListTodo className="text-indigo-500" size={18} />
            <span>핵심 주간 목표 보드</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">이번 주 반드시 정복할 단계별 마일스톤을 기입하세요.</p>
        </div>
        <span className="p-1 px-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold font-mono text-[10px] rounded-full">
          D-WEEK PLAN
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddGoal} className="space-y-3 bg-slate-50 dark:bg-slate-950/65 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="목표 내용을 구체적으로 기입 (예: 토익 기출문제 풀이)"
          className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:border-indigo-500 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-sans"
          maxLength={50}
        />
        
        <div className="flex gap-2 text-xs">
          {/* Category SELECT */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 px-2 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-350 outline-none"
          >
            <option value="학업">📚 학업 / 수강</option>
            <option value="프로젝트">💻 개발 / 사이드</option>
            <option value="어학/자격">🏆 자격증 / 어학</option>
            <option value="취업">🚀 인턴 / 입사지원</option>
            <option value="습관">🧘 운동 / 생활관리</option>
          </select>

          {/* Date Picker */}
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 px-2 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-350 outline-none font-mono"
            title="마감 기한"
          />

          <button
            type="submit"
            className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0"
          >
            <Plus size={14} />
            <span className="hidden sm:inline ml-1">등록</span>
          </button>
        </div>
      </form>

      {/* Goal Items List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {goals.map((item) => {
          const isOverdue = new Date(item.deadline) < new Date() && !item.isCompleted;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-sans transition-all ${
                item.isCompleted
                  ? "bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-900 opacity-65"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:border-slate-200"
              }`}
              id={`goal-item-${item.id}`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {/* Complete Check Circle */}
                <button
                  type="button"
                  onClick={() => toggleGoal(item.id)}
                  className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 border cursor-pointer transition ${
                    item.isCompleted
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                  }`}
                  id={`goal-toggle-${item.id}`}
                >
                  {item.isCompleted && <Check size={10} strokeWidth={3} />}
                </button>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 rounded">
                      {item.category}
                    </span>
                    <span className={`truncate font-medium text-slate-850 dark:text-slate-200 ${item.isCompleted ? "line-through text-slate-450 dark:text-slate-550" : ""}`}>
                      {item.text}
                    </span>
                  </div>
                  
                  {/* Deadline view */}
                  <span className={`text-[10px] font-mono flex items-center gap-0.5 mt-0.5 ${isOverdue ? "text-rose-500 font-semibold" : "text-slate-400"}`}>
                    <Calendar size={10} />
                    <span>~{item.deadline} 까지 {isOverdue && "(기한 지남)"}</span>
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteGoal(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-55 transition shrink-0 cursor-pointer"
                title="목표 삭제"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-6 text-slate-450 dark:text-slate-550 text-xs">
            정리된 목표가 없습니다. 이번 주 해야 할 일을 하나씩 기록해 보세요!
          </div>
        )}
      </div>

    </div>
  );
}
