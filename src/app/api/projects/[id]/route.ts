import { NextResponse } from 'next/server';
import { deleteProjectRecord } from '../../../../server/projectsController';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
    }

    const result = await deleteProjectRecord(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project from database', details: error.message },
      { status: 500 }
    );
  }
}
