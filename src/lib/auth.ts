import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  id: string;
  username: string;
  role: 'user' | 'admin';
  origIat?: number;
}


const JWT_SECRET = 'my-super-secret-jwt-key';

export const verifyToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    throw new Error('Invalid token');
  }
};

export const requireAuth = async (allowedRoles: UserPayload['role'][]) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('access')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const user = jwt.decode(token) as UserPayload;
    console.log('User:', user);

    if (!allowedRoles.includes(user.role)) {
      console.log('User role not allowed:', user.role);
      redirect('/user');
    }

    return user;
  } catch {
    console.log('Token verification failed');
    redirect('/login');
  }
};
