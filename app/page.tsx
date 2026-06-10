'use client'

import { useState, useEffect, useCallback } from 'react'
import { SOURCES, SOURCE_COLORS, UI } from '@/lib/sources'

interface NewsItem {
  id: string
  title: string
  summary: string
  url: string
  source: string
  published_at: string
  ai_summary?: string
}

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date(dateStr))
  } catch { return dateStr }
}

export default function Home() {
  const [news, setNews]         = useState<NewsItem[]>([])
  const [source, setSource]     = useState('all')
  const [loading, setLoading]   = useState(false)
  const [crawling, setCrawling] = useState(false)
  const [search, setSearch]     = useState('')
  const [error, setError]       = useState('')
  const [total, setTotal]       = useState(0)

  const fetchNews = useCallback(async (src = source) => {
    setLoading(true)
    setError('')
    try {
      const params = src !== 'all' ? `?source=${encodeURIComponent(src)}` : ''
      const res  = await fetch(`/api/news${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || UI.errorMsg)
      setNews(data.items || [])
      setTotal(data.total || 0)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [source])

  useEffect(() => { fetchNews() }, [fetchNews])

  async function handleCrawl() {
    setCrawling(true)
    setError('')
    try {
      const res  = await fetch('/api/crawl', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || UI.errorMsg)
      await fetchNews()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCrawling(false)
    }
  }

  function handleSource(src: string) {
    setSource(src)
    fetchNews(src)
  }

  const filtered = news.filter(n =>
    !search || n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.summary || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* 헤더 */}
      <header style={{
        background: 'var(--panel)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🏥</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              {UI.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '-2px' }}>
              {UI.subtitle}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder={UI.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border2)',
              color: 'var(--text)',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: '13px',
              outline: 'none',
              width: '200px',
              fontFamily: 'inherit',
            }}
          />
          <button onClick={handleCrawl} disabled={crawling} style={{
            background: crawling ? '#1e3a5f' : 'var(--accent)',
            color: crawling ? '#4a6280' : '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: crawling ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {crawling ? (
              <><span style={{ display:'inline-block',width:'12px',height:'12px',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }}></span>{UI.crawling}</>
            ) : `🔍 ${UI.crawlBtn}`}
          </button>
        </div>
      </header>

      {/* 출처 탭 */}
      <div style={{
        background: 'var(--panel)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
      }}>
        {SOURCES.map(s => (
          <button
            key={s.id}
            onClick={() => handleSource(s.id)}
            style={{
              background: source === s.id ? 'var(--accent)' : 'transparent',
              color: source === s.id ? '#fff' : 'var(--muted2)',
              border: 'none',
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: source === s.id ? 600 : 400,
              cursor: 'pointer',
              borderRadius: '0',
              borderBottom: source === s.id ? '2px solid var(--accent)' : '2px solid transparent',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'all .15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 메인 */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 24px' }}>

        {/* 결과 수 */}
        {!loading && !error && (
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
            {search
              ? <><strong style={{ color: 'var(--accent)' }}>{filtered.length}</strong>개 검색됨</>
              : <><strong style={{ color: 'var(--accent)' }}>{total}</strong>개의 뉴스</>
            }
          </div>
        )}

        {/* 오류 */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,.1)',
            border: '1px solid rgba(239,68,68,.3)',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--red)' }}>⚠ {error}</span>
            <button onClick={() => fetchNews()} style={{
              background: 'var(--red)', color: '#fff', border: 'none',
              padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{UI.retryBtn}</button>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '13px' }}>뉴스를 불러오는 중...</div>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '60px 24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📰</div>
            <div style={{ fontSize: '15px', color: 'var(--muted2)', marginBottom: '6px' }}>{UI.noNews}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{UI.noNewsDesc}</div>
          </div>
        )}

        {/* 뉴스 목록 */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(item => {
              const color = SOURCE_COLORS[item.source] || '#3b82f6'
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '16px 18px',
                    display: 'grid',
                    gridTemplateColumns: '8px 1fr',
                    gap: '0 13px',
                    alignItems: 'start',
                    transition: 'border-color .12s, transform .1s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'none'
                  }}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: color, marginTop: '5px', flexShrink: 0,
                  }}></div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color }}>
                        {item.source}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        📅 {formatDate(item.published_at)}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.5, marginBottom: '6px' }}>
                      {item.title}
                    </div>
                    {item.ai_summary ? (
                      <div style={{
                        fontSize: '12px', color: 'var(--muted2)',
                        background: 'rgba(59,130,246,.06)',
                        border: '1px solid rgba(59,130,246,.15)',
                        borderRadius: '6px', padding: '8px 10px',
                        marginBottom: '6px',
                      }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '10px', marginRight: '5px' }}>AI 요약</span>
                        {item.ai_summary}
                      </div>
                    ) : item.summary ? (
                      <div style={{ fontSize: '12px', color: 'var(--muted2)', lineHeight: 1.6 }}>
                        {item.summary.slice(0, 200)}{item.summary.length > 200 ? '...' : ''}
                      </div>
                    ) : null}
                    <div style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '6px' }}>
                      원문 보기 →
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          header { padding: 0 14px !important; }
          input[type=text] { display: none !important; }
          main { padding: 14px !important; }
        }
      `}</style>
    </div>
  )
}
