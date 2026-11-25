import { authenticateUser } from '../../src/server/usersController';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const user = await authenticateUser(body.email, body.password);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password. Please verify credentials.',
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.error('API Error (POST /api/auth/login):', error);
    return res.status(500).json({
      error: error.message || 'Authentication error',
    });
  }
}

