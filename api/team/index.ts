import { getAllTeamMembers } from '../../src/server/teamController.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const members = await getAllTeamMembers();
      return res.status(200).json(members);
    } catch (error: any) {
      console.error('API Error (GET /api/team):', error);
      return res.status(500).json({
        error: 'Failed to fetch team members',
        details: error.message || String(error),
      });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

