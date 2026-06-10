import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '의료 뉴스 AI | 최신 의료·보건 뉴스 자동 수집',
  description: 'WHO, CDC, NIH, PubMed 등 주요 의료 기관에서 AI가 수집·요약한 최신 의료·보건 뉴스',
  keywords: '의료 뉴스, 보건 뉴스, WHO, CDC, NIH, PubMed, 의료 정보',
  openGraph: {
    title: '의료 뉴스 AI',
    description: 'AI가 수집·요약한 최신 의료·보건 뉴스',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
