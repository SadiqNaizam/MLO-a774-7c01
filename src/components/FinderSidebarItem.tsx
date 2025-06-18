import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FinderSidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  onClick?: () => void; // Optional click handler if specific action beyond navigation is needed
}

const FinderSidebarItem: React.FC<FinderSidebarItemProps> = ({
  icon: Icon,
  label,
  to,
  onClick,
}) => {
  const location = useLocation();
  // A basic way to determine if the link is active.
  // For more complex scenarios (e.g., nested routes), this might need refinement.
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  console.log(`FinderSidebarItem loaded: ${label}, Path: ${to}, Active: ${isActive}`);

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start h-8 px-2 py-1.5 mb-0.5", // Adjusted padding and margin for denser sidebar
        "text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700",
        isActive && "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700"
      )}
      asChild
      onClick={onClick}
    >
      <Link to={to}>
        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default FinderSidebarItem;