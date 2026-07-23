import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { authService } from "../services/authService";
import { ApiError } from "../api/client";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      await authService.register({ email, password });
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
      <div className="flex items-center gap-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary">
          <span className="material-symbols-outlined">person_add</span>
        </div>
        <h1 className="text-title-lg font-bold text-on-surface">Create your account</h1>
      </div>

      <h2 className="mt-2xl text-headline-lg-mobile text-on-surface">Get started</h2>
      <p className="mt-xs text-body-md text-on-surface-variant">Register to access fleet inventory workflows.</p>

      <form onSubmit={handleSubmit} className="mt-lg flex flex-col gap-md" noValidate>
        <Input
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        {errors.general && (
          <p role="alert" className="rounded-lg bg-error-container px-md py-sm text-body-md text-on-error-container">
            {errors.general}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-sm w-full justify-center">
          Register
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Button>
      </form>

      <p className="mt-lg text-center text-body-md text-on-surface-variant">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
