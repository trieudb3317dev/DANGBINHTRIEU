"use client";

import React, { createContext, useContext, useState } from "react";

type Tab = "username" | "mobile";

interface AuthContextValue {
  tab: Tab;
  setTab: (t: Tab) => void;
  // optional: expose other auth-related shared state here
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("username");

  return (
    <AuthContext.Provider value={{ tab, setTab }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
