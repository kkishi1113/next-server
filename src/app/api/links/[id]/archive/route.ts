import { openDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { archived }: { archived: boolean } = await req.json();
    const db = await openDb();
    const sql = `UPDATE links SET archived = ? WHERE id = ?`;
    await db.run(sql, [!archived, id]);
    return NextResponse.json({ success: true, archived: !archived });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to archive' }, { status: 500 });
  }
}
