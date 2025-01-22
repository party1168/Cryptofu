"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/languageProvider";
import { useState } from "react";
import validator from "validator";
import toast from "react-hot-toast";
import axios from "axios";
export default function Subscribe() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validator.isEmail(email)) {
      toast.error("錯誤的Email格式");
      return;
    }
    if (!email) {
      toast.error("Email是必填的");
      return;
    }
    try {
      toast.promise(await axios.post("/api/subscribe", { email }),{
        loading: "訂閱中...",
        success: "訂閱成功！",
        error: "訂閱失敗！",
      });
      setEmail("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(`訂閱失敗: ${err.response.data.message}`);
      } else {
        toast.error(`訂閱失敗: ${(err as Error).message}`);
      }
    }
  };
  return (
    <header className="pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
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
          onSubmit={handleSubmit}
          className="flex-cols sm:flex gap-10 sm:gap-5  justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Input
            type="email"
            placeholder={t("subscribe.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-screen-sm h-10 bg-gray-800/30 border-gray-700/50 text-gray-100 mb-5 sm:mb-0 placeholder-gray-400"
            required
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {t("subscribe.cta")} <ArrowRight className="ml-2" />
          </Button>
        </motion.form>
      </div>
    </header>
  );
}
