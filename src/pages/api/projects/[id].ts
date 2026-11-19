import { deleteProjectRecord } from '../../../server/projectsController';

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const result = await deleteProjectRecord(id as string);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
