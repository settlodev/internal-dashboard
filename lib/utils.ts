import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

// export const getBuildInfo = () => {
//   return {
//     buildId: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
//     buildNumber: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
//         ? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
//         : 'local',
//     environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'
//   };
// };