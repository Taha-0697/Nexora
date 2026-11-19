import { getAllProjects, createProjectRecord } from '../../../server/projectsController';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const projects = await getAllProjects();
      return res.status(200).json(projects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const project = await createProjectRecord(req.body);
      return res.status(201).json(project);
    } catch (error: any) {
      console.error('Error creating project:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
