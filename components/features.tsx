"use client";
import { motion } from "framer-motion";
import {
  Shield,
  Link,
  BarChart2Icon,
  Layers,
  CoinsIcon,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/contexts/languageProvider";
export default function Features() {
  const { t } = useLanguage();
  return (
    <section className="py-20" id="features">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("features.title")}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: t("features.items.0.title"),
              description: t("features.items.0.description"),
            },
            {
              icon: Link,
              title: t("features.items.1.title"),
              description: t("features.items.1.description"),
            },
            {
              icon: BarChart2Icon,
              title: t("features.items.2.title"),
              description: t("features.items.2.description"),
            },
            {
              icon: Layers,
              title: t("features.items.3.title"),
              description: t("features.items.3.description"),
            },
            {
              icon: CoinsIcon,
              title: t("features.items.4.title"),
              description: t("features.items.4.description"),
            },
            {
              icon: Settings,
              title: t("features.items.5.title"),
              description: t("features.items.5.description"),
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/20 p-6 rounded-lg shadow-lg border border-gray-700/30 hover:bg-gray-700/30 transition-colors duration-300 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-200">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
