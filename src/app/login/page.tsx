"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/stores/auth-store";

/* ── Schema ── */
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof loginSchema>;

/* ── Animations ── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

/* ── Contour Lines (topographic / intelligence motif) ── */
function ContourLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Flowing contour paths — warm monochrome */}
      <g opacity="0.08" stroke="var(--color-primary)" strokeWidth="1">
        <path d="M-100 400 C200 200, 400 600, 700 350 S1000 500, 1300 300">
          <animate attributeName="d" dur="25s" repeatCount="indefinite" values="
            M-100 400 C200 200, 400 600, 700 350 S1000 500, 1300 300;
            M-100 350 C200 500, 400 200, 700 450 S1000 300, 1300 400;
            M-100 400 C200 200, 400 600, 700 350 S1000 500, 1300 300
          " />
        </path>
        <path d="M-100 500 C250 300, 500 700, 750 400 S1050 600, 1300 350">
          <animate attributeName="d" dur="28s" repeatCount="indefinite" values="
            M-100 500 C250 300, 500 700, 750 400 S1050 600, 1300 350;
            M-100 450 C250 600, 500 250, 750 500 S1050 350, 1300 450;
            M-100 500 C250 300, 500 700, 750 400 S1050 600, 1300 350
          " />
        </path>
        <path d="M-100 300 C150 100, 350 500, 650 250 S950 400, 1300 200">
          <animate attributeName="d" dur="22s" repeatCount="indefinite" values="
            M-100 300 C150 100, 350 500, 650 250 S950 400, 1300 200;
            M-100 250 C150 450, 350 100, 650 350 S950 200, 1300 300;
            M-100 300 C150 100, 350 500, 650 250 S950 400, 1300 200
          " />
        </path>
      </g>
      <g opacity="0.05" stroke="var(--color-accent-teal)" strokeWidth="0.8">
        <path d="M-100 600 C300 400, 550 750, 800 500 S1100 650, 1300 450">
          <animate attributeName="d" dur="30s" repeatCount="indefinite" values="
            M-100 600 C300 400, 550 750, 800 500 S1100 650, 1300 450;
            M-100 550 C300 700, 550 350, 800 600 S1100 400, 1300 550;
            M-100 600 C300 400, 550 750, 800 500 S1100 650, 1300 450
          " />
        </path>
        <path d="M-100 200 C200 50, 450 400, 700 150 S1000 300, 1300 100">
          <animate attributeName="d" dur="26s" repeatCount="indefinite" values="
            M-100 200 C200 50, 450 400, 700 150 S1000 300, 1300 100;
            M-100 150 C200 350, 450 50, 700 250 S1000 100, 1300 200;
            M-100 200 C200 50, 450 400, 700 150 S1000 300, 1300 100
          " />
        </path>
      </g>
    </svg>
  );
}

/* ── Glass input (custom for auth pages) ── */
function GlassInput({
  label, error, className, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </label>
      <input
        className={[
          "flex h-10 w-full rounded-[10px] px-3.5 py-2 text-[13.5px] text-text-deep placeholder:text-text-muted/60 transition-all duration-200",
          "outline-none ring-0 transition-all duration-200",
          error
            ? "bg-error/[0.04] border border-error/25"
            : "bg-white/50 border border-transparent hover:bg-white/70 focus:bg-white focus:border-primary/25",
          className,
        ].filter(Boolean).join(" ")}
        style={{ backdropFilter: "blur(8px)" }}
        {...props}
      />
      {error && <p className="text-[11px] font-medium" style={{ color: "var(--color-error)" }}>{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isHydrated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isHydrated && isAuthenticated) router.replace("/workspace");
  }, [isHydrated, isAuthenticated, router]);

  const onSubmit = (data: LoginForm) => {
    login(data.email, data.password);
    router.push("/workspace");
  };

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center" style={{ background: "var(--color-surface-warm)" }}>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl font-heading font-bold text-sm animate-pulse"
          style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)", color: "var(--color-primary)" }}
        >
          G
        </div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden" style={{ background: "var(--color-surface-warm)" }}>

      {/* ── Living aurora mesh ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Blob 1 — primary warm */}
        <div
          className="absolute h-[700px] w-[700px] rounded-full blur-[160px] opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, var(--color-primary-300), transparent 70%)",
            top: "-10%", right: "-10%",
            animation: "aurora-drift-1 20s ease-in-out infinite alternate",
          }}
        />
        {/* Blob 2 — teal accent */}
        <div
          className="absolute h-[500px] w-[500px] rounded-full blur-[140px] opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, var(--color-accent-teal), transparent 70%)",
            bottom: "-5%", left: "-5%",
            animation: "aurora-drift-2 24s ease-in-out infinite alternate",
          }}
        />
        {/* Blob 3 — gold */}
        <div
          className="absolute h-[400px] w-[400px] rounded-full blur-[120px] opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, var(--color-accent-gold), transparent 70%)",
            top: "40%", left: "50%", transform: "translateX(-50%)",
            animation: "aurora-drift-3 18s ease-in-out infinite alternate",
          }}
        />
        {/* Blob 4 — subtle terracotta */}
        <div
          className="absolute h-[350px] w-[350px] rounded-full blur-[100px] opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, var(--color-accent-terracotta), transparent 70%)",
            top: "10%", left: "20%",
            animation: "aurora-drift-4 22s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* ── Contour lines ── */}
      <ContourLines />

      {/* ── Content ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center px-5 w-full max-w-[400px]"
      >
        {/* Brand mark with glow ring */}
        <motion.div variants={fadeUp} className="mb-8 flex flex-col items-center">
          <div className="relative mb-5">
            {/* Glow */}
            <div
              className="absolute -inset-3 rounded-full opacity-30 blur-xl"
              style={{ background: "var(--color-primary-300)" }}
            />
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl font-heading font-bold text-xl"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 15%, white), white)",
                color: "var(--color-primary)",
                boxShadow: "var(--shadow-warm-lg), inset 0 1px 0 rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              G
            </div>
          </div>
          <h1 className="font-heading font-bold text-[24px] text-neutral-900 tracking-[-0.02em]">
            Welcome back
          </h1>
          <p className="text-[13px] mt-1.5" style={{ color: "var(--color-text-secondary)" }}>
            Sign in to your workspace
          </p>
        </motion.div>

        {/* Glass card */}
        <motion.div
          variants={fadeUp}
          className="w-full rounded-[20px] p-6 sm:p-7"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(40px) saturate(1.5)",
            WebkitBackdropFilter: "blur(40px) saturate(1.5)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "var(--shadow-warm-lg), inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <GlassInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <GlassInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-[11px] p-0.5 rounded-md transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="pt-2 [&>div]:w-full">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Sign in
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p variants={fadeUp} className="text-center text-[13px] mt-6" style={{ color: "var(--color-text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
            Sign up
          </Link>
        </motion.p>
      </motion.div>

      {/* ── Aurora keyframes ── */}
      <style jsx global>{`
        @keyframes aurora-drift-1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-80px, 60px) scale(1.1); }
        }
        @keyframes aurora-drift-2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, -50px) scale(1.15); }
        }
        @keyframes aurora-drift-3 {
          0% { transform: translateX(-50%) translate(0, 0) scale(1); }
          100% { transform: translateX(-50%) translate(40px, -40px) scale(1.08); }
        }
        @keyframes aurora-drift-4 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-40px, 50px) scale(1.12); }
        }
      `}</style>
    </div>
  );
}
