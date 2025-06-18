import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Folder,
  FileText,
  ImageIcon,
  Archive,
  Settings,
  Home,
  Download,
  Clock,
  Star,
  Briefcase, // For Applications in sidebar
  ArrowLeft,
  ArrowRight,
  Search as SearchIcon,
  LayoutGrid, // Icon view
  List as ListIcon, // List view
} from 'lucide-react';

// Custom Components
import WindowFrame from '@/components/WindowFrame';
import FinderSidebarItem from '@/components/FinderSidebarItem';
import DesktopFileIcon, { DesktopIconType, FileMimeType } from '@/components/DesktopFileIcon';

// Shadcn/UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'; // Added for toolbar buttons

interface MockEntry {
  id: string;
  name: string;
  type: DesktopIconType; // 'folder' | 'file'
  fileMimeType?: FileMimeType;
  kindString: string; // For Table "Kind" column
  size?: string;
  dateModified: string;
  position?: { x: number; y: number }; // For DesktopFileIcon view
  iconComponent: React.ReactNode; // For Table icon column
}

const initialMockData: MockEntry[] = [
  { id: 'folder-apps', name: 'Applications', type: 'folder', kindString: 'Folder', dateModified: 'Yesterday, 10:30 AM', position: {x: 30, y: 20}, iconComponent: <Folder className="h-5 w-5 text-blue-500" /> },
  { id: 'folder-docs', name: 'Documents', type: 'folder', kindString: 'Folder', dateModified: 'Today, 09:15 AM', position: {x: 30, y: 130}, iconComponent: <Folder className="h-5 w-5 text-blue-500" /> },
  { id: 'folder-pics', name: 'Pictures', type: 'folder', kindString: 'Folder', dateModified: 'Last Month', position: {x: 30, y: 240}, iconComponent: <Folder className="h-5 w-5 text-blue-500" /> },
  { id: 'file-img1', name: 'Sunset.jpg', type: 'file', fileMimeType: 'image', kindString: 'JPEG Image', size: '2.1 MB', dateModified: '2 days ago, 03:45 PM', position: {x: 170, y: 20}, iconComponent: <ImageIcon className="h-5 w-5 text-purple-500" /> },
  { id: 'file-doc1', name: 'Quarterly Report.docx', type: 'file', fileMimeType: 'document', kindString: 'Microsoft Word Document', size: '780 KB', dateModified: 'Yesterday, 05:00 PM', position: {x: 170, y: 130}, iconComponent: <FileText className="h-5 w-5 text-gray-500" /> },
  { id: 'file-arc1', name: 'Project_Assets.zip', type: 'file', fileMimeType: 'archive', kindString: 'ZIP Archive', size: '15.3 MB', dateModified: 'Last Week', position: {x: 170, y: 240}, iconComponent: <Archive className="h-5 w-5 text-yellow-600" /> },
  { id: 'file-code1', name: 'script.js', type: 'file', fileMimeType: 'code', kindString: 'JavaScript File', size: '12 KB', dateModified: 'Today, 11:00 AM', position: {x: 310, y: 20}, iconComponent: <FileText className="h-5 w-5 text-green-500" /> }, // Using FileText for generic code, could be Code2
];

const sidebarItems = [
  { icon: Star, label: "Favorites", isHeader: true },
  { icon: Clock, label: "Recents", to: "/finder-interface/recents" },
  { icon: Briefcase, label: "Applications", to: "/finder-interface/applications" },
  { icon: Home, label: "Desktop", to: "/finder-interface/desktop" },
  { icon: Folder, label: "Documents", to: "/finder-interface/documents" },
  { icon: Download, label: "Downloads", to: "/finder-interface/downloads" },
  { icon: Folder, label: "Pictures", to: "/finder-interface/pictures" },
  { icon: Folder, label: "Music", to: "/finder-interface/music" },
  { icon: Folder, label: "Movies", to: "/finder-interface/movies" },

];

