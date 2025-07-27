"use client";
import React from "react";
import LoginForm from "@repo/ui/loginform/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginForm
      onLoginSuccess={({ name }) => {
        setTimeout(() => {
          router.push(`/dashboard?name=${encodeURIComponent(name)}`);
        }, 300);
      }}
      onGoToSignup={() => router.replace("/signup")}
    />
  );
}
