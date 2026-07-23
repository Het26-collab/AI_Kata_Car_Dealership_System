import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import {
  VEHICLE_CATEGORIES,
  VEHICLE_STATUSES,
  FUEL_TYPES,
  TRANSMISSIONS,
  type Vehicle,
  type VehicleDraft,
} from "../types/vehicle";

interface VehicleFormModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSubmit: (draft: VehicleDraft) => Promise<void>;
}

const EMPTY_FORM: VehicleDraft = {
  make: "",
  model: "",
  trim: "",
  year: new Date().getFullYear(),
  category: "SUV",
  dealerId: "",
  vin: "",
  price: 0,
  quantity: 1,
  status: "In Stock",
  mileage: 0,
  color: "",
  fuelType: "Gasoline",
  transmission: "Automatic",
  description: "",
};

export function VehicleFormModal({ isOpen, vehicle, onClose, onSubmit }: VehicleFormModalProps) {
  const [form, setForm] = useState<VehicleDraft>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(
        vehicle
          ? {
              make: vehicle.make,
              model: vehicle.model,
              trim: vehicle.trim,
              year: vehicle.year,
              category: vehicle.category,
              dealerId: vehicle.dealerId,
              vin: vehicle.vin,
              price: vehicle.price,
              quantity: vehicle.quantity,
              status: vehicle.status,
              mileage: vehicle.mileage || 0,
              color: vehicle.color || "",
              fuelType: vehicle.fuelType || "Gasoline",
              transmission: vehicle.transmission || "Automatic",
              description: vehicle.description || "",
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [isOpen, vehicle]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.make.trim()) next.make = "Make is required.";
    if (!form.model.trim()) next.model = "Model is required.";
    if (!form.vin.trim() || form.vin.trim().length < 5) next.vin = "Enter a valid VIN.";
    if (!form.year || form.year < 1900 || form.year > new Date().getFullYear() + 1) {
      next.year = "Enter a valid year.";
    }
    if (!form.price || form.price <= 0) next.price = "Enter a price greater than 0.";
    if (form.quantity === undefined || form.quantity < 0) next.quantity = "Quantity can't be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle ? "Edit Vehicle" : "Add New Vehicle"}
      size="lg"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="vehicle-form" isLoading={isSubmitting}>
            {vehicle ? "Save Changes" : "Add Vehicle"}
          </Button>
        </>
      }
    >
      <form id="vehicle-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-md sm:grid-cols-2">
        <Input
          label="Make"
          value={form.make}
          error={errors.make}
          onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))}
          placeholder="e.g. Mercedes-Benz"
        />
        <Input
          label="Model"
          value={form.model}
          error={errors.model}
          onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
          placeholder="e.g. S-Class"
        />
        <Input
          label="Trim"
          value={form.trim}
          onChange={(e) => setForm((f) => ({ ...f, trim: e.target.value }))}
          placeholder="e.g. S 580 4MATIC"
        />
        <Input
          label="Year"
          type="number"
          value={form.year}
          error={errors.year}
          onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
        />
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as VehicleDraft["category"] }))}
        >
          {VEHICLE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as VehicleDraft["status"] }))}
        >
          {VEHICLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Input
          label="VIN"
          value={form.vin}
          error={errors.vin}
          onChange={(e) => setForm((f) => ({ ...f, vin: e.target.value.toUpperCase() }))}
          placeholder="17-character VIN"
        />
        <Input
          label="Dealer ID"
          value={form.dealerId}
          onChange={(e) => setForm((f) => ({ ...f, dealerId: e.target.value }))}
          placeholder="e.g. GM-MB-001"
        />
        <Input
          label="Price (USD)"
          type="number"
          value={form.price}
          error={errors.price}
          onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
        />
        <Input
          label="Quantity"
          type="number"
          value={form.quantity}
          error={errors.quantity}
          onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
        />
        <Input
          label="Mileage"
          type="number"
          value={form.mileage}
          onChange={(e) => setForm((f) => ({ ...f, mileage: Number(e.target.value) }))}
          placeholder="0"
        />
        <Input
          label="Color"
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
          placeholder="e.g. Midnight Black Metallic"
        />
        <Select
          label="Fuel Type"
          value={form.fuelType}
          onChange={(e) => setForm((f) => ({ ...f, fuelType: e.target.value }))}
        >
          {FUEL_TYPES.map((ft) => (
            <option key={ft} value={ft}>
              {ft}
            </option>
          ))}
        </Select>
        <Select
          label="Transmission"
          value={form.transmission}
          onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
        >
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <div className="sm:col-span-2">
          <label className="mb-xs block text-label-md text-on-surface-variant">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Vehicle description, features, and highlights..."
            rows={3}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </form>
    </Modal>
  );
}
