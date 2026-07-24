import { useState, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import { vehicleService } from "../services/vehicleService";
import { formatCurrency, formatDate } from "../utils/format";

interface PurchaseRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  vehicleId: string;
  make: string;
  model: string;
  price: number;
  purchasedAt: string;
}

export function SettingsPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    vehicleService
      .getPurchases()
      .then((res) => {
        setPurchases(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch purchases:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-lg">
        <div>
          <h1 className="text-headline-md text-on-surface font-bold">Settings & Account</h1>
          <p className="text-body-md text-on-surface-variant">Manage your profile information and view transaction history.</p>
        </div>

        <Card className="max-w-4xl p-lg">
          <h3 className="text-title-lg font-bold text-on-surface">Account Profile</h3>
          <div className="mt-md grid grid-cols-1 gap-md sm:grid-cols-2">
            <Input label="Full Name" defaultValue={user?.name || (user?.role === "admin" ? "Fleet Manager" : "Valued Client")} readOnly />
            <Input label="Email" defaultValue={user?.email ?? ""} readOnly />
            <Input label="Role" defaultValue={user?.role === "admin" ? "Administrator" : "Client / Buyer"} readOnly />
            <Input label="Dealership" defaultValue={user?.dealership ?? "Global Motors"} readOnly />
          </div>
        </Card>

        <Card className="max-w-4xl p-lg">
          <div className="flex items-center justify-between mb-md">
            <div>
              <h3 className="text-title-lg font-bold text-on-surface">
                {user?.role === "admin" ? "All Customer Vehicle Orders & Purchases" : "My Vehicle Order History"}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Official transaction records stored in backend database
              </p>
            </div>
            <span className="material-symbols-outlined text-primary text-[28px]">receipt_long</span>
          </div>

          {isLoading ? (
            <p className="text-body-md text-on-surface-variant py-md">Loading purchase records...</p>
          ) : purchases.length === 0 ? (
            <div className="rounded-lg border border-dashed border-outline-variant p-lg text-center">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">shopping_cart</span>
              <p className="mt-xs text-body-md font-medium text-on-surface">No completed vehicle orders found.</p>
              <p className="text-body-sm text-on-surface-variant">
                Purchases made from the inventory catalog will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-outline-variant">
              <table className="w-full text-left text-body-md">
                <thead className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="px-md py-sm">Vehicle</th>
                    {user?.role === "admin" && <th className="px-md py-sm">Customer</th>}
                    <th className="px-md py-sm">Purchase Price</th>
                    <th className="px-md py-sm">Order Date</th>
                    <th className="px-md py-sm">Order ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {purchases.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-md py-sm font-semibold text-on-surface">
                        {item.make} {item.model}
                      </td>
                      {user?.role === "admin" && (
                        <td className="px-md py-sm text-on-surface-variant">
                          <p className="font-medium text-on-surface">{item.userName}</p>
                          <p className="text-label-sm text-on-surface-variant">{item.userEmail}</p>
                        </td>
                      )}
                      <td className="px-md py-sm font-semibold text-primary">{formatCurrency(item.price)}</td>
                      <td className="px-md py-sm text-on-surface-variant">{formatDate(item.purchasedAt)}</td>
                      <td className="px-md py-sm font-mono text-label-sm text-on-surface-variant">
                        {item.id.slice(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
