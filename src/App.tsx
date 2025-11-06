import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Grades from "./pages/Grades";
import Finance from "./pages/Finance";
import HR from "./pages/HR";
import Messaging from "./pages/Messaging";
import Facilities from "./pages/Facilities";
import Library from "./pages/Library";
import Infirmary from "./pages/Infirmary";
import Extracurricular from "./pages/Extracurricular";
import Inventory from "./pages/Inventory";
import Partnerships from "./pages/Partnerships";
import ParentPortal from "./pages/ParentPortal";
import ParentLogin from "./pages/ParentLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/students" element={<MainLayout><Students /></MainLayout>} />
          <Route path="/teachers" element={<MainLayout><Teachers /></MainLayout>} />
           <Route path="/classes" element={<MainLayout><Classes /></MainLayout>} />
           <Route path="/grades" element={<MainLayout><Grades /></MainLayout>} />
           <Route path="/schedule" element={<MainLayout><Dashboard /></MainLayout>} />
           <Route path="/finance" element={<MainLayout><Finance /></MainLayout>} />
           <Route path="/hr" element={<MainLayout><HR /></MainLayout>} />
           <Route path="/messaging" element={<MainLayout><Messaging /></MainLayout>} />
           <Route path="/facilities" element={<MainLayout><Facilities /></MainLayout>} />
           <Route path="/library" element={<MainLayout><Library /></MainLayout>} />
           <Route path="/infirmary" element={<MainLayout><Infirmary /></MainLayout>} />
          <Route path="/extracurricular" element={<MainLayout><Extracurricular /></MainLayout>} />
          <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
          <Route path="/partnerships" element={<MainLayout><Partnerships /></MainLayout>} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/parent-portal" element={<ParentPortal />} />
          <Route path="/statistics" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/messages" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/infrastructure" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Dashboard /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
