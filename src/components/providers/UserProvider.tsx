'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'; 
import { fetchCurrentUser, logoutUser } from '@/services/authServices';
import { UserData } from '@/interfaces/authInterface';
import { useRouter, usePathname } from 'next/navigation';

interface UserContextType {
  user: UserData | null;
  isLoadingUser: boolean;
  isLoggedIn: boolean;
  refetchUser: (options?: RefetchOptions) => Promise<QueryObserverResult<UserData, Error>>;
  logout: () => Promise<void>;
  setUser: (userData: UserData | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const queryClient = useQueryClient();
  const [user, setUserState] = useState<UserData | null>(null);
  const router = useRouter();
  const pathname = usePathname(); 
  const isPublicAuthRoute = pathname.startsWith('/emailConfirmation');

  const { data, isLoading, isError, refetch } = useQuery<UserData, Error>({ 
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !isPublicAuthRoute,
  });

  useEffect(() => {
    if (data) {
      setUserState(data);
    } else if (isError) {
      setUserState(null);
    }
  }, [data, isError]);

  const setUser = useCallback((userData: UserData | null) => {
    setUserState(userData);
    if (userData) {
      queryClient.setQueryData(['currentUser'], userData);
    } else {
      queryClient.removeQueries({ queryKey: ['currentUser'] });
    }
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setUser(null);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      queryClient.clear();
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [queryClient, setUser, router]);

  const value = React.useMemo(
    () => ({
      user,
      isLoadingUser: isLoading,
      isLoggedIn: !!user,
      refetchUser: refetch,
      logout,
      setUser,
    }),
    [user, isLoading, refetch, logout, setUser]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};