"use client";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { authUserAtom } from "@repo/ui/store/LayoutStore";
import { useLogout } from "../../hooks/useLogout";

type Props = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const setUser = useSetAtom(authUserAtom);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const logout = useLogout();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:3001/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, setUser, logout]);

  if (loading) return <div>Caricamento profilo...</div>;

  return <>{children}</>;
};
