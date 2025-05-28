"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const onGoToRegister = () => {
    router.push("/register");
  };
  const onBackToDashboard = () => {
    router.push("/dashboard");
  };

  function onLogin(email: string, password: string): void {}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 模擬登入延遲
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#eeedf5] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-[#6c5ce7] w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">C</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">Cryptofu</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600">歡迎回來，請登入您的帳戶</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                  className="pl-9 sm:pl-10 bg-[#f5f4fa] border-0 rounded-lg h-10 sm:h-12 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                  className="pl-9 sm:pl-10 pr-9 sm:pr-10 bg-[#f5f4fa] border-0 rounded-lg h-10 sm:h-12 text-sm sm:text-base"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-[#6c5ce7] focus:ring-[#6c5ce7]" />
                <span className="ml-2 text-sm text-gray-600">記住我</span>
              </label>
              <button type="button" className="text-sm text-[#6c5ce7] hover:text-[#5d4ed6] text-left sm:text-right">
                忘記密碼？
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6c5ce7] hover:bg-[#5d4ed6] h-10 sm:h-12 rounded-lg font-medium text-sm sm:text-base"
            >
              {isLoading ? "登入中..." : "登入"}
            </Button>
          </form>
          {/* Sign Up Link */}
          <div className="mt-5 sm:mt-6 text-center">
            <span className="text-sm text-gray-600">還沒有帳戶？</span>
            <button
              type="button"
              onClick={onGoToRegister}
              className="ml-1 text-sm text-[#6c5ce7] hover:text-[#5d4ed6] font-medium"
            >
              立即註冊
            </button>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-5 sm:mt-6 text-center">
          <button onClick={onBackToDashboard} className="text-sm text-gray-600 hover:text-gray-800">
            ← 返回儀表板
          </button>
        </div>
      </div>
    </div>
  )
}
