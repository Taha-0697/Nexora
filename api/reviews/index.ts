import { getAllReviews, createReviewRecord } from '../../src/server/reviewsController.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const reviews = await getAllReviews();
      return res.status(200).json(reviews);
    } catch (error: any) {
      console.error('Error in GET /api/reviews:', error);
      return res.status(500).json({
        error: 'Failed to fetch reviews',
        details: error.message || String(error),
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const review = await createReviewRecord(body);
      return res.status(201).json(review);
    } catch (error: any) {
      console.error('Error in POST /api/reviews:', error);
      return res.status(400).json({
        error: 'Failed to create review in database',
        details: error.message || String(error),
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
