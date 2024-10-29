'use client';

import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useAuth } from '@/queryHooks/auth';

// Define a generic type for props if your component accepts props :)
type Props = {
  [key: string]: any; // Replace 'any' with a more specific type as needed
};

const withPublicAccess = (WrappedComponent: React.ComponentType<Props>): NextPage => {
  const ProtectedRoute: NextPage<Props> = (props: Props) => {
    const router = useRouter();
    const { checkAuthClient } = useAuth();
    const { data: session, isSuccess } = checkAuthClient;

    React.useEffect(() => {
      // Redirect to dashboard if already authenticated
      if (isSuccess && session) {
        router.replace('/dashboard/projects');
      }
    }, [session, isSuccess, router]);

    // Rendering wrapped component if not authenticated
    return !isSuccess || !session ? <WrappedComponent {...props} /> : null;
  };

  return ProtectedRoute;
};

export default withPublicAccess;
