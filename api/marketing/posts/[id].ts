import { updateMarketingPost, deleteMarketingPost } from '../../_lib/marketingController.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query || {};

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const updated = await updateMarketingPost(id as string, body);
      return res.status(200).json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: 'Failed to update marketing post', details: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await deleteMarketingPost(id as string);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete marketing post', details: err.message });
    }
  }

  res.setHeader('Allow', ['PATCH', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
