import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { RoleProvider } from "./contexts/RoleContext";
import { AuditProvider } from "./contexts/AuditContext";
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
import ParticipationParascolaire from "./pages/parascolaire/Participation";
import EvenementsParascolaire from "./pages/parascolaire/Evenements";
import Inventory from "./pages/Inventory";
import SeuilsAlerte from "./pages/stocks/SeuilsAlerte";
import InventaireAuto from "./pages/stocks/InventaireAuto";
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
import ImprimerListes from "./pages/scolarite/ImprimerListes";
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
import EmploisDuTemps from "./pages/pedagogie/EmploisDuTemps";
import Emprunts from "./pages/bibliotheque/Emprunts";
import Catalogue from "./pages/bibliotheque/Catalogue";
import Reservations from "./pages/bibliotheque/Reservations";
import AlertesRetard from "./pages/bibliotheque/AlertesRetard";
import Inventaire from "./pages/bibliotheque/Inventaire";
import StatistiquesBibliotheque from "./pages/bibliotheque/Statistiques";
import CartesLecteur from "./pages/bibliotheque/CartesLecteur";
import ScanQRCode from "./pages/bibliotheque/ScanQRCode";
import Suggestions from "./pages/bibliotheque/Suggestions";
import Acquisitions from "./pages/bibliotheque/Acquisitions";
import Consultations from "./pages/infirmerie/Consultations";
import HistoriqueMedical from "./pages/infirmerie/Historique";
import AlertesMedicales from "./pages/infirmerie/Alertes";
import FichesSante from "./pages/infirmerie/FichesSante";
import StockMedicaments from "./pages/infirmerie/StockMedicaments";
import RapportsMedicaux from "./pages/infirmerie/RapportsMedicaux";
import Ordonnances from "./pages/infirmerie/Ordonnances";
import RappelsMedicaux from "./pages/infirmerie/Rappels";
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
import Securite from "./pages/parametrage/Securite";
import AuditActivite from "./pages/parametrage/AuditActivite";
import ConfigurationEtablissement from "./pages/parametrage/ConfigurationEtablissement";
import { EtablissementProvider } from "./contexts/EtablissementContext";
import TableauxCroises from "./pages/statistiques/TableauxCroises";
import ExportMultiformat from "./pages/statistiques/ExportMultiformat";
import RapportsPlanifies from "./pages/statistiques/RapportsPlanifies";
import RapportsGlobaux from "./pages/statistiques/RapportsGlobaux";
import Contrats from "./pages/hr/Contrats";
import Entretiens from "./pages/hr/Entretiens";
import Formations from "./pages/hr/Formations";
import Competences from "./pages/hr/Competences";
import Recrutement from "./pages/hr/Recrutement";
import TableauBordRH from "./pages/hr/TableauBordRH";
import ImprimerListesRH from "./pages/hr/ImprimerListesRH";
import Echeances from "./pages/scolarite/Echeances";
import MENAImportExport from "./pages/scolarite/MENA";
import Emails from "./pages/messaging/Emails";
import PointageEnseignants from "./pages/enseignants/Pointage";
import Assiduite from "./pages/enseignants/Assiduite";
import FicheService from "./pages/enseignants/FicheService";
import Caisse from "./pages/comptabilite/Caisse";
import JournauxComptables from "./pages/comptabilite/JournauxComptables";
import PaiementsScolaires from "./pages/comptabilite/PaiementsScolaires";
import Quittances from "./pages/comptabilite/Quittances";
import BulletinsNotes from "./pages/notes/Bulletins";
import PlanningInfrastructures from "./pages/infrastructures/Planning";
import Convocations from "./pages/Convocations";
import StudentProfile from "./pages/StudentProfile";
import GenericPlaceholder from "./pages/GenericPlaceholder";
import ParametrageExamens from "./pages/examens/Parametrage";
import InscriptionCandidats from "./pages/examens/Candidats";
import JurysExamens from "./pages/examens/Jurys";
import SallesExamens from "./pages/examens/Salles";
import ConvocationsExamens from "./pages/examens/Convocations";
import ProcesVerbaux from "./pages/examens/ProcesVerbaux";
import NotesExamens from "./pages/examens/NotesExamens";
import Deliberations from "./pages/examens/Deliberations";
import ResultatsExamens from "./pages/examens/Resultats";
import DocumentsOfficiels from "./pages/examens/DocumentsOfficiels";
import CommunicationExamens from "./pages/examens/Communication";
import AuditExamens from "./pages/examens/Audit";
import RapprochementDECO from "./pages/examens/RapprochementDECO";
import TableauBordExamens from "./pages/examens/TableauBordExamens";
import AlertesMonitoring from "./pages/examens/AlertesMonitoring";
import VerificationConvocation from "./pages/VerificationConvocation";
import NotesParents from "./pages/portail/NotesParents";
import AbsencesParents from "./pages/portail/AbsencesParents";
import PaiementsParents from "./pages/portail/PaiementsParents";
import ChatParents from "./pages/portail/ChatParents";
import CalendrierParents from "./pages/portail/CalendrierParents";
import ElearningAvance from "./pages/modules/ElearningAvance";
import AppMobile from "./pages/modules/AppMobile";
import QRCodeScolaire from "./pages/modules/QRCodeScolaire";
import PaiementMobile from "./pages/modules/PaiementMobile";
import SuiteBureautique from "./pages/outils/SuiteBureautique";
import SignatureElectronique from "./pages/outils/SignatureElectronique";
import ModelesCourriers from "./pages/outils/ModelesCourriers";
import CloudSecurise from "./pages/outils/CloudSecurise";
import Synchronisation from "./pages/mena/Synchronisation";
import FichierNational from "./pages/mena/FichierNational";
import Preinscriptions from "./pages/mena/Preinscriptions";
import DecisionsBilans from "./pages/mena/DecisionsBilans";
import ReunionsPV from "./pages/partenariats/Reunions";
import SponsorsPage from "./pages/partenariats/Sponsors";
import IntelligenceArtificielle from "./pages/modules/IntelligenceArtificielle";
import Archives from "./pages/parametrage/Archives";
import { ArchivesProvider } from "./contexts/ArchivesContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <LanguageProvider>
      <FavoritesProvider>
        <NotificationsProvider>
            <RoleProvider>
              <AuditProvider>
              <EtablissementProvider>
                <ArchivesProvider>
                <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/dashboard/custom" element={<MainLayout><CustomDashboard /></MainLayout>} />
          <Route path="/students" element={<MainLayout><Students /></MainLayout>} />
          <Route path="/students/:id" element={<MainLayout><StudentProfile /></MainLayout>} />
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
          <Route path="/hr/entretiens" element={<MainLayout><Entretiens /></MainLayout>} />
          <Route path="/hr/formations" element={<MainLayout><Formations /></MainLayout>} />
          <Route path="/hr/competences" element={<MainLayout><Competences /></MainLayout>} />
          <Route path="/hr/recrutement" element={<MainLayout><Recrutement /></MainLayout>} />
          <Route path="/hr/tableau-bord" element={<MainLayout><TableauBordRH /></MainLayout>} />
          <Route path="/hr/listes" element={<MainLayout><ImprimerListesRH /></MainLayout>} />
          
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
          <Route path="/pedagogie/emplois-du-temps" element={<MainLayout><EmploisDuTemps /></MainLayout>} />
          <Route path="/pedagogie/convocations" element={<MainLayout><Convocations /></MainLayout>} />
          
          {/* Notes Routes */}
          <Route path="/notes/baremes" element={<MainLayout><Baremes /></MainLayout>} />
          <Route path="/notes/validation" element={<MainLayout><Validation /></MainLayout>} />
          <Route path="/notes/qcm" element={<MainLayout><QCM /></MainLayout>} />
          <Route path="/notes/moyennes" element={<MainLayout><Moyennes /></MainLayout>} />
          <Route path="/notes/bulletins" element={<MainLayout><BulletinsNotes /></MainLayout>} />
          
          {/* Examens Routes */}
          <Route path="/examens/parametrage" element={<MainLayout><ParametrageExamens /></MainLayout>} />
          <Route path="/examens/candidats" element={<MainLayout><InscriptionCandidats /></MainLayout>} />
          <Route path="/examens/jurys" element={<MainLayout><JurysExamens /></MainLayout>} />
          <Route path="/examens/salles" element={<MainLayout><SallesExamens /></MainLayout>} />
          <Route path="/examens/convocations" element={<MainLayout><ConvocationsExamens /></MainLayout>} />
          <Route path="/examens/pv" element={<MainLayout><ProcesVerbaux /></MainLayout>} />
          <Route path="/examens/notes" element={<MainLayout><NotesExamens /></MainLayout>} />
          <Route path="/examens/deliberations" element={<MainLayout><Deliberations /></MainLayout>} />
          <Route path="/examens/resultats" element={<MainLayout><ResultatsExamens /></MainLayout>} />
          <Route path="/examens/documents" element={<MainLayout><DocumentsOfficiels /></MainLayout>} />
          <Route path="/examens/communication" element={<MainLayout><CommunicationExamens /></MainLayout>} />
          <Route path="/examens/audit" element={<MainLayout><AuditExamens /></MainLayout>} />
          <Route path="/examens/rapprochement" element={<MainLayout><RapprochementDECO /></MainLayout>} />
          <Route path="/examens/tableau-bord" element={<MainLayout><TableauBordExamens /></MainLayout>} />
          <Route path="/examens/alertes-monitoring" element={<MainLayout><AlertesMonitoring /></MainLayout>} />
          
          {/* Verification Route (public) */}
          <Route path="/verification-convocation" element={<VerificationConvocation />} />
          
