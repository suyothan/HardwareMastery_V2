import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Scroll behavior on route change:
 *   - PUSH / REPLACE (clicked a link / programmatic nav) → scroll to top.
 *   - POP (browser back / forward) → restore the scroll position the user
 *     had when they last left that path.
 *
 * Render this once, inside <Router>, above the route tree. It renders nothing.
 */
export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType(); // 'PUSH' | 'REPLACE' | 'POP'

  // Map of pathname -> last scrollY when the user navigated away from it.
  const positionsRef = useRef(new Map());
  // Pathname we're currently displaying, so we know which key to save under
  // when the location changes.
  const currentPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = currentPathRef.current;
    const nextPath = location.pathname;

    // Save the scroll position we're leaving, keyed by the *previous* path.
    if (prevPath !== nextPath) {
      positionsRef.current.set(prevPath, window.scrollY);
    }

    if (navType === 'POP') {
      // Back/forward — restore if we have a saved position, else go to top.
      const saved = positionsRef.current.get(nextPath) ?? 0;
      // Wait one frame so the new page has laid out and is tall enough
      // to actually accept the scroll.
      requestAnimationFrame(() => {
        window.scrollTo(0, saved);
      });
    } else {
      // PUSH or REPLACE — fresh navigation, start at the top.
      window.scrollTo(0, 0);
    }

    currentPathRef.current = nextPath;
  }, [location.pathname, navType]);

  return null;
}
