import { motion } from "motion/react";
import { X, Github, CloudLightning, CheckCircle2, Terminal, HelpCircle } from "lucide-react";

interface GithubVercelGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GithubVercelGuide({ isOpen, onClose }: GithubVercelGuideProps) {
  if (!isOpen) return null;

  return (
    <div id="deployment-modal-overlay" className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        id="deployment-modal"
        className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div id="deployment-modal-header" className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <CloudLightning size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans">GitHub & Vercel 배포 가이드</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">내 자기계발 앱을 전세계에 런칭하는 방법</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            id="close-guide-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* GitHub Section */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-md font-semibold text-slate-900 dark:text-white">
              <span className="p-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                <Github size={16} />
              </span>
              1단계. GitHub 저장소에 밀어넣기 (Push)
            </h3>
            <div className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl p-4 text-sm space-y-2 border border-slate-100 dark:border-slate-800 font-sans">
              <p>1. 내 깃허브 계정에 접속한 뒤 **New Repository**를 만듭니다.</p>
              <p>2. 로컬 터미널을 열고 터미널 창에 다음 명령어를 복사하여 실행합니다:</p>
              <div className="bg-slate-900 text-slate-200 font-mono p-3 rounded-lg text-xs overflow-x-auto space-y-1">
                <div># 깃 저장소 초기화 및 원격 연결</div>
                <div>git init</div>
                <div>git add .</div>
                <div>git commit -m "feat: 대학생 자기계발 플랫폼 구축"</div>
                <div>git branch -M main</div>
                <div>git remote add origin https://github.com/내계정이름/저장소이름.git</div>
                <div>git push -u origin main</div>
              </div>
            </div>
          </div>

          {/* Vercel Section */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-md font-semibold text-slate-900 dark:text-white">
              <span className="p-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded">
                <CloudLightning size={16} />
              </span>
              2단계. Vercel 무료 호스팅 연결
            </h3>
            <div className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl p-4 text-sm space-y-3 border border-slate-100 dark:border-slate-800">
              <p>1. <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-bold">Vercel 웹사이트</a>에 가입한 뒤 GitHub 계정과 연동합니다.</p>
              <p>2. 대시보드에서 **Add New ... &gt; Project**를 클릭합니다.</p>
              <p>3. 조금 전 푸시한 깃허브 저장소를 찾은 다음 **Import**를 누릅니다.</p>
              <p>4. 설정 화면에서 다음 두 가지를 확인합니다:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <li><strong className="text-slate-800 dark:text-slate-200">Framework Preset:</strong> Vite (자동 감지됩니다)</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Build Command:</strong> <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">npm run build</code></li>
                <li><strong className="text-slate-800 dark:text-slate-200">Output Directory:</strong> <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">dist</code></li>
              </ul>
            </div>
          </div>

          {/* Environment Variable Setup */}
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-200/50 dark:border-amber-900/50 text-sm">
              <h4 className="font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-400 mb-1">
                <HelpCircle size={16} />
                💡 중요: AI 로드맵 기능 작동을 위한 비밀 키 등록!
              </h4>
              <p className="text-xs leading-relaxed text-amber-900/80 dark:text-amber-300/80">
                이 앱은 대학생 맞춤형 로드맵을 위해 구글 Gemini 인공지능을 활용합니다.
                Vercel 환경 설정의 **Environment Variables** 탭에 아래 값을 등록해주세요.
              </p>
              <div className="bg-slate-900 text-slate-200 font-mono p-2.5 rounded-lg text-xs mt-2 space-y-1">
                <div>KEY: <span className="text-emerald-400">GEMINI_API_KEY</span></div>
                <div>VALUE: <span className="text-slate-400">[내 구글 AI Studio 개발자 키 대입]</span></div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 rounded-xl border border-emerald-200/50 dark:border-emerald-900/50 text-sm flex gap-3">
            <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-400">배포 준비 완료!</p>
              <p className="text-xs text-emerald-900/75 dark:text-emerald-300/75 mt-0.5">Vercel은 깃허브 코드에 기여(commit)할 때마다 무료로 상용 서버 무중단 빌드 및 CDN 자동 롤아웃을 실행합니다.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div id="deployment-modal-footer" className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all cursor-pointer font-sans shadow-sm text-sm"
            id="close-modal-footer-btn"
          >
            안내 확인 완료
          </button>
        </div>
      </motion.div>
    </div>
  );
}
