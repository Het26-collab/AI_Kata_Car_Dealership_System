import { useMemo, useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { VehicleCard } from "../components/VehicleCard";
import { VehicleCardSkeleton } from "../components/Skeleton";
import { EmptyState } from "../components/EmptyState";
import { Button } from "../components/Button";
import { Select } from "../components/Select";
import { Input } from "../components/Input";
import { VehicleFormModal } from "../components/VehicleFormModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useVehicles } from "../hooks/useVehicles";
import { useDebounce } from "../hooks/useDebounce";
import { useToast } from "../hooks/useToast";
import { VEHICLE_CATEGORIES, type Vehicle, type VehicleDraft, type VehicleFilters } from "../types/vehicle";
import { ApiError } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export function InventoryPage() {
  const [makeInput, setMakeInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const debouncedMake = useDebounce(makeInput, 300);
  const debouncedModel = useDebounce(modelInput, 300);
  const [category, setCategory] = useState<VehicleFilters["category"]>("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filters = useMemo<VehicleFilters>(
    () => ({
      make: debouncedMake || undefined,
      model: debouncedModel || undefined,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
    [debouncedMake, debouncedModel, category, minPrice, maxPrice]
  );

  const { vehicles, total, isLoading, createVehicle, updateVehicle, deleteVehicle, purchaseVehicle, restockVehicle, refetch } =
    useVehicles(filters, { useSearchEndpoint: true });
  const { showToast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  function openAddForm() {
    setEditingVehicle(null);
    setIsFormOpen(true);
  }

  function openEditForm(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  }

  async function handleSubmit(draft: VehicleDraft) {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, draft);
        showToast({
          variant: "success",
          title: "Changes saved",
          description: `${draft.year} ${draft.make} ${draft.model} was updated.`,
        });
      } else {
        await createVehicle(draft);
        showToast({
          variant: "success",
          title: "Vehicle added successfully",
          description: `${draft.year} ${draft.make} ${draft.model} was saved to Global Motors.`,
        });
      }
    } catch {
      showToast({
        variant: "error",
        title: "Failed to save changes",
        description: "Connection timeout. Please check your network and try again.",
      });
      throw new Error("save-failed");
    }
  }

  async function confirmDelete() {
    if (!deletingVehicle) return;
    setIsDeleting(true);
    try {
      await deleteVehicle(deletingVehicle.id);
      showToast({
        variant: "success",
        title: "Vehicle removed",
        description: `${deletingVehicle.make} ${deletingVehicle.model} was deleted from inventory.`,
      });
      setDeletingVehicle(null);
    } catch {
      showToast({
        variant: "error",
        title: "Failed to delete vehicle",
        description: "Connection timeout. Please check your network and try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handlePurchase(vehicle: Vehicle) {
    setPurchasingId(vehicle.id);
    try {
      const updated = await purchaseVehicle(vehicle.id);
      showToast({
        variant: "success",
        title: "Purchase completed",
        description: `${updated.make} ${updated.model} inventory is now ${updated.quantity}.`,
      });
    } catch (err) {
      const status = err instanceof ApiError ? err.status : undefined;
      if (status === 400 || status === 409) {
        showToast({
          variant: "error",
          title: "Vehicle is out of stock",
          description: "Another purchase was completed first. Inventory has been refreshed.",
        });
        refetch();
      } else {
        showToast({
          variant: "error",
          title: "Failed to purchase vehicle",
          description: "Please try again.",
        });
      }
    } finally {
      setPurchasingId(null);
    }
  }

  async function handleRestock(vehicle: Vehicle) {
    try {
      const updated = await restockVehicle(vehicle.id, 1);
      showToast({
        variant: "success",
        title: "Vehicle restocked",
        description: `${updated.make} ${updated.model} inventory is now ${updated.quantity}.`,
      });
    } catch {
      showToast({
        variant: "error",
        title: "Failed to restock vehicle",
        description: "Please try again.",
      });
    }
  }

  function resetFilters() {
    setMakeInput("");
    setModelInput("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <DashboardLayout onAddVehicle={isAdmin ? openAddForm : undefined}>
      <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Inventory Management</h1>
          <p className="text-body-md text-on-surface-variant">Manage and monitor your enterprise fleet in real-time.</p>
        </div>
        <Button size="sm" variant="secondary">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export List
        </Button>
      </div>

      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-card">
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-5">
          <Input
            label="Make"
            name="make"
            value={makeInput}
            onChange={(e) => setMakeInput(e.target.value)}
            placeholder="e.g. Toyota"
          />
          <Input
            label="Model"
            name="model"
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            placeholder="e.g. Camry"
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value as VehicleFilters["category"])}>
            <option value="All">Category: All</option>
            {VEHICLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            label="Min Price"
            name="minPrice"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
          <Input
            label="Max Price"
            name="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="100000"
          />
        </div>
        <div className="mt-md flex items-center justify-between gap-md">
          <p className="text-label-md text-on-surface-variant">Filters query /api/vehicles/search in real time.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-label-md font-semibold text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <EmptyState
          title="No vehicles found"
          description="We couldn't find any vehicles matching your current selection. Try adjusting your search criteria or add a new vehicle to get started."
          action={
            <>
              <Button variant="secondary" onClick={resetFilters}>
                Reset Filters
              </Button>
              {isAdmin && (
                <Button onClick={openAddForm}>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add New Vehicle
                </Button>
              )}
            </>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={openEditForm}
                onDelete={setDeletingVehicle}
                onPurchase={handlePurchase}
                onRestock={handleRestock}
                isPurchasing={purchasingId === vehicle.id}
                canManage={isAdmin}
              />
            ))}
          </div>
          <p className="text-label-md text-on-surface-variant">
            Showing 1 - {vehicles.length} of {total} vehicles
          </p>
        </>
      )}

      <VehicleFormModal
        isOpen={isFormOpen}
        vehicle={editingVehicle}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingVehicle)}
        title="Delete vehicle"
        description={
          deletingVehicle
            ? `Are you sure you want to delete ${deletingVehicle.year} ${deletingVehicle.make} ${deletingVehicle.model}? This can't be undone.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingVehicle(null)}
      />
    </DashboardLayout>
  );
}
