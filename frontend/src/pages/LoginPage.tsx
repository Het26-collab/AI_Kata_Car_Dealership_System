import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("manager@globalmotors.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const registrationState = location.state as { registered?: boolean; email?: string } | null;

  const from = (location.state as { from?: string })?.from ?? "/dashboard";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
      // error is surfaced via auth context state
    }
  }

  return (
    <AuthLayout>
      <div className="flex items-center gap-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary">
          <span className="material-symbols-outlined">directions_car</span>
        </div>
        <h1 className="text-title-lg font-bold text-on-surface">
          AutoFleet<span className="text-primary">Pro</span>
        </h1>
      </div>

      <h2 className="mt-2xl text-headline-lg-mobile text-on-surface">Welcome back</h2>
      <p className="mt-xs text-body-md text-on-surface-variant">Access your enterprise dashboard</p>

      <form onSubmit={handleSubmit} className="mt-lg flex flex-col gap-md" noValidate>
        {registrationState?.registered && (
          <p role="status" className="rounded-lg bg-success-container px-md py-sm text-body-md text-on-success-container">
            Account created for {registrationState.email ?? "your email"}. Please sign in.
          </p>
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
        />

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-body-md font-medium text-on-surface">
              Password
            </label>
            <a href="#" className="text-label-md font-semibold text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative mt-xs">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-md pr-2xl text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        <label className="flex items-center gap-sm text-body-md text-on-surface-variant">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/40"
          />
          Keep me logged in
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-error-container px-md py-sm text-body-md text-on-error-container">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-sm w-full justify-center">
          Sign In
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Button>
      </form>

      <p className="mt-lg text-center text-body-md text-on-surface-variant">
        New to the platform?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-md text-center text-label-md text-on-surface-variant">
        Demo credentials are pre-filled — any email + 8-character password will sign you in.
      </p>
    </AuthLayout>
  );
}
