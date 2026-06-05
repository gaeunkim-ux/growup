import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, Compass, Flame, BookOpen, Clock, Lightbulb, Github, Check, AlertCircle, ArrowUpRight, Sun, Moon, GraduationCap, ChevronRight } from "lucide-react";

import AIPositioning from "./components/AIPositioning";
import PomodoroTimer from "./components/PomodoroTimer";
import HabitTracker from "./components/HabitTracker";
import GoalPlanner from "./components/GoalPlanner";
import GithubVercelGuide from "./components/GithubVercelGuide";
import { MentorStory } from "./types";

const MOCK_STORIES: MentorStory[] = [
  {
    id: "s1",
    name: "김민재 (24)",
    role: "카카오 리서치 인턴 합격",
    major: "컴퓨터공학과 3학년",
    quote: "뽀모도로 25분 몰입과 매일 1시간 깃허브 커밋 습관이 고스란히 비전공 극복의 무기가 되었습니다.",
    story: "학점 3.2점 평범한 전공생이었으나, AI 로드맵 설계를 토대로 3개의 핵심 앱 서비스를 배포했습니다. 뽀모도로 타이머를 켜두고 휴대폰을 격리함으로써 일 평균 집중 시간이 4시간 증가했습니다.",
    avatarColor: "bg-amber-100 text-amber-700"
  },
  {
    id: "s2",
    name: "이지원 (23)",
    role: "글로벌 마케팅 에이전시 입사",
    major: "사학과 4학년",
    quote: "사학 전공이라 취업 걱정이 앞섰지만, 마케팅 자격증 취득 및 기획 블로깅 습관으로 역량을 증명했어요.",
    story: "비전공 분야 분석 습관을 기르기 위해 daily habit tracker를 사용했습니다. 사학 특유의 정보 리서치 기법과 디지털 분석 독학을 매일 30분씩 병행한 결과가 고스란히 합격 포트폴리오가 되었습니다.",
    avatarColor: "bg-emerald-100 text-emerald-700"
  },
  {
    id: "s3",
    name: "박서준 (25)",
    role: "웹 에이전시 풀스택 외주 개발자",
    major: "전자공학과 4학년",
    quote: "혼자 구상하던 아이디어를 Vercel로 런칭할 때의 짜릿함을 잊지 못합니다.",
    story: "Vercel 무료 배포 가이드를 참고해 제 외주용 포트폴리오를 빠르게 구축했습니다. 깃허브 기여 기록 잔디밭이 차오르는 것을 대시보드로 보며 탄탄한 개발 성장 루틴을 유지할 수 있었습니다.",
    avatarColor: "bg-indigo-150 text-indigo-700"
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // System Dark-mode sync
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const formatDateString = (date: Date) => {
    const years = date.getFullYear();
    const months = (date.getMonth() + 1).toString().padStart(2, "0");
    const days = date.getDate().toString().padStart(2, "0");
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const day = daysOfWeek[date.getDay()];
    return `${years}년 ${months}월 ${days}일 (${day})`;
  };

  const formatHours = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", { hour12: false });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? "bg-slate-950 text-slate-150" : "bg-slate-50 text-slate-850"}`}>
      
      {/* 1. Header & Navigation */}
      <nav className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <GraduationCap size={20} />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
              GROWUP<span className="text-indigo-600 dark:text-indigo-400">.CAMPUS</span>
            </span>
          </div>

          {/* Center Dynamic Clock widget */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-150 dark:border-slate-850/60 font-mono text-xs">
            <Clock size={13} className="text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400 font-sans font-medium">{formatDateString(currentTime)}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest">{formatHours(currentTime)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Guide clicker */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1 transition"
              id="top-guide-trigger"
            >
              <Github size={13} />
              <span>GitHub & Vercel 배포</span>
            </button>

            {/* Dark mode switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 rounded-xl cursor-pointer transition"
              title={isDarkMode ? "라이트 모드" : "다크 모드"}
            >
              {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
          </div>

        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-full text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
        >
          <Sparkles size={12} />
          <span>대학생 자기계발 스마트 가이드 &amp; 플래너</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight font-sans tracking-tight"
        >
          목표는 원대하게, 루틴은 미시적으로<br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">어제와 다른 대학 생활의 성과</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400 font-sans leading-relaxed"
        >
          지나가는 무의미한 공강 시간, 밀려오는 전공 과제, 다가올 취업 걱정.<br />
          나만의 전공을 설정하고 AI 맞춤형 4주 액션 플랜을 수립하세요. 몰입 타이머와 데일리 리포트가 성공적인 결과물을 향한 견고한 레일이 되어줍니다.
        </motion.p>

        {/* Feature quick previews */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6 text-left"
        >
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold mb-3 text-xs font-mono">01</div>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white uppercase">AI Roadmap Generator</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">전공과 고민을 입력해 구글 Gemini가 세정하는 맞춤 가이드라인 즉시 생성.</p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3 text-xs font-mono">02</div>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white uppercase">25m Focus Booster</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">뽀모도로 순환식 타이머를 적용하여 일상 속 깊은 초집중 습관을 체화.</p>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3 text-xs font-mono">03</div>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white uppercase">Daily Habit Tracker</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">잔디 심기, 어학 스터디 등 지속해 낼 소형 루틴을 기록하고 스택 축적.</p>
          </div>
        </motion.div>
      </header>

      {/* 3. Main Operational Workbench */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Large Column (AI Roadmap Builder & Testimonials) */}
          <section className="lg:col-span-7 space-y-8">
            {/* AI Advisor Module */}
            <div className="scroll-mt-20" id="ai-planning">
              <AIPositioning />
            </div>

            {/* Mentor peer community stories card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-100 dark:border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <GraduationCap className="text-indigo-500" size={18} />
                  <span>선배들의 생생한 자기계발 돌파 스토리</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">같은 학과, 같은 고민을 가졌던 선배들의 현실적인 성장기</p>
              </div>

              <div className="space-y-4">
                {MOCK_STORIES.map((story) => (
                  <div key={story.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-full ${story.avatarColor} font-bold text-xs flex items-center justify-center`}>
                          {story.name[0]}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{story.name} ({story.major})</h4>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{story.role}</span>
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-xs italic text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 p-2.5 rounded-xl font-sans">
                      "{story.quote}"
                    </blockquote>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-1">
                      {story.story}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Smaller Column (Focus Boosters, Habits, Goals list) */}
          <aside className="lg:col-span-5 space-y-8">
            {/* Pomodoro module */}
            <PomodoroTimer />

            {/* Habits tracker module */}
            <HabitTracker />

            {/* Weekly Target Planner */}
            <GoalPlanner />
          </aside>

        </div>
      </main>

      {/* 4. GitHub and Vercel Launch CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white py-14 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center mx-auto mb-2 border border-slate-700/60 font-mono text-sm shadow">
            <Github size={22} className="animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            "이 프로그램을 내 깃허브에 저장하고,<br />
            Vercel을 통해 실제 서버에 런칭해 보세요."
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-indigo-200/80 leading-relaxed font-sans">
            이 앱에는 당신의 깃허브 포트폴리오를 증명할 완벽한 정적 빌드 환경(Vite)과 구글 Gemini 초실시간 연동 Express 배포 파일이 완비되어 있습니다. 단 5분 안내를 따라 전세계 누구나 무료로 들어올 수 있는 포트폴리오 랜딩 페이지를 가꿔보세요.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95"
              id="cta-guide-btn"
            >
              <span>배포 가이드 원클릭으로 열기</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Clean Human Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-slate-850 dark:text-slate-350">GROWUP.CAMPUS</span> — 대학생들을 위한 프리미엄 스마트 성장 비서 랜딩 페이지
            <p className="mt-1">© 2026. Made with Google AI Studio and Ready for seamless GitHub &amp; Vercel integration.</p>
          </div>
          <div className="space-x-3 text-slate-405 font-mono text-[10px]">
            <span>UTC TIME: 2026-06-05</span>
            <span className="text-indigo-600 dark:text-indigo-400">● STATIC BUILD READY</span>
          </div>
        </div>
      </footer>

      {/* 6. Deploy Modal Guide */}
      <AnimatePresence>
        {isGuideOpen && (
          <GithubVercelGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
