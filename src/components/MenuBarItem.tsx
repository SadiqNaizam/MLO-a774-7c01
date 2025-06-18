import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MenuItemAction {
  label: string;
  onClick?: () => void;
  shortcut?: string;
  disabled?: boolean;
  isSeparator?: boolean;
}

interface MenuBarItemProps {
  label: string;
  items: MenuItemAction[];
  /** Optional: function to call when the menu is opened or closed */
  onOpenChange?: (open: boolean) => void;
}

const MenuBarItem: React.FC<MenuBarItemProps> = ({ label, items, onOpenChange }) => {
  console.log('MenuBarItem loaded for label:', label);

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="px-2 py-1 h-auto text-sm font-medium rounded-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 data-[state=open]:bg-accent"
          aria-label={`Open ${label} menu`}
        >
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {items.map((item, index) => {
          if (item.isSeparator) {
            return <DropdownMenuSeparator key={`separator-${index}`} />;
          }
          return (
            <DropdownMenuItem
              key={`${label}-item-${index}-${item.label}`}
              onClick={item.onClick || (() => console.log(`${item.label} clicked (no action defined)`))}
              disabled={item.disabled}
              className="cursor-pointer"
            >
              {item.label}
              {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuBarItem;