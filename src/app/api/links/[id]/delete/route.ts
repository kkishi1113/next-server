import { openDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await openDb();
    const sql = `DELETE FROM links WHERE id = ?`;
    await db.run(sql, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    throw NextResponse.error();
  }
}
