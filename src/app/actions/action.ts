'use server';

// import { cookies } from 'next/headers';
import { checkAuthFn } from '@/apiRequests/AuthRequests';

export async function checkAuthServer(): Promise<boolean> {
  // const _cookie = cookies();
  return await checkAuthFn();
}
