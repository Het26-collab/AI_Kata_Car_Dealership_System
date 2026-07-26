import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { fadeInUp, staggerContainer, staggerItem } from "../lib/motion";

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  const [email, setEmail] = useState("admin@globalmotors.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState("");

  const registrationState = location.state as { registered?: boolean; email?: string } | null;
  const from = (location.state as { from?: string })?.from ?? "/dashboard";

  function handleFillAdmin() {
    setEmail("admin@globalmotors.com");
    setPassword("demo1234");
  }

  function handleFillClient() {
    setEmail("user@globalmotors.com");
    setPassword("demo1234");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      // Error is stored in AuthContext and rendered below
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
    <AuthLayout>
      <motion.div
        variants={!prefersReduced ? staggerContainer : undefined}
        initial={!prefersReduced ? "hidden" : undefined}
        animate={!prefersReduced ? "visible" : undefined}
        className="flex flex-col"
      >
        {/* Brand Header */}
        <motion.div className="flex flex-col items-center text-center" variants={!prefersReduced ? staggerItem : undefined}>
          <div className="flex h-16 w-full items-center justify-center rounded-xl bg-surface-container-low p-sm border border-outline-variant/60 shadow-sm">
            <img src="/Logo_GM.png" alt="Global Motors Logo" className="h-12 w-auto object-contain" />
          </div>
          <h2 className="mt-xl text-headline-sm font-bold text-on-surface">Welcome back</h2>
          <p className="mt-xs text-body-md text-on-surface-variant">Sign in to your enterprise dealership dashboard</p>
        </motion.div>

        {/* Quick Demo Credentials Selector */}
        <motion.div variants={!prefersReduced ? staggerItem : undefined} className="mt-md rounded-xl border border-primary/20 bg-primary-container/20 p-sm">
          <p className="text-label-sm font-semibold text-primary uppercase tracking-wide mb-xs text-center">
            ⚡ Quick Demo Fill
          </p>
          <div className="grid grid-cols-2 gap-xs">
            <button
              type="button"
              onClick={handleFillAdmin}
              className={`rounded-lg px-sm py-xs text-label-sm font-medium transition-all ${
                email === "admin@globalmotors.com"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"
              }`}
            >
              👑 Fleet Manager (Admin)
            </button>
            <button
              type="button"
              onClick={handleFillClient}
              className={`rounded-lg px-sm py-xs text-label-sm font-medium transition-all ${
                email === "user@globalmotors.com"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"
              }`}
            >
              👤 Client (Buyer)
            </button>
          </div>
        </motion.div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="mt-md flex flex-col gap-md" noValidate>
          <AnimatePresence mode="wait">
            {registrationState?.registered && (
              <motion.p
                key="registered-alert"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="status"
                className="rounded-lg border border-success/30 bg-success-container px-md py-sm text-body-md text-on-success-container"
              >
                Account created for {registrationState.email ?? "your email"}. Please sign in below.
              </motion.p>
            )}
          </AnimatePresence>

          <Input
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            leadingIcon="mail"
          />

          <div>
            <div className="flex items-center justify-between mb-xs">
              <label htmlFor="password" className="text-body-md font-medium text-on-surface">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setIsForgotOpen(true);
                }}
                className="text-label-md font-semibold text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
                lock
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[44px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-2xl pr-2xl text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-sm text-body-md text-on-surface-variant cursor-pointer">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/40"
              />
              Keep me logged in
            </label>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error-alert"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="alert"
                className="flex items-center gap-xs rounded-lg border border-error/30 bg-error-container px-md py-sm text-body-md text-on-error-container"
              >
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" isLoading={isLoading} className="mt-xs w-full justify-center">
            Sign In to Dashboard
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </form>

        <p className="mt-lg text-center text-body-md text-on-surface-variant">
          New to the platform?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>

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
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-container text-success mx-auto">
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
            <Input
              label="Email Address"
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@company.com"
              leadingIcon="mail"
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
    </AuthLayout>
  );
}
