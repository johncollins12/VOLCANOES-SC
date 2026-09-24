import { notFound } from 'next/navigation';
import { getRoles, getUserById } from '@/lib/data';
import { UserForm } from '../../UserForm';
import { updateUserRolesAction } from '@/actions/users.actions';

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const [roles, user] = await Promise.all([getRoles(), getUserById(id)]);

  if (!user) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Edit Staff Account</h1>
      <UserForm roles={roles} user={user} action={updateUserRolesAction.bind(null, id)} />
    </div>
  );
}
