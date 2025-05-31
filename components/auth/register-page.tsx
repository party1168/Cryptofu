"use client";

import type React from "react";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onRegister(
    name: string,
    email: string,
    password: string
  ): Promise<boolean> {
    console.log("註冊請求:", { name, email, password });
    setIsLoading(true);

    return axios
      .post("/api/auth/signup", {
        name,
        email,
        password,
      })
      .then((response) => {
        setIsLoading(false);
        console.log("註冊回應:", response.data);
        if (response.data.success) {
          return true;
        } else {
          throw new Error(response.data.message || "註冊失敗");
        }
      });
  }

  // 密碼驗證規則
  const passwordValidation = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isPasswordMatch =
    password === confirmPassword && confirmPassword !== "";
  const isFormValid = email && isPasswordValid && isPasswordMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    const isSuccess: boolean = await onRegister(name, email, password);
    try {
      if (isSuccess) {
        router.push("/login");
        toast.success("註冊成功！請登入您的帳戶。");
      }
    } catch (err) {
      toast.error("註冊失敗，請稍後再試。");
      setName("");
      setEmail("");
      setPassword("");
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#eeedf5] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-[#6c5ce7] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">F</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              Cryptofu
            </span>
          </div>
          <p className="text-gray-600">建立您的新帳戶</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                使用者姓名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="請輸入您的使用者姓名"
                  className="pl-9 sm:pl-10 bg-[#f5f4fa] text-gray-700 border-0 rounded-lg h-10 sm:h-12 text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                電子郵件
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入您的電子郵件"
                  className="pl-9 sm:pl-10 bg-[#f5f4fa] text-gray-700 border-0 rounded-lg h-10 sm:h-12 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                密碼
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入您的密碼"
                  className="pl-9 sm:pl-10 pr-9 sm:pr-10 text-gray-700 bg-[#f5f4fa] border-0 rounded-lg h-10 sm:h-12 text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.minLength ? (
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.minLength
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      至少 8 個字元
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.hasNumber ? (
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.hasNumber
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      包含至少一個數字
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.hasLetter ? (
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    <span
                      className={
                        passwordValidation.hasLetter
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      包含至少一個字母
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                確認密碼
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="請再次輸入您的密碼"
                  className="pl-9 sm:pl-10 pr-9 sm:pr-10 text-gray-700 bg-[#f5f4fa] border-0 rounded-lg h-10 sm:h-12 text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="flex items-center gap-2 text-xs mt-2">
                  {isPasswordMatch ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-green-600">密碼匹配</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                      <span className="text-red-600">密碼不匹配</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded border-gray-300 text-[#6c5ce7] focus:ring-[#6c5ce7] flex-shrink-0"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                我同意{" "}
                <button
                  type="button"
                  className="text-[#6c5ce7] hover:text-[#5d4ed6]"
                >
                  服務條款
                </button>{" "}
                和{" "}
                <button
                  type="button"
                  className="text-[#6c5ce7] hover:text-[#5d4ed6]"
                >
                  隱私政策
                </button>
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-[#6c5ce7] hover:bg-[#5d4ed6] h-10 sm:h-12 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? "註冊中..." : "建立帳戶"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-5 sm:mt-6 text-center">
            <span className="text-sm text-gray-600">已經有帳戶了？</span>
            <Link href={"/login"}>
              <button
                type="button"
                className="ml-1 text-sm text-[#6c5ce7] hover:text-[#5d4ed6] font-medium"
              >
                立即登入
              </button>
            </Link>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-5 sm:mt-6 text-center">
          <Link href={"/dashboard"}>
            <button className="text-sm text-gray-600 hover:text-gray-800">
              ← 返回儀表板
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
