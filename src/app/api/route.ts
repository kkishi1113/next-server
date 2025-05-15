import { openDb } from '@/utils/db';

interface Link {
  id: string;
  title: string;
  url: string;
  domain: string;
  thumbnail: string;
  archived: boolean;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { links }: { links: Link[] } = body;

  if (!Array.isArray(links) || links.length === 0) {
    return new Response(JSON.stringify({ error: 'No links provided' }), {
      status: 400,
    });
  }

  try {
    const db = await openDb();

    // VALUES 部分のプレースホルダーを作成
    const valuesPlaceholders = links.map(() => `(?, ?, ?, ?, ?, ?)`).join(', ');

    // 実際の値を平坦化（フラット化）する
    const values: any[] = [];
    for (const link of links) {
      values.push(
        link.id,
        link.title,
        link.url,
        link.domain,
        link.thumbnail,
        link.archived ? 1 : 0
      );
    }

    const sql = `
      INSERT INTO links (id, title, url, domain, thumbnail, archived)
      VALUES ${valuesPlaceholders}
    `;

    await db.run(sql, values);

    return new Response(JSON.stringify({ success: true }), {
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
