import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { fadeInUp, staggerContainer, staggerItem } from "../lib/motion";

type PersonaRole = "fleet_manager" | "admin" | "sales_exec";

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  const [activePersona, setActivePersona] = useState<PersonaRole>("admin");
  const [email, setEmail] = useState("admin@globalmotors.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot Password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState("");

  const registrationState = location.state as { registered?: boolean; email?: string } | null;
  const from = (location.state as { from?: string })?.from ?? "/dashboard";

  function handlePersonaSwitch(role: PersonaRole) {
    setActivePersona(role);
    if (role === "admin") {
      setEmail("admin@globalmotors.com");
      setPassword("demo1234");
    } else if (role === "fleet_manager") {
      setEmail("manager@globalmotors.com");
      setPassword("demo1234");
    } else {
      setEmail("user@globalmotors.com");
      setPassword("demo1234");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      // Error is rendered from AuthContext
    }
  }

  async function handleSendResetLink(e: FormEvent) {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setIsForgotLoading(true);
    setForgotSuccessMessage("");
    try {
      const res = await authService.forgotPassword(forgotEmail);
      setForgotSuccessMessage(res.message);
    } catch {
      setForgotSuccessMessage("If an account exists with that email address, a password reset link has been dispatched.");
    } finally {
      setIsForgotLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Column: Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-md md:p-xl min-h-screen z-10 relative bg-surface">
        {/* Top Logo */}
        <Link to="/" className="flex items-center gap-sm transition-opacity hover:opacity-90">
          <span
            className="material-symbols-outlined text-[28px] font-bold text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            speed
          </span>
          <span className="text-title-lg font-bold tracking-tight text-on-surface">
            DriveFlow
          </span>
        </Link>

        {/* Main Form Area */}
        <motion.div
          className="max-w-md w-full mx-auto my-auto py-xl"
          variants={!prefersReduced ? staggerContainer : undefined}
          initial={!prefersReduced ? "hidden" : undefined}
          animate={!prefersReduced ? "visible" : undefined}
        >
          {/* Badge */}
          <motion.div
            variants={!prefersReduced ? staggerItem : undefined}
            className="mb-md inline-flex items-center gap-xs bg-primary-container/10 border border-primary-container/20 px-sm py-xs rounded-full"
          >
            <span className="material-symbols-outlined text-primary text-[14px]">shield</span>
            <span className="text-label-sm text-primary font-medium">Enterprise Edition</span>
          </motion.div>

          <motion.h1
            variants={!prefersReduced ? staggerItem : undefined}
            className="text-headline-md font-bold text-on-surface md:text-display-sm mb-xs"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            variants={!prefersReduced ? staggerItem : undefined}
            className="text-body-lg text-on-surface-variant mb-xl"
          >
            Access your enterprise dealership platform securely.
          </motion.p>

          {/* Role Persona Selector Tabs */}
          <motion.div variants={!prefersReduced ? staggerItem : undefined} className="mb-xl">
            <p className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-xs">
              ⚡ Select Demo Role
            </p>
            <div className="flex bg-surface-container-high rounded-xl p-xs w-full gap-xs">
              <button
                type="button"
                onClick={() => handlePersonaSwitch("admin")}
                className={`flex-1 py-xs px-sm rounded-lg text-label-sm font-medium transition-all ${
                  activePersona === "admin"
                    ? "bg-surface shadow text-primary font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => handlePersonaSwitch("fleet_manager")}
                className={`flex-1 py-xs px-sm rounded-lg text-label-sm font-medium transition-all ${
                  activePersona === "fleet_manager"
                    ? "bg-surface shadow text-primary font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Fleet Manager
              </button>
              <button
                type="button"
                onClick={() => handlePersonaSwitch("sales_exec")}
                className={`flex-1 py-xs px-sm rounded-lg text-label-sm font-medium transition-all ${
                  activePersona === "sales_exec"
                    ? "bg-surface shadow text-primary font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Sales Exec
              </button>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-md" noValidate>
            <AnimatePresence mode="wait">
              {registrationState?.registered && (
                <motion.p
                  key="registered-banner"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-md py-sm text-body-md text-emerald-700"
                >
                  Account created for {registrationState.email ?? "your email"}. Please sign in below.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <motion.div variants={!prefersReduced ? staggerItem : undefined} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="block w-full pl-[44px] pr-md py-md bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={!prefersReduced ? staggerItem : undefined} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                  lock
                </span>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="block w-full pl-[44px] pr-2xl py-md bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              variants={!prefersReduced ? staggerItem : undefined}
              className="flex items-center justify-between pt-xs"
            >
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/40"
                />
                <span className="text-body-md text-on-surface-variant">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setIsForgotOpen(true);
                }}
                className="text-label-md font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="login-error"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center gap-xs rounded-lg border border-error/30 bg-error-container px-md py-sm text-body-md text-on-error-container"
                >
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={!prefersReduced ? staggerItem : undefined}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-sm py-md px-lg bg-primary text-on-primary rounded-lg font-semibold shadow-md hover:bg-primary-fixed-variant transition-all hover:-translate-y-0.5"
              >
                <span>{isLoading ? "Authenticating..." : "Sign In to Dashboard"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </motion.div>
          </form>

          <p className="mt-lg text-center text-body-md text-on-surface-variant">
            New to the platform?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="flex flex-wrap gap-md text-label-sm text-on-surface-variant pt-lg border-t border-outline-variant/30">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Security</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </div>

      {/* Right Column: Hero Showcase Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#131b2e] via-[#1e35d0] to-[#0f172a] relative overflow-hidden p-xl flex-col justify-between text-white">
        {/* Ambient Blur */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-70" />

        {/* Top Operational Badge */}
        <div className="flex justify-end relative z-10">
          <div className="rounded-full bg-white/10 px-md py-sm backdrop-blur-xl border border-white/15 shadow-sm flex items-center gap-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-label-sm text-white/90 font-medium">System Operational • 99.99% Uptime</span>
          </div>
        </div>

        {/* Center Showcase Card */}
        <div className="relative z-10 max-w-lg mx-auto w-full">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-lg backdrop-blur-xl shadow-2xl mb-lg">
            <div className="flex items-center gap-md mb-md">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-white text-[28px]">analytics</span>
              </div>
              <div>
                <h2 className="text-headline-sm font-bold text-white tracking-tight">Enterprise Grade</h2>
                <p className="text-body-md text-white/70">Precision Fleet Intelligence Platform</p>
              </div>
            </div>
            <p className="text-body-md text-white/80 leading-relaxed">
              Integrated real-time valuation metrics, dynamic inventory forecasting, and end-to-end loan quote calculation in a unified platform.
            </p>
          </div>

          {/* Bento Grid Stats */}
          <div className="grid grid-cols-2 gap-md">
            <div className="rounded-xl border border-white/15 bg-white/10 p-md backdrop-blur-xl shadow-lg">
              <span className="material-symbols-outlined text-white/60 mb-xs text-[20px]">account_balance</span>
              <p className="text-headline-md font-bold text-white">$1.2B+</p>
              <p className="text-label-sm text-white/70">Fleet Value Managed</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-md backdrop-blur-xl shadow-lg">
              <span className="material-symbols-outlined text-white/60 mb-xs text-[20px]">directions_car</span>
              <p className="text-headline-md font-bold text-white">450k+</p>
              <p className="text-label-sm text-white/70">Active Vehicles</p>
            </div>
          </div>
        </div>

        {/* Bottom Security Badges */}
        <div className="relative z-10 flex justify-center gap-xl text-white/70">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="text-label-sm">SOC 2 Type II</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="text-label-sm">256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">policy</span>
            <span className="text-label-sm">GDPR Ready</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => {
          setIsForgotOpen(false);
          setForgotSuccessMessage("");
        }}
        title="Reset Account Password"
      >
        {forgotSuccessMessage ? (
          <div className="space-y-md text-center py-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
              <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
            </span>
            <p className="text-body-md text-on-surface">{forgotSuccessMessage}</p>
            <Button
              variant="secondary"
              onClick={() => {
                setIsForgotOpen(false);
                setForgotSuccessMessage("");
              }}
              className="w-full justify-center"
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendResetLink} className="space-y-md">
            <p className="text-body-md text-on-surface-variant">
              Enter your registered work email address below and we will dispatch a secure password reset link.
            </p>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-lg border border-outline-variant bg-surface px-md py-md text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex gap-sm pt-sm">
              <Button type="button" variant="secondary" onClick={() => setIsForgotOpen(false)} className="flex-1 justify-center">
                Cancel
              </Button>
              <Button type="submit" isLoading={isForgotLoading} className="flex-1 justify-center">
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
