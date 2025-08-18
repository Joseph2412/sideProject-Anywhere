"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SignUpForm } from "@repo/components";
export default function SignUpPage() {
  const router = useRouter();

  return <SignUpForm onGoToLogin={() => router.replace("/login")} />;
}
