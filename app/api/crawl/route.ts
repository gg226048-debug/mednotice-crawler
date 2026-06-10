import { NextResponse } from 'next/server'
import { crawlAll } from '@/lib/crawlers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    const items = await crawlAll()
    if (items.length > 0) {
      const rows = items.map(it => ({
        id:           it.id,
        title:        it.title,
        summary:      it.summary,
        url:          it.url,
        source:       it.source,
        published_at: it.publishedAt,
        image_url:    it.imageUrl || null,
        ai_summary:   it.aiSummary || null,
      }))
      await supabase.from('news_items').upsert(rows, { onConflict: 'id' })
    }
    return NextResponse.json({
      success: true,
      count: items.length,
      message: `${items.length}개의 뉴스를 수집했습니다`,
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
