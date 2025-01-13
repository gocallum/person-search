'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { SearchCommand } from '@/components/search-command';
import UserCard from './user-card';
import { searchUsers, getUserById } from '@/app/actions/actions';
import { User } from '@/app/actions/schemas';

export default function UserSearch({ searchParams }: { searchParams: { userId?: string } }) {
  const { userId } = searchParams || {};
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    if (userId) {
      getUserById(userId).then(setUserDetails);
    }
  }, [userId]);

  const handleUserUpdate = (updatedUser: User) => {
    setUserDetails(updatedUser);
  };

  return (
    <div className="space-y-6">
      <SearchCommand<User>
        onSearch={async (inputValue: string): Promise<User[]> => searchUsers(inputValue)}
        onItemSelect={async (user: User) => {
          if (user.id) {
            setUserDetails(await getUserById(user.id));
          } else {
            throw new Error('Invalid user ID');
          }
        }}
        getItemId={(user) => user.id}
        getItemLabel={(user) => user.name}
        placeholder="Search for a user..."
        noResultsText="No users found."
      />
      {userDetails && (
        <Suspense fallback={<p>Loading user...</p>}>
          <UserCard
            key={userDetails.id}
            user={userDetails}
            onUserUpdate={handleUserUpdate}
          />
        </Suspense>
      )}
    </div>
  );
}
