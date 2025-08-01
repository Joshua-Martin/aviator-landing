import { useEffect, useMemo, useState } from 'react';
import { NavItem } from './nav';
import NavBar from './NavBar';

/**
 * Default navigation items used as fallback
 */
// No default nav items - we want to allow empty navigation
const defaultNavItems: NavItem[] = [];

/**
 * Interface for links data structure from links.json
 */
interface LinksData {
  /** Array of navigation items */
  links: NavItem[];
}

/**
 * NavBarRoot Component - Loads navigation links dynamically
 *
 * Features:
 * - Loads navigation data from links.json (dev) or js/components/links.json (prod)
 * - Falls back to default nav items on error or empty data
 * - Proper loading states and error handling
 * - Environment-aware path resolution
 *
 * @returns {JSX.Element}
 */
const NavBarRoot: React.FC = () => {
  /**
   * Determine the correct fetch path based on environment
   * - Development: './links.json'
   * - Production: './js/components/links.json'
   */
  const linksJsonPath = useMemo((): string => {
    // Vite uses import.meta.env.MODE for environment
    return import.meta.env.MODE === 'production' ? './js/components/links.json' : './links.json';
  }, []);

  /**
   * Memoize the fetch promise for links data
   * This avoids useEffect/useState for the fetch itself
   */
  const linksDataPromise = useMemo((): Promise<NavItem[]> => {
    return fetch(linksJsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load links: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((linksData: LinksData) => {
        // Only return the links if they exist and are valid
        if (!linksData || !Array.isArray(linksData.links)) {
          return [];
        }
        return linksData.links;
      })
      .catch(() => {
        // Use default nav items on any error
        return defaultNavItems;
      });
  }, [linksJsonPath]);

  /**
   * Local state for resolved data, error, and loading
   * This is only for promise resolution, not for the fetch itself
   */
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

  /**
   * Resolve the memoized fetch promise on mount or when the path changes
   * This is the only useEffect, just for promise resolution
   */
  useEffect(() => {
    let isMounted = true;

    linksDataPromise
      .then(data => {
        if (isMounted) {
          setNavItems(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setNavItems(defaultNavItems);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [linksDataPromise]);

  // Always render NavBar, even during loading (may have no items)
  return <NavBar items={navItems} />;
};

export default NavBarRoot;
