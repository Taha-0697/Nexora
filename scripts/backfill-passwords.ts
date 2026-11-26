import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

function isBcryptHash(str?: string | null): boolean {
  if (!str) return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str);
}

async function run() {
  console.log('--- Starting Neon DB Password Hashing Migration ---');
  try {
    const teamMembers = await prisma.teamMember.findMany();
    console.log(`Found ${teamMembers.length} team member records in Neon DB.`);

    let updatedCount = 0;
    for (const member of teamMembers) {
      if (member.password && !isBcryptHash(member.password)) {
        console.log(`Hashing legacy plaintext password for: ${member.email || member.name}`);
        const hashedPassword = await bcrypt.hash(member.password, 10);
        await prisma.teamMember.update({
          where: { id: member.id },
          data: { password: hashedPassword },
        });
        updatedCount++;
      } else if (member.password) {
        console.log(`Password already hashed for: ${member.email || member.name}`);
      } else if (member.email === 'admin@nexora.io') {
        console.log(`Setting default hashed password for root admin.`);
        const hashedPassword = await bcrypt.hash('admin2026!', 10);
        await prisma.teamMember.update({
          where: { id: member.id },
          data: { password: hashedPassword },
        });
        updatedCount++;
      }
    }

    console.log(`--- Migration Complete: ${updatedCount} passwords secured with bcrypt ---`);
  } catch (err: any) {
    console.error('Password backfill migration error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
