"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { PageTransition } from "@/components/layout/PageTransition";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";

type AuthResponse = {
  success?: boolean;
  error?: string;
  details?: string;
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dreamCompany, setDreamCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modeTitle = useMemo(() => {
    if (mode === "signin") {
      return "Bon retour";
    }

    return "Create your account";
  }, [mode]);

  const modeDescription = useMemo(() => {
    if (mode === "signin") {
      return "Connecte-toi pour accéder à tes matchs CV et ton profile pro.";
    }

    return "Inscris-toi pour démarrer ton suivi CV et construire ton plan carrière.";
  }, [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError("Email and password are required.");
      return;
    }

    if (normalizedPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (mode === "signup" && fullName.trim().length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    setIsSubmitting(true);

    const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email: normalizedEmail,
          password: normalizedPassword,
          dreamCompany,
          targetRole,
        }),
      });

      const payload = (await response.json()) as AuthResponse;

      if (!response.ok || payload.success === false) {
        throw new Error(payload.error ?? "Authentication failed.");
      }

      router.push("/profile");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected authentication error.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const profileBadge = initialsFromName(fullName.trim() || "CV Match");

  return (
    <PageTransition className="mx-auto min-h-[calc(100vh-11rem)] w-full max-w-6xl">
      <section className="relative overflow-hidden rounded-[1.8rem] border border-indigo-500/35 bg-slate-950 shadow-[0_0_0_1px_rgba(99,102,241,0.25),0_24px_80px_rgba(15,23,42,0.6)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(14,165,233,0.22),transparent_36%),radial-gradient(circle_at_88%_30%,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.14),transparent_40%)]" />

        <div className="relative grid min-h-[680px] lg:grid-cols-[1.05fr_1fr]">
          <div className="hidden border-r border-slate-800/90 p-8 lg:block xl:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              <Sparkles className="size-4" /> CV Match
            </div>

            <div className="space-y-4 text-slate-100">
              <h1 className="text-4xl font-bold leading-tight">
                Build the profile that gets you noticed.
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-slate-300">
                Analyse ton CV, compare tes skills au marché algérien et transforme ton roadmap en
                résultats concrets.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
                <p className="text-2xl font-bold text-cyan-300">1 247</p>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Offres analysées</p>
              </div>
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
                <p className="text-2xl font-bold text-indigo-300">87%</p>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Match moyen</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5">
              <p className="text-sm italic leading-relaxed text-slate-200">
                “J&apos;ai trouvé mon stage PFE en 3 semaines grâce aux recommandations précises de
                l&apos;IA.”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-slate-600 bg-slate-800 font-semibold text-cyan-300">
                  OM
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">Oussama M.</p>
                  <p className="text-xs text-slate-400">Fullstack Developer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-5 sm:p-8">
            <div className="w-full max-w-md rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-3xl font-semibold text-slate-100">{modeTitle}</p>
                  <p className="mt-1 text-sm text-slate-400">{modeDescription}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-indigo-400/35 bg-indigo-500/10 text-indigo-200">
                  {profileBadge}
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-950/70 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition",
                    mode === "signin"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  )}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition",
                    mode === "signup"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  )}
                >
                  Sign up
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {mode === "signup" ? (
                    <motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-4"
                    >
                      <label className="block space-y-1">
                        <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Full name</span>
                        <span className="relative block">
                          <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/75 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                            placeholder="Karim Boualem"
                            autoComplete="name"
                            required
                          />
                        </span>
                      </label>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-1">
                          <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Dream company</span>
                          <span className="relative block">
                            <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                            <input
                              type="text"
                              value={dreamCompany}
                              onChange={(event) => setDreamCompany(event.target.value)}
                              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/75 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                              placeholder="Yassir"
                            />
                          </span>
                        </label>

                        <label className="block space-y-1">
                          <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Target role</span>
                          <span className="relative block">
                            <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                            <input
                              type="text"
                              value={targetRole}
                              onChange={(event) => setTargetRole(event.target.value)}
                              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/75 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                              placeholder="Backend Developer"
                            />
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <label className="block space-y-1">
                  <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Email</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/75 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                      placeholder="ton@email.com"
                      autoComplete="email"
                      required
                    />
                  </span>
                </label>

                <label className="block space-y-1">
                  <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Password</span>
                  <span className="relative block">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950/75 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
                      placeholder="••••••••"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      required
                    />
                  </span>
                </label>

                {error ? (
                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting
                    ? mode === "signin"
                      ? "Signing in..."
                      : "Creating account..."
                    : mode === "signin"
                    ? "Se connecter"
                    : "Créer un compte"}
                  <ArrowRight className="size-4" />
                </button>

                <p className="text-center text-xs text-slate-400">
                  {mode === "signin" ? "Pas encore de compte ?" : "Tu as déjà un compte ?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setError(null);
                    }}
                    className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    {mode === "signin" ? "Créer un compte" : "Se connecter"}
                  </button>
                </p>
              </form>

              <div className="mt-6 border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
                En continuant, tu acceptes nos conditions d&apos;utilisation.
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
                  )}
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
