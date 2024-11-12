import { baseApiUrl } from '@/config/envConfig';

export const dynamic = 'force-dynamic';

interface ApiResponse {
  data?: any;
  error?: string;
}

export async function createUser(email: string, password: string): Promise<ApiResponse> {
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const endpoint = `${baseApiUrl}/auth/register`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { error: 'An unexpected error occurred' };
    }

    const data = await response.json();
    return { data };
  } catch (e) {
    return { error: 'An unexpected error occurred' };
  }
}

interface LoginResponse {
  message: string;
}
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const endpoint = `${baseApiUrl}/auth/login`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log('data ok', data);
    if (!data.success) {
      throw new Error(data.message);
    }
    return {
      message: data.data,
    };
  } catch (e: any) {
    throw new Error(e?.message || 'An unexpected error occurred');
  }
}

export async function checkAuthFn(): Promise<boolean> {
  const endpoint = `${baseApiUrl}/auth/current`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });
    const data = await response.json();

    return data.success;
  } catch (e) {
    return false;
  }
}

export async function logoutUser(): Promise<boolean> {
  const endpoint = `${baseApiUrl}/auth/logout`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data.success;
  } catch (e: any) {
    throw new Error(e?.message || 'Unexpected error occurred');
  }
}
