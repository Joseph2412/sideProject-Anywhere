"use client"

import {React, useEffect} from "react";
import {messageToast} from "../../../store/LayoutStore"
import {useAtom} from "jotai"
import {notification} from "antd"

export function MessageProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [api, contextHolder] = notification.useNotification({
    duration: 3,
    stack: {
      threshold: 3,
    },
  });
  const [message, setMessage] = useAtom(messageToast);

  useEffect(() => {
    if(message){
      api.open({
        duration: 3,
        type: "success",
        message: "ciaoooone",
        description: "sono una descrizione",
        onClose: () => {
          setMessage(false);
        },
      });
    }
  }, [message])

  return (
    <>
      {children}
      {contextHolder}
    </>
  )
}

