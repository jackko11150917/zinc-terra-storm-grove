import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Dumbbell, House, ScrollText, Trophy } from "lucide-react";
import { Toaster } from "sonner";
import { Onboarding } from "@/components/onboarding";
import { rehydrateGym } from "@/lib/store";
import { useGymStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "主頁", icon: House },
  { to: "/train", label: "訓練", icon: Dumbbell },
  { to: "/log", label: "紀錄", icon: ScrollText },
  { to: "/guide", label: "指導", icon: BookOpen },
  { to: "/rank", label: "段位", icon: Trophy },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const onboarded = useGymStore((s) => s.profile.onboarded);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    void Promise.resolve(rehydrateGym());
  }, []);

  if (!onboarded) return <Onboarding />;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-elevated)",
            border: "1px solid var(--color-border)",
            color: "var(--color-foreground)",
          },
        }}
      />
      <main className="main-with-tabbar flex-1">{children}</main>
      <nav className="tabbar-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-border bg-background/95">
        <ul className="grid grid-cols-5">
          {TABS.map((tab) => {
            const active =
              tab.to === "/"
                ? pathname === "/"
                : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
            const Icon = tab.icon;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 text-xs transition-colors duration-150",
                    active ? "text-accent" : "text-subtle",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
