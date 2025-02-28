// components/edit-button.tsx
'use client';

import { User } from '@/app/actions/schemas';
import { UserEditDialog } from './user-edit-dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EditButtonProps {
  user: User;
}

export default function EditButton({ user }: EditButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit</Button>
      {open && <UserEditDialog user={user} />}
    </>
  );
}