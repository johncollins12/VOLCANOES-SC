'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';

type ToastVariant = 'info' | 'success' | 'error';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: 'border-border text-ink' },
  success: { icon: CheckCircle2, className: 'border-cyan/30 text-cyan' },
  error: { icon: XCircle, className: 'border-accent/30 text-accent' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toast = useCallback((input: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...input, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2"
          >
            {toasts.map((t) => {
              const { icon: Icon, className } = VARIANT_STYLES[t.variant];
              return (
                <div
                  key={t.id}
                  className={cn(
                    'flex items-start gap-3 rounded-card border bg-surface p-4 shadow-lg animate-fade-in',
                    className
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{t.title}</p>
                    {t.description && <p className="mt-0.5 text-sm text-muted">{t.description}</p>}
                  </div>
                  <IconButton icon={X} aria-label="Dismiss notification" size="sm" onClick={() => dismiss(t.id)} />
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be used within a <ToastProvider>');
  }
  return ctx;
}