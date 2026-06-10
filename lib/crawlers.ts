import Parser from 'rss-parser'

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'MedicalNewsBot/1.0' },
})

export interface NewsItem {
  id:          string
  title:       string
  summary:     string
  url:         string
  source:      string
  publishedAt: string
  imageUrl?:   string
  aiSummary?:  string
}

function makeId(source: string, url: string) {
  return Buffer.from(`${source}:${url}`).toString('base64').slice(0, 16)
}

async function fetchRSS(url: string, source: string, limit = 10): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(url)
    return (feed.items || []).slice(0, limit).map(item => ({
      id:          makeId(source, item.link || ''),
      title:       item.title || '',
      summary:     (item.contentSnippet || item.content || '').slice(0, 300),
      url:         item.link || '',
      source,
      publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
    }))
  } catch {
    return []
  }
}

export async function crawlWHO():    Promise<NewsItem[]> {
  return fetchRSS('https://www.who.int/rss-feeds/news-english.xml', 'WHO')
}
export async function crawlCDC():    Promise<NewsItem[]> {
  return fetchRSS('https://tools.cdc.gov/api/v2/resources/media/316422.rss', 'CDC')
}
export async function crawlNIH():    Promise<NewsItem[]> {
  return fetchRSS('https://www.nih.gov/news-events/news-releases.rss', 'NIH')
}
export async function crawlPubMed(): Promise<NewsItem[]> {
  return fetchRSS(
    'https://pubmed.ncbi.nlm.nih.gov/rss/search/?term=hospital+medicine&limit=10&format=abstract',
    'PubMed'
  )
}
export async function crawlMedicalXpress(): Promise<NewsItem[]> {
  return fetchRSS('https://medicalxpress.com/rss-feed/', 'MedicalXpress')
}
export async function crawlGoogleNews(): Promise<NewsItem[]> {
  return fetchRSS(
    'https://news.google.com/rss/search?q=medical+health+hospital&hl=ko&gl=KR&ceid=KR:ko',
    'Google News'
  )
}
export async function crawlReuters(): Promise<NewsItem[]> {
  return fetchRSS('https://feeds.reuters.com/reuters/health', 'Reuters')
}

export async function crawlAll(): Promise<NewsItem[]> {
  const results = await Promise.allSettled([
    crawlWHO(), crawlCDC(), crawlNIH(), crawlPubMed(),
    crawlMedicalXpress(), crawlGoogleNews(), crawlReuters(),
  ])
  return results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}
