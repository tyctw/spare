import { useEffect, useRef, useCallback } from 'react';

export function useModalHistory(modalId: string, isOpen: boolean, onClose: () => void) {
  const hasHistoryRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modalId }, '');
    hasHistoryRef.current = true;

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { modalId?: string } | null;
      if (state?.modalId !== modalId) {
        hasHistoryRef.current = false;
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, modalId, onClose]);

  const handleClose = useCallback(() => {
    if (hasHistoryRef.current) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

  return handleClose;
}
