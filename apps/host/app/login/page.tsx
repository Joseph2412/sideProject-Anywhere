"use client";
import React from "react";
import LoginForm from "@repo/ui/loginform/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginForm
      onLoginSuccess={({ name }) => {
        router.push(`/dashboard?name=${encodeURIComponent(name)}`);
      }}
      onGoToSignup={() => router.replace("/signup")}
    />
  );
}
