import { NextResponse } from 'next/server';
import { deleteReviewRecord, updateReviewRecord } from '../../../../server/reviewsController';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const updated = await updateReviewRecord(id, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('Failed to update review:', error);
    return NextResponse.json(
      { error: 'Failed to update review in database', details: error.message },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  return PUT(request, { params });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }
    const result = await deleteReviewRecord(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Failed to delete review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review from database', details: error.message },
      { status: 500 }
    );
  }
}
