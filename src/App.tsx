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
