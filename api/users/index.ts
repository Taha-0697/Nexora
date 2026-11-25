import { getAllUsers, createUserRecord } from '../../src/server/usersController';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const users = await getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      console.error('API Error (GET /api/users):', error);
      return res.status(500).json({
        error: 'Failed to fetch users from database',
        details: error.message || String(error),
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const newUser = await createUserRecord(body);
      return res.status(201).json(newUser);
    } catch (error: any) {
      console.error('API Error (POST /api/users):', error);
      return res.status(400).json({
        error: error.message || 'Failed to create user',
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