{/* Scolarité Routes */}
          <Route path="/scolarite/paiements" element={<MainLayout><Paiements /></MainLayout>} />
          <Route path="/scolarite/matricule" element={<MainLayout><Matricule /></MainLayout>} />
          <Route path="/scolarite/historique" element={<MainLayout><Historique /></MainLayout>} />
          <Route path="/scolarite/echeances" element={<MainLayout><Echeances /></MainLayout>} />
          <Route path="/scolarite/mena" element={<MainLayout><MENAImportExport /></MainLayout>} />
          <Route path="/scolarite/documents" element={<MainLayout><DocumentsEleves /></MainLayout>} />
          <Route path="/scolarite/alertes" element={<MainLayout><AlertesImpayes /></MainLayout>} />
          <Route path="/scolarite/listes" element={<MainLayout><ImprimerListes /></MainLayout>} />
          
          {/* Portail Parents Routes */}
          <Route path="/portail/documents" element={<MainLayout><DocumentsEleves /></MainLayout>} />
          <Route path="/portail/notes" element={<MainLayout><NotesParents /></MainLayout>} />
          <Route path="/portail/absences" element={<MainLayout><AbsencesParents /></MainLayout>} />
          <Route path="/portail/paiements" element={<MainLayout><PaiementsParents /></MainLayout>} />
          <Route path="/portail/chat" element={<MainLayout><ChatParents /></MainLayout>} />
          <Route path="/portail/calendrier" element={<MainLayout><CalendrierParents /></MainLayout>} />
          
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
          <Route path="/bibliotheque/catalogue" element={<MainLayout><Catalogue /></MainLayout>} />
          <Route path="/bibliotheque/emprunts" element={<MainLayout><Emprunts /></MainLayout>} />
          <Route path="/bibliotheque/reservations" element={<MainLayout><Reservations /></MainLayout>} />
          <Route path="/bibliotheque/alertes" element={<MainLayout><AlertesRetard /></MainLayout>} />
          <Route path="/bibliotheque/inventaire" element={<MainLayout><Inventaire /></MainLayout>} />
          <Route path="/bibliotheque/statistiques" element={<MainLayout><StatistiquesBibliotheque /></MainLayout>} />
          <Route path="/bibliotheque/cartes" element={<MainLayout><CartesLecteur /></MainLayout>} />
          <Route path="/bibliotheque/scan" element={<MainLayout><ScanQRCode /></MainLayout>} />
          <Route path="/bibliotheque/suggestions" element={<MainLayout><Suggestions /></MainLayout>} />
          <Route path="/bibliotheque/acquisitions" element={<MainLayout><Acquisitions /></MainLayout>} />

          {/* Infirmerie Routes */}
          <Route path="/infirmerie/consultations" element={<MainLayout><Consultations /></MainLayout>} />
          <Route path="/infirmerie/historique" element={<MainLayout><HistoriqueMedical /></MainLayout>} />
          <Route path="/infirmerie/alertes" element={<MainLayout><AlertesMedicales /></MainLayout>} />
          <Route path="/infirmerie/fiches" element={<MainLayout><FichesSante /></MainLayout>} />
          <Route path="/infirmerie/stock" element={<MainLayout><StockMedicaments /></MainLayout>} />
          <Route path="/infirmerie/rapports" element={<MainLayout><RapportsMedicaux /></MainLayout>} />
          <Route path="/infirmerie/ordonnances" element={<MainLayout><Ordonnances /></MainLayout>} />
          <Route path="/infirmerie/rappels" element={<MainLayout><RappelsMedicaux /></MainLayout>} />
          
          {/* Comptabilité Routes */}
          <Route path="/comptabilite/bilan" element={<MainLayout><Bilan /></MainLayout>} />
          <Route path="/comptabilite/caisse" element={<MainLayout><Caisse /></MainLayout>} />
          <Route path="/comptabilite/journaux" element={<MainLayout><JournauxComptables /></MainLayout>} />
          <Route path="/comptabilite/paiements" element={<MainLayout><PaiementsScolaires /></MainLayout>} />
          <Route path="/comptabilite/quittances" element={<MainLayout><Quittances /></MainLayout>} />
          
          {/* Infrastructures Routes */}
          <Route path="/infrastructures/maintenance" element={<MainLayout><Maintenance /></MainLayout>} />
          <Route path="/infrastructures/planning" element={<MainLayout><PlanningInfrastructures /></MainLayout>} />
          
          {/* Parascolaire Routes */}
          <Route path="/parascolaire/participation" element={<MainLayout><ParticipationParascolaire /></MainLayout>} />
          <Route path="/parascolaire/evenements" element={<MainLayout><EvenementsParascolaire /></MainLayout>} />
          
          {/* Stocks Routes */}
          <Route path="/stocks/seuils" element={<MainLayout><SeuilsAlerte /></MainLayout>} />
          <Route path="/stocks/inventaire" element={<MainLayout><InventaireAuto /></MainLayout>} />
          
          {/* Partenariats Routes */}
          <Route path="/partenariats/reunions" element={<MainLayout><ReunionsPV /></MainLayout>} />
          <Route path="/partenariats/sponsors" element={<MainLayout><SponsorsPage /></MainLayout>} />
          
          {/* MENA Routes */}
          <Route path="/mena/sync" element={<MainLayout><Synchronisation /></MainLayout>} />
          <Route path="/mena/fichier" element={<MainLayout><FichierNational /></MainLayout>} />
          <Route path="/mena/preinscriptions" element={<MainLayout><Preinscriptions /></MainLayout>} />
          <Route path="/mena/decisions" element={<MainLayout><DecisionsBilans /></MainLayout>} />
          
          {/* Outils Routes */}
          <Route path="/outils/bureautique" element={<MainLayout><SuiteBureautique /></MainLayout>} />
          <Route path="/outils/signature" element={<MainLayout><SignatureElectronique /></MainLayout>} />
          <Route path="/outils/modeles" element={<MainLayout><ModelesCourriers /></MainLayout>} />
          <Route path="/outils/cloud" element={<MainLayout><CloudSecurise /></MainLayout>} />
          
          {/* Statistiques Routes */}
          <Route path="/statistiques/rapports" element={<MainLayout><RapportsGlobaux /></MainLayout>} />
          <Route path="/statistiques/tableaux" element={<MainLayout><TableauxCroises /></MainLayout>} />
          <Route path="/statistiques/export" element={<MainLayout><ExportMultiformat /></MainLayout>} />
          <Route path="/statistiques/planifies" element={<MainLayout><RapportsPlanifies /></MainLayout>} />
          
          {/* Modules Optionnels Routes */}
          <Route path="/modules/elearning" element={<MainLayout><ElearningAvance /></MainLayout>} />
          <Route path="/modules/mobile" element={<MainLayout><AppMobile /></MainLayout>} />
          <Route path="/modules/qrcode" element={<MainLayout><QRCodeScolaire /></MainLayout>} />
          <Route path="/modules/paiement-mobile" element={<MainLayout><PaiementMobile /></MainLayout>} />
          <Route path="/modules/ia" element={<MainLayout><IntelligenceArtificielle /></MainLayout>} />
          
          {/* Paramétrage Routes */}
          <Route path="/settings" element={<MainLayout><Utilisateurs /></MainLayout>} />
          <Route path="/parametrage/utilisateurs" element={<MainLayout><Utilisateurs /></MainLayout>} />
          <Route path="/parametrage/roles" element={<MainLayout><RolesConfig /></MainLayout>} />
          <Route path="/parametrage/sauvegarde" element={<MainLayout><Sauvegarde /></MainLayout>} />
          <Route path="/parametrage/langues" element={<MainLayout><Langues /></MainLayout>} />
          <Route path="/parametrage/logs" element={<MainLayout><Logs /></MainLayout>} />
          <Route path="/parametrage/securite" element={<MainLayout><Securite /></MainLayout>} />
          <Route path="/parametrage/audit" element={<MainLayout><AuditActivite /></MainLayout>} />
          <Route path="/parametrage/etablissement" element={<MainLayout><ConfigurationEtablissement /></MainLayout>} />
          <Route path="/parametrage/archives" element={<MainLayout><Archives /></MainLayout>} />
          
          <Route path="/statistics" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/messages" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/infrastructure" element={<MainLayout><Dashboard /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
              </TooltipProvider>
              </ArchivesProvider>
            </EtablissementProvider>
              </AuditProvider>
          </RoleProvider>
        </NotificationsProvider>
      </FavoritesProvider>
    </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
