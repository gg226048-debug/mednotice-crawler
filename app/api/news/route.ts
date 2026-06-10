import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const source = searchParams.get('source')
  const limit  = parseInt(searchParams.get('limit') || '60')

  let query = supabase
    .from('news_items')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (source && source !== 'all') {
    query = query.eq('source', source)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data || [], total: data?.length || 0 })
}
