import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { FileText, Folder, Image as ImageIcon, FileAudio, FileVideo, Archive, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DesktopIconType = 'file' | 'folder';
export type FileMimeType = 'image' | 'document' | 'audio' | 'video' | 'archive' | 'code' | 'generic';

interface DesktopFileIconProps {
  id: string;
  name: string;
  type: DesktopIconType;
  fileMimeType?: FileMimeType; // Used if type is 'file' to determine a more specific icon
  icon?: React.ReactNode; // Optional custom icon
  isSelected: boolean;
  position: { x: number; y: number };
  onSelect: (id: string, event: React.MouseEvent) => void;
  onDoubleClick: (id: string, type: DesktopIconType) => void;
  onDragEnd: (id: string, newPosition: { x: number; y: number }) => void;
  dragConstraintsRef?: React.RefObject<HTMLElement>; // Parent element to constrain dragging
}

const DesktopFileIcon: React.FC<DesktopFileIconProps> = ({
  id,
  name,
  type,
  fileMimeType = 'generic',
  icon,
  isSelected,
  position,
  onSelect,
  onDoubleClick,
  onDragEnd,
  dragConstraintsRef,
}) => {
  console.log(`DesktopFileIcon loaded: ${name}, selected: ${isSelected}`);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Note: info.point contains absolute screen coordinates.
    // We need to adjust if dragConstraintsRef is used and has its own offset.
    // For simplicity, if dragConstraintsRef is provided, we assume its top-left is (0,0) relative to dragging.
    // A more robust solution might involve calculating relative positions.
    onDragEnd(id, { x: info.point.x, y: info.point.y });
  };

  const IconComponent = React.useMemo(() => {
    if (icon) return icon;
    if (type === 'folder') return <Folder size={48} className="text-blue-500" />;
    
    // File type specific icons
    switch (fileMimeType) {
      case 'image':
        return <ImageIcon size={48} className="text-purple-500" />;
      case 'document':
        return <FileText size={48} className="text-gray-600" />;
      case 'audio':
        return <FileAudio size={48} className="text-orange-500" />;
      case 'video':
        return <FileVideo size={48} className="text-red-500" />;
      case 'archive':
        return <Archive size={48} className="text-yellow-600" />;
      case 'code':
        return <Code2 size={48} className="text-green-600" />;
      default:
        return <FileText size={48} className="text-gray-500" />;
    }
  }, [icon, type, fileMimeType]);

  return (
    <motion.div
      id={`desktop-icon-${id}`}
      className={cn(
        "absolute flex flex-col items-center p-2 rounded-md w-24 text-center cursor-pointer select-none group",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
        isSelected ? "bg-blue-500 bg-opacity-30" : "hover:bg-gray-500 hover:bg-opacity-10 dark:hover:bg-gray-200 dark:hover:bg-opacity-10"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      drag
      dragConstraints={dragConstraintsRef}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={(e) => onSelect(id, e)}
      onDoubleClick={() => onDoubleClick(id, type)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      aria-label={name}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onDoubleClick(id, type);
        }
      }}
    >
      <div className="mb-1 text-neutral-700 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-neutral-50 transition-colors">
        {IconComponent}
      </div>
      <span 
        className={cn(
          "text-xs text-neutral-800 dark:text-neutral-100 break-words line-clamp-2 px-1 py-0.5 rounded",
          isSelected ? "bg-blue-600 text-white" : "bg-transparent group-hover:bg-opacity-50"
        )}
        style={{
          textShadow: isSelected ? 'none' : '0 0 2px rgba(255, 255, 255, 0.7), 0 0 4px rgba(255, 255, 255, 0.5)', // Simulates macOS desktop icon label shadow
        }}
      >
        {name}
      </span>
    </motion.div>
  );
};

export default DesktopFileIcon;