import { getAllProjects, createProjectRecord } from '../../src/server/projectsController.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const projects = await getAllProjects();
      return res.status(200).json(projects);
    } catch (error: any) {
      console.error('Error in GET /api/projects:', error);
      return res.status(500).json({
        error: 'Failed to fetch projects from Neon PostgreSQL',
        details: error.message || String(error),
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const project = await createProjectRecord(body);
      return res.status(201).json(project);
    } catch (error: any) {
      console.error('Error in POST /api/projects:', error);
      return res.status(400).json({
        error: 'Failed to create project in database',
        details: error.message || String(error),
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
