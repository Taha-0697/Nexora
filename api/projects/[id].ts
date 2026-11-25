import { deleteProjectRecord } from '../_lib/projectsController.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};

  if (req.method === 'DELETE') {
    try {
      const result = await deleteProjectRecord(id as string);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in DELETE /api/projects/:id:', error);
      return res.status(500).json({
        error: 'Failed to delete project',
        details: error.message || String(error),
      });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
