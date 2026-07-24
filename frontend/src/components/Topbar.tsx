import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { initials } from "../utils/format";

interface TopbarProps {
  onSearch?: (value: string) => void;
  onMenuClick: () => void;
}

export function Topbar({ onSearch, onMenuClick }: TopbarProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center gap-md border-b border-outline-variant bg-surface-container-lowest/90 px-md backdrop-blur-md md:pl-[304px] md:pr-lg">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-sm text-on-surface-variant hover:bg-surface-container-low md:hidden"
        aria-label="Toggle navigation menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {onSearch && (
        <div className="relative hidden max-w-md flex-1 sm:flex">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Search inventory..."
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-sm pl-2xl pr-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-md">
        <button
          type="button"
          className="relative rounded-full p-sm text-on-surface-variant hover:bg-surface-container-low"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
        </button>
        <div className="flex items-center gap-sm">
          <div className="hidden text-right sm:block">
            <p className="text-body-md font-medium leading-tight text-on-surface">
              {user?.name || (user?.role === "admin" ? "Fleet Manager" : "Valued Client")}
            </p>
            <p className="text-label-md leading-tight text-on-surface-variant">
              {user?.role === "admin" ? "Administrator" : "Client / Buyer"}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-label-md font-semibold text-on-primary-container">
            {initials(user?.name || (user?.role === "admin" ? "Fleet Manager" : "Valued Client"))}
          </div>
        </div>
      </div>
    </header>
  );
}
