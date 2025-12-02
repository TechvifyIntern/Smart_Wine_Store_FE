"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/auth";
import { refreshToken } from "@/services/auth/api";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { setAuthToken } from "@/services/api";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current && pathname) {
      // Chỉ check nếu user cố truy cập admin mà không có quyền
      if (!accessToken && pathname.startsWith("/admin")) {
        router.push("/unauthorized");
      } else if (accessToken) {
        const decoded = jwtDecode<{ roleId: number }>(accessToken);
        if (
          decoded.roleId !== 1 &&
          decoded.roleId !== 2 &&
          pathname.startsWith("/admin")
        ) {
          router.push("/unauthorized");
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
              if (
                newDecoded.roleId !== 1 &&
                newDecoded.roleId !== 2 &&
                pathname.startsWith("/admin")
              ) {
                router.push("/unauthorized");
              }
            })
            .catch(() => {
              logout();
              if (pathname !== "/") {
                router.push("/unauthorized");
              }
            });
        } else {
          logout();
          if (pathname !== "/") {
            router.push("/unauthorized");
          }
        }
      } else {
        // Chỉ redirect user thường ra khỏi admin page
        if (
          decoded.roleId !== 1 &&
          decoded.roleId !== 2 &&
          pathname.startsWith("/admin")
        ) {
          router.push("/unauthorized");
        }
      }
    } else {
      if (pathname.startsWith("/admin")) {
        router.push("/unauthorized");
      }
    }

    isInitialized.current = true;

    // Subscribe to store changes
    const unsubscribe = useAppStore.subscribe((state) => {
      // Re-run logic when accessToken or _hasHydrated changes
      if (isInitialized.current) {
        const isAdminRoute = pathname.startsWith("/admin");
        if (!state.accessToken && isAdminRoute) {
          router.push("/");
        } else if (state.accessToken && isAdminRoute) {
          try {
            const decoded = jwtDecode<{ roleId: number }>(state.accessToken);
            if (decoded.roleId !== 1 && decoded.roleId !== 2) {
              router.push("/");
            }
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return <>{children}</>;
};

export default AuthInitializer;
