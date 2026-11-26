import { prisma } from './prisma.js';
import type { User, UserRole } from '../../src/types/index.js';
import { hashPassword, verifyPassword, isBcryptHash } from './authUtils.js';

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
  const rawRoles = u?.roles;
  if (Array.isArray(rawRoles)) {
    roles = rawRoles as UserRole[];
  } else if (typeof rawRoles === 'string') {
    roles = rawRoles
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
    password: null, // SECURITY: Never return password hashes in client payloads or responses
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

// Ensure the root Super Admin exists in the TeamMember table with a secure bcrypt hashed password
export async function ensureRootSuperAdmin(): Promise<void> {
  const teamMember = (prisma as any).teamMember;
  try {
    const existing: any = await withTimeout(
      teamMember.findFirst({
        where: { email: 'admin@nexora.io' },
      })
    );

    if (!existing) {
      const hashedPassword = await hashPassword('admin2026!');
      await withTimeout(
        teamMember.create({
          data: {
            email: 'admin@nexora.io',
            name: 'Super Administrator',
            roles: ['super_admin', 'admin', 'project_manager', 'marketing_manager', 'review_manager'],
            password: hashedPassword,
            role: 'Chief Technology Officer',
            avatarUrl:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            displayOrder: 0,
          },
        })
      );
      console.log('[Nexora] Seeded root Super Admin with bcrypt hash into TeamMember table.');
    } else if (existing.password && !isBcryptHash(existing.password)) {
      // Automatic upgrade of existing plaintext password to bcrypt hash
      const upgradedHash = await hashPassword(existing.password || 'admin2026!');
      await withTimeout(
        teamMember.update({
          where: { id: existing.id },
          data: { password: upgradedHash },
        })
      );
      console.log('[Nexora] Upgraded root Super Admin plaintext password to secure bcrypt hash.');
    }
  } catch (err: any) {
    console.error('[Nexora] ensureRootSuperAdmin error:', err.message);
  }
}

// Fetch all users (TeamMembers with an email set = portal users)
export async function getAllUsers(): Promise<User[]> {
  await ensureRootSuperAdmin();
  const teamMember = (prisma as any).teamMember;
  const records: any[] = (await withTimeout(
    teamMember.findMany({
      where: {
        email: { not: null },
      },
      orderBy: { displayOrder: 'asc' },
    })
  )) as any[];
  return records.map(formatUser);
}

// Create a new portal user (invoked by Super Admin)
export async function createUserRecord(data: any): Promise<User> {
  const teamMember = (prisma as any).teamMember;
  const email = String(data.email || '').trim().toLowerCase();
  const name = String(data.name || '').trim();
  const rawPassword = String(data.password || '').trim();
  const role = String(data.title || data.role || 'Team Member').trim();
  const avatarUrl = data.avatarUrl || data.avatar ? String(data.avatarUrl || data.avatar).trim() : null;
  const bio = data.bio ? String(data.bio).trim() : null;
  const linkedinUrl = data.linkedinUrl ? String(data.linkedinUrl).trim() : 'https://www.linkedin.com/';
  const displayOrder = typeof data.displayOrder === 'number' ? data.displayOrder : 99;

  if (!email) throw new Error('Email address is required.');
  if (!name) throw new Error('Full name is required.');
  if (!rawPassword) throw new Error('A secure password is required.');

  // Check duplicate email
  const existing = await withTimeout(
    teamMember.findFirst({ where: { email } })
  );
  if (existing) throw new Error(`A user with email ${email} already exists.`);

  let roles: string[] = [];
  if (Array.isArray(data.roles)) {
    roles = data.roles.map(String).map((r: string) => r.trim()).filter(Boolean);
  } else if (typeof data.roles === 'string') {
    roles = data.roles.split(',').map((r: string) => r.trim()).filter(Boolean);
  }
  if (roles.length === 0) roles = ['project_manager'];

  // Hash password before saving to Neon DB
  const hashedPassword = await hashPassword(rawPassword);

  const created = await withTimeout(
    teamMember.create({
      data: {
        email,
        name,
        password: hashedPassword,
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
  const teamMember = (prisma as any).teamMember;

  const existing: any = await withTimeout(
    teamMember.findUnique({ where: { id } })
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
    // Hash new password before saving
    updateData.password = await hashPassword(String(data.password).trim());
  }

  if (data.roles !== undefined) {
    let roles: string[] = [];
    if (Array.isArray(data.roles)) {
      roles = data.roles.map(String).map((r: string) => r.trim()).filter(Boolean);
    } else if (typeof data.roles === 'string') {
      roles = data.roles.split(',').map((r: string) => r.trim()).filter(Boolean);
    }

    // Guard: at least one super_admin must remain
    const existingRoles: string[] = Array.isArray(existing.roles) ? existing.roles : [];
    const hadAdmin = existingRoles.includes('super_admin') || existingRoles.includes('admin');
    const willHaveAdmin = roles.includes('super_admin') || roles.includes('admin');
    if (hadAdmin && !willHaveAdmin) {
      const admins: any[] = (await withTimeout(
        teamMember.findMany({
          where: { email: { not: null } },
        })
      )) as any[];
      const adminUsers = admins.filter(
        (u: any) => u.id !== id && (u.roles?.includes('super_admin') || u.roles?.includes('admin'))
      );
      if (adminUsers.length === 0) {
        throw new Error('Cannot remove administrative privileges from the sole Super Administrator.');
      }
    }

    updateData.roles = roles;
  }

  const updated = await withTimeout(
    teamMember.update({ where: { id }, data: updateData })
  );

  return formatUser(updated);
}

// Delete user (invoked by Super Admin)
export async function deleteUserRecord(id: string): Promise<{ success: boolean; message: string }> {
  if (!id) throw new Error('User ID is required.');
  const teamMember = (prisma as any).teamMember;

  const existing: any = await withTimeout(
    teamMember.findUnique({ where: { id } })
  );
  if (!existing) throw new Error(`User with ID ${id} not found.`);

  // Guard sole super admin
  const existingRoles: string[] = Array.isArray(existing.roles) ? existing.roles : [];
  if (existingRoles.includes('super_admin') || existingRoles.includes('admin')) {
    const allAdmins: any[] = (await withTimeout(
      teamMember.findMany({
        where: { email: { not: null } },
      })
    )) as any[];
    const otherAdmins = allAdmins.filter(
      (u: any) => u.id !== id && (u.roles?.includes('super_admin') || u.roles?.includes('admin'))
    );
    if (otherAdmins.length === 0) {
      throw new Error('Cannot delete the sole Super Administrator account.');
    }
  }

  await withTimeout(teamMember.delete({ where: { id } }));

  return { success: true, message: `User ${id} removed successfully.` };
}

// Authenticate against TeamMember table using secure constant-time bcrypt verification
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  await ensureRootSuperAdmin();
  const teamMember = (prisma as any).teamMember;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const trimmedPassword = String(password || '').trim();

  if (!normalizedEmail || !trimmedPassword) return null;

  // Find by email (case-insensitive)
  const member: any = await withTimeout(
    teamMember.findFirst({
      where: { email: normalizedEmail },
    })
  );

  if (!member) return null;

  const { valid, needsUpgrade } = await verifyPassword(trimmedPassword, member.password);
  if (!valid) return null;

  // Seamless auto-upgrade legacy plaintext passwords to salted bcrypt hash
  if (needsUpgrade) {
    try {
      const newHash = await hashPassword(trimmedPassword);
      await teamMember.update({
        where: { id: member.id },
        data: { password: newHash },
      });
      console.log(`[Nexora Auth] Auto-upgraded password for ${normalizedEmail} to bcrypt hash.`);
    } catch (err: any) {
      console.warn('[Nexora Auth] Auto-upgrade password warning:', err.message);
    }
  }

  return formatUser(member);
}
