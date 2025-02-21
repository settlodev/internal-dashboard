'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkUserPermissions } from '@/lib/actions/auth/signIn';
import Loading from '../widgets/loader';


interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

export const ProtectedComponent = ({
  children,
  requiredPermission,
  requiredPermissions,
  fallback = null,
  loading = <div>
    <Loading />
  </div>
}: ProtectedComponentProps) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { permissions, error } = await checkUserPermissions();
        console.log("The permissions", permissions)
        
        if (error) {
          console.error('Auth error:', error);
          router.push('/sign-in');
          return;
        }

        setPermissions(permissions);
      } catch (error) {
        console.error('Error checking permissions:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return loading;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return fallback;
  }

  if (requiredPermissions && !requiredPermissions.every(perm => permissions.includes(perm))) {
    return fallback;
  }

  return <>{children}</>;
};