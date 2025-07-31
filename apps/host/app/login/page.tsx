"use client";
import React from "react";
import LoginForm from "@repo/ui/loginform/LoginForm";
import { useRouter } from "next/navigation";
import { MessageProvider } from "../../../../packages/components/src/providers/Message.provider";

export default function LoginPage() {
  const router = useRouter();

  return (
    <>
      <MessageProvider>
        <LoginForm
          onLoginSuccess={({ name }) => {
            setTimeout(() => {
              router.push(`/private?name=${encodeURIComponent(name)}`);
            }, 300);
          }}
          onGoToSignup={() => router.replace("/signup")}
        />
      </MessageProvider>
    </>
  );
}
