import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/students" element={<MainLayout><Students /></MainLayout>} />
          <Route path="/teachers" element={<MainLayout><Teachers /></MainLayout>} />
          <Route path="/classes" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/grades" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/schedule" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/finance" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/statistics" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/messages" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/infrastructure" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Dashboard /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
