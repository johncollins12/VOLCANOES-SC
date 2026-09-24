import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';
import type { RoleName } from '@/config/roles';

export interface RoleOption {
  id: string;
  name: RoleName;
}

export async function getRoles(): Promise<RoleOption[]> {
  try {
    const roles = await prisma.role.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
    return roles as RoleOption[];
  } catch (error) {
    console.error('[getRoles] failed to load roles:', error);
    return [];
  }
}

export interface AdminUserRow {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: string[];
}

export async function getAdminUsersList(params: { page?: number; pageSize?: number; query?: string }): Promise<PaginatedResult<AdminUserRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = params.query
      ? {
          OR: [
            { fullName: { contains: params.query, mode: 'insensitive' as const } },
            { email: { contains: params.query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { fullName: 'asc' },
        skip,
        take,
        select: { id: true, fullName: true, email: true, isActive: true, roles: { select: { role: { select: { name: true } } } } },
      }),
      prisma.user.count({ where }),
    ]);

    return toPaginatedResult(
      users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        isActive: u.isActive,
        roles: u.roles.map((r) => r.role.name),
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getAdminUsersList] failed to load users:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export async function getUserCount(): Promise<number> {
  try {
    return await prisma.user.count();
  } catch (error) {
    console.error('[getUserCount] failed to count users:', error);
    return 0;
  }
}

export interface UserEditData {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roleIds: string[];
}

export async function getUserById(id: string): Promise<UserEditData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, fullName: true, email: true, isActive: true, roles: { select: { roleId: true } } },
    });
    if (!user) return null;
    return { id: user.id, fullName: user.fullName, email: user.email, isActive: user.isActive, roleIds: user.roles.map((r) => r.roleId) };
  } catch (error) {
    console.error('[getUserById] failed to load user:', error);
    return null;
  }
}
