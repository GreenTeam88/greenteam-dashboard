'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { checkAuthFn, createUser, loginUser, logoutUser } from '@/apiRequests/AuthRequests';

export function useAuth() {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => createUser(email, password),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      router.push('/login');
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.replace('/dashboard/projects');
    },
  });

  const checkAuthQuery = useQuery({
    queryKey: ['checkAuth'],
    staleTime: 0,
    queryFn: checkAuthFn,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Logged out successfully');
      router.push('/auth/login');
    },
  });

  return {
    register: registerMutation,
    login: loginMutation,
    checkAuthClient: checkAuthQuery,
    logout: logoutMutation,
  };
}
