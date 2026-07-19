"use client";

import { MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";

const routeTransition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function MotionShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={routeTransition}>
      <motion.div
        className="route-motion-shell"
        initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={routeTransition}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
