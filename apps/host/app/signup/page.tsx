"use client";
import React from "react";
import { useRouter } from "next/navigation";
import SignUpForm from "@repo/ui/components/signupform/SignUpForm";
export default function SignUpPage() {
  const router = useRouter();

  return <SignUpForm onGoToLogin={() => router.replace("/login")} />;
}
