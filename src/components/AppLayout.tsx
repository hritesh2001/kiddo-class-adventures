
import React from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen kiddo-bg-pattern flex flex-col">
      <AppHeader />
      <main className="flex-grow">{children}</main>
      <AppFooter />
    </div>
  );
};
