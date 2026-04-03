"use client";

import { useUser } from "@clerk/nextjs";

export const useAuthUser = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  
  return {
    user,
    isLoaded,
    isSignedIn,
  };
};