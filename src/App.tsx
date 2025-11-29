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
import DashboardAdmin from "./pages/dashboard/Admin";
import DashboardPedagogique from "./pages/dashboard/Pedagogique";
import Affectations from "./pages/hr/Affectations";
import Conges from "./pages/hr/Conges";
import Pointage from "./pages/hr/Pointage";
import Paiements from "./pages/scolarite/Paiements";
import Matricule from "./pages/scolarite/Matricule";
import Historique from "./pages/scolarite/Historique";
import SMSPro from "./pages/messaging/SMS";
import Forum from "./pages/messaging/Forum";
import Transport from "./pages/services/Transport";
import Cantine from "./pages/services/Cantine";
import Internat from "./pages/services/Internat";
import Elearning from "./pages/pedagogie/Elearning";
import Attribution from "./pages/pedagogie/Attribution";
import Matieres from "./pages/pedagogie/Matieres";
import Conseils from "./pages/pedagogie/Conseils";
import Emprunts from "./pages/bibliotheque/Emprunts";
import Consultations from "./pages/infirmerie/Consultations";
import Bilan from "./pages/comptabilite/Bilan";
import Baremes from "./pages/notes/Baremes";
import Validation from "./pages/notes/Validation";
import QCM from "./pages/notes/QCM";
import Maintenance from "./pages/infrastructures/Maintenance";

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
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/admin" element={<MainLayout><DashboardAdmin /></MainLayout>} />
          <Route path="/dashboard/pedagogique" element={<MainLayout><DashboardPedagogique /></MainLayout>} />
          
          {/* HR Routes */}
          <Route path="/hr/affectations" element={<MainLayout><Affectations /></MainLayout>} />
          <Route path="/hr/conges" element={<MainLayout><Conges /></MainLayout>} />
          <Route path="/hr/pointage" element={<MainLayout><Pointage /></MainLayout>} />
          
          {/* Pédagogie Routes */}
          <Route path="/pedagogie/elearning" element={<MainLayout><Elearning /></MainLayout>} />
          <Route path="/pedagogie/attribution" element={<MainLayout><Attribution /></MainLayout>} />
          <Route path="/pedagogie/matieres" element={<MainLayout><Matieres /></MainLayout>} />
          <Route path="/pedagogie/conseils" element={<MainLayout><Conseils /></MainLayout>} />
          
          {/* Notes Routes */}
          <Route path="/notes/baremes" element={<MainLayout><Baremes /></MainLayout>} />
          <Route path="/notes/validation" element={<MainLayout><Validation /></MainLayout>} />
          <Route path="/notes/qcm" element={<MainLayout><QCM /></MainLayout>} />
          
          {/* Scolarité Routes */}
          <Route path="/scolarite/paiements" element={<MainLayout><Paiements /></MainLayout>} />
          <Route path="/scolarite/matricule" element={<MainLayout><Matricule /></MainLayout>} />
          <Route path="/scolarite/historique" element={<MainLayout><Historique /></MainLayout>} />
          
          {/* Messaging Routes */}
          <Route path="/messaging/sms" element={<MainLayout><SMSPro /></MainLayout>} />
          <Route path="/messaging/forum" element={<MainLayout><Forum /></MainLayout>} />
          
          {/* Services Routes */}
          <Route path="/services/transport" element={<MainLayout><Transport /></MainLayout>} />
          <Route path="/services/cantine" element={<MainLayout><Cantine /></MainLayout>} />
          <Route path="/services/internat" element={<MainLayout><Internat /></MainLayout>} />
          
          {/* Bibliothèque Routes */}
          <Route path="/bibliotheque/emprunts" element={<MainLayout><Emprunts /></MainLayout>} />
          
          {/* Infirmerie Routes */}
          <Route path="/infirmerie/consultations" element={<MainLayout><Consultations /></MainLayout>} />
          
          {/* Comptabilité Routes */}
          <Route path="/comptabilite/bilan" element={<MainLayout><Bilan /></MainLayout>} />
          
          {/* Infrastructures Routes */}
          <Route path="/infrastructures/maintenance" element={<MainLayout><Maintenance /></MainLayout>} />
          
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
