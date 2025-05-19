import { openDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //   console.log('🍎', params);
  try {
    const { id } = await params;
    const db = await openDb();
    const sql = `UPDATE links SET archived = 1 WHERE id = ?`;
    await db.run(sql, id);
    return NextResponse.json({ success: true, archived: 1 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to archive' }, { status: 500 });
  }
}
