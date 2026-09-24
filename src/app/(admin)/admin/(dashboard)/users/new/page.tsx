import { getRoles } from '@/lib/data';
import { UserForm } from '../UserForm';
import { createUserAction } from '@/actions/users.actions';

export default async function NewUserPage() {
  const roles = await getRoles();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">New Staff Account</h1>
      <UserForm roles={roles} action={createUserAction} />
    </div>
  );
}
