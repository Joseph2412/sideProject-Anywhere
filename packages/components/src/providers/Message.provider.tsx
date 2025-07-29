"use client";

import { React, useEffect } from "react";
import { messageToast, ToastPayload } from "../../../store/LayoutStore";
import { useAtom } from "jotai";
import { notification } from "antd";

export function MessageProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [api, contextHolder] = notification.useNotification({
    duration: 3,
    stack: {
      threshold: 3,
    },
  });
  const [toast, setToast] = useAtom<ToastPayload | false>(messageToast);

  useEffect(() => {
    if (toast) {
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
  }, [toast]);

  return (
    <>
      {children}
      {contextHolder}
    </>
  );
}
