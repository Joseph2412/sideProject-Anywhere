"use client";

import { React, useEffect, useState } from "react";
import { messageToast, ToastPayload } from "../../../store/LayoutStore";
import { useAtom } from "jotai";
import { notification } from "antd";

export function MessageProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [toast, setToast] = useAtom<ToastPayload | false>(messageToast);

  const [isHydrated, setIsHydrated] = useState(false);

  const [api, contextHolder] = notification.useNotification({
    stack: {
      threshold: 3,
    },
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (toast && isHydrated) {
      api.open({
        type: toast.type || "info",
        message: toast.message,
        description: toast.description || "",
        duration: toast.duration ?? 3,
        placement: toast.placement || "bottomRight",
        onClose: () => {
          setToast(false);
        },
      });
    }
  }, [toast, isHydrated]);

  return (
    <>
      {children}
      {isHydrated && contextHolder}
    </>
  );
}
