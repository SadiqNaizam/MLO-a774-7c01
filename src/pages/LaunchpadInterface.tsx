import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import LaunchpadAppIcon from '@/components/LaunchpadAppIcon'; // Custom component
import {
  Mail,
  CalendarDays,
  Image as ImageIcon, // Renamed to avoid conflict with HTMLImageElement
  StickyNote,
  ListChecks,
  MapPin,
  MessageSquare,
  Video,
  Settings,
  Store,
  Calculator,
  TerminalSquare,
  Search,
  X,
  Compass,
  PlayCircle,
  Mic,
  TrendingUp,
  CloudSun,
  Clock,
} from 'lucide-react';

// Define the App type for mockApps
interface AppDefinition {
  name: string;
  icon: React.ReactNode;
  keywords?: string[]; // For better search
}

// Mock applications data
const mockAppsList: AppDefinition[] = [
  { name: "Mail", icon: <Mail className="w-16 h-16 md:w-20 md:h-20 text-blue-400" />, keywords: ["email", "messages", "outlook"] },
  { name: "Calendar", icon: <CalendarDays className="w-16 h-16 md:w-20 md:h-20 text-red-400" />, keywords: ["schedule", "events", "appointments"] },
  { name: "Photos", icon: <ImageIcon className="w-16 h-16 md:w-20 md:h-20 text-yellow-400" />, keywords: ["images", "gallery", "pictures"] },
  { name: "Notes", icon: <StickyNote className="w-16 h-16 md:w-20 md:h-20 text-yellow-500" />, keywords: ["text", "memos", "editor"] },
  { name: "Reminders", icon: <ListChecks className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />, keywords: ["todo", "tasks", "list"] },
  { name: "Maps", icon: <MapPin className="w-16 h-16 md:w-20 md:h-20 text-green-400" />, keywords: ["navigation", "directions", "places"] },
  { name: "Messages", icon: <MessageSquare className="w-16 h-16 md:w-20 md:h-20 text-green-500" />, keywords: ["chat", "sms", "imessage"] },
  { name: "FaceTime", icon: <Video className="w-16 h-16 md:w-20 md:h-20 text-green-600" />, keywords: ["video call", "conference"] },
  { name: "System Settings", icon: <Settings className="w-16 h-16 md:w-20 md:h-20 text-gray-500" />, keywords: ["preferences", "configuration", "control panel"] },
  { name: "App Store", icon: <Store className="w-16 h-16 md:w-20 md:h-20 text-blue-500" />, keywords: ["applications", "download", "software"] },
  { name: "Calculator", icon: <Calculator className="w-16 h-16 md:w-20 md:h-20 text-orange-400" />, keywords: ["math", "numbers", "sum"] },
  { name: "Terminal", icon: <TerminalSquare className="w-16 h-16 md:w-20 md:h-20 text-neutral-300" />, keywords: ["command line", "shell", "bash", "code"] },
  { name: "Safari", icon: <Compass className="w-16 h-16 md:w-20 md:h-20 text-blue-300" />, keywords: ["browser", "web", "internet"] },
  { name: "QuickTime Player", icon: <PlayCircle className="w-16 h-16 md:w-20 md:h-20 text-neutral-500" />, keywords: ["video", "player", "media"] },
  { name: "Voice Memos", icon: <Mic className="w-16 h-16 md:w-20 md:h-20 text-red-300" />, keywords: ["audio", "record", "sound"] },
  { name: "Stocks", icon: <TrendingUp className="w-16 h-16 md:w-20 md:h-20 text-green-300" />, keywords: ["finance", "market", "shares"] },
  { name: "Weather", icon: <CloudSun className="w-16 h-16 md:w-20 md:h-20 text-sky-400" />, keywords: ["forecast", "temperature"] },
  { name: "Clock", icon: <Clock className="w-16 h-16 md:w-20 md:h-20 text-orange-200" />, keywords: ["time", "alarm", "stopwatch"] },
];


const LaunchpadInterface = () => {
  console.log('LaunchpadInterface loaded');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAppLaunch = (appName: string) => {
    console.log(`Attempting to launch app: ${appName}`);
    // This function would typically navigate to an app-specific page or open a modal window.
    // For example, it might navigate to `/generic-app-interface?app=${appName}`
    // Or update a global state to render the app in a WindowFrame on the DesktopEnvironmentPage.
    // For this standalone page, we'll just log.
    alert(`Launching ${appName} (simulation)`);
  };

  const filteredApps = mockAppsList.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.keywords && app.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Optional: Handle Escape key to navigate back to desktop
  // This would require using useNavigate from react-router-dom if not using a Link
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Programmatic navigation would require `useNavigate` hook.
        // For simplicity, a visible close button using <Link> is provided.
        console.log("Escape key pressed. User would typically navigate to '/' (Desktop).");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-start bg-black/85 backdrop-blur-2xl p-4 pt-12 md:pt-20 overflow-hidden text-white">
      {/* Search Input */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mb-8 md:mb-12">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
        <Input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-base sm:text-lg bg-white/10 border-transparent hover:bg-white/15 focus:bg-white/20 placeholder-neutral-400 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          aria-label="Search applications"
        />
      </div>

      {/* App Grid */}
      <ScrollArea className="flex-grow w-full max-w-screen-lg xl:max-w-screen-xl">
        <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6 md:gap-x-6 md:gap-y-8 p-2 sm:p-4 justify-items-center">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <LaunchpadAppIcon
                key={app.name}
                appName={app.name}
                icon={app.icon}
                onLaunch={handleAppLaunch}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-neutral-400 text-lg mt-10">
              <p>No results for "{searchTerm}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Close Button to return to Desktop */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full"
        asChild
      >
        <Link to="/" aria-label="Close Launchpad and return to Desktop">
          <X className="h-6 w-6 sm:h-7 sm:w-7" />
        </Link>
      </Button>
    </div>
  );
};

export default LaunchpadInterface;