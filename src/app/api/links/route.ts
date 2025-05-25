import { fetchMetadata } from '@/app/actions/fetchMetadata';
import { openDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await openDb();
    const sql = `SELECT * FROM links`;

    const links = await db.all(sql);

    return NextResponse.json({ links });
  } catch (err) {
    console.error('DB select error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls }: { urls: string[] } = body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: 'No links provided' }), {
        status: 400,
      });
    }

    const db = await openDb();

    // メタデータをフェッチしnewLinksを作成
    const newLinks = await Promise.all(
      urls.map(async (url, index) => {
        const metadata = await fetchMetadata(url);
        const domain = new URL(url).hostname;
        return {
          id: `new-${Date.now()}-${index}`,
          title: metadata.title || '',
          url: url,
          domain: domain || '',
          thumbnail: metadata.image || '',
          archived: 0,
        };
      })
    );

    // VALUES 部分のプレースホルダーを作成
    const valuesPlaceholders = newLinks
      .map(() => `(?, ?, ?, ?, ?, ?)`)
      .join(', ');

    // 実際の値を平坦化（フラット化）する
    const values = newLinks.flatMap((link) => [
      link.id,
      link.title,
      link.url,
      link.domain,
      link.thumbnail,
      link.archived ? 1 : 0,
    ]);

    const sql = `
      INSERT INTO links (id, title, url, domain, thumbnail, archived)
      VALUES ${valuesPlaceholders}
    `;
    console.log(sql);

    await db.run(sql, values);

    return NextResponse.json({
      newLinks: newLinks,
      success: true,
      status: 200,
    });
  } catch (err) {
    console.error('DB insert error:', err);
    return new Response(
      JSON.stringify({ error: 'Insert failed', detail: String(err) }),
      {
        status: 500,
      }
    );
  }
}
