export const DEFAULT_CAR_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (target.src !== DEFAULT_CAR_IMAGE) {
    target.onerror = null; // prevent infinite loop
    target.src = DEFAULT_CAR_IMAGE;
  }
}
