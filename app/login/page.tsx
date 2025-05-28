import { LoginPage } from "@/components/auth/login-page";
import { RegisterPage } from "@/components/auth/register-page";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogIn() {
  return (
    <div>
      <LoginPage />
    </div>
  );
}
