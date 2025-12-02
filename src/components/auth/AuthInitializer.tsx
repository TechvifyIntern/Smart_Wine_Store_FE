"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/auth";
import { refreshToken } from "@/services/auth/api";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { setAuthToken } from "@/services/api";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    accessToken,
    refreshToken: rt,
    setTokens,
    logout,
    _hasHydrated,
  } = useAppStore();

  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (!_hasHydrated) return;

    // Nếu thiếu token → chỉ cấm admin route
    const handleNoToken = () => {
      console.log("No token");
      if (isAdminRoute) router.push("/unauthorized");
    };

    // Check sai quyền
    const redirectUnauthorized = () => {
      console.log("No permisstion to access");
      router.push("/unauthorized");
    };

    const validateRole = (roleId: number) => {
      if (isAdminRoute && ![1, 2].includes(roleId)) {
        redirectUnauthorized();
      }
    };

    const checkAccess = async () => {
      // ===== Không có token =====
      if (!accessToken) {
        handleNoToken();
        return;
      }

      setAuthToken(accessToken);

      try {
        const decoded = jwtDecode<{ exp: number; roleId: number }>(accessToken);

        // ===== Token hết hạn =====
        if (decoded.exp * 1000 < Date.now()) {
          if (!rt) {
            logout();
            handleNoToken();
            return;
          }

          try {
            const { accessToken: newAT, refreshToken: newRT } =
              await refreshToken(rt);

            setTokens(newAT, newRT);

            const newDecoded = jwtDecode<{ roleId: number }>(newAT);
            validateRole(newDecoded.roleId);
            return;
          } catch {
            logout();
            handleNoToken();
            return;
          }
        }

        // ===== Token còn hạn → check role =====
        validateRole(decoded.roleId);
      } catch (err) {
        console.error("Decode token error:", err);
        logout();
        handleNoToken();
      }
    };

    checkAccess();
  }, [_hasHydrated, pathname, accessToken, rt]);

  return <>{children}</>;
};

export default AuthInitializer;
