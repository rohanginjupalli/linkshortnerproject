import { NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortcode?: string }> },
) {
  const shortcode = (await params)?.shortcode;

  if (!shortcode) {
    return NextResponse.json({ error: 'Missing shortcode' }, { status: 400 });
  }

  try {
    const rows = await db
      .select({ url: links.url })
      .from(links)
      .where(eq(links.shortCode, shortcode))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let target = row.url.trim();

    try {
      const parsed = new URL(target);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return NextResponse.json({ error: 'Invalid URL scheme' }, { status: 400 });
      }
      return NextResponse.redirect(parsed.toString(), 307);
    } catch {
      try {
        const parsed = new URL(`https://${target}`);
        return NextResponse.redirect(parsed.toString(), 307);
      } catch {
        return NextResponse.json({ error: 'Invalid target URL' }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
