import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For potential page-level animations if needed

// Custom Components
import DesktopFileIcon, { DesktopIconType, FileMimeType } from '@/components/DesktopFileIcon';
import WindowFrame from '@/components/WindowFrame';
import MenuBarItem from '@/components/MenuBarItem';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Lucide Icons
import {
  Apple,
  FolderKanban,
  LayoutGrid,
  StickyNote,
  Settings,
  AppWindow,
  Maximize2,
  Minus,
  X,
  Info,
  Power,
  Search,
  FileText,
  Folder,
  ImageIcon as LucideImageIcon,
} from 'lucide-react';

// Page Components to be rendered in WindowFrames
import FinderInterface from './FinderInterface';
import GenericAppInterface from './GenericAppInterface';
import SystemPreferencesInterface from './SystemPreferencesInterface';

const WALLPAPER_URL = 'https://images.unsplash.com/photo-1617574004387-a591080a11ea?auto=format&fit=crop&w=1920&q=80'; // macOS Monterey like

interface DesktopIconData {
  id: string;
  name: string;
  type: DesktopIconType;
  fileMimeType?: FileMimeType;
  icon?: React.ReactNode;
  position: { x: number; y: number };
  isSelected: boolean;
  onDoubleClickAction?: () => void;
}

interface WindowData {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  position?: { x: number; y: number };
  size?: { width: string | number; height: string | number };
  zIndex: number;
  isActive: boolean;
}

const initialDesktopIcons: DesktopIconData[] = [
  {
    id: 'docs-folder',
    name: 'Documents',
    type: 'folder',
    position: { x: 40, y: 40 },
    isSelected: false,
  },
  {
    id: 'notes-file',
    name: 'My Notes.txt',
    type: 'file',
    fileMimeType: 'document',
    position: { x: 40, y: 150 },
    isSelected: false,
  },
  {
    id: 'wallpaper-img',
    name: 'Background.jpg',
    type: 'file',
    fileMimeType: 'image',
    position: { x: 40, y: 260 },
    isSelected: false,
  },
];

