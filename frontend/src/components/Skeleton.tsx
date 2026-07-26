export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-md bg-surface-container-high ${className}`}>
      <div className="skeleton-shimmer h-full w-full rounded-md" />
    </div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-md">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="mt-md h-4 w-24" />
      <Skeleton className="mt-sm h-5 w-40" />
      <Skeleton className="mt-sm h-4 w-32" />
      <Skeleton className="mt-md h-10 w-full" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-lg py-md">
        <div className="flex items-center gap-md">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="hidden px-lg py-md sm:table-cell">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="px-lg py-md">
        <Skeleton className="h-6 w-20 rounded-full" />
      </td>
      <td className="px-lg py-md text-right">
        <Skeleton className="ml-auto h-4 w-16" />
      </td>
    </tr>
  );
}
