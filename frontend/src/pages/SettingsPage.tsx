import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-headline-md text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant">Manage your account and dealership preferences.</p>
      </div>

      <Card className="max-w-2xl p-lg">
        <h3 className="text-title-lg text-on-surface">Profile</h3>
        <div className="mt-md grid grid-cols-1 gap-md sm:grid-cols-2">
          <Input label="Full Name" defaultValue={user?.name ?? "Fleet Manager"} readOnly />
          <Input label="Email" defaultValue={user?.email ?? ""} readOnly />
          <Input label="Role" defaultValue={user?.role ?? "Admin"} readOnly />
          <Input label="Dealership" defaultValue={user?.dealership ?? "Global Motors"} readOnly />
        </div>
        <p className="mt-md text-label-md text-on-surface-variant">
          This is a demo profile from the mock authentication service — editing is disabled.
        </p>
        <Button variant="secondary" className="mt-lg" disabled>
          Save Changes
        </Button>
      </Card>
    </DashboardLayout>
  );
}