const DesktopEnvironmentPage: React.FC = () => {
  console.log('DesktopEnvironmentPage loaded');
  const navigate = useNavigate();
  const desktopConstraintsRef = useRef<HTMLDivElement>(null);

  const [desktopIcons, setDesktopIcons] = useState<DesktopIconData[]>(initialDesktopIcons);
  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState<number>(10);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update time every minute
    return () => clearInterval(timer);
  }, []);


  const launchApp = useCallback((appId: string, appName: string, appContent: React.ReactNode, appIcon?: React.ReactNode, initialSize?: { width: string | number; height: string | number }) => {
    setOpenWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.id === appId);
      const newZ = nextZIndex + 1;
      setNextZIndex(newZ);

      if (existingWindow) {
        return prevWindows.map(w =>
          w.id === appId
            ? { ...w, isActive: true, zIndex: newZ }
            : { ...w, isActive: false }
        ).sort((a, b) => a.zIndex - b.zIndex);
      } else {
        // Calculate initial position to avoid all windows opening at the exact same spot
        const x = 100 + (prevWindows.length % 5) * 30; // Cascade new windows slightly
        const y = 100 + (prevWindows.length % 5) * 30;

        return [
          ...prevWindows.map(w => ({ ...w, isActive: false })),
          {
            id: appId,
            title: appName,
            icon: appIcon,
            content: appContent,
            position: { x, y },
            size: initialSize || { width: 720, height: 480 }, // Default size
            zIndex: newZ,
            isActive: true,
          },
        ].sort((a, b) => a.zIndex - b.zIndex);
      }
    });
    setActiveWindowId(appId);
  }, [nextZIndex]);

  const dockApps = [
    {
      id: 'finder',
      name: 'Finder',
      icon: <FolderKanban size={32} />,
      action: () => launchApp('finder', 'Finder', <FinderInterface />, <FolderKanban size={16} />, {width: 800, height: 600}),
    },
    {
      id: 'launchpad',
      name: 'Launchpad',
      icon: <LayoutGrid size={32} />,
      action: () => navigate('/launchpad-interface'),
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: <StickyNote size={32} />,
      action: () => launchApp('notes', 'Notes', <GenericAppInterface appName="Notes" />, <StickyNote size={16} />),
    },
    {
      id: 'system-preferences',
      name: 'System Settings',
      icon: <Settings size={32} />,
      action: () => launchApp('system-preferences', 'System Settings', <SystemPreferencesInterface />, <Settings size={16} />, {width: 860, height: 580}),
    },
    {
      id: 'generic-app',
      name: 'My App',
      icon: <AppWindow size={32} />,
      action: () => launchApp('generic-app', 'My App', <GenericAppInterface appName="My App Example" />, <AppWindow size={16} />),
    },
  ];

  const appleMenuItems = [
    { label: 'About This Mac', onClick: () => launchApp('about-this-mac', 'About This Mac', <div className="p-4"><h2 className="text-lg font-semibold">macOS Web Simulation</h2><p className="text-sm mt-2">Version 1.0 (Alpha)<br/>Created by mlo AI</p></div>, <Apple size={16} />, {width: 400, height: 200}) },
    { isSeparator: true },
    { label: 'System Settings...', onClick: () => dockApps.find(app => app.id === 'system-preferences')?.action() },
    { label: 'App Store...', onClick: () => console.log('App Store clicked (not implemented)') },
    { isSeparator: true },
    { label: 'Recent Items', onClick: () => console.log('Recent Items clicked (not implemented)'), disabled: true },
    { isSeparator: true },
    { label: 'Force Quit...', onClick: () => console.log('Force Quit clicked (not implemented)'), shortcut: '⌥⌘⎋' },
    { isSeparator: true },
    { label: 'Sleep', onClick: () => console.log('Sleep (not implemented)') },
    { label: 'Restart...', onClick: () => console.log('Restart (not implemented)') },
    { label: 'Shut Down...', onClick: () => console.log('Shut Down (not implemented)') },
    { isSeparator: true },
    { label: 'Lock Screen', onClick: () => console.log('Lock Screen (not implemented)'), shortcut: '⌃⌘Q' },
    { label: 'Log Out User...', onClick: () => console.log('Log Out (not implemented)'), shortcut: '⇧⌘Q' },
  ];

  const fileMenuItems = [
    { label: 'New Finder Window', onClick: () => dockApps.find(app => app.id === 'finder')?.action(), shortcut: '⌘N' },
    { label: 'New Folder', onClick: () => console.log('New Folder (not implemented)'), shortcut: '⇧⌘N' },
    { label: 'Open...', onClick: () => console.log('Open (not implemented)'), shortcut: '⌘O' },
    { label: 'Close Window', onClick: () => activeWindowId && handleWindowClose(activeWindowId), shortcut: '⌘W' },
  ];
  
  const editMenuItems = [
    { label: 'Undo', onClick: () => console.log('Undo (not implemented)'), shortcut: '⌘Z' },
    { label: 'Redo', onClick: () => console.log('Redo (not implemented)'), shortcut: '⇧⌘Z' },
    { isSeparator: true },
    { label: 'Cut', onClick: () => console.log('Cut (not implemented)'), shortcut: '⌘X' },
    { label: 'Copy', onClick: () => console.log('Copy (not implemented)'), shortcut: '⌘C' },
    { label: 'Paste', onClick: () => console.log('Paste (not implemented)'), shortcut: '⌘V' },
    { isSeparator: true },
    { label: 'Select All', onClick: () => console.log('Select All (not implemented)'), shortcut: '⌘A' },
  ];

  const handleWindowClose = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null); // Or set to next top window
    }
  };

  const handleWindowFocus = (id: string) => {
    if (activeWindowId === id) return; // Already active
    const newZ = nextZIndex + 1;
    setNextZIndex(newZ);
    setOpenWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, isActive: true, zIndex: newZ } : { ...w, isActive: false }
      ).sort((a, b) => a.zIndex - b.zIndex)
    );
    setActiveWindowId(id);
  };
  
  const handleWindowMinimize = (id: string) => {
    console.log(`Minimize window: ${id} (not fully implemented)`);
    // Basic minimize: hide the window, could add to a "minimized" list in dock later
    setOpenWindows(prev => prev.map(w => w.id === id ? {...w, content: <></>, size: {width:0, height:0}, isActive: false} : w ));
     if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleWindowMaximize = (id: string) => {
    console.log(`Maximize window: ${id} (not fully implemented)`);
    // This would typically involve changing the window size to fill screen or toggle full-screen state
    // For simplicity, we'll just log
  };

  const handleIconSelect = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent desktop click from deselecting
    setDesktopIcons(prev => prev.map(icon => ({ ...icon, isSelected: icon.id === id })));
     // Deselect any active window if an icon is selected
    if (activeWindowId) {
      setOpenWindows(prev => prev.map(w => ({ ...w, isActive: false })));
      setActiveWindowId(null);
    }
  };

  const handleIconDoubleClick = (id: string, type: DesktopIconType) => {
    console.log('Double clicked icon:', id, type);
    const iconData = desktopIcons.find(icon => icon.id === id);
    if (iconData?.onDoubleClickAction) {
      iconData.onDoubleClickAction();
    } else if (type === 'folder') {
      launchApp(`folder-window-${id}`, iconData?.name || 'Folder', <FinderInterface />, <Folder size={16} />);
    } else {
       launchApp(`file-window-${id}`, iconData?.name || 'File', <GenericAppInterface appName={iconData?.name || 'File Viewer'} />, <FileText size={16} />);
    }
  };

  const handleIconDragEnd = (iconId: string, newScreenPosition: { x: number; y: number }) => {
    if (desktopConstraintsRef.current) {
      const parentRect = desktopConstraintsRef.current.getBoundingClientRect();
      // Calculate position relative to the draggable area (desktopConstraintsRef)
      let relativeX = newScreenPosition.x - parentRect.left;
      let relativeY = newScreenPosition.y - parentRect.top;

      // Simple clamping to keep icon somewhat within bounds
      // Assuming approximate icon width of 80-100px for clamping calculation
      const iconWidth = 96; 
      const iconHeight = 96; 
      relativeX = Math.max(0, Math.min(relativeX, parentRect.width - iconWidth));
      relativeY = Math.max(0, Math.min(relativeY, parentRect.height - iconHeight));
      
      setDesktopIcons(prev =>
        prev.map(icon =>
          icon.id === iconId ? { ...icon, position: { x: relativeX, y: relativeY } } : icon
        )
      );
    }
  };
  
  const handleDesktopClick = () => {
    // Deselect all icons
    setDesktopIcons(prev => prev.map(icon => ({ ...icon, isSelected: false })));
    // Deactivate any active window
    if (activeWindowId) {
      setOpenWindows(prev => prev.map(w => ({ ...w, isActive: false })));
      setActiveWindowId(null);
    }
  };


  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col bg-cover bg-center select-none"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
    >
      {/* Global Top Menu Bar */}
      <nav className="h-[28px] bg-white/30 dark:bg-black/30 backdrop-blur-md shadow px-3 flex items-center justify-between text-sm font-medium text-neutral-800 dark:text-neutral-100 shrink-0 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center">
          <MenuBarItem label={<Apple size={16} className="-mt-0.5" />} items={appleMenuItems} />
          <MenuBarItem label="File" items={fileMenuItems} />
          <MenuBarItem label="Edit" items={editMenuItems} />
          <MenuBarItem label="View" items={[{ label: 'Show View Options...', shortcut: '⌘J', onClick: () => console.log("View options") }]} />
          <MenuBarItem label="Go" items={[{ label: 'Home', shortcut: '⇧⌘H', onClick: () => console.log("Go Home") }]} />
          <MenuBarItem label="Window" items={[{ label: 'Minimize', shortcut: '⌘M', onClick: () => activeWindowId && handleWindowMinimize(activeWindowId) }]} />
          <MenuBarItem label="Help" items={[{ label: 'macOS Help', onClick: () => console.log("macOS Help") }]} />
        </div>
        <div className="flex items-center space-x-3">
          {/* Placeholder for Spotlight, Control Center */}
          <Search size={16} className="cursor-pointer hover:text-blue-500" title="Search"/>
          <span className="text-xs">{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} {currentTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit'})}</span>
        </div>
      </nav>

      {/* Desktop Area (for icons and windows) */}
      <main 
        ref={desktopConstraintsRef} 
        className="flex-1 relative isolate" // isolate for z-indexing context
        onClick={handleDesktopClick} // Click on desktop to deselect icons/windows
      >
        {desktopIcons.map(icon => (
          <DesktopFileIcon
            key={icon.id}
            id={icon.id}
            name={icon.name}
            type={icon.type}
            fileMimeType={icon.fileMimeType}
            icon={icon.icon}
            isSelected={icon.isSelected}
            position={icon.position}
            onSelect={handleIconSelect}
            onDoubleClick={handleIconDoubleClick}
            onDragEnd={handleIconDragEnd}
            dragConstraintsRef={desktopConstraintsRef}
          />
        ))}

        {openWindows.map(win => (
          <WindowFrame
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            initialPosition={win.position}
            initialSize={win.size}
            zIndex={win.zIndex}
            isActive={win.isActive}
            onClose={handleWindowClose}
            onMinimize={handleWindowMinimize}
            onMaximize={handleWindowMaximize}
            onFocus={handleWindowFocus}
            constraintsRef={desktopConstraintsRef}
          >
            {win.content}
          </WindowFrame>
        ))}
      </main>

      {/* Main Application Dock */}
      <footer 
        className="h-[70px] bg-white/20 dark:bg-black/20 backdrop-blur-lg flex justify-center items-center space-x-2 px-4 shrink-0 border-t border-black/10 dark:border-white/10"
        // Prevent click on dock from deselecting desktop elements
        onClick={(e) => e.stopPropagation()}
      >
        {dockApps.map(app => (
          <TooltipProvider key={app.id} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-2 h-auto w-auto flex flex-col items-center group relative"
                  onClick={app.action}
                  aria-label={`Launch ${app.name}`}
                >
                  <motion.div whileHover={{ scale: 1.3, y: -8 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                    {app.icon}
                  </motion.div>
                  {openWindows.some(w => w.id === app.id && w.isActive) && (
                     <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-neutral-700 dark:bg-neutral-300 rounded-full mb-[-6px]"></span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-1">
                <p>{app.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </footer>
      
      {/* Minimal Footer element as per layout_info (can be styled or removed if Dock is considered the footer) */}
      <div className="h-[4px] bg-black/10 dark:bg-white/5 text-xs text-transparent text-center shrink-0">
        .
      </div>
    </div>
  );
};

export default DesktopEnvironmentPage;