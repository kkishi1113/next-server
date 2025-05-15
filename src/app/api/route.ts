import { openDb } from '@/utils/db';

export async function POST(req: any) {
  const body = await req.json();
  const db = await openDb();

  try {
    await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [
      body.name,
      body.email,
    ]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
    });
  }
}
