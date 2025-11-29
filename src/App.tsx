import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { RoleProvider } from "./contexts/RoleContext";
import { MainLayout } from "./components/layout/MainLayout";
import CustomDashboard from "./pages/CustomDashboard";
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
import HistoriqueCarriere from "./pages/hr/Historique";
import Paiements from "./pages/scolarite/Paiements";
import Matricule from "./pages/scolarite/Matricule";
import Historique from "./pages/scolarite/Historique";
import AlertesImpayes from "./pages/scolarite/Alertes";
import DocumentsEleves from "./pages/scolarite/Documents";
import SMSPro from "./pages/messaging/SMS";
import Forum from "./pages/messaging/Forum";
import NotificationsAuto from "./pages/messaging/Notifications";
import Transport from "./pages/services/Transport";
import Cantine from "./pages/services/Cantine";
import Internat from "./pages/services/Internat";
import Elearning from "./pages/pedagogie/Elearning";
import Attribution from "./pages/pedagogie/Attribution";
import Matieres from "./pages/pedagogie/Matieres";
import Conseils from "./pages/pedagogie/Conseils";
import Discipline from "./pages/pedagogie/Discipline";
import Bulletins from "./pages/pedagogie/Bulletins";
import Emprunts from "./pages/bibliotheque/Emprunts";
import Consultations from "./pages/infirmerie/Consultations";
import Bilan from "./pages/comptabilite/Bilan";
import Baremes from "./pages/notes/Baremes";
import Validation from "./pages/notes/Validation";
import QCM from "./pages/notes/QCM";
import Moyennes from "./pages/notes/Moyennes";
import Maintenance from "./pages/infrastructures/Maintenance";
import PlanningEnseignants from "./pages/enseignants/Planning";
import SuiviCours from "./pages/enseignants/SuiviCours";
import RolesConfig from "./pages/parametrage/Roles";
import Sauvegarde from "./pages/parametrage/Sauvegarde";
import Langues from "./pages/parametrage/Langues";
import Logs from "./pages/parametrage/Logs";
import Utilisateurs from "./pages/parametrage/Utilisateurs";
import Contrats from "./pages/hr/Contrats";
import Echeances from "./pages/scolarite/Echeances";
import MENAImportExport from "./pages/scolarite/MENA";
import Emails from "./pages/messaging/Emails";
import PointageEnseignants from "./pages/enseignants/Pointage";
import Assiduite from "./pages/enseignants/Assiduite";
import FicheService from "./pages/enseignants/FicheService";
import Caisse from "./pages/comptabilite/Caisse";
import BulletinsNotes from "./pages/notes/Bulletins";
import PlanningInfrastructures from "./pages/infrastructures/Planning";
import Convocations from "./pages/Convocations";
import GenericPlaceholder from "./pages/GenericPlaceholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <FavoritesProvider>
        <NotificationsProvider>
          <RoleProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/dashboard/custom" element={<MainLayout><CustomDashboard /></MainLayout>} />
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
          <Route path="/hr/historique" element={<MainLayout><HistoriqueCarriere /></MainLayout>} />
          <Route path="/hr/contrats" element={<MainLayout><Contrats /></MainLayout>} />
          
          {/* Enseignants Routes */}
          <Route path="/teachers" element={<MainLayout><PlanningEnseignants /></MainLayout>} />
          <Route path="/enseignants/suivi-cours" element={<MainLayout><SuiviCours /></MainLayout>} />
          <Route path="/enseignants/pointage" element={<MainLayout><PointageEnseignants /></MainLayout>} />
          <Route path="/enseignants/assiduite" element={<MainLayout><Assiduite /></MainLayout>} />
          <Route path="/enseignants/fiche-service" element={<MainLayout><FicheService /></MainLayout>} />
          
          {/* Pédagogie Routes */}
          <Route path="/pedagogie/elearning" element={<MainLayout><Elearning /></MainLayout>} />
          <Route path="/pedagogie/attribution" element={<MainLayout><Attribution /></MainLayout>} />
          <Route path="/pedagogie/matieres" element={<MainLayout><Matieres /></MainLayout>} />
          <Route path="/pedagogie/conseils" element={<MainLayout><Conseils /></MainLayout>} />
          <Route path="/pedagogie/discipline" element={<MainLayout><Discipline /></MainLayout>} />
          <Route path="/pedagogie/bulletins" element={<MainLayout><Bulletins /></MainLayout>} />
          <Route path="/pedagogie/convocations" element={<MainLayout><Convocations /></MainLayout>} />
          
          {/* Notes Routes */}
          <Route path="/notes/baremes" element={<MainLayout><Baremes /></MainLayout>} />
          <Route path="/notes/validation" element={<MainLayout><Validation /></MainLayout>} />
          <Route path="/notes/qcm" element={<MainLayout><QCM /></MainLayout>} />
          <Route path="/notes/moyennes" element={<MainLayout><Moyennes /></MainLayout>} />
          <Route path="/notes/bulletins" element={<MainLayout><BulletinsNotes /></MainLayout>} />
          
          {/* Scolarité Routes */}
          <Route path="/scolarite/paiements" element={<MainLayout><Paiements /></MainLayout>} />
          <Route path="/scolarite/matricule" element={<MainLayout><Matricule /></MainLayout>} />
          <Route path="/scolarite/historique" element={<MainLayout><Historique /></MainLayout>} />
          <Route path="/scolarite/echeances" element={<MainLayout><Echeances /></MainLayout>} />
          <Route path="/scolarite/mena" element={<MainLayout><MENAImportExport /></MainLayout>} />
          <Route path="/portail/documents" element={<MainLayout><DocumentsEleves /></MainLayout>} />
          <Route path="/portail/notes" element={<MainLayout><GenericPlaceholder title="Notes & Bulletins" description="Consultation des notes et bulletins scolaires" /></MainLayout>} />
          <Route path="/portail/absences" element={<MainLayout><GenericPlaceholder title="Absences & Emploi du Temps" description="Suivi des absences et consultation de l'emploi du temps" /></MainLayout>} />
          <Route path="/portail/paiements" element={<MainLayout><GenericPlaceholder title="Paiements Parents" description="Historique et gestion des paiements" /></MainLayout>} />
          <Route path="/portail/chat" element={<MainLayout><GenericPlaceholder title="Chat Parents" description="Messagerie avec les enseignants et l'administration" /></MainLayout>} />
          <Route path="/dashboard/alertes" element={<MainLayout><AlertesImpayes /></MainLayout>} />
          
          {/* Messaging Routes */}
          <Route path="/messaging/sms" element={<MainLayout><SMSPro /></MainLayout>} />
          <Route path="/messaging/forum" element={<MainLayout><Forum /></MainLayout>} />
          <Route path="/messaging/notifications" element={<MainLayout><NotificationsAuto /></MainLayout>} />
          <Route path="/messaging/emails" element={<MainLayout><Emails /></MainLayout>} />
          
          {/* Services Routes */}
          <Route path="/services/transport" element={<MainLayout><Transport /></MainLayout>} />
          <Route path="/services/cantine" element={<MainLayout><Cantine /></MainLayout>} />
          <Route path="/services/internat" element={<MainLayout><Internat /></MainLayout>} />
          
          {/* Bibliothèque Routes */}
          <Route path="/bibliotheque/emprunts" element={<MainLayout><Emprunts /></MainLayout>} />
          <Route path="/bibliotheque/alertes" element={<MainLayout><GenericPlaceholder title="Alertes Retard" description="Gestion des alertes de retour de livres" /></MainLayout>} />
          <Route path="/bibliotheque/inventaire" element={<MainLayout><GenericPlaceholder title="Inventaire Bibliothèque" description="Inventaire des livres et ressources" /></MainLayout>} />
          
          {/* Infirmerie Routes */}
          <Route path="/infirmerie/consultations" element={<MainLayout><Consultations /></MainLayout>} />
          <Route path="/infirmerie/historique" element={<MainLayout><GenericPlaceholder title="Historique Médical" description="Historique des consultations médicales" /></MainLayout>} />
          <Route path="/infirmerie/alertes" element={<MainLayout><GenericPlaceholder title="Alertes Urgentes" description="Gestion des urgences médicales" /></MainLayout>} />
          
          {/* Comptabilité Routes */}
          <Route path="/comptabilite/bilan" element={<MainLayout><Bilan /></MainLayout>} />
          <Route path="/comptabilite/caisse" element={<MainLayout><Caisse /></MainLayout>} />
          <Route path="/comptabilite/journaux" element={<MainLayout><GenericPlaceholder title="Journaux Comptables" description="Journaux comptables et écritures" /></MainLayout>} />
          <Route path="/comptabilite/paiements" element={<MainLayout><GenericPlaceholder title="Paiements Scolaires" description="Gestion des paiements" /></MainLayout>} />
          <Route path="/comptabilite/quittances" element={<MainLayout><GenericPlaceholder title="Quittances" description="Génération de quittances" /></MainLayout>} />
          
          {/* Infrastructures Routes */}
          <Route path="/infrastructures/maintenance" element={<MainLayout><Maintenance /></MainLayout>} />
          <Route path="/infrastructures/planning" element={<MainLayout><PlanningInfrastructures /></MainLayout>} />
          
          {/* Parascolaire Routes */}
          <Route path="/parascolaire/participation" element={<MainLayout><GenericPlaceholder title="Participation" description="Suivi de la participation aux activités" /></MainLayout>} />
          <Route path="/parascolaire/evenements" element={<MainLayout><GenericPlaceholder title="Événements" description="Gestion des événements scolaires" /></MainLayout>} />
          
          {/* Stocks Routes */}
          <Route path="/stocks/seuils" element={<MainLayout><GenericPlaceholder title="Seuils d'Alerte" description="Configuration des seuils de stock" /></MainLayout>} />
          <Route path="/stocks/inventaire" element={<MainLayout><GenericPlaceholder title="Inventaire Auto" description="Inventaire automatique" /></MainLayout>} />
          
          {/* Partenariats Routes */}
          <Route path="/partenariats/reunions" element={<MainLayout><GenericPlaceholder title="Réunions & PV" description="Gestion des réunions et procès-verbaux" /></MainLayout>} />
          <Route path="/partenariats/sponsors" element={<MainLayout><GenericPlaceholder title="Sponsors" description="Gestion des sponsors et partenaires" /></MainLayout>} />
          
          {/* MENA Routes */}
          <Route path="/mena/sync" element={<MainLayout><GenericPlaceholder title="Synchronisation MENA" description="Synchronisation avec le système MENA" /></MainLayout>} />
          <Route path="/mena/fichier" element={<MainLayout><GenericPlaceholder title="Fichier National" description="Gestion du fichier national" /></MainLayout>} />
          <Route path="/mena/preinscriptions" element={<MainLayout><GenericPlaceholder title="Préinscriptions" description="Gestion des préinscriptions MENA" /></MainLayout>} />
          <Route path="/mena/decisions" element={<MainLayout><GenericPlaceholder title="Décisions & Bilans" description="Décisions et bilans MENA" /></MainLayout>} />
          
          {/* Outils Routes */}
          <Route path="/outils/bureautique" element={<MainLayout><GenericPlaceholder title="Suite Bureautique" description="Outils de bureautique en ligne" /></MainLayout>} />
          <Route path="/outils/signature" element={<MainLayout><GenericPlaceholder title="Signature Électronique" description="Signature électronique de documents" /></MainLayout>} />
          <Route path="/outils/modeles" element={<MainLayout><GenericPlaceholder title="Modèles de Courriers" description="Bibliothèque de modèles" /></MainLayout>} />
          <Route path="/outils/cloud" element={<MainLayout><GenericPlaceholder title="Cloud Sécurisé" description="Stockage cloud sécurisé" /></MainLayout>} />
          
          {/* Statistiques Routes */}
          <Route path="/statistiques/tableaux" element={<MainLayout><GenericPlaceholder title="Tableaux Croisés" description="Tableaux croisés dynamiques" /></MainLayout>} />
          <Route path="/statistiques/export" element={<MainLayout><GenericPlaceholder title="Export Multi-format" description="Export des rapports" /></MainLayout>} />
          <Route path="/statistiques/planifies" element={<MainLayout><GenericPlaceholder title="Rapports Planifiés" description="Rapports automatiques planifiés" /></MainLayout>} />
          
          {/* Modules Optionnels Routes */}
          <Route path="/modules/elearning" element={<MainLayout><GenericPlaceholder title="E-learning Avancé" description="Plateforme e-learning" /></MainLayout>} />
          <Route path="/modules/mobile" element={<MainLayout><GenericPlaceholder title="Application Mobile" description="App mobile native" /></MainLayout>} />
          <Route path="/modules/qrcode" element={<MainLayout><GenericPlaceholder title="QR Code Scolaire" description="Gestion par QR codes" /></MainLayout>} />
          <Route path="/modules/paiement-mobile" element={<MainLayout><GenericPlaceholder title="Paiement Mobile" description="Paiement mobile money" /></MainLayout>} />
          <Route path="/modules/ia" element={<MainLayout><GenericPlaceholder title="Intelligence Artificielle" description="Outils IA pour l'éducation" /></MainLayout>} />
          
          {/* Paramétrage Routes */}
          <Route path="/settings" element={<MainLayout><Utilisateurs /></MainLayout>} />
          <Route path="/parametrage/utilisateurs" element={<MainLayout><Utilisateurs /></MainLayout>} />
          <Route path="/parametrage/roles" element={<MainLayout><RolesConfig /></MainLayout>} />
          <Route path="/parametrage/sauvegarde" element={<MainLayout><Sauvegarde /></MainLayout>} />
          <Route path="/parametrage/langues" element={<MainLayout><Langues /></MainLayout>} />
          <Route path="/parametrage/logs" element={<MainLayout><Logs /></MainLayout>} />
          
          <Route path="/statistics" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/messages" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/infrastructure" element={<MainLayout><Dashboard /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
            </TooltipProvider>
          </RoleProvider>
        </NotificationsProvider>
      </FavoritesProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
