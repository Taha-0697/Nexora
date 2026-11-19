import { NextResponse } from 'next/server';
import { getAllTeamMembers, createTeamMemberRecord } from '../../../server/teamController';

export async function GET() {
  try {
    const members = await getAllTeamMembers();
    return NextResponse.json(members, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const member = await createTeamMemberRecord(body);
    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member', details: error.message },
      { status: 400 }
    );
  }
}
