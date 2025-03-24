"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/languageProvider";
function Navbar() {
  const { t } = useLanguage();
  return (
    <nav className="absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-3xl text-gray-100">
              {t("common.title")}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
