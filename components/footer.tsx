"use client";
import { useLanguage } from "@/contexts/languageProvider";
export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-900/50 py-8 mt-auto backdrop-blur-sm">
      <div className="container mx-auto text-center">
        <p>{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
