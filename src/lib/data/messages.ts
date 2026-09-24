import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';

export interface AdminMessageRow {
  id: string;
  fullName: string;
  email: string;
  subject: string | null;
  isRead: boolean;
  createdAt: Date;
}

export async function getAdminMessagesList(params: {
  page?: number;
  pageSize?: number;
  query?: string;
  unreadOnly?: boolean;
}): Promise<PaginatedResult<AdminMessageRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = {
      ...(params.unreadOnly ? { isRead: false } : {}),
      ...(params.query
        ? {
            OR: [
              { fullName: { contains: params.query, mode: 'insensitive' as const } },
              { email: { contains: params.query, mode: 'insensitive' as const } },
              { subject: { contains: params.query, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: { id: true, fullName: true, email: true, subject: true, isRead: true, createdAt: true },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return toPaginatedResult(messages, total, page, pageSize);
  } catch (error) {
    console.error('[getAdminMessagesList] failed to load messages:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    return await prisma.contactMessage.count({ where: { isRead: false } });
  } catch (error) {
    console.error('[getUnreadMessageCount] failed to count messages:', error);
    return 0;
  }
}

export interface MessageDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export async function getMessageById(id: string): Promise<MessageDetail | null> {
  try {
    return await prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true, fullName: true, email: true, phone: true, subject: true, message: true, isRead: true, createdAt: true },
    });
  } catch (error) {
    console.error('[getMessageById] failed to load message:', error);
    return null;
  }
}
