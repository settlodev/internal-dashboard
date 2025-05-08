// 'use client'
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { checkUserPermissions } from '@/lib/actions/auth/signIn';
// import Loading from '../widgets/loader';


// interface ProtectedComponentProps {
//   children: React.ReactNode;
//   requiredPermission?: string;
//   requiredPermissions?: string[];
//   fallback?: React.ReactNode;
//   loading?: React.ReactNode;
// }

// export const ProtectedComponent = ({
//   children,
//   requiredPermission,
//   requiredPermissions,
//   fallback = null,
//   loading = <div><Loading /></div>
// }: ProtectedComponentProps) => {
//   const [permissions, setPermissions] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const { permissions, error } = await checkUserPermissions();
//         console.log("Received permissions:", permissions);
        
//         if (error) {
//           console.error('Auth error:', error);
//           router.push('/sign-in');
//           return;
//         }

//         setPermissions(permissions || []);
//       } catch (error) {
//         console.error('Error checking permissions:', error);
//         router.push('/login');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, [router]);

//   if (isLoading) {
//     return loading;
//   }

//   console.log("Checking permissions:", {
//     requiredPermission,
//     requiredPermissions,
//     userPermissions: permissions
//   });

//   if (requiredPermission && !permissions.includes(requiredPermission)) {
//     console.log(`Missing required permission: ${requiredPermission}`);
//     return fallback;
//   }

//   if (requiredPermissions && !requiredPermissions.every(perm => permissions.includes(perm))) {
//     const missing = requiredPermissions.filter(perm => !permissions.includes(perm));
//     console.log(`Missing required permissions:`, missing);
//     return fallback;
//   }

//   return <>{children}</>;
// };

'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkUserPermissions } from '@/lib/actions/auth/signIn';
import Loading from '../widgets/loader';

interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean; // New prop to control permission logic
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

export const ProtectedComponent = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = true, // Default to requiring all permissions
  fallback = null,
  loading = <div><Loading /></div>
}: ProtectedComponentProps) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { permissions, error } = await checkUserPermissions();
        console.log("Received permissions:", permissions);
        
        if (error) {
          console.error('Auth error:', error);
          router.push('/sign-in');
          return;
        }

        setPermissions(permissions || []);
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

  console.log("Checking permissions:", {
    requiredPermission,
    requiredPermissions,
    requireAll,
    userPermissions: permissions
  });

  // Single permission check
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    console.log(`Missing required permission: ${requiredPermission}`);
    return fallback;
  }

  // Multiple permissions check with requireAll flag
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      // Check if user has ALL required permissions
      const hasAllPermissions = requiredPermissions.every(perm => permissions.includes(perm));
      if (!hasAllPermissions) {
        const missing = requiredPermissions.filter(perm => !permissions.includes(perm));
        console.log(`Missing required permissions:`, missing);
        return fallback;
      }
    } else {
      // Check if user has AT LEAST ONE of the required permissions
      const hasAtLeastOnePermission = requiredPermissions.some(perm => permissions.includes(perm));
      if (!hasAtLeastOnePermission) {
        console.log(`Need at least one of these permissions:`, requiredPermissions);
        return fallback;
      }
    }
  }

  return <>{children}</>;
};