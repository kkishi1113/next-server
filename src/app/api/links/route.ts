import { fetchMetadata } from '@/app/actions/fetchMetadata';
import { openDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

interface Link {
  id: string;
  title: string;
  url: string;
  domain: string;
  thumbnail: string;
  archived: boolean;
}

const baseUrl = 'http://localhost:3000'; //process.env.NEXT_PUBLIC_BASE_URL;

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
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set');
  }

  try {
    const body = await req.json();
    const { urls }: { urls: string[] } = body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: 'No links provided' }), {
        status: 400,
      });
    }

    //   const res = await fetch(`${baseUrl}/api/metadata`, {
    //     method: 'POST',
    //     body: JSON.stringify({ urls: urls }),
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    //   const { links }: { links: Link[] } = await res.json();

    //   console.log('🍇', res);

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
    // const values: any[] = [];
    // for (const link of links) {
    //   values.push(
    //     link.id,
    //     link.title,
    //     link.url,
    //     link.domain,
    //     link.thumbnail,
    //     link.archived ? 1 : 0
    //   );
    // }

    const sql = `
      INSERT INTO links (id, title, url, domain, thumbnail, archived)
      VALUES ${valuesPlaceholders}
    `;
    console.log(sql);

    await db.run(sql, values);

    // return new Response(JSON.stringify({ success: true }), {
    //   status: 200,
    // });
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

// import { openDb } from '@/utils/db';

// interface Link {
//   id: string;
//   title: string;
//   url: string;
//   domain: string;
//   thumbnail: string;
//   archived: boolean;
// }

// export async function POST(req: any) {
//   const body = await req.json();
//   const db = await openDb();
//   console.log('req:', body);
//   const { links }: { links: Link[] } = body;

//   try {
//     await db.run(
//       'INSERT INTO links (id, title, url, domain, thumbnail, archived) VALUES (?, ?, ?, ?, ?, ?)',
//       [
//         link.id,
//         link.title,
//         link.url,
//         link.domain,
//         link.thumbnail,
//         link.archived ? 1 : 0,
//       ]
//     );

//     return new Response(JSON.stringify({ success: true }), {
//       status: 200,
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err }), {
//       status: 500,
//     });
//   }
// }
