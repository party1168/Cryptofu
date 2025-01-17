"use client";
import { useState } from "react";
import {
  ArrowRight,
  BarChart2,
  Lock,
  Zap,
  Coins,
  Globe,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { useLanguage } from "@/contexts/languageProvider";

export default function Page() {
  const [email, setEmail] = useState("");
  const { t } = useLanguage();
  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <header className="pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            {t("common.title")}
          </h1>
        </motion.div>
        <motion.p
          className="text-xl mb-8 text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {t("common.description")}
        </motion.p>
        <motion.form
          onSubmit={handlesubmit}
          className="flex justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Input
            type="email"
            placeholder="請輸入您的電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs bg-gray-800/30 border-gray-700/50 text-gray-100 placeholder-gray-400"
            required
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            訂閱更新 <ArrowRight className="ml-2" />
          </Button>
        </motion.form>
      </div>
    </header>
  );
}
