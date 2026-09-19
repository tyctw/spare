import { useEffect, useState } from 'react';

/** Makes the skip-to-content shortcut available on routes that do not render it themselves. */
export default function AccessibilityEnhancements() {
  const [needsSkipLink, setNeedsSkipLink] = useState(false);

  useEffect(() => {
    const updateLandmark = () => {
      const main = document.querySelector<HTMLElement>('main');
      if (main) {
        if (!main.id) main.id = 'main-content';
        main.tabIndex = -1;
      }
      setNeedsSkipLink(!document.querySelector('.skip-link:not([data-a11y-skip])'));
    };

    updateLandmark();
    const observer = new MutationObserver(updateLandmark);
    observer.observe(document.getElementById('root')!, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const focusMainContent = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;

    if (!main.id) main.id = 'main-content';
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: 'start' });
  };

  return needsSkipLink ? <a href="#main-content" className="skip-link" data-a11y-skip onClick={focusMainContent}>跳到主要內容</a> : null;
}
