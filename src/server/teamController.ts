import { prisma } from '../lib/prisma.ts';

export async function getAllTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return members;
  } catch (err: any) {
    console.error('Error in getAllTeamMembers:', err);
    throw err;
  }
}

export async function createTeamMemberRecord(data: any) {
  const name = data.name || 'Core Engineer';
  const role = data.role || 'Senior Systems Architect';
  const bio = data.bio || null;
  const linkedinUrl = data.linkedinUrl || 'https://www.linkedin.com/';
  const avatarUrl = data.avatarUrl || null;
  const displayOrder = Number(data.displayOrder) || 0;

  const member = await prisma.teamMember.create({
    data: {
      name,
      role,
      bio,
      linkedinUrl,
      avatarUrl,
      displayOrder,
    },
  });

  return member;
}
