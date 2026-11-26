import { getAllMarketingPosts, createMarketingPost } from '../../_lib/marketingController.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const data = await getAllMarketingPosts();
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch marketing posts', details: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const created = await createMarketingPost(body);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(400).json({ error: 'Failed to create marketing post', details: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
