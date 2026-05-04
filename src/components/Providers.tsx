'use client';

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // During static generation, SessionProvider may cause issues
  // We wrap it to handle edge cases gracefully
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
