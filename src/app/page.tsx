"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MatchOfferPanel } from "@/components/MatchOfferPanel";
import { SearchJobsPanel } from "@/components/SearchJobsPanel";
import { SearchByCVPanel } from "@/components/SearchByCVPanel";
import { useBackground } from "@/components/BackgroundContext";
import { useLanguage } from "@/components/LanguageContext";
import { useTheme } from "@/components/ThemeContext";

type Workflow = "match" | "search" | "search_cv";

export default function Home() {
  const { setInteractive } = useBackground();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [cvCacheId, setCvCacheId] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    setInteractive(!cvCacheId);
  }, [cvCacheId, setInteractive]);

  useEffect(() => {
    const handleReset = () => {
      setCvCacheId(null);
      setActiveWorkflow(null);
      setResetKey((prev) => prev + 1);
      window.scrollTo(0, 0);
    };

    window.addEventListener("resetApp", handleReset);
    return () => window.removeEventListener("resetApp", handleReset);
  }, []);

  const handleTryDemo = () => {
    setCvCacheId("demo_mode_active");
    setActiveWorkflow("match");
  };

  const activeCvCacheId = cvCacheId ?? "demo_mode_active";

  return (
    <motion.div
      key={`main-container-${resetKey}`}
      initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center w-full min-h-[80vh] px-4"
    >
      <AnimatePresence mode="wait">
        {!cvCacheId ? (
          <motion.div
            key="demo-entry"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-2xl"
          >
            <div className="mb-8 relative">
              <div
                className={cn(
                  "absolute inset-0 bg-neon-purple rounded-full blur-[40px] theme-glow",
                  theme === "dark" ? "opacity-40 animate-pulse" : "opacity-0",
                )}
              />
              <div
                className="relative p-6 rounded-full border shadow-2xl backdrop-blur-md"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <Sparkles
                  className="w-12 h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </div>

            <div className="text-center mb-12">
              <h1
                className={cn(
                  "text-5xl md:text-6xl font-bold tracking-tight mb-4",
                  theme === "dark" && "glow-text-purple",
                )}
                style={{ color: "var(--text-primary)" }}
              >
                ApplyAI
              </h1>
              <p className="text-lg font-light tracking-wide" style={{ color: "var(--text-secondary)" }}>
                {t("heroSubtitle")}
              </p>
            </div>

            <button onClick={handleTryDemo} className="relative group cursor-pointer w-auto mt-2">
              <div
                className={cn(
                  "absolute -inset-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full blur-xl theme-glow will-change-transform group-hover:scale-105",
                  theme === "dark" ? "opacity-70 group-hover:opacity-100" : "opacity-0",
                )}
              />
              <div
                className="relative flex items-center gap-3 px-8 py-4 rounded-full border overflow-hidden"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <Sparkles className="w-6 h-6 text-neon-purple transition-transform duration-300 group-hover:-translate-y-1" />
                <span className="text-lg font-medium tracking-wide" style={{ color: "var(--text-primary)" }}>
                  {t("tryDemo")}
                </span>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="workflow-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            <div
              className="flex w-full mb-8 relative border rounded-2xl overflow-hidden p-1 shadow-2xl"
              style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
            >
              <div
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(33.333%-4px)] rounded-xl transition-all duration-300 pointer-events-none",
                  activeWorkflow === "search_cv"
                    ? "left-[calc(66.666%+2px)]"
                    : activeWorkflow === "search"
                      ? "left-[calc(33.333%+2px)]"
                      : "left-1",
                )}
                style={{ backgroundColor: "var(--surface)" }}
              />

              <button
                onClick={() => setActiveWorkflow("match")}
                className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 gap-2 transition-colors rounded-xl"
                style={{ color: activeWorkflow === "match" ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                <Target className="w-6 h-6 mb-2" />
                <span className="font-bold text-base sm:text-lg text-center leading-tight">{t("workflowMatchTitle")}</span>
                <span className="text-[10px] sm:text-xs text-center px-1 sm:px-4 hidden sm:block">{t("workflowMatchDesc")}</span>
              </button>

              <button
                onClick={() => setActiveWorkflow("search")}
                className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 gap-2 transition-colors rounded-xl border-l border-r"
                style={{
                  color: activeWorkflow === "search" ? "var(--text-primary)" : "var(--text-muted)",
                  borderLeftColor: "var(--border-muted)",
                  borderRightColor: "var(--border-muted)",
                }}
              >
                <Search className="w-6 h-6 mb-2" />
                <span className="font-bold text-base sm:text-lg text-center leading-tight">{t("workflowSearchTitle")}</span>
                <span className="text-[10px] sm:text-xs text-center px-1 sm:px-4 hidden sm:block">{t("workflowSearchDesc")}</span>
              </button>

              <button
                onClick={() => setActiveWorkflow("search_cv")}
                className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 gap-2 transition-colors rounded-xl"
                style={{ color: activeWorkflow === "search_cv" ? "var(--text-primary)" : "var(--text-muted)" }}
              >
                <Sparkles className="w-6 h-6 mb-2" />
                <span className="font-bold text-base sm:text-lg text-center leading-tight">{t("workflowSearchCVTitle")}</span>
                <span className="text-[10px] sm:text-xs text-center px-1 sm:px-4 hidden sm:block">{t("workflowSearchCVDesc")}</span>
              </button>
            </div>

            {activeWorkflow === "match" ? (
              <MatchOfferPanel cvCacheId={activeCvCacheId} />
            ) : activeWorkflow === "search" ? (
              <SearchJobsPanel cvCacheId={activeCvCacheId} />
            ) : activeWorkflow === "search_cv" ? (
              <SearchByCVPanel cvCacheId={activeCvCacheId} />
            ) : (
              <div className="text-center mt-12 animate-pulse font-medium" style={{ color: "var(--text-muted)" }}>
                {t("selectWorkflow")}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
