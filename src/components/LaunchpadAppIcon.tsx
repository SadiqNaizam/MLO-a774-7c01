import React from 'react';
import { Button } from '@/components/ui/button';

interface LaunchpadAppIconProps {
  /** The name of the application, displayed below the icon. */
  appName: string;
  /**
   * The React node for the icon.
   * This should be an <img /> tag or a suitable icon component (e.g., from lucide-react).
   * For best results, the icon itself should be designed or sized to fit well within the icon container (approx. 64x64px on small screens, 80x80px on medium screens and up).
   * Example: <img src="/path/to/icon.svg" alt={appName} className="w-full h-full object-contain" />
   * or <SomeLucideIcon className="w-16 h-16 md:w-20 md:h-20" />
   */
  icon: React.ReactNode;
  /**
   * Callback function triggered when the icon is clicked.
   * Receives the appName as an argument, which can be used by the parent component
   * to identify which application to launch (e.g., by managing window states).
   */
  onLaunch: (appName: string) => void;
}

const LaunchpadAppIcon: React.FC<LaunchpadAppIconProps> = ({ appName, icon, onLaunch }) => {
  console.log(`LaunchpadAppIcon loaded for: ${appName}`);

  const handleClick = () => {
    if (onLaunch) {
      onLaunch(appName);
    }
  };

  return (
    <Button
      variant="ghost" // Using ghost variant for a transparent background
      onClick={handleClick}
      className="flex flex-col items-center justify-start w-[100px] h-[120px] md:w-[112px] md:h-[144px] p-2 md:p-3 space-y-1.5 md:space-y-2 rounded-lg md:rounded-xl group transition-all duration-100 ease-in-out hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
      aria-label={`Launch ${appName}`}
      title={appName} // Provides a native tooltip with the app name
    >
      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform duration-100 ease-in-out group-hover:scale-105 group-active:scale-100">
        {/* The icon passed via props will be rendered here. It should fill this container. */}
        {icon}
      </div>
      <span
        className="text-xs md:text-sm text-white font-medium truncate w-full text-center select-none"
        // Applying a text shadow for better legibility, common in macOS interfaces
        style={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)' }}
      >
        {appName}
      </span>
    </Button>
  );
};

export default LaunchpadAppIcon;