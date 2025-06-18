import React, { useState, useRef } from 'react';
import WindowFrame from '@/components/WindowFrame';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquareText } from 'lucide-react'; // Example icon for a notes app

const GenericAppInterfacePage: React.FC = () => {
  console.log('GenericAppInterfacePage loaded');

  const [isActive, setIsActive] = useState(true); // For demo, window is initially active
  const [notesContent, setNotesContent] = useState(
    "This is a generic application window simulating a simple notes app.\n\n" +
    "Features:\n" +
    "- Draggable window frame.\n" +
    "- Mock traffic light controls (close, minimize, maximize).\n" +
    "- Editable filename and content area.\n" +
    "- Simulated 'Save' and 'Clear' actions."
  );
  const [filename, setFilename] = useState("Demo Note");

  // Ref for the pseudo-desktop area to constrain window dragging
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleClose = (id: string) => {
    console.log(`Window ${id} close requested. On this demo page, the window remains.`);
    // In a real multi-window environment, this would likely remove the window.
    // For this standalone page, we can perhaps just log or show a message.
  };

  const handleFocus = (id: string) => {
    console.log(`Window ${id} focused.`);
    setIsActive(true); // Ensure window appears active
  };

  const handleMinimize = (id: string) => {
    console.log(`Window ${id} minimize requested (simulated).`);
  };

  const handleMaximize = (id: string) => {
    console.log(`Window ${id} maximize requested (simulated).`);
  };
  
  const appContent = (
    <div className="p-4 flex flex-col h-full bg-neutral-50 dark:bg-neutral-200 text-black overflow-y-auto">
      <div className="mb-3">
        <Label htmlFor="notes-filename" className="text-xs font-medium text-gray-700 dark:text-gray-600">
          Filename:
        </Label>
        <Input
          id="notes-filename"
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="mt-1 w-full h-8 text-sm p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:text-black dark:border-gray-400"
        />
      </div>
      <Label htmlFor="notes-textarea" className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-600">
        Content:
      </Label>
      <Textarea
        id="notes-textarea"
        value={notesContent}
        onChange={(e) => setNotesContent(e.target.value)}
        className="flex-grow resize-none border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:text-black dark:border-gray-400 text-sm"
        placeholder="Type your notes here..."
        rows={8}
      />
      <div className="mt-4 flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { 
            setNotesContent(''); 
            setFilename("Untitled Note"); 
            console.log('Notes cleared.');
          }}
        >
          Clear
        </Button>
        <Button 
          size="sm" 
          onClick={() => console.log('Simulated save:', { filename, notesContent })}
        >
          Save (Simulated)
        </Button>
      </div>
    </div>
  );

  return (
    <div 
      ref={desktopRef} 
      className="relative w-full h-screen bg-slate-300 dark:bg-slate-700 flex items-center justify-center p-4 md:p-10 overflow-hidden"
      onClick={() => setIsActive(false)} // Clicking desktop makes window inactive
    >
      <WindowFrame
        id="generic-app-demo-1"
        title={filename || "Generic Application"}
        icon={<MessageSquareText size={14} />}
        initialPosition={{ x: desktopRef.current ? desktopRef.current.offsetWidth / 2 - 250 : 100 , y: desktopRef.current ? desktopRef.current.offsetHeight / 2 - 200 : 50 }}
        initialSize={{ width: 500, height: 400 }}
        zIndex={isActive ? 20 : 10} // Active window gets higher z-index
        isActive={isActive}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onFocus={handleFocus}
        constraintsRef={desktopRef}
      >
        {appContent}
      </WindowFrame>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white p-3 rounded-md text-xs shadow-lg">
        <p className="font-semibold">GenericAppInterface Demo Page</p>
        <p className="mt-1">This page demonstrates a single, draggable application window.</p>
        <p>Click the window to activate, click the background to deactivate.</p>
      </div>
    </div>
  );
};

export default GenericAppInterfacePage;