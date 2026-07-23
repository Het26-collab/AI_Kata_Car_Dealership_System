import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-md bg-background px-lg text-center">
      <p className="text-label-sm uppercase tracking-wide text-primary">404</p>
      <h1 className="text-headline-lg text-on-surface">Page not found</h1>
      <p className="max-w-sm text-body-md text-on-surface-variant">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
