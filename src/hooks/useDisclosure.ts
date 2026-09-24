'use client';

import { useCallback, useState } from 'react';

/**
 * Generic open/close state helper — mobile menus, modals, dropdowns,
 * accordions. Centralizing this avoids every component reinventing its own
 * `const [open, setOpen] = useState(false)` + three handler functions.
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
