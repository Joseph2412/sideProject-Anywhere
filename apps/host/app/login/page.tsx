"use client";
import React from "react";
import LoginForm from "@repo/ui/components/loginform/LoginForm";
import { useRouter } from "next/navigation";
import { MessageProvider } from "../../../../packages/components/src/providers/Message.provider";

export default function LoginPage() {
  const router = useRouter();

  return (
    <>
      <MessageProvider>
        <LoginForm
          onLoginSuccess={() => {
            setTimeout(() => {
              router.push("/homepage");
            }, 300);
          }}
          onGoToSignup={() => router.replace("/signup")}
        />
      </MessageProvider>
    </>
  );
}
