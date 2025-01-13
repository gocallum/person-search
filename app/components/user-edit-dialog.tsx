'use client';

import MutableDialog from '@/components/mutable-dialog';
import { updateUser } from '@/app/actions/actions';
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas';
import { UserForm } from './user-form';

interface UserEditDialogProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

export default function UserEditDialog({ user, onUserUpdate }: UserEditDialogProps) {
  const handleEditUser = async (data: UserFormData) => {
    const updatedUser = await updateUser(user.id, data);
    onUserUpdate(updatedUser); // Propagate the updated user back to the parent
    try {
      return {
        success: true,
        message: `User ${updatedUser.name} updated successfully.`,
        data: updatedUser,
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update user' + (error instanceof Error ? error.message : String(error)),
      }
    }
  }

  return (
    <MutableDialog<UserFormData>
      key={user.id} // Ensures dialog refreshes for each user
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleEditUser}
      triggerButtonLabel="Edit"
      editDialogTitle={`Edit ${user.name}`}
      dialogDescription={`Update the details of ${user.name} below.`}
      submitButtonLabel="Save Changes"
      defaultValues={{
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }}
    />
  )
}
