import { NextResponse } from 'next/server';
import { getAllReviews, createReviewRecord } from '../../../server/reviewsController';

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews from database', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const review = await createReviewRecord(body);
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { error: 'Failed to create review in database', details: error.message },
      { status: 400 }
    );
  }
}
