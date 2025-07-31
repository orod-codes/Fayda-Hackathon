'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  loginRoute: string;
}

export default function ProtectedRoute({ children, allowedRoles, loginRoute }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(loginRoute);
        return;
      }

      // Detect fallback role based on path
      let role: UserRole | undefined = user?.role;
      if (!role && pathname) {
        if (pathname.startsWith('/patient')) role = 'patient';
        else if (pathname.startsWith('/doctor')) role = 'doctor';
        else if (pathname.startsWith('/hospital-admin')) role = 'hospital-admin';
        else if (pathname.startsWith('/super-admin')) role = 'super-admin';

        console.warn('User role is missing, inferring role from path:', role);
      }

      if (allowedRoles && role && !allowedRoles.includes(role)) {
        const roleRoutes: Record<UserRole, string> = {
          patient: '/patient/login',
          doctor: '/doctor/login',
          'hospital-admin': '/hospital-admin/login',
          'super-admin': '/super-admin/login',
        };

        const redirectRoute = roleRoutes[role];
        if (redirectRoute) {
          router.push(redirectRoute);
        } else {
          console.error('Unknown role. Redirecting to login.');
          router.push(loginRoute);
        }
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, loginRoute, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const effectiveRole =
    user?.role ||
    (pathname?.startsWith('/patient')
      ? 'patient'
      : pathname?.startsWith('/doctor')
      ? 'doctor'
      : pathname?.startsWith('/hospital-admin')
      ? 'hospital-admin'
      : pathname?.startsWith('/super-admin')
      ? 'super-admin'
      : undefined);

  if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
