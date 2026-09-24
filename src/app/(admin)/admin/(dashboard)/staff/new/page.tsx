import { getStaffCategories } from '@/lib/data';
import { StaffForm } from '../StaffForm';
import { createStaffMemberAction } from '@/actions/staff.actions';

export default async function NewStaffPage() {
  const categories = await getStaffCategories();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">New Staff Member</h1>
      <StaffForm categories={categories} action={createStaffMemberAction} />
    </div>
  );
}
