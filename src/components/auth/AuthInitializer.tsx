'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/auth';
import { refreshToken } from '@/services/auth/api';
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from 'next/navigation';
import { setAuthToken } from '@/services/api';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, refreshToken: rt, setTokens, logout } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken);
      const decoded = jwtDecode<{ exp: number; roleId: number }>(accessToken);
      if (decoded.exp * 1000 < Date.now()) {
        if (rt) {
          refreshToken(rt)
            .then(({ accessToken, refreshToken }) => {
              setTokens(accessToken, refreshToken);
              const newDecoded = jwtDecode<{ roleId: number }>(accessToken);
              if (newDecoded.roleId === 1 && !pathname.startsWith('/admin')) {
                router.push("/admin");
              } else if (newDecoded.roleId !== 1 && pathname.startsWith('/admin')) {
                router.push("/");
              }
            })
            .catch(() => {
              logout();
              if (pathname !== '/') {
                router.push("/");
              }
            });
        } else {
          logout();
          if (pathname !== '/') {
            router.push("/");
          }
        }
      } else {
        if (decoded.roleId === 1 && !pathname.startsWith('/admin')) {
          router.push("/admin");
        } else if (decoded.roleId !== 1 && pathname.startsWith('/admin')) {
          router.push("/");
        }
      }
    } else {
      if (pathname.startsWith('/admin')) {
        router.push("/");
      }
    }
  }, [accessToken, rt, setTokens, logout, pathname, router]);

  return <>{children}</>;
};

export default AuthInitializer;
