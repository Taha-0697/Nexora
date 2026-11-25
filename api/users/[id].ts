import { updateUserRecord, deleteUserRecord } from '../../src/server/usersController.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};

  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const updated = await updateUserRecord(id as string, body);
      return res.status(200).json(updated);
    } catch (error: any) {
      console.error('API Error (PATCH /api/users/:id):', error);
      return res.status(400).json({
        error: error.message || 'Failed to update user',
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await deleteUserRecord(id as string);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('API Error (DELETE /api/users/:id):', error);
      return res.status(400).json({
        error: error.message || 'Failed to delete user',
      });
    }
  }

  res.setHeader('Allow', ['PATCH', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

