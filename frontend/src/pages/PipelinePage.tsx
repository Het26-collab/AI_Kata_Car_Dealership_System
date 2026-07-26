import { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useVehicles } from "../hooks/useVehicles";
import type { Vehicle, VehicleStatus } from "../types/vehicle";
import { SortableVehicleCard } from "../components/pipeline/SortableVehicleCard";
import { PipelineColumn } from "../components/pipeline/PipelineColumn";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";

const STATUSES = ["In Transit", "In Stock", "Reserved"];

export function PipelinePage() {
  const { vehicles, isLoading, updateVehicle } = useVehicles({ limit: 100, sort: "newest" });
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [items, setItems] = useState<Record<string, Vehicle[]>>({
    "In Transit": [],
    "In Stock": [],
    "Reserved": [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!vehicles) return;
    const newItems: Record<string, Vehicle[]> = { "In Transit": [], "In Stock": [], "Reserved": [] };
    vehicles.forEach((v) => {
      const statusKey = v.status && STATUSES.includes(v.status) ? v.status : "In Stock";
      newItems[statusKey].push(v);
    });
    setItems(newItems);
  }, [vehicles]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: any) {
    if (!isAdmin) {
      showToast({
        variant: "warning",
        title: "Access Restricted",
        description: "Pipeline status updates require Administrator privileges.",
      });
      return;
    }
    setActiveId(event.active.id);
  }

  function handleDragOver(event: any) {
    if (!isAdmin) return;
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;
    
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;
    
    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((v) => v.id === activeId);
      const overIndex = overItems.findIndex((v) => v.id === overId);
      
      let newIndex = overIndex >= 0 ? overIndex : overItems.length;
      const movedItem = { ...activeItems[activeIndex], status: overContainer };
      
      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter((item) => item.id !== activeId),
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          movedItem,
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);
    if (!isAdmin) return;
    if (!over) return;
    
    const targetId = active.id;
    // Find container where the item currently resides after drag
    const currentContainer = findContainer(targetId);
    if (!currentContainer) return;

    // Check actual vehicle object in backend dataset to see if container changed
    const targetVehicle = vehicles.find((v) => v.id === targetId);
    if (targetVehicle && targetVehicle.status !== currentContainer) {
      try {
        await updateVehicle(targetId, { status: currentContainer as VehicleStatus });
        showToast({
          variant: "success",
          title: "Status Updated",
          description: `${targetVehicle.year} ${targetVehicle.make} ${targetVehicle.model} status updated to ${currentContainer}.`,
        });
      } catch (err) {
        showToast({
          variant: "error",
          title: "Update Failed",
          description: "Failed to persist pipeline status change.",
        });
      }
    }
  }

  function findContainer(id: string) {
    if (STATUSES.includes(id)) return id;
    return Object.keys(items).find((key) => items[key].find((item) => item.id === id));
  }

  const activeVehicle = activeId ? vehicles.find((v) => v.id === activeId) : null;

  return (
    <DashboardLayout>
      <div className="mb-md">
        <h1 className="text-headline-md font-bold text-on-surface">Inventory Pipeline</h1>
        <p className="text-body-md text-on-surface-variant">Drag and drop vehicles to update their status instantly.</p>
      </div>

      {!isAdmin && (
        <div className="mb-md flex items-center gap-sm rounded-lg border border-amber-500/30 bg-amber-500/10 p-md text-amber-800 dark:text-amber-200">
          <span className="material-symbols-outlined text-[20px]">info</span>
          <span className="text-body-md font-medium">
            Viewing Mode: Status drag-and-drop workflow updates are restricted to Dealership Administrators.
          </span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-lg h-[calc(100vh-200px)]">
          {STATUSES.map((status) => (
            <PipelineColumn key={status} id={status} title={status} items={items[status]} isLoading={isLoading} />
          ))}
        </div>

        <DragOverlay>
          {activeVehicle ? <SortableVehicleCard vehicle={activeVehicle} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </DashboardLayout>
  );
}
