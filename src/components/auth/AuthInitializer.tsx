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
    const { accessToken, refreshToken: rt, setTokens, logout, _hasHydrated } = useAppStore.getState();

    // Đợi store hydrate xong từ localStorage trước khi check auth
    if (!_hasHydrated) {
      return;
    }

    const isAdminRoute = pathname.startsWith("/admin");

    // Chỉ chạy logic auth check khi mount hoặc khi accessToken thay đổi
    // Không chạy lại mỗi khi pathname thay đổi
    if (isInitialized.current && pathname) {
      // Chỉ check và redirect nếu user cố truy cập admin mà không có quyền
      if (!accessToken && isAdminRoute) {
        router.push("/");
      } else if (accessToken && isAdminRoute) {
        try {
          const decoded = jwtDecode<{ roleId: number }>(accessToken);
          if (decoded.roleId !== 1 && decoded.roleId !== 2) {
            router.push("/");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      return;
    }

    if (accessToken) {
      setAuthToken(accessToken);
      try {
        const decoded = jwtDecode<{ exp: number; roleId: number }>(accessToken);
        if (decoded.exp * 1000 < Date.now()) {
          // Token hết hạn, thử refresh
          if (rt) {
            refreshToken(rt)
              .then(({ accessToken, refreshToken }) => {
                useAppStore.getState().setTokens(accessToken, refreshToken);
                const newDecoded = jwtDecode<{ roleId: number }>(accessToken);
                // Chỉ redirect nếu đang ở admin page mà không có quyền
                if (
                  isAdminRoute &&
                  newDecoded.roleId !== 1 &&
                  newDecoded.roleId !== 2
                ) {
                  router.push("/");
                }
              })
              .catch(() => {
                useAppStore.getState().logout();
                // Chỉ redirect về home nếu đang ở admin page
                if (isAdminRoute) {
                  router.push("/");
                }
              });
          } else {
            logout();
            // Chỉ redirect về home nếu đang ở admin page
            if (isAdminRoute) {
              router.push("/");
            }
          }
        } else {
          // Token còn hạn, chỉ check quyền truy cập admin
          if (
            isAdminRoute &&
            decoded.roleId !== 1 &&
            decoded.roleId !== 2
          ) {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
        if (isAdminRoute) {
          router.push("/");
        }
      }
    } else {
      // Không có token, chỉ redirect nếu cố truy cập admin
      if (isAdminRoute) {
        router.push("/");
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
