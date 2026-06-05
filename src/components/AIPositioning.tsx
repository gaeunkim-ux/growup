import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, BookOpen, Clock, Lightbulb, Compass, RotateCcw } from "lucide-react";
import { AdviceRequest } from "../types";

const GOAL_OPTIONS = [
  { id: "academic", label: "학점 관리 및 전공 심화 📚" },
  { id: "coding", label: "코딩 및 개발 포트폴리오 💻" },
  { id: "languages", label: "영어 회화 및 어학 자격증 🇬🇧" },
  { id: "certificates", label: "컴활/기사 등 공인 자격증 🏆" },
  { id: "sideprojects", label: "동아리 및 앱 빌드 프로젝트 🚀" },
  { id: "routine", label: "미라클 모닝 및 체력 단련 🧘" },
];

const PRESET_WORRIES = [
  "공부와 대외활동, 동아리 일정까지 겹치다 보니 어떤 일부터 챙겨야 할지 모르겠어요.",
  "졸업 시즌이 다가오는데 포트폴리오도 전공 지식도 완성되지 않은 느낌이라 불안합니다.",
  "의지박약이라 아침 일찍 일어나는 루틴을 잡고 매일 한 시간씩이라도 꾸준히 공부하고 싶습니다.",
  "비전공자인데 전공생만큼 실력을 단기간에 끌어올릴 수 있는 실제 행동 장치가 필요합니다."
];

// Aesthetic Custom Markdown Parser for flawless Zero-Dependency styling
function renderHelperMarkdown(md: string) {
  if (!md) return null;
  
  return md.split('\n').map((line, i) => {
    let cleanLine = line.trim();
    if (cleanLine.startsWith('### ')) {
      return (
        <h4 key={i} className="text-base font-bold text-indigo-700 dark:text-indigo-400 mt-5 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-indigo-600 rounded"></span>
          {cleanLine.replace('### ', '')}
        </h4>
      );
    }
    if (cleanLine.startsWith('#### ')) {
      return <h5 key={i} className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2 pl-2 border-l-2 border-slate-300 dark:border-slate-700">{cleanLine.replace('#### ', '')}</h5>;
    }
    if (cleanLine.startsWith('## ')) {
      return <h3 key={i} className="text-lg font-extrabold text-slate-900 dark:text-white mt-6 mb-3 border-b pb-2 border-slate-100 dark:border-slate-800">{cleanLine.replace('## ', '')}</h3>;
    }
    if (cleanLine.startsWith('# ')) {
      return <h2 key={i} className="text-xl font-black text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">{cleanLine.replace('# ', '')}</h2>;
    }
    if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
      const content = cleanLine.substring(2);
      return (
        <li key={i} className="list-none pl-5 relative text-sm my-1.5 text-slate-700 dark:text-slate-350 leading-relaxed font-sans">
          <span className="absolute left-1.5 top-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          {parseInlineBoldMarkdown(content)}
        </li>
      );
    }
    if (line.startsWith('> ')) {
      return (
        <blockquote key={i} className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 pl-4 py-3.5 pr-3 italic text-sm text-slate-700 dark:text-slate-300 rounded-r-2xl my-4 leading-relaxed font-sans">
          "{line.replace('> ', '').replace(/^["> ]+|["> ]+$/g, '')}"
        </blockquote>
      );
    }
    // Code blocks styling
    if (cleanLine.startsWith('```')) {
      return null; // hide raw codeblock tags
    }
    if (cleanLine === '') {
      return <div key={i} className="h-2" />;
    }
    return <p key={i} className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed my-2 font-sans">{parseInlineBoldMarkdown(cleanLine)}</p>;
  });
}

function parseInlineBoldMarkdown(text: string) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className="font-bold text-slate-900 dark:text-white bg-indigo-50/40 dark:bg-indigo-950/30 px-1 rounded">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

