import { prisma } from './prisma.js';
import type { User, UserRole } from '../../src/types/index.js';

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 8000,
  errorMsg = 'Database query timed out. Please verify DATABASE_URL in .env points to an active Neon PostgreSQL instance.'
): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

export function formatUser(u: any): User {
  let roles: UserRole[] = [];
  if (Array.isArray(u.roles)) {
    roles = u.roles as UserRole[];
  } else if (typeof u.roles === 'string') {
    roles = u.roles
      .split(',')
      .map((r: string) => r.trim())
      .filter(Boolean) as UserRole[];
  }

  if (roles.length === 0) {
    roles = ['project_manager'];
  }

  const avatar =
    u.avatarUrl ||
    u.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  const roleTitle = u.role || u.title || 'Team Member';

  return {
    id: u.id,
    email: u.email ?? '',
    name: u.name,
    roles,
    password: u.password ?? '',
    role: roleTitle,
    title: roleTitle,
    bio: u.bio || null,
    linkedinUrl: u.linkedinUrl || null,
    avatarUrl: avatar,
    avatar,
    displayOrder: typeof u.displayOrder === 'number' ? u.displayOrder : 0,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : undefined,
    updatedAt: u.updatedAt ? new Date(u.updatedAt).toISOString() : undefined,
  };
}

// Ensure the root Super Admin exists in the TeamMember table
export async function ensureRootSuperAdmin(): Promise<void> {
  try {
    const existing = await withTimeout(
      prisma.teamMember.findFirst({
        where: { email: 'admin@nexora.io' },
      })
    );

    if (!existing) {
      await withTimeout(
        prisma.teamMember.create({
          data: {
            email: 'admin@nexora.io',
            name: 'Super Administrator',
            roles: ['super_admin', 'admin', 'project_manager', 'marketing_manager', 'review_manager'],
            password: 'admin2026!',
            role: 'Chief Technology Officer',
            avatarUrl:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            displayOrder: 0,
          },
        })
      );
      console.log('[Nexora] Seeded root Super Admin into TeamMember table.');
    }
  } catch (err: any) {
    console.error('[Nexora] ensureRootSuperAdmin error:', err.message);
  }
}

// Fetch all users (TeamMembers with an email set = portal users)
export async function getAllUsers(): Promise<User[]> {
  await ensureRootSuperAdmin();
  const records = await withTimeout(
    prisma.teamMember.findMany({
      where: {
        email: { not: null },
      },
      orderBy: { displayOrder: 'asc' },
    })
  );
  return records.map(formatUser);
}

// Create a new portal user (invoked by Super Admin)
export async function createUserRecord(data: any): Promise<User> {
  const email = String(data.email || '').trim().toLowerCase();
  const name = String(data.name || '').trim();
  const password = String(data.password || '').trim();
  const role = String(data.title || data.role || 'Team Member').trim();
  const avatarUrl = data.avatarUrl || data.avatar ? String(data.avatarUrl || data.avatar).trim() : null;
  const bio = data.bio ? String(data.bio).trim() : null;
  const linkedinUrl = data.linkedinUrl ? String(data.linkedinUrl).trim() : 'https://www.linkedin.com/';
  const displayOrder = typeof data.displayOrder === 'number' ? data.displayOrder : 99;

  if (!email) throw new Error('Email address is required.');
  if (!name) throw new Error('Full name is required.');
  if (!password) throw new Error('A secure password is required.');

  // Check duplicate email
  const existing = await withTimeout(
    prisma.teamMember.findFirst({ where: { email } })
  );
  if (existing) throw new Error(`A user with email ${email} already exists.`);

  let roles: string[] = [];
  if (Array.isArray(data.roles)) {
    roles = data.roles.map(String).map((r: string) => r.trim()).filter(Boolean);
  } else if (typeof data.roles === 'string') {
    roles = data.roles.split(',').map((r: string) => r.trim()).filter(Boolean);
  }
  if (roles.length === 0) roles = ['project_manager'];

  const created = await withTimeout(
    prisma.teamMember.create({
      data: {
        email,
        name,
        password,
        role,
        bio,
        linkedinUrl,
        avatarUrl,
        displayOrder,
        roles,
      },
    })
  );

  return formatUser(created);
}

