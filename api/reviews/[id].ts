import { updateReviewRecord, deleteReviewRecord } from '../_lib/reviewsController.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const updated = await updateReviewRecord(id as string, body);
      return res.status(200).json(updated);
    } catch (error: any) {
      console.error('Error in PUT/PATCH /api/reviews/:id:', error);
      return res.status(500).json({
        error: 'Failed to update review',
        details: error.message || String(error),
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await deleteReviewRecord(id as string);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in DELETE /api/reviews/:id:', error);
      return res.status(500).json({
        error: 'Failed to delete review',
        details: error.message || String(error),
      });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
