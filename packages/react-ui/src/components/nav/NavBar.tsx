/**
 * Modern responsive navigation bar component with dropdown support
 *
 * @component
 * @param {NavBarProps} props - Component props
 * @param {NavItem[]} props.items - Array of navigation items
 * @param {Object} [props.logoProps] - Props for the Mantic logo
 *
 * Features:
 * - Responsive design with hamburger menu for mobile
 * - Dropdown menus for items with subLinks
 * - Keyboard navigation support
 * - Animated transitions
 * - Mobile-first approach
 */
import { useState, useEffect, useRef } from 'react';
import { NavBarProps, NavItem } from './nav';
import { motion, AnimatePresence } from 'framer-motion';
import { AviatorButton } from '../custom/aviator-button';

const NavBar: React.FC<NavBarProps> = ({ items }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
    const hasDropdown = item.subLinks && item.subLinks.length > 0;
    const isActive = activeDropdown === item.label;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isActive) {
        const handleClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          const isLink = target.tagName === 'A' || target.closest('a');

          // If clicking a link, let the navigation happen naturally
          if (isLink) {
            // Close the dropdown after a brief delay to allow navigation
            setTimeout(() => setActiveDropdown(null), 100);
            return;
          }

          // If clicking outside the dropdown, close it
          if (!dropdownRef.current?.contains(target)) {
            setActiveDropdown(null);
          }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
      }
    }, [isActive]);

    // If it's a regular link without dropdown, render as a simple anchor
    if (!hasDropdown) {
      return (
        <div className="flex items-center">
          <a
            href={item.href}
            className="px-3 py-4 lg:py-2 text-base font-medium text-aviator-black hover:text-da-green-500 transition-colors"
          >
            {item.label}
          </a>
        </div>
      );
    }

    return (
      <div className="relative group">
        <div className="inline-flex items-center w-fit">
          <button
            onClick={() => {
              if (hasDropdown) {
                setActiveDropdown(isActive ? null : item.label);
              }
            }}
            className="flex items-center px-3 py-4 lg:py-2 text-base font-medium text-aviator-black hover:text-da-green-500 transition-colors"
          >
            {item.label}
            {hasDropdown && (
              <motion.svg
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            )}
          </button>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: hasDropdown && isActive ? 1 : 0,
              opacity: hasDropdown && isActive ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 h-[2px] rounded-full w-full bg-da-green-500 origin-left hidden lg:block "
          />
        </div>

        {/* Desktop Dropdown Menu */}
        <AnimatePresence>
          {hasDropdown && isActive && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-52 rounded-md rounded-tl-none shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden lg:block"
            >
              <div className="py-1">
                {item.subLinks?.map(subLink => (
                  <a
                    key={subLink.href}
                    href={subLink.href}
                    className="group flex items-center px-4 py-2 text-sm text-aviator-black hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium text-base w-full">{subLink.label}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Accordion Menu */}
        <AnimatePresence>
          {hasDropdown && isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              {item.subLinks?.map(subLink => (
                <a
                  key={subLink.href}
                  href={subLink.href}
                  className="block pl-8 py-4 text-aviator-black hover:text-da-green-500"
                >
                  <div className="flex items-center">
                    <p className="text-base">{subLink.label}</p>
                  </div>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Helper function to identify special nav items
  const isSpecialNavItem = (label: string) => label === 'Login' || label === 'Waitlist';

  return (
    <div>
      <div className="w-screen px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex h-16 items-center justify-between max-w-[80rem] mx-auto">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a className="flex items-start" href="/">
              <span className="text-aviator-black font-[900] text-3xl font-michroma">AVIATOR</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Regular nav items */}
            {items
              .filter(item => !isSpecialNavItem(item.label))
              .map(item => (
                <NavLink key={item.label} item={item} />
              ))}

            {/* Special buttons if they exist in items */}
            <div className="flex items-center space-x-2">
              {items.map(item => {
                if (item.label === 'Waitlist') {
                  return (
                    <AviatorButton
                      key={item.label}
                      asLink={true}
                      href={item.href}
                      rounded="rounded-md"
                    >
                      Join the Waitlist
                    </AviatorButton>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-100/50 hover:text-da-green-500/90 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 right-0 top-20 w-full bg-aviator-background/80 backdrop-blur-md lg:hidden overflow-y-auto"
      >
        <div className="px-4">
          {/* Regular nav items */}
          {items
            .filter(item => !isSpecialNavItem(item.label))
            .map(item => (
              <div key={item.label}>
                <NavLink item={item} />
              </div>
            ))}

          {/* Special buttons with updated mobile styling */}
          {items.map(item => {
            if (item.label === 'Waitlist') {
              return (
                <div key={item.label} className="pt-4">
                  <AviatorButton
                    asLink={true}
                    href={item.href}
                    className="group relative overflow-hidden px-8 py-3 text-center font-bold transition-all hover:bg-da-green-500/90 w-full block text-lg"
                    rounded="rounded-lg"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      <span>Join the Waitlist</span>
                      <svg
                        className="h-6 w-6 text-white transform transition-all duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                  </AviatorButton>
                </div>
              );
            }
            if (item.label === 'Login') {
              return (
                <div key={item.label} className="pt-4">
                  <a
                    href={item.href}
                    className="group relative overflow-hidden rounded-lg recess-border border-gray-200 bg-white px-8 py-3 text-center font-medium transition-all hover:bg-gray-50 w-full block"
                  >
                    <div className="relative z-10 flex items-center justify-center space-x-3">
                      <span className="text-lg text-aviator-black">{item.label}</span>
                      <svg
                        className="h-6 w-6 text-aviator-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </a>
                </div>
              );
            }
            return null;
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default NavBar;
