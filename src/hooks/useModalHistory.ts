import { useEffect, useRef, useCallback } from 'react';

export function useModalHistory(modalId: string, isOpen: boolean, onClose: () => void) {
  const hasHistoryRef = useRef(false);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      hasHistoryRef.current = false;
      return;
    }

    if (!hasHistoryRef.current) {
      if (window.history.state?.modalId !== modalId) {
        window.history.pushState({ modalId }, '');
      }
      hasHistoryRef.current = true;
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { modalId?: string } | null;
      if (state?.modalId !== modalId) {
        hasHistoryRef.current = false;
        onCloseRef.current();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, modalId]);

  const handleClose = useCallback(() => {
    if (hasHistoryRef.current) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

  return handleClose;
}
