export const SOURCES = [
  { id: 'all',         label: '전체',         en: 'All' },
  { id: 'WHO',         label: 'WHO',          en: 'WHO' },
  { id: 'CDC',         label: 'CDC',          en: 'CDC' },
  { id: 'NIH',         label: 'NIH',          en: 'NIH' },
  { id: 'PubMed',      label: 'PubMed',       en: 'PubMed' },
  { id: 'MedicalXpress', label: 'MedicalXpress', en: 'MedicalXpress' },
  { id: 'Google News', label: '구글 뉴스',     en: 'Google News' },
  { id: 'Reuters',     label: 'Reuters',      en: 'Reuters' },
]

export const SOURCE_COLORS: Record<string, string> = {
  WHO:           '#3b82f6',
  CDC:           '#22c55e',
  NIH:           '#a78bfa',
  PubMed:        '#f59e0b',
  MedicalXpress: '#f97316',
  'Google News': '#ef4444',
  Reuters:       '#2dd4bf',
}

export const UI = {
  title:         '의료 뉴스 AI',
  subtitle:      'AI 의료·보건 뉴스 자동 수집 · 요약',
  crawlBtn:      '뉴스 수집',
  crawling:      '수집 중...',
  newsCount:     (n: number) => `${n}개의 뉴스`,
  readMore:      '원문 보기',
  summary:       'AI 요약',
  noNews:        '뉴스가 없습니다',
  noNewsDesc:    '뉴스 수집 버튼을 클릭하여 최신 뉴스를 가져오세요',
  loadMore:      '더 보기',
  searchPlaceholder: '뉴스 검색...',
  dateFormat:    'ko-KR',
  errorMsg:      '뉴스를 불러오는 중 오류가 발생했습니다',
  retryBtn:      '다시 시도',
  sourceLabel:   '출처',
  dateLabel:     '날짜',
  allSources:    '전체 출처',
  latestNews:    '최신 뉴스',
  medNews:       '의료·보건 뉴스',
}
