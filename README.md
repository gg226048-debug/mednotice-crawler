# 🏥 의료 뉴스 AI

WHO, CDC, NIH, PubMed 등 주요 의료 기관에서 AI가 수집·요약한 최신 의료·보건 뉴스 서비스

## 기술 스택
- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **DB**: Supabase
- **배포**: Vercel

## 시작하기

```bash
npm install
cp .env.example .env.local
# .env.local 에 환경변수 입력
npm run dev
```

## 환경변수

| 변수 | 설명 |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase 프로젝트 URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key |
| OPENROUTER_API_KEY | OpenRouter API 키 (AI 요약용) |

## 수집 기관
- WHO (세계보건기구)
- CDC (미국 질병통제예방센터)
- NIH (미국 국립보건원)
- PubMed (의학 논문 DB)
- MedicalXpress
- Google News
- Reuters Health
