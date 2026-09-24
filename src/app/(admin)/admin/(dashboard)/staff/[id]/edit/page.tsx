import { notFound } from 'next/navigation';
import { getStaffCategories, getStaffMemberById } from '@/lib/data';
import { StaffForm } from '../../StaffForm';
import { updateStaffMemberAction } from '@/actions/staff.actions';

interface EditStaffPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { id } = await params;
  const [categories, staff] = await Promise.all([getStaffCategories(), getStaffMemberById(id)]);

  if (!staff) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Edit Staff Member</h1>
      <StaffForm categories={categories} staff={staff} action={updateStaffMemberAction.bind(null, id)} />
    </div>
  );
}
