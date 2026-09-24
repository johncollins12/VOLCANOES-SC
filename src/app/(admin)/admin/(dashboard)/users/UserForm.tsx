'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input, Checkbox } from '@/components/forms';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';
import type { UserEditData, RoleOption } from '@/lib/data/users';

interface UserFormProps {
  roles: RoleOption[];
  user?: UserEditData;
  action: (prevState: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
}

/**
 * Email is only editable at creation — an invite is sent to that address
 * (see createUserAction's comment) and Supabase Auth treats email changes
 * as a separate, re-verification-requiring flow this phase doesn't cover;
 * the edit form shows it read-only instead of silently no-op-ing it.
 */
export function UserForm({ roles, user, action }: UserFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <Input id="fullName" name="fullName" label="Full Name" required defaultValue={user?.fullName} error={fieldErrors?.fullName?.[0]} />

      {user ? (
        <div>
          <p className="text-sm font-medium text-ink">Email</p>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
      ) : (
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          hint="An invite email will be sent to this address to set a password."
          required
          error={fieldErrors?.email?.[0]}
        />
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Roles</legend>
        <div className="flex flex-col gap-2">
          {roles.map((role) => (
            <Checkbox
              key={role.id}
              id={`role-${role.id}`}
              name="roleIds"
              value={role.id}
              label={role.name}
              defaultChecked={user?.roleIds.includes(role.id) ?? false}
            />
          ))}
        </div>
        {fieldErrors?.roleIds?.[0] && <p className="mt-1 text-sm text-danger">{fieldErrors.roleIds[0]}</p>}
      </fieldset>

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton isEdit={!!user} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      {isEdit ? 'Save Changes' : 'Send Invite'}
    </Button>
  );
}