const FinderInterface = () => {
  console.log('FinderInterface loaded');
  const navigate = useNavigate();
  const [items, setItems] = useState<MockEntry[]>(initialMockData);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'icon' | 'list'>('icon');
  const [searchTerm, setSearchTerm] = useState('');
  const contentAreaRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    navigate('/'); // Navigate to DesktopEnvironmentPage
  };

  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
  };

  const handleItemDoubleClick = (id: string, type: DesktopIconType) => {
    console.log(`Double clicked ${type} ID: ${id}`);
    // Placeholder: Open folder or file
  };

  const handleItemDragEnd = (id: string, newPosition: { x: number; y: number }) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, position: newPosition } : item
      )
    );
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute inset-0 bg-transparent flex items-center justify-center p-4 md:p-8 pointer-events-none"> {/* Wrapper for WindowFrame to be centered/positioned if needed, made transparent and pointer-events-none so it doesn't interfere with desktop */}
      <WindowFrame
        id="finder-main-window"
        title="Finder"
        initialPosition={{ x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 250 }} // Center-ish
        initialSize={{ width: 800, height: 550 }}
        isActive={true} // This page represents a single, active Finder window
        onClose={handleClose}
        onMinimize={() => console.log("Minimize Finder clicked")}
        onMaximize={() => console.log("Maximize Finder clicked")}
        onFocus={() => console.log("Finder window focused")} // Already "focused" in this context
        // constraintsRef could be a ref to a larger "desktop" div if this was part of DesktopEnvironmentPage.
        // For standalone page, it drags within viewport.
      >
        <TooltipProvider>
        <div className="flex flex-col h-full bg-neutral-100 dark:bg-[#2B2B2B] text-neutral-900 dark:text-neutral-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-1.5 border-b border-neutral-300 dark:border-neutral-600 flex items-center space-x-1 shrink-0 h-[44px]">
            <Tooltip>
              <TooltipTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-600 dark:text-neutral-400" disabled><ArrowLeft size={18} /></Button></TooltipTrigger>
              <TooltipContent><p>Back</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="ghost" size="icon" className="w-8 h-8 text-neutral-600 dark:text-neutral-400" disabled><ArrowRight size={18} /></Button></TooltipTrigger>
              <TooltipContent><p>Forward</p></TooltipContent>
            </Tooltip>
            
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 px-2 truncate">Current Folder</span>

            <div className="flex-grow"></div> {/* Spacer */}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={currentView === 'icon' ? 'secondary' : 'ghost'} size="icon" className="w-8 h-8" onClick={() => setCurrentView('icon')}>
                  <LayoutGrid size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Icon View</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={currentView === 'list' ? 'secondary' : 'ghost'} size="icon" className="w-8 h-8" onClick={() => setCurrentView('list')}>
                  <ListIcon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>List View</p></TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-5 mx-1" />

            <div className="relative w-48">
              <SearchIcon size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-8 h-8 text-sm bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:bg-white dark:focus:bg-neutral-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <ScrollArea className="w-52 bg-neutral-200/60 dark:bg-[#3A3A3A]/50 p-1.5 border-r border-neutral-300 dark:border-neutral-600 shrink-0">
              <nav className="space-y-0.5">
                {sidebarItems.map((item, index) => (
                  item.isHeader ? (
                    <h3 key={`header-${index}`} className="px-2 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-2 first:mt-0">
                      {item.label}
                    </h3>
                  ) : (
                    <FinderSidebarItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      to={item.to || '#'}
                      onClick={() => console.log(`Sidebar: ${item.label} clicked`)}
                    />
                  )
                ))}
              </nav>
            </ScrollArea>

            {/* Main Content */}
            <ScrollArea className="flex-1 relative bg-neutral-50 dark:bg-[#2B2B2B]" ref={contentAreaRef}>
              {currentView === 'icon' && (
                <div className="p-4 w-full h-full">
                  {filteredItems.map(item => (
                    item.position && ( // Ensure position exists for icon view
                      <DesktopFileIcon
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        type={item.type}
                        fileMimeType={item.fileMimeType}
                        isSelected={selectedItemId === item.id}
                        position={item.position}
                        onSelect={handleItemSelect}
                        onDoubleClick={handleItemDoubleClick}
                        onDragEnd={handleItemDragEnd}
                        dragConstraintsRef={contentAreaRef}
                      />
                    )
                  ))}
                </div>
              )}
              {currentView === 'list' && (
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-neutral-100/50 dark:hover:bg-neutral-700/20">
                      <TableHead className="w-[50px]"></TableHead> {/* Icon */}
                      <TableHead>Name</TableHead>
                      <TableHead>Date Modified</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Kind</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => (
                      <TableRow 
                        key={item.id} 
                        className="hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40 cursor-pointer"
                        onClick={() => console.log(`Selected ${item.name} in list view`)}
                      >
                        <TableCell className="p-2">{React.cloneElement(item.iconComponent as React.ReactElement, { className: "h-5 w-5" })}</TableCell>
                        <TableCell className="font-medium p-2">{item.name}</TableCell>
                        <TableCell className="p-2 text-neutral-600 dark:text-neutral-400">{item.dateModified}</TableCell>
                        <TableCell className="p-2 text-neutral-600 dark:text-neutral-400">{item.size || '--'}</TableCell>
                        <TableCell className="p-2 text-neutral-600 dark:text-neutral-400">{item.kindString}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
               {filteredItems.length === 0 && searchTerm && (
                <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                  No items match "{searchTerm}".
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Status Bar */}
          <div className="p-1.5 border-t border-neutral-300 dark:border-neutral-600 text-xs text-center text-neutral-600 dark:text-neutral-400 shrink-0 h-[28px] flex items-center justify-center">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          </div>
        </div>
        </TooltipProvider>
      </WindowFrame>
    </div>
  );
};

export default FinderInterface;