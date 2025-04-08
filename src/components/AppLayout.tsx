
import React from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { motion } from "framer-motion";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <motion.div 
      className="min-h-screen kiddo-bg-pattern flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AppHeader />
      <main className="flex-grow">{children}</main>
      <AppFooter />
    </motion.div>
  );
};