export default function AIPositioning() {
  const [major, setMajor] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [struggle, setStruggle] = useState("");
  const [loading, setLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoalToggle = (goalLabel: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalLabel)
        ? prev.filter((g) => g !== goalLabel)
        : [...prev, goalLabel]
    );
  };

  const loadPresetWorry = (worry: string) => {
    setStruggle(worry);
  };

  const handleClearWorry = () => {
    setMajor("");
    setSelectedGoals([]);
    setStruggle("");
    setAdviceResult(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!major.trim()) {
      setErrorMsg("전공 학과를 기입해주세요.");
      return;
    }
    if (selectedGoals.length === 0) {
      setErrorMsg("최소 한 개의 관심 자기계발 분야를 지정해주세요.");
      return;
    }
    if (!struggle.trim() || struggle.trim().length < 5) {
      setErrorMsg("현재 고민 중이거나 성장에 방해가 되는 요소를 자세히 고백해주세요 (5자 이상).");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setAdviceResult(null);

    try {
      const response = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          major: major.trim(),
          goals: selectedGoals,
          struggle: struggle.trim(),
        }),
      });

      const json = await response.json();
      if (json.success) {
        setAdviceResult(json.data);
        // Scroll down to roadmap container smoothly on success
        setTimeout(() => {
          document.getElementById("roadmap-result-block")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        setErrorMsg(json.error || "실패를 반환했습니다. 잠시 후 재시도해보세요.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("서버로의 통신 중 오작동이 기록되었습니다. 구동 환경을 확인해 보세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-planner-wrapper" className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 dark:border-slate-800">
        
        {/* Planner Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Compass className="animate-spin-slow text-indigo-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">AI 자기계발 로드맵 설계기</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">내 전공과 고민에 최적화된 맞춤형 4주 구체적인 수립 가이드를 즉시 생성합니다.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Major Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              1. 본인의 전공 학과
            </label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 컴퓨터공학과, 경영학과, 디자인과, 비전공(학과미지정) 등"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-400 rounded-xl outline-none text-sm placeholder-slate-400 dark:placeholder-slate-650 dark:text-slate-100 font-sans"
            />
          </div>

          {/* Goal Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              2. 몰입하고 싶은 자기계발 주제 (복수 선택 가능)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {GOAL_OPTIONS.map((option) => {
                const isSelected = selectedGoals.includes(option.label);
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => handleGoalToggle(option.label)}
                    className={`px-3.5 py-3 rounded-2xl border text-left text-xs font-medium font-sans cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Struggles & Difficulties Text Area */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                3. 평소 성장을 방해하거나 가장 고민되는 고충
              </label>
              <span className="text-xs text-slate-400 font-sans">({struggle.length}/200자)</span>
            </div>
            
            <textarea
              value={struggle}
              onChange={(e) => setStruggle(e.target.value.slice(0, 200))}
              placeholder="예: 시간 약속이 잘 지켜지지 않거나, 해야 할 일의 일정이 꼬여서 자꾸 내일로 미루게 됩니다..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-400 rounded-xl outline-none text-sm placeholder-slate-400 dark:placeholder-slate-650 dark:text-slate-100 resize-none font-sans leading-relaxed"
            />

            {/* Quick Worry presets */}
            <div className="space-y-1.5 mt-2">
              <span className="text-[11px] text-slate-400 font-sans block">💡 대학생 단골 고민 템플릿 간편 대입:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_WORRIES.map((worry, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => loadPresetWorry(worry)}
                    className="px-2.5 py-1 text-[11px] bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:text-slate-450 dark:hover:text-slate-300 rounded-lg max-w-full truncate text-left border border-slate-100 dark:border-slate-800/80 cursor-pointer"
                  >
                    {worry}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition transform active:scale-95 text-sm cursor-pointer disabled:opacity-50"
              id="roadmap-generation-btn"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                  <span>AI 멘토가 로드맵 작성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>맞춤형 4주 장기 플랜 생성</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClearWorry}
              className="px-5 py-3 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center gap-1.5 transition text-sm cursor-pointer font-semibold"
            >
              <RotateCcw size={15} />
              <span>초기화</span>
            </button>
          </div>
        </form>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 rounded-xl text-xs border border-rose-100 dark:border-rose-900/50">
            ⚠ {errorMsg}
          </div>
        )}
      </div>

      {/* AI Output Result Section */}
      <AnimatePresence>
        {adviceResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            id="roadmap-result-block"
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-lg border border-indigo-100/70 dark:border-indigo-900/40 relative overflow-hidden"
          >
            {/* Visual glow accent */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
            
            <div className="flex items-center gap-2.5 mb-5 border-b border-indigo-50 pb-4 dark:border-indigo-950/50">
              <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                <BookOpen size={16} />
              </div>
              <h4 className="text-md font-bold text-slate-900 dark:text-white">
                완성된 고맞춤형 시그니처 로드맵
              </h4>
            </div>

            {/* Custom formatted Markdown container */}
            <div className="space-y-1.5 text-slate-800 dark:text-slate-100 leading-relaxed max-w-none">
              {renderHelperMarkdown(adviceResult)}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-xs text-slate-450 dark:text-slate-550">
              <span className="flex items-center gap-1">
                <Clock size={12} className="inline" />
                생성 시간: 실시간 AI 연동
              </span>
              <span className="bg-indigo-50 dark:bg-indigo-950 px-2 py-1 rounded text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                personalized plan
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
