import { baseApiUrl } from '@/config/envConfig';

export const dynamic = 'force-dynamic';

interface ApiResponse {
  data?: any;
  error?: string;
}

//change the return value of check ayth from boolean to data

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

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || 'An unexpected error occurred' };
    }

    return { data };
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred' };
  }
}

interface LoginResponse {
  message?: string;
  error?: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  if (!email || !password) {
    return { error: 'Email and password are required' };
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
    if (!response.ok) {
      if (response.status === 401) {
        return { error: 'Authentication failed. Check credentials.' };
      } else if (response.status === 500) {
        return { error: 'Server error. Please try again later.' };
      }
      return { error: data.error || 'Login failed due to server error' };
    }

    return data.success;
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred' };
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
    if (!response.ok) {
      throw new Error(data.error || 'Logout failed');
    }
    return data.success;
  } catch (e) {
    return false;
  }
}
