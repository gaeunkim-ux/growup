import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely, client-ready on first use
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY is not defined. AI features fallback to demo patterns.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API Route: AI Advice Generator
app.post("/api/advice", async (req, res) => {
  const { major, goals, struggle } = req.body;

  if (!major || !goals || !struggle) {
    return res.status(400).json({ error: "필수 정보가 누락되었습니다." });
  }

  // Check if real key is available
  if (!process.env.GEMINI_API_KEY) {
    // Elegant realistic Mock responses if key is missing (fallback behavior for local testing)
    return res.json({
      success: true,
      data: `### 🎯 대학생 맞춤형 핵심 성장 로드맵 (데모 모드)

> **알림**: GEMINI_API_KEY 비밀 키가 설정되지 않아 예시 로드맵을 제공해 드립니다. AI Studio의 **Settings > Secrets** 탭에 키를 등록하시면 인공지능 실시간 비서가 개인화된 최적 추천서을 직접 수립합니다.

#### 🎓 1단계: 전공 역량 빌드업 (${major})
* **내용**: 기초 전공 도서 숙독 및 학내 외 프로젝트 스터디 개시.
* **추천 활동**: 주간 전공 공부 6시간 고정 할당.
* **목표 성취**: 전공 학점 방어 및 기술 포트폴리오의 탄탄한 토대 마련.

#### 🗓️ 2단계: 핵심 선택 영역 (${goals.join(", ")})
* **활동 계획**: 우선순위가 높은 영역인 **${goals[0] || '자기관리'}**부터 하루 30분씩 집중 학습.
* **추천 리소스**: K-MOOC 무료 심화 강의 및 깃허브 오픈도서 탐방.

#### 💡 3단계: 극복 방안 및 실천 수칙
* **고민 주제**: "*${struggle}*"
* **극복 처방전**: 하루 단위로 잘게 쪼갠 루틴 설계가 핵심입니다. 복잡한 생각 대신 매일 아침 10분 계획-실행 주간을 정립해 에너지를 배분하세요.`
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `
대학생의 전공, 흥미 있는 자기계발 영역, 그리고 현재 겪는 고민/장벽을 분석하여 맞춤형 4주 실천형 자기계발 로드맵을 작성해주세요.
형식은 매우 정돈되고 격조 높은 Markdown 포맷을 원합니다. 보기 편하게 적절히 Bullet point, 볼드체, 인용구를 사용해주세요.

[학생 세부사항]
- 전공: ${major}
- 자기계발 관심 분야: ${goals.join(", ")}
- 마주한 고민/상황: ${struggle}

[요구사항]
1. 🎯 분석 및 동기 부여 인용문 (현재 고민을 위로하면서 격려하는 짧은 한마디)
2. 📖 4주차 주간 액션 가이드라인 (1주차, 2주차, 3주차, 4주차 구체적 행동 강령)
3. 🛠️ 추천 툴, 웹사이트 혹은 도서 리스트 (가성비 있거나 대학생 무료 혜택이 적용되는 도구 우선 추천)
4. 🚀 매일 성공률을 높이기 위한 시그니처 팁 제언

반드시 한글로 친근하면서도 격이 있는 어조로 작성해주세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 한국 대학생들을 위한 맞춤형 커리어 및 라이프 스타일 자기계발 멘토이자 카운셀러입니다. 용기를 북돋워 주는 구체적이고 현실적인 로드맵을 제시하십시오.",
      }
    });

    res.json({
      success: true,
      data: response.text
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "AI 로드맵 생성 중 오류가 발생했습니다. 다시 시도해 주세요." });
  }
});

// Vite Middleware for integrated dev experience
async function runServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting at http://localhost:${PORT}`);
  });
}

runServer();
