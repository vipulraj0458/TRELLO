import { useEffect, useRef } from 'react';

/**
 * Calls handler when pointer / mousedown happens outside ref element.
 */
export function useClickOutside(isActive, handler) {
  const ref = useRef(null);
  const saved = useRef(handler);

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!isActive) return;

    const onDown = (e) => {
      const el = ref.current;
      if (!el || el.contains(e.target)) return;
      saved.current(e);
    };

    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [isActive]);

  return ref;
}
