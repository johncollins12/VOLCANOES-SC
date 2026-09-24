import { prisma } from '@/lib/prisma';
import { resolvePagination, toPaginatedResult } from '@/lib/pagination';
import type { PaginatedResult } from '@/types';

export interface StaffCategoryOption {
  id: string;
  name: string;
}

export async function getStaffCategories(): Promise<StaffCategoryOption[]> {
  try {
    return await prisma.staffCategory.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } });
  } catch (error) {
    console.error('[getStaffCategories] failed to load categories:', error);
    return [];
  }
}

export interface StaffMemberSummary {
  id: string;
  fullName: string;
  role: string;
  photoUrl: string | null;
  categoryName: string;
  isActive: boolean;
}

/** Grouped by category then display order, for both the public Management/Technical Staff pages and the admin list. Includes inactive staff (admin-only concern — the public pages filter isActive themselves). */
export async function getAllStaffMembers(): Promise<StaffMemberSummary[]> {
  try {
    const staff = await prisma.staffMember.findMany({
      orderBy: [{ category: { name: 'asc' } }, { displayOrder: 'asc' }],
      select: {
        id: true,
        fullName: true,
        role: true,
        photoUrl: true,
        isActive: true,
        category: { select: { name: true } },
      },
    });
    return staff.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      role: s.role,
      photoUrl: s.photoUrl,
      categoryName: s.category.name,
      isActive: s.isActive,
    }));
  } catch (error) {
    console.error('[getAllStaffMembers] failed to load staff:', error);
    return [];
  }
}

export type AdminStaffRow = StaffMemberSummary;

/** Paginated, searchable staff list for /admin/staff. */
export async function getAdminStaffList(params: { page?: number; pageSize?: number; query?: string }): Promise<PaginatedResult<AdminStaffRow>> {
  const { page, pageSize, skip, take } = resolvePagination(params);

  try {
    const where = params.query ? { fullName: { contains: params.query, mode: 'insensitive' as const } } : {};

    const [staff, total] = await Promise.all([
      prisma.staffMember.findMany({
        where,
        orderBy: [{ category: { name: 'asc' } }, { displayOrder: 'asc' }],
        skip,
        take,
        select: {
          id: true,
          fullName: true,
          role: true,
          photoUrl: true,
          isActive: true,
          category: { select: { name: true } },
        },
      }),
      prisma.staffMember.count({ where }),
    ]);

    return toPaginatedResult(
      staff.map((s) => ({
        id: s.id,
        fullName: s.fullName,
        role: s.role,
        photoUrl: s.photoUrl,
        categoryName: s.category.name,
        isActive: s.isActive,
      })),
      total,
      page,
      pageSize
    );
  } catch (error) {
    console.error('[getAdminStaffList] failed to load staff:', error);
    return toPaginatedResult([], 0, page, pageSize);
  }
}

export interface StaffEditData {
  id: string;
  fullName: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  categoryId: string;
  displayOrder: number;
  isActive: boolean;
}

export async function getStaffMemberById(id: string): Promise<StaffEditData | null> {
  try {
    return await prisma.staffMember.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        role: true,
        bio: true,
        photoUrl: true,
        categoryId: true,
        displayOrder: true,
        isActive: true,
      },
    });
  } catch (error) {
    console.error('[getStaffMemberById] failed to load staff member:', error);
    return null;
  }
}
