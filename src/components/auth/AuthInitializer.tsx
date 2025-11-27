'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/auth';
import { refreshToken } from '@/services/auth/api';
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from 'next/navigation';
import { setAuthToken } from '@/services/api';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, refreshToken: rt, setTokens, logout } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Chỉ chạy logic auth check khi mount hoặc khi accessToken thay đổi
    // Không chạy lại mỗi khi pathname thay đổi
    if (isInitialized.current && pathname) {
      // Chỉ check nếu user cố truy cập admin mà không có quyền
      if (!accessToken && pathname.startsWith('/admin')) {
        router.push("/");
      } else if (accessToken) {
        const decoded = jwtDecode<{ roleId: number }>(accessToken);
        if (decoded.roleId !== 1 && decoded.roleId !== 2 && pathname.startsWith('/admin')) {
          router.push("/");
        }
      }
      return;
    }

    if (accessToken) {
      setAuthToken(accessToken);
      const decoded = jwtDecode<{ exp: number; roleId: number }>(accessToken);
      if (decoded.exp * 1000 < Date.now()) {
        if (rt) {
          refreshToken(rt)
            .then(({ accessToken, refreshToken }) => {
              setTokens(accessToken, refreshToken);
              const newDecoded = jwtDecode<{ roleId: number }>(accessToken);
              // Chỉ redirect user thường ra khỏi admin page
              if (newDecoded.roleId !== 1 && newDecoded.roleId !== 2 && pathname.startsWith('/admin')) {
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
        // Chỉ redirect user thường ra khỏi admin page
        if (decoded.roleId !== 1 && decoded.roleId !== 2 && pathname.startsWith('/admin')) {
          router.push("/");
        }
      }
    } else {
      if (pathname.startsWith('/admin')) {
        router.push("/");
      }
    }

    isInitialized.current = true;
  }, [accessToken, rt, pathname]);

  return <>{children}</>;
};

export default AuthInitializer;
