"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut, Moon, Sparkles, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "CV Analysis", href: "/cv-analysis" },
  { label: "Profile", href: "/profile" },
  { label: "Market Trends", href: "/market-trends" },
  { label: "Premium", href: "/premium" },
];

const cvAnalysisChildren = [
  { label: "Upload", href: "/cv-analysis/upload" },
];

type NavbarAuthUser = {
  fullName: string;
};

function getFirstName(fullName: string) {
  const [firstName] = fullName.trim().split(" ");
  return firstName || "Profile";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [authUser, setAuthUser] = useState<NavbarAuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isCvAnalysisActive =
    pathname.startsWith("/cv-analysis") || pathname === "/results" || pathname === "/upload";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAuthState() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setAuthUser(null);
          }
          return;
        }

        const payload = (await response.json()) as {
          user?: NavbarAuthUser;
        };

        if (!cancelled) {
          setAuthUser(payload.user ?? null);
        }
      } catch {
        if (!cancelled) {
          setAuthUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsAuthLoading(false);
        }
      }
    }

    void loadAuthState();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setAuthUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
          <span className="rounded-xl bg-primary/15 p-1.5 text-primary">
            <Sparkles className="size-4" />
          </span>
          Smart CV Matcher DZ
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive =
              link.href === "/cv-analysis" ? isCvAnalysisActive : pathname === link.href;

            if (link.href === "/cv-analysis") {
              return (
                <div key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>

                  <div className="invisible absolute left-0 top-11 z-50 w-44 rounded-xl border border-border/70 bg-card p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                    {cvAnalysisChildren.map((child) => {
                      const isChildActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "mb-1 block rounded-lg px-3 py-2 text-sm last:mb-0",
                            isChildActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {authUser ? (
            <>
              <Link
                href="/profile"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden rounded-xl sm:inline-flex"
                )}
              >
                <UserRound className="size-4" />
                {getFirstName(authUser.fullName)}
              </Link>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  void handleLogout();
                }}
                aria-label="Sign out"
                disabled={isAuthLoading}
              >
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }), "rounded-xl px-3")}
            >
              <LogIn className="size-4" /> Login
            </Link>
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>

      <nav className="dotted-grid flex items-center gap-2 overflow-x-auto border-t border-border/70 px-4 py-3 md:hidden">
        {links.map((link) => {
          const isActive =
            link.href === "/cv-analysis" ? isCvAnalysisActive : pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-xl px-3 py-1.5 text-sm",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground ring-1 ring-border/70"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
