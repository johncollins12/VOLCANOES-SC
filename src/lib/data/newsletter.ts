import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';

export interface AdminSubscriberRow {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: Date;
}

export async function getAdminSubscribersList(params: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<PaginatedResult<AdminSubscriberRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = params.query ? { email: { contains: params.query, mode: 'insensitive' as const } } : {};

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take,
        select: { id: true, email: true, isActive: true, subscribedAt: true },
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return toPaginatedResult(subscribers, total, page, pageSize);
  } catch (error) {
    console.error('[getAdminSubscribersList] failed to load subscribers:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface SubscriberStats {
  total: number;
  active: number;
  unsubscribed: number;
}

export async function getSubscriberStats(): Promise<SubscriberStats> {
  try {
    const [total, active] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);
    return { total, active, unsubscribed: total - active };
  } catch (error) {
    console.error('[getSubscriberStats] failed to load subscriber stats:', error);
    return { total: 0, active: 0, unsubscribed: 0 };
  }
}

/** Every active subscriber's email, for CSV export — deliberately unpaginated since an export needs the full list, not one page of it. */
export async function getAllActiveSubscriberEmails(): Promise<string[]> {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true },
      orderBy: { subscribedAt: 'desc' },
    });
    return subscribers.map((s) => s.email);
  } catch (error) {
    console.error('[getAllActiveSubscriberEmails] failed to load emails:', error);
    return [];
  }
}
