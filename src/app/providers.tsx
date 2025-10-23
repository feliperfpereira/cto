"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { createQueryClient } from "@/lib/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
