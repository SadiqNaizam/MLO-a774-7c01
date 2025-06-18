import React from 'react';
import { motion, useDragControls, PanInfo } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility from shadcn/ui setup

interface WindowFrameProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string | number; height: string | number };
  zIndex?: number;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize?: (id: string) => void;
  onMaximize?: (id: string) => void;
  onFocus: (id: string) => void;
  constraintsRef?: React.RefObject<HTMLElement>; // Optional ref for drag constraints
}

const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  title,
  icon,
  children,
  initialPosition = { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 }, // Default to a slightly random position
  initialSize = { width: 640, height: 400 },
  zIndex,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  constraintsRef,
}) => {
  console.log(`WindowFrame '${id}' (${title}) loaded. Active: ${isActive}, zIndex: ${zIndex}`);
  const dragControls = useDragControls();

  const handleTitleBarPointerDown = (event: React.PointerEvent) => {
    // Prevent drag from triggering on text selection, etc.
    if (event.button !== 0) return; // Only main button (left-click)
    onFocus(id); // Ensure window focuses when drag starts on title bar
    dragControls.start(event, { snapToCursor: false }); // snapToCursor false feels more natural for windows
  };
  
  // Fallback initial position if not provided
  const finalInitialPosition = {
    x: initialPosition?.x ?? 50,
    y: initialPosition?.y ?? 50,
  };

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={constraintsRef} // Use parent-defined constraints if available
      dragElastic={0.1} // Allow slight elasticity if constraints are hit
      initial={{
        x: finalInitialPosition.x,
        y: finalInitialPosition.y,
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        x: finalInitialPosition.x, // Managed by drag after initial animation
        y: finalInitialPosition.y, // Managed by drag after initial animation
        opacity: 1,
        scale: 1,
        boxShadow: isActive 
          ? "0 0 0 1px rgba(100, 100, 200, 0.3), 0px 10px 30px -5px rgba(0, 0, 0, 0.3), 0px 5px 15px -7px rgba(0,0,0,0.2)" 
          : "0 0 0 1px rgba(50, 50, 50, 0.5), 0px 8px 20px -8px rgba(0, 0, 0, 0.4)",
      }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      style={{
        width: initialSize.width,
        height: initialSize.height,
        zIndex: zIndex,
        position: 'absolute', // Crucial for absolute positioning and dragging
      }}
      className={cn(
        "rounded-lg flex flex-col overflow-hidden border",
        isActive ? "border-neutral-500/70" : "border-neutral-700/50",
        "bg-neutral-800/85 backdrop-blur-xl shadow-2xl" // macOS-like frosted glass
      )}
      onMouseDownCapture={(e) => {
        // Focus window on any click within its bounds, not just title bar
        // This ensures clicking content also brings window to front
        if (e.button === 0) { // Only for left clicks
            onFocus(id);
        }
      }}
    >
      {/* Title Bar - The Drag Handle */}
      <div
        onPointerDown={handleTitleBarPointerDown}
        className={cn(
          "h-[33px] flex items-center justify-between px-3 select-none relative shrink-0",
          isActive ? "bg-neutral-700/50" : "bg-neutral-750/50", // Slightly different inactive bg
          "cursor-grab active:cursor-grabbing"
        )}
      >
        {/* Left side: Traffic Light Buttons */}
        <div className="flex items-center space-x-2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            className="w-[13px] h-[13px] rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group shrink-0"
            aria-label="Close"
            title="Close"
          >
            <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize?.(id); }}
            className="w-[13px] h-[13px] rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group shrink-0"
            aria-label="Minimize"
            title="Minimize"
            disabled={!onMinimize}
          >
            <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize?.(id); }}
            className="w-[13px] h-[13px] rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group shrink-0"
            aria-label="Maximize"
            title="Maximize"
            disabled={!onMaximize}
          >
            <Maximize2 className="w-[7px] h-[7px] text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
          </button>
        </div>

        {/* Center: Title and Icon (Absolutely centered) */}
        <div className={cn(
          "absolute left-0 right-0 top-1/2 -translate-y-1/2 text-[13px] font-medium text-center truncate pointer-events-none px-16", // Added padding to prevent overlap with buttons
          isActive ? "text-neutral-100" : "text-neutral-400"
        )}>
          {icon && React.isValidElement(icon) && 
            React.cloneElement(icon as React.ReactElement, {
              // Ensure icon is styled appropriately if it's a component
              className: cn("mr-1.5 inline-block align-middle h-[14px] w-[14px] -mt-px", (icon as React.ReactElement).props.className),
            })
          }
          {title}
        </div>
        
        {/* Right side placeholder to balance flexbox for the absolutely positioned title. Can be empty. */}
        <div className="z-10" aria-hidden="true" />
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-auto bg-neutral-200 dark:bg-[#2d2d2d] relative">
        {/* Example content background: light gray for light mode, custom dark for dark mode */}
        {children}
      </div>
    </motion.div>
  );
};

export default WindowFrame;