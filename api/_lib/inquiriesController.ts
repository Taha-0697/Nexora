import { prisma } from './prisma.js';

export interface FormattedInquiry {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  roleTitle?: string | null;
  serviceType: string;
  serviceInterest?: string | null;
  budget: string;
  budgetRange?: string | null;
  timeline: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost' | 'closed';
  notes?: string | null;
  customStack: string[];
  createdAt: string;
  updatedAt?: string;
}

export function formatInquiry(inq: any): FormattedInquiry {
  const customStack = Array.isArray(inq.customStack)
    ? inq.customStack
    : typeof inq.customStack === 'string'
    ? inq.customStack.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];

  const fullName = inq.fullName || inq.name || 'Anonymous Prospect';
  const service = inq.serviceInterest || inq.serviceType || 'Custom Enterprise Software';
  const budget = inq.budgetRange || inq.budget || '$10k - $25k';
  const timeline = inq.timeline || 'Immediate';

  return {
    id: inq.id,
    name: fullName,
    fullName,
    email: inq.email || '',
    phone: inq.phone || '',
    company: inq.company || 'Enterprise Partner',
    roleTitle: inq.roleTitle || null,
    serviceType: service,
    serviceInterest: service,
    budget,
    budgetRange: budget,
    timeline,
    message: inq.message || '',
    source: inq.source || 'website',
    status: (inq.status || 'new') as any,
    notes: inq.notes || null,
    customStack,
    createdAt: inq.createdAt ? new Date(inq.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: inq.updatedAt ? new Date(inq.updatedAt).toISOString() : undefined,
  };
}

export async function getAllInquiries(): Promise<FormattedInquiry[]> {
  try {
    const list = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map(formatInquiry);
  } catch (err: any) {
    console.error('Error fetching inquiries from Neon DB:', err);
    throw err;
  }
}

export async function createInquiryRecord(data: any): Promise<FormattedInquiry> {
  const fullName = String(data.fullName || data.name || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const message = String(data.message || '').trim();

  if (!fullName) throw new Error('Prospect name is required.');
  if (!email) throw new Error('Contact email address is required.');
  if (!message) throw new Error('Project inquiry message is required.');

  let customStack: string[] = [];
  if (Array.isArray(data.customStack)) {
    customStack = data.customStack.map(String).map((s: string) => s.trim()).filter(Boolean);
  } else if (typeof data.customStack === 'string') {
    customStack = data.customStack.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  const created = await prisma.inquiry.create({
    data: {
      fullName,
      email,
      phone: data.phone ? String(data.phone).trim() : null,
      company: data.company ? String(data.company).trim() : 'Enterprise Partner',
      roleTitle: data.roleTitle ? String(data.roleTitle).trim() : null,
      serviceInterest: data.serviceInterest || data.serviceType || 'Custom Enterprise Software',
      budgetRange: data.budgetRange || data.budget || '$10k - $25k',
      timeline: data.timeline ? String(data.timeline).trim() : 'Immediate',
      message,
      source: data.source ? String(data.source).trim() : 'website',
      status: (data.status || 'new').toLowerCase(),
      notes: data.notes ? String(data.notes).trim() : null,
      customStack,
    },
  });

  return formatInquiry(created);
}

export async function updateInquiryStatus(id: string, status: string, notes?: string): Promise<FormattedInquiry> {
  if (!id) throw new Error('Inquiry ID is required.');
  const updateData: any = {
    status: status.toLowerCase(),
  };
  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const updated = await prisma.inquiry.update({
    where: { id },
    data: updateData,
  });

  return formatInquiry(updated);
}

export async function deleteInquiryRecord(id: string): Promise<{ success: boolean; deletedId: string }> {
  if (!id) throw new Error('Inquiry ID is required.');
  const deleted = await prisma.inquiry.delete({
    where: { id },
  });
  return { success: true, deletedId: deleted.id };
}
