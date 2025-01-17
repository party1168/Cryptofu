"use client";
import Features from "@/components/features";
import Subscribe from "@/components/subscribe";
import BackgroundEffects from "@/components/background-effects";

export default function Page() {


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      <BackgroundEffects />
      <Subscribe />
      <Features />
    </div>
  );
}