// Update user (invoked by Super Admin)
export async function updateUserRecord(id: string, data: any): Promise<User> {
  if (!id) throw new Error('User ID is required for update.');

  const existing = await withTimeout(
    prisma.teamMember.findUnique({ where: { id } })
  );
  if (!existing) throw new Error(`User with ID ${id} not found.`);

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = String(data.name).trim();
  if (data.email !== undefined) updateData.email = String(data.email).trim().toLowerCase();
  if (data.title !== undefined) updateData.role = String(data.title).trim();
  if (data.role !== undefined && !data.title) updateData.role = String(data.role).trim();
  if (data.bio !== undefined) updateData.bio = data.bio ? String(data.bio).trim() : null;
  if (data.linkedinUrl !== undefined)
    updateData.linkedinUrl = data.linkedinUrl ? String(data.linkedinUrl).trim() : null;
  if (data.displayOrder !== undefined) updateData.displayOrder = Number(data.displayOrder) || 0;
  if (data.avatarUrl !== undefined || data.avatar !== undefined) {
    const av = data.avatarUrl || data.avatar;
    updateData.avatarUrl = av ? String(av).trim() : null;
  }
  if (data.password !== undefined && String(data.password).trim() !== '') {
    updateData.password = String(data.password).trim();
  }

  if (data.roles !== undefined) {
    let roles: string[] = [];
    if (Array.isArray(data.roles)) {
      roles = data.roles.map(String).map((r: string) => r.trim()).filter(Boolean);
    } else if (typeof data.roles === 'string') {
      roles = data.roles.split(',').map((r: string) => r.trim()).filter(Boolean);
    }

    // Guard: at least one super_admin must remain
    const hadAdmin =
      existing.roles.includes('super_admin') || existing.roles.includes('admin');
    const willHaveAdmin = roles.includes('super_admin') || roles.includes('admin');
    if (hadAdmin && !willHaveAdmin) {
      const admins = await withTimeout(
        prisma.teamMember.findMany({
          where: { email: { not: null } },
        })
      );
      const adminUsers = admins.filter(
        u => u.id !== id && (u.roles.includes('super_admin') || u.roles.includes('admin'))
      );
      if (adminUsers.length === 0) {
        throw new Error('Cannot remove administrative privileges from the sole Super Administrator.');
      }
    }

    updateData.roles = roles;
  }

  const updated = await withTimeout(
    prisma.teamMember.update({ where: { id }, data: updateData })
  );

  return formatUser(updated);
}

// Delete user (invoked by Super Admin)
export async function deleteUserRecord(id: string): Promise<{ success: boolean; message: string }> {
  if (!id) throw new Error('User ID is required.');

  const existing = await withTimeout(
    prisma.teamMember.findUnique({ where: { id } })
  );
  if (!existing) throw new Error(`User with ID ${id} not found.`);

  // Guard sole super admin
  if (existing.roles.includes('super_admin') || existing.roles.includes('admin')) {
    const allAdmins = await withTimeout(
      prisma.teamMember.findMany({
        where: { email: { not: null } },
      })
    );
    const otherAdmins = allAdmins.filter(
      u => u.id !== id && (u.roles.includes('super_admin') || u.roles.includes('admin'))
    );
    if (otherAdmins.length === 0) {
      throw new Error('Cannot delete the sole Super Administrator account.');
    }
  }

  await withTimeout(prisma.teamMember.delete({ where: { id } }));

  return { success: true, message: `User ${id} removed successfully.` };
}

// Authenticate against TeamMember table
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  await ensureRootSuperAdmin();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const trimmedPassword = String(password || '').trim();

  if (!normalizedEmail || !trimmedPassword) return null;

  // Find by email (case-insensitive)
  const member = await withTimeout(
    prisma.teamMember.findFirst({
      where: { email: normalizedEmail },
    })
  );


  if (!member) return null;
  if (member.password !== trimmedPassword) return null;

  return formatUser(member);
}
