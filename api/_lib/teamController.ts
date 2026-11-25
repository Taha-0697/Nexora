import { prisma } from './prisma.js';

// Public endpoint: returns all team members (for the Leadership section on the website)
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

// Create a team member record (without portal access - no email/password)
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

// Update a team member's public profile fields
export async function updateTeamMemberRecord(id: string, data: any) {
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = String(data.name).trim();
  if (data.role !== undefined) updateData.role = String(data.role).trim();
  if (data.bio !== undefined) updateData.bio = data.bio ? String(data.bio).trim() : null;
  if (data.linkedinUrl !== undefined)
    updateData.linkedinUrl = data.linkedinUrl ? String(data.linkedinUrl).trim() : null;
  if (data.avatarUrl !== undefined)
    updateData.avatarUrl = data.avatarUrl ? String(data.avatarUrl).trim() : null;
  if (data.displayOrder !== undefined)
    updateData.displayOrder = Number(data.displayOrder) || 0;

  return prisma.teamMember.update({ where: { id }, data: updateData });
}

// Delete a team member record
export async function deleteTeamMemberRecord(id: string) {
  return prisma.teamMember.delete({ where: { id } });
}
