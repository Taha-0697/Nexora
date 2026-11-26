import { getAllAccountConnections, updateAccountConnection } from '../_lib/marketingController.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const data = await getAllAccountConnections();
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch account connections', details: err.message });
    }
  }

  if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const updated = await updateAccountConnection(body.platform, body);
      return res.status(200).json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: 'Failed to update account connection', details: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'PUT']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
