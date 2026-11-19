import { NextResponse } from 'next/server';
import { getAllProjects, createProjectRecord } from '../../../server/projectsController';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects from database', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await createProjectRecord(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { error: 'Failed to create project in database', details: error.message },
      { status: 400 }
    );
  }
}
