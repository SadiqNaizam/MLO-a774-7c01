import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import DesktopEnvironmentPage from "./pages/DesktopEnvironmentPage";
import FinderInterface from "./pages/FinderInterface";
import GenericAppInterface from "./pages/GenericAppInterface";
import LaunchpadInterface from "./pages/LaunchpadInterface";
import SystemPreferencesInterface from "./pages/SystemPreferencesInterface";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<DesktopEnvironmentPage />} />
          <Route path="/finder-interface" element={<FinderInterface />} />
          <Route path="/generic-app-interface" element={<GenericAppInterface />} />
          <Route path="/launchpad-interface" element={<LaunchpadInterface />} />
          <Route path="/system-preferences-interface" element={<SystemPreferencesInterface />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;
