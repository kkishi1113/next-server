import { NextRequest } from 'next/server';

export function DELETE(
  req: NextRequest,
  { paramas }: { params: Promise<{ id: string }> }
) {}
