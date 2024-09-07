import { baseApiUrl } from '@/config/envConfig';

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

export async function loginUser(email: string, password: string): Promise<ApiResponse> {
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

    if (!response.ok) {
      return { error: 'An unexpected error occurred' };
    }
    //get cookie from response
    // const cookie = response.headers.get('set-cookie');
    const data = await response.json();
    return { data };
  } catch (e) {
    return { error: 'An unexpected error occurred' };
  }
}
