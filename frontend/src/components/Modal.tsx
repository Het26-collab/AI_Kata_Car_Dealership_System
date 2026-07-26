import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { backdropVariants, modalPanelVariants } from "../lib/motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}

export function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div
            className="absolute inset-0 bg-[#000000]/40 backdrop-blur-sm"
            onClick={onClose}
            variants={!prefersReduced ? backdropVariants : undefined}
            initial={!prefersReduced ? "hidden" : undefined}
            animate={!prefersReduced ? "visible" : undefined}
            exit={!prefersReduced ? "exit" : undefined}
          />
          <motion.div
            className={`relative w-full ${
              size === "lg" ? "max-w-2xl" : "max-w-md"
            } max-h-[90vh] overflow-y-auto rounded-xl bg-surface-container-lowest shadow-modal`}
            variants={!prefersReduced ? modalPanelVariants : undefined}
            initial={!prefersReduced ? "hidden" : undefined}
            animate={!prefersReduced ? "visible" : undefined}
            exit={!prefersReduced ? "exit" : undefined}
          >
            <div className="flex items-center justify-between border-b border-outline-variant px-lg py-md">
              <h2 id="modal-title" className="text-title-lg text-on-surface">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-lg py-lg">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-sm border-t border-outline-variant px-lg py-md">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
