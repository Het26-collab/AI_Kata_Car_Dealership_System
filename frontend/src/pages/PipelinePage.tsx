import { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useVehicles } from "../hooks/useVehicles";
import type { Vehicle } from "../types/vehicle";
import { SortableVehicleCard } from "../components/pipeline/SortableVehicleCard";
import { PipelineColumn } from "../components/pipeline/PipelineColumn";
import { useToast } from "../hooks/useToast";

const STATUSES = ["In Transit", "In Stock", "Reserved"];

export function PipelinePage() {
  const { vehicles, isLoading, updateVehicle } = useVehicles({ sort: "newest" });
  const [items, setItems] = useState<Record<string, Vehicle[]>>({
    "In Transit": [],
    "In Stock": [],
    "Reserved": [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!vehicles || vehicles.length === 0) return;
    const newItems: Record<string, Vehicle[]> = { "In Transit": [], "In Stock": [], "Reserved": [] };
    vehicles.forEach((v) => {
      if (newItems[v.status]) newItems[v.status].push(v);
    });
    setItems(newItems);
  }, [vehicles]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event: any) {
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
      
      let newIndex = overIndex >= 0 ? overIndex : overItems.length + 1;
      
      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter((item) => item.id !== activeId)],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          activeItems[activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;
    
    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const activeIndex = items[activeContainer].findIndex((v) => v.id === activeId);
      const overIndex = items[overContainer].findIndex((v) => v.id === overId);
      
      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
        }));
      }
    } else {
      // It moved across columns. We need to update vehicle status and save to backend!
      setItems((prev) => {
        const updatedOver = prev[overContainer].map((v) =>
          v.id === activeId ? { ...v, status: overContainer } : v
        );
        return {
          ...prev,
          [overContainer]: updatedOver,
        };
      });

      try {
        await updateVehicle(activeId, { status: overContainer });
        showToast({
          variant: "success",
          title: "Status Updated",
          description: `Vehicle moved to ${overContainer}.`,
        });
      } catch (err) {
        showToast({
          variant: "error",
          title: "Update Failed",
          description: "Failed to save the status change.",
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
