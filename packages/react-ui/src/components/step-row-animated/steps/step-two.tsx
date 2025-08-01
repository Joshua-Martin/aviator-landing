import React, { useRef, useState, useEffect } from 'react';
import {
  Blocks,
  Bot,
  Settings2,
  Zap,
  Copy,
  Sparkles,
  PanelRight,
  SquareSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepTwoContent from './step-two-content';
import { cn } from '../../../lib/utils';

/**
 * Animation phases for the cursor and context menu sequence, extended for bot menu and avatar floating.
 */
type AnimationPhase =
  | 'idle'
  | 'moving-to-name'
  | 'hovering-name'
  | 'clicking-name'
  | 'showing-menu'
  | 'moving-to-menu-item'
  | 'hovering-menu-item'
  | 'clicking-menu-item'
  | 'hiding-menu'
  | 'moving-to-bot'
  | 'hovering-bot'
  | 'clicking-bot'
  | 'showing-bot-menu'
  | 'moving-to-bot-menu-item'
  | 'hovering-bot-menu-item'
  | 'clicking-bot-menu-item'
  | 'hiding-bot-menu'
  | 'animating-avatar-floating'
  | 'waiting-after-float'
  | 'returning-home';

/**
 * iOS-style context menu options for the name span.
 */
const contextMenuOptions = [
  { key: 'edit', label: 'Edit', icon: Settings2 },
  { key: 'make-dynamic', label: 'Make Dynamic', icon: Zap },
  { key: 'copy', label: 'Copy', icon: Copy },
];

/**
 * Bot menu options for avatar position.
 */
const botMenuOptions = [
  { key: 'floating', label: 'Floating' },
  { key: 'sidebar', label: 'Sidebar' },
];

/**
 * StepTwo component with animated cursor and context menu interaction.
 *
 * - Cursor moves to the name, clicks, opens menu, moves to 'Make Dynamic', clicks, closes menu, and resets.
 * - Uses Framer Motion for smooth animation.
 * - iOS-style context menu with icons and highlight on hover/click.
 */
export const StepTwo: React.FC = () => {
  // Animation and state
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');
  const [isNameClicked, setIsNameClicked] = useState(false);
  const [isNameDynamic, setIsNameDynamic] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuHoverIdx, setMenuHoverIdx] = useState<number | null>(null);
  const [menuClickIdx, setMenuClickIdx] = useState<number | null>(null);
  const animationRunning = useRef(false);

  // New state for bot menu and avatar position
  const [showBotMenu, setShowBotMenu] = useState(false);
  const [botMenuHoverIdx, setBotMenuHoverIdx] = useState<number | null>(null);
  const [botMenuClickIdx, setBotMenuClickIdx] = useState<number | null>(null);
  const [avatarPosition, setAvatarPosition] = useState<'sidebar' | 'floating'>('sidebar');
  const [animatingAvatar, setAnimatingAvatar] = useState(false);

  // Refs for positioning
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const botIconRef = useRef<HTMLDivElement>(null);
  const botMenuRef = useRef<HTMLDivElement>(null);
  const botMenuItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const homeRef = useRef<HTMLDivElement>(null);

  // Add state for menu position
  const [menuPosition, setMenuPosition] = useState<{ left: number; top: number } | null>(null);
  const [botMenuPosition, setBotMenuPosition] = useState<{ right: number; top: number } | null>(
    null
  );

  // Add a ref to track the last cursor position
  const lastCursorPosition = useRef<{ x: string; y: string }>({ x: '50%', y: '200px' });

  /**
   * Animation loop for cursor and menu sequence.
   * Loops continuously.
   */
  useEffect(() => {
    if (animationRunning.current) return;
    animationRunning.current = true;

    const waitForMenuRender = async (ref: React.RefObject<HTMLDivElement>, timeout = 300) => {
      // Wait until the menu ref is set (rendered), or timeout
      const start = Date.now();
      while (!ref.current && Date.now() - start < timeout) {
        await new Promise(res => setTimeout(res, 10));
      }
    };

    const runAnimationLoop = async () => {
      while (animationRunning.current) {
        // Move to name
        setAnimationPhase('moving-to-name');
        await new Promise(res => setTimeout(res, 1200));
        setAnimationPhase('hovering-name');
        await new Promise(res => setTimeout(res, 400));
        setAnimationPhase('clicking-name');
        setIsNameClicked(true);
        await new Promise(res => setTimeout(res, 250));
        setAnimationPhase('showing-menu');
        setTimeout(() => {
          const nameRect = nameRef.current?.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (nameRect && containerRect) {
            setMenuPosition({
              left: nameRect.left + nameRect.width / 2 - containerRect.left,
              top: nameRect.bottom - containerRect.top + 8,
            });
          }
        }, 0);
        setShowMenu(true);
        await waitForMenuRender(menuRef, 300); // Wait for menu to render
        await new Promise(res => setTimeout(res, 600));
        // Move to 'Make Dynamic' menu item
        setAnimationPhase('moving-to-menu-item');
        await new Promise(res => setTimeout(res, 900));
        setAnimationPhase('hovering-menu-item');
        setMenuHoverIdx(1); // 'Make Dynamic' is index 1
        await new Promise(res => setTimeout(res, 400));
        setAnimationPhase('clicking-menu-item');
        setMenuClickIdx(1);
        await new Promise(res => setTimeout(res, 250));
        // Apply dynamic name
        setIsNameDynamic(true);
        setShowMenu(false);
        setMenuHoverIdx(null);
        setMenuClickIdx(null);
        setAnimationPhase('hiding-menu');
        await new Promise(res => setTimeout(res, 500));
        // --- New: Animate to Bot Icon ---
        setAnimationPhase('moving-to-bot');
        await new Promise(res => setTimeout(res, 900));
        setAnimationPhase('hovering-bot');
        await new Promise(res => setTimeout(res, 400));
        setAnimationPhase('clicking-bot');
        await new Promise(res => setTimeout(res, 250));
        // Show bot menu
        setAnimationPhase('showing-bot-menu');
        setTimeout(() => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            setBotMenuPosition({
              right: 16, // 16px from the right edge of the container
              top: 48, // 48px from the top of the container (approx header height + margin)
            });
          }
        }, 0);
        setShowBotMenu(true);
        await waitForMenuRender(botMenuRef, 300); // Wait for bot menu to render
        await new Promise(res => setTimeout(res, 600));
        // Move to 'Floating' menu item
        setAnimationPhase('moving-to-bot-menu-item');
        await new Promise(res => setTimeout(res, 900));
        setAnimationPhase('hovering-bot-menu-item');
        setBotMenuHoverIdx(0); // 'Floating' is index 0
        await new Promise(res => setTimeout(res, 400));
        setAnimationPhase('clicking-bot-menu-item');
        setBotMenuClickIdx(0);
        await new Promise(res => setTimeout(res, 250));
        // Apply floating avatar
        setAvatarPosition('floating');
        setShowBotMenu(false);
        setBotMenuHoverIdx(null);
        setBotMenuClickIdx(null);
        setAnimationPhase('hiding-bot-menu');
        await new Promise(res => setTimeout(res, 500));
        // Animate avatar floating
        setAnimatingAvatar(true);
        setAnimationPhase('animating-avatar-floating');
        await new Promise(res => setTimeout(res, 800));
        setAnimatingAvatar(false);
        setAnimationPhase('waiting-after-float');
        await new Promise(res => setTimeout(res, 1000));
        // Reset other states, but NOT avatarPosition yet
        setIsNameClicked(false);
        setIsNameDynamic(false);
        setMenuPosition(null);
        setBotMenuPosition(null);
        setAnimationPhase('returning-home');
        await new Promise(res => setTimeout(res, 1200));
        setAvatarPosition('sidebar');
        setAnimationPhase('idle');
        await new Promise(res => setTimeout(res, 800));
      }
    };
    runAnimationLoop();
    return () => {
      animationRunning.current = false;
    };
  }, []);

  /**
   * Calculates the cursor position based on the current animation phase.
   * Uses refs to get actual element positions for responsive accuracy.
   * Holds the cursor at the last known position if the target is not rendered yet.
   * @returns The x and y coordinates for the cursor.
   */
  const getCursorPosition = () => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return lastCursorPosition.current;
    // Home position: centered on the card
    const homeRect = homeRef.current?.getBoundingClientRect();
    if (animationPhase === 'idle' || animationPhase === 'returning-home') {
      if (homeRect) {
        const pos = {
          x: `${homeRect.left + homeRect.width / 2 - containerRect.left}px`,
          y: `${homeRect.top + homeRect.height / 2 - containerRect.top}px`,
        };
        lastCursorPosition.current = pos;
        return pos;
      }
      return lastCursorPosition.current;
    }
    // Move to name
    if (
      animationPhase === 'moving-to-name' ||
      animationPhase === 'hovering-name' ||
      animationPhase === 'clicking-name'
    ) {
      const nameRect = nameRef.current?.getBoundingClientRect();
      if (nameRect) {
        const pos = {
          x: `${nameRect.left + nameRect.width / 2 - containerRect.left}px`,
          y: `${nameRect.top + nameRect.height / 2 - containerRect.top}px`,
        };
        lastCursorPosition.current = pos;
        return pos;
      }
      return lastCursorPosition.current;
    }
    // Move to menu item
    if (
      animationPhase === 'showing-menu' ||
      animationPhase === 'moving-to-menu-item' ||
      animationPhase === 'hovering-menu-item' ||
      animationPhase === 'clicking-menu-item' ||
      animationPhase === 'hiding-menu' // Hold at menu item during hiding
    ) {
      const menuItemRect = menuItemRefs.current[1]?.getBoundingClientRect(); // 'Make Dynamic'
      if (menuItemRect) {
        const pos = {
          x: `${menuItemRect.left + menuItemRect.width / 2 - containerRect.left}px`,
          y: `${menuItemRect.top + menuItemRect.height / 2 - containerRect.top}px`,
        };
        lastCursorPosition.current = pos;
        return pos;
      }
      // Fallback to menu center if menu is rendered
      const menuRect = menuRef.current?.getBoundingClientRect();
      if (menuRect) {
        const pos = {
          x: `${menuRect.left + menuRect.width / 2 - containerRect.left}px`,
          y: `${menuRect.top + menuRect.height / 2 - containerRect.top}px`,
        };
        lastCursorPosition.current = pos;
        return pos;
      }
      // If menu not rendered, hold at last position
      return lastCursorPosition.current;
    }
    // Move to Bot icon
    if (
      animationPhase === 'moving-to-bot' ||
      animationPhase === 'hovering-bot' ||
      animationPhase === 'clicking-bot'
    ) {
      const botRect = botIconRef.current?.getBoundingClientRect();
      if (botRect) {
        const pos = {
          x: `${botRect.left + botRect.width / 2 - containerRect.left}px`,
          y: `${botRect.top + botRect.height / 2 - containerRect.top}px`,
        };
        lastCursorPosition.current = pos;
        return pos;
      }
      return lastCursorPosition.current;
    }
    // Move to bot menu item
    if (
      animationPhase === 'showing-bot-menu' ||
      animationPhase === 'moving-to-bot-menu-item' ||
      animationPhase === 'hovering-bot-menu-item' ||
      animationPhase === 'clicking-bot-menu-item' ||
      animationPhase === 'hiding-bot-menu' // Hold at bot menu item during hiding
    ) {
      const botMenuItemRect = botMenuItemRefs.current[0]?.getBoundingClientRect(); // 'Floating'
      if (botMenuItemRect) {
        const pos = {
          x: `${botMenuItemRect.left + botMenuItemRect.width / 2 - containerRect.left}px`,
          y: `${botMenuItemRect.top + botMenuItemRect.height / 2 - containerRect.top}px`,
        };
        lastCursorPosition.current = pos;
        return pos;
      }
      // Fallback to bot menu center if rendered
      const botMenuRect = botMenuRef.current?.getBoundingClientRect();
      if (botMenuRect) {
        const pos = {
          x: `${botMenuRect.left + botMenuRect.width / 2 - containerRect.left}px`,
          y: `${botMenuRect.top + botMenuRect.height / 2 - containerRect.top}px`,
        };
        lastCursorPosition.current = pos;
        return pos;
      }
      // If bot menu not rendered, hold at last position
      return lastCursorPosition.current;
    }
    // Default fallback: hold at last position
    return lastCursorPosition.current;
  };

  /**
   * Renders the iOS-style context menu, positioned below the name span.
   */
  const renderContextMenu = () => (
    <AnimatePresence>
      {showMenu && menuPosition && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'absolute',
            left: menuPosition.left,
            top: menuPosition.top,
            transform: 'translateX(-50%)',
            zIndex: 50,
            width: 220,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 px-1 flex flex-col"
        >
          {contextMenuOptions.map((opt, idx) => {
            const Icon = opt.icon;
            const isHovered = menuHoverIdx === idx;
            const isClicked = menuClickIdx === idx;
            return (
              <motion.div
                key={opt.key}
                ref={el => (menuItemRefs.current[idx] = el)}
                className={`flex items-center p-2 rounded-xl cursor-pointer select-none transition-colors text-gray-900 text-sm font-medium ${
                  isHovered ? 'bg-gray-100' : ''
                } ${isClicked ? 'scale-95 bg-gray-200' : ''}`}
                style={{
                  marginBottom: idx !== contextMenuOptions.length - 1 ? 2 : 0,
                  boxShadow: isClicked ? '0 1px 4px 0 rgba(0,0,0,0.04)' : undefined,
                }}
              >
                <Icon className="w-5 h-5 mr-3 text-gray-500" />
                {opt.label}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  /**
   * Renders the Bot menu for avatar position selection.
   */
  const renderBotMenu = () => (
    <AnimatePresence>
      {showBotMenu && botMenuPosition && (
        <motion.div
          ref={botMenuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'absolute',
            right: botMenuPosition.right,
            top: botMenuPosition.top,
            zIndex: 40,
            width: 180,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 px-1 flex flex-col"
        >
          {botMenuOptions.map((opt, idx) => {
            const isHovered = botMenuHoverIdx === idx;
            const isClicked = botMenuClickIdx === idx;
            const isSelected = avatarPosition === opt.key;
            return (
              <motion.div
                key={opt.key}
                ref={el => (botMenuItemRefs.current[idx] = el)}
                className={`flex items-center p-2 rounded-xl cursor-pointer select-none transition-colors text-gray-900 text-sm font-medium ${
                  isHovered ? 'bg-gray-100' : ''
                } ${isClicked ? 'scale-95 bg-gray-200' : ''} ${isSelected ? 'font-bold text-da-pink-500' : ''}`}
                style={{
                  marginBottom: idx !== botMenuOptions.length - 1 ? 2 : 0,
                  boxShadow: isClicked ? '0 1px 4px 0 rgba(0,0,0,0.04)' : undefined,
                }}
              >
                {opt.label === 'Floating' ? (
                  <SquareSquare
                    className={cn(
                      'w-4 h-4 mr-3',
                      isSelected ? 'text-da-pink-500' : 'text-gray-500'
                    )}
                  />
                ) : (
                  <PanelRight
                    className={cn(
                      'w-4 h-4 mr-3',
                      isSelected ? 'text-da-pink-500' : 'text-gray-500'
                    )}
                  />
                )}
                {opt.label}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div className="bg-white rounded-xl shadow-2xl border-none overflow-hidden">
        {/* Editor Header */}
        <div className="flex flex-row space-x-4 items-center justify-between p-2 border-b border-gray-200 bg-white rounded-t-xl">
          <div className="flex flex-row space-x-2 items-center">
            <Blocks className="w-4 h-4 text-da-pink-500" />
            <span className="font-medium text-gray-700">Domo Editor</span>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <div ref={botIconRef} className="flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
        </div>
        {/* Animation Home Position (invisible) */}
        <div
          ref={homeRef}
          className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        {/* Main Content Row (relative for avatar absolute positioning) */}
        <div
          className={`flex flex-row space-x-2 p-2${avatarPosition === 'floating' ? ' w-full' : ''} relative`}
          style={{ minHeight: '12rem' }}
        >
          <StepTwoContent
            isNameClicked={isNameClicked}
            isNameDynamic={isNameDynamic}
            nameRef={nameRef}
            expandContent={avatarPosition === 'floating'}
          />
          {/* Animated Avatar Placeholder - always rendered, animates between sidebar and floating */}
          <motion.div
            layout
            layoutId="avatar-placeholder"
            initial={false}
            data-position={avatarPosition}
            transition={{
              layout: {
                type: 'spring',
                stiffness: 120,
                damping: 18,
                duration: animatingAvatar ? 0.8 : 0.5,
              },
              width: { duration: 0 },
              height: { duration: 0 },
              minHeight: { duration: 0 },
              borderRadius: { duration: 0 },
              backgroundColor: { duration: 0 },
              scale: { duration: 0 },
            }}
            className={
              avatarPosition === 'floating'
                ? 'absolute bottom-6 right-6 w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center z-40'
                : 'w-[14rem] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center relative min-h-[8rem] bg-gray-50'
            }
            aria-label={
              avatarPosition === 'floating'
                ? 'Floating AI avatar placeholder.'
                : 'Avatar video placeholder. Your AI avatar will appear here.'
            }
          >
            <div className="w-full h-full flex flex-col items-center justify-center py-6">
              <div className="relative flex flex-col items-center justify-center">
                {/* AI Icon (Sparkles) */}
                <Sparkles className="w-10 h-10 text-da-pink-500 mb-2" />
              </div>
              <span className="mt-2 text-xs text-gray-500 font-medium select-none text-center px-2">
                AI Avatar
              </span>
            </div>
          </motion.div>
        </div>
        {/* Context Menu Overlay */}
        {renderContextMenu()}
        {/* Bot Menu Overlay */}
        {renderBotMenu()}
        {/* Animated Cursor */}
        <motion.div
          className="absolute pointer-events-none z-50"
          style={{
            left: getCursorPosition().x,
            top: getCursorPosition().y,
          }}
          animate={{
            left: getCursorPosition().x,
            top: getCursorPosition().y,
          }}
          transition={{
            duration:
              animationPhase === 'moving-to-name' || animationPhase === 'returning-home'
                ? 1.2
                : animationPhase === 'moving-to-menu-item' ||
                    animationPhase === 'moving-to-bot-menu-item' ||
                    animationPhase === 'moving-to-bot'
                  ? 0.9
                  : 0.4,
            ease: 'easeInOut',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            <path
              d="M3 3L10.5 21L13.5 12L22.5 9L3 3Z"
              fill="white"
              stroke="black"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default StepTwo;
