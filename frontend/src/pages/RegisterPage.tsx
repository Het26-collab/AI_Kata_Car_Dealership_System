import { useState, useMemo, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { authService } from "../services/authService";
import { ApiError } from "../api/client";
import { fadeInUp, staggerContainer, staggerItem } from "../lib/motion";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

function computePasswordStrength(pass: string): { score: number; label: string; color: string } {
  if (!pass) return { score: 0, label: "", color: "bg-surface-container-high" };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 1) return { score: 25, label: "Weak password", color: "bg-error" };
  if (score === 2) return { score: 50, label: "Fair password", color: "bg-amber-500" };
  if (score === 3) return { score: 75, label: "Good password", color: "bg-blue-500" };
  return { score: 100, label: "Strong password", color: "bg-emerald-500" };
}

function mapBackendErrors(error: ApiError): FormErrors {
  const messages = error.errors && error.errors.length > 0 ? error.errors : [error.message];
  const nextErrors: FormErrors = {};

  for (const message of messages) {
    const lowered = message.toLowerCase();
    if (!nextErrors.email && lowered.includes("email")) {
      nextErrors.email = message;
      continue;
    }
    if (!nextErrors.password && lowered.includes("password")) {
      nextErrors.password = message;
      continue;
    }
    if (!nextErrors.general) {
      nextErrors.general = message;
    }
  }

  return nextErrors;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const strength = useMemo(() => computePasswordStrength(password), [password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      nextErrors.terms = "You must agree to the Terms of Service to create an account.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      await authService.register({ email: email.trim(), password, name: name.trim() });
      navigate("/login", { replace: true, state: { registered: true, email } });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(mapBackendErrors(err));
      } else {
        setErrors({ general: "Unable to create account. Please try again." });
      }
    } finally {
      setIsLoading(false);
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
          <h2 className="mt-xl text-headline-sm font-bold text-on-surface">Get started with DriveFlow</h2>
          <p className="mt-xs text-body-md text-on-surface-variant">Register to access enterprise fleet workflows</p>
        </motion.div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-lg flex flex-col gap-md" noValidate>
          <Input
            label="Full Name"
            type="text"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah Jenkins"
            leadingIcon="person"
            error={errors.name}
          />

          <Input
            label="Work Email Address"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            leadingIcon="mail"
            error={errors.email}
          />

          <div>
            <div className="flex items-center justify-between mb-xs">
              <label htmlFor="password" className="text-body-md font-medium text-on-surface">
                Create Password
              </label>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
                lock
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-xs space-y-xs">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                </div>
                <p className="text-label-sm font-medium text-on-surface-variant flex justify-between">
                  <span>{strength.label}</span>
                  <span>At least 8 characters</span>
                </p>
              </div>
            )}
            {errors.password && <p className="mt-xs text-label-md text-error">{errors.password}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-xs">
              <label htmlFor="confirmPassword" className="text-body-md font-medium text-on-surface">
                Confirm Password
              </label>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
                lock_reset
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-[44px] w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-2xl pr-2xl text-body-md text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-xs text-label-md text-error">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-xs">
            <label className="flex items-start gap-sm text-body-sm text-on-surface-variant cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/40"
              />
              <span>
                I agree to the <a href="#" className="font-semibold text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-primary hover:underline">Privacy Policy</a>.
              </span>
            </label>
            {errors.terms && <p className="text-label-md text-error">{errors.terms}</p>}
          </div>

          <AnimatePresence mode="wait">
            {errors.general && (
              <motion.div
                key="general-error"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="alert"
                className="flex items-center gap-xs rounded-lg border border-error/30 bg-error-container px-md py-sm text-body-md text-on-error-container"
              >
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>{errors.general}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" isLoading={isLoading} className="mt-xs w-full justify-center">
            Create Account
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </form>

        <p className="mt-lg text-center text-body-md text-on-surface-variant">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
