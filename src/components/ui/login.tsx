'use client';

import { UserButton, SignInButton, SignUpButton, useUser } from '@clerk/nextjs';

export const UserNav = () => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex gap-2 justify-end mb-4">
        <SignInButton mode="modal">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</button>
        </SignUpButton>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4">
      <UserButton showName />
    </div>
  );
};
