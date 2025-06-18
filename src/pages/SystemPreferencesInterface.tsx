import React, { useState } from 'react';
import WindowFrame from '@/components/WindowFrame'; // Custom component
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cog, Monitor, Volume2, Wifi, Palette, Sun, Moon, Network, Ear } from 'lucide-react'; // Icons

interface SystemPreferencesInterfaceProps {
  id: string; // Unique ID for this window instance
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string | number; height: string | number };
  isActive: boolean;
  zIndex?: number;
  onClose: (id: string) => void;
  onMinimize?: (id: string) => void;
  onMaximize?: (id: string) => void;
  onFocus: (id: string) => void;
  constraintsRef?: React.RefObject<HTMLElement>;
}

const SystemPreferencesInterface: React.FC<SystemPreferencesInterfaceProps> = ({
  id,
  initialPosition = { x: 150, y: 100 }, // Default position
  initialSize = { width: 720, height: 500 }, // Default size
  isActive,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  constraintsRef,
}) => {
  console.log('SystemPreferencesInterface loaded');

  // States for mock settings
  const [theme, setTheme] = useState('auto');
  const [accentColorEnabled, setAccentColorEnabled] = useState(true);
  const [uiScale, setUiScale] = useState([100]);
  const [resolution, setResolution] = useState('1920x1080');
  const [nightLight, setNightLight] = useState(false);
  const [brightness, setBrightness] = useState([75]);
  const [outputDevice, setOutputDevice] = useState('internal-speakers');
  const [volume, setVolume] = useState([50]);
  const [muteMic, setMuteMic] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(true);

  const defaultTab = "general";

  return (
    <WindowFrame
      id={id}
      title="System Settings"
      icon={<Cog className="h-4 w-4" />}
      initialPosition={initialPosition}
      initialSize={initialSize}
      isActive={isActive}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
      constraintsRef={constraintsRef}
    >
      <div className="flex h-full bg-neutral-200 dark:bg-[#2d2d2d]">
        <ScrollArea className="h-full w-full">
          <Tabs defaultValue={defaultTab} orientation="vertical" className="flex flex-grow p-1 md:p-2 lg:p-4 min-h-full">
            <TabsList className="flex flex-col h-auto justify-start items-stretch mr-4 p-1 bg-neutral-300/50 dark:bg-neutral-700/30 rounded-lg w-40 md:w-48">
              <TabsTrigger value="general" className="justify-start px-3 py-2 text-sm">
                <Palette className="mr-2 h-4 w-4" /> General
              </TabsTrigger>
              <TabsTrigger value="display" className="justify-start px-3 py-2 text-sm">
                <Monitor className="mr-2 h-4 w-4" /> Display
              </TabsTrigger>
              <TabsTrigger value="sound" className="justify-start px-3 py-2 text-sm">
                <Volume2 className="mr-2 h-4 w-4" /> Sound
              </TabsTrigger>
              <TabsTrigger value="network" className="justify-start px-3 py-2 text-sm">
                <Network className="mr-2 h-4 w-4" /> Network
              </TabsTrigger>
              {/* Add more categories as needed */}
            </TabsList>

            <div className="flex-grow">
              {/* General Settings */}
              <TabsContent value="general" className="mt-0">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="pb-2 px-1">
                    <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Appearance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 px-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="theme-select" className="text-neutral-700 dark:text-neutral-300">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme-select" className="w-[180px]">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light"><Sun className="inline-block mr-2 h-4 w-4" />Light</SelectItem>
                          <SelectItem value="dark"><Moon className="inline-block mr-2 h-4 w-4" />Dark</SelectItem>
                          <SelectItem value="auto"><Cog className="inline-block mr-2 h-4 w-4" />Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accent-color-switch" className="text-neutral-700 dark:text-neutral-300">Enable Accent Color</Label>
                      <Switch id="accent-color-switch" checked={accentColorEnabled} onCheckedChange={setAccentColorEnabled} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ui-scale-slider" className="text-neutral-700 dark:text-neutral-300">UI Scale: {uiScale[0]}%</Label>
                      <Slider id="ui-scale-slider" defaultValue={uiScale} max={200} step={10} onValueChange={setUiScale} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Display Settings */}
              <TabsContent value="display" className="mt-0">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="pb-2 px-1">
                    <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Monitor Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 px-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="resolution-select" className="text-neutral-700 dark:text-neutral-300">Resolution</Label>
                      <Select value={resolution} onValueChange={setResolution}>
                        <SelectTrigger id="resolution-select" className="w-[180px]">
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1280x720">1280 x 720</SelectItem>
                          <SelectItem value="1920x1080">1920 x 1080</SelectItem>
                          <SelectItem value="2560x1440">2560 x 1440</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="night-light-switch" className="text-neutral-700 dark:text-neutral-300">Night Light</Label>
                      <Switch id="night-light-switch" checked={nightLight} onCheckedChange={setNightLight} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="brightness-slider" className="text-neutral-700 dark:text-neutral-300">Brightness: {brightness[0]}%</Label>
                      <Slider id="brightness-slider" defaultValue={brightness} max={100} step={1} onValueChange={setBrightness} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sound Settings */}
              <TabsContent value="sound" className="mt-0">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="pb-2 px-1">
                    <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Audio Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 px-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="output-device-select" className="text-neutral-700 dark:text-neutral-300">Output Device</Label>
                      <Select value={outputDevice} onValueChange={setOutputDevice}>
                        <SelectTrigger id="output-device-select" className="w-[220px]">
                          <SelectValue placeholder="Select output device" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal-speakers"><Ear className="inline-block mr-2 h-4 w-4" />Internal Speakers</SelectItem>
                          <SelectItem value="headphones">Headphones</SelectItem>
                          <SelectItem value="external-monitor">External Monitor Audio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volume-slider" className="text-neutral-700 dark:text-neutral-300">Master Volume: {volume[0]}%</Label>
                      <Slider id="volume-slider" defaultValue={volume} max={100} step={1} onValueChange={setVolume} />
                    </div>
                     <div className="flex items-center justify-between">
                      <Label htmlFor="mute-mic-switch" className="text-neutral-700 dark:text-neutral-300">Mute Microphone</Label>
                      <Switch id="mute-mic-switch" checked={muteMic} onCheckedChange={setMuteMic} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Network Settings */}
              <TabsContent value="network" className="mt-0">
                <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="pb-2 px-1">
                    <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Connectivity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 px-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wifi-switch" className="text-neutral-700 dark:text-neutral-300">Wi-Fi</Label>
                      <Switch id="wifi-switch" checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
                    </div>
                    {wifiEnabled && (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        <p>Status: <span className="text-green-600 dark:text-green-400">Connected</span></p>
                        <p>Network Name: <span className="font-medium">MyHomeNetwork_5GHz</span></p>
                      </div>
                    )}
                     {!wifiEnabled && (
                      <div className="text-sm text-neutral-500 dark:text-neutral-500">
                        <p>Wi-Fi is currently off.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>
      </div>
    </WindowFrame>
  );
};

export default SystemPreferencesInterface;