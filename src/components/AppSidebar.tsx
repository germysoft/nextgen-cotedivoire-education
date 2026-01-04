import { 
  Home, Users, GraduationCap, BookOpen, Calendar, DollarSign, MessageSquare, 
  Settings, BarChart3, FileText, Building2, Heart, Library, Briefcase, Bus, 
  Trophy, Package, Handshake, ChevronDown, ClipboardList, School, BookOpenCheck,
  Bell, UserCheck, Archive, Wallet, Utensils, Bed, Book, Activity, Shield,
  Globe, FileSpreadsheet, Lock, Puzzle, TrendingUp, Mail, Users2, Building,
  Stethoscope, Boxes, Handshake as Partnership, Link2, Cloud, BarChart2, Star,
  ClipboardCheck, UserCircle, Users as UsersGroup, FileCheck, Award, FileSignature, 
  Send, ShieldCheck
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { usePermissions } from "@/hooks/usePermissions";
import { menuPermissionMap } from "@/types/roles";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SubMenuItem {
  titleKey: string;
  url: string;
}

interface MenuItem {
  titleKey: string;
  legacyTitle: string;
  icon: any;
  url?: string;
  subItems?: SubMenuItem[];
}

const menuStructure: MenuItem[] = [
  {
    titleKey: "sidebar.dashboards",
    legacyTitle: "Tableaux de Bord",
    icon: Home,
    subItems: [
      { titleKey: "sidebar.globalView", url: "/dashboard" },
      { titleKey: "sidebar.customDashboard", url: "/dashboard/custom" },
    ],
  },
  {
    titleKey: "sidebar.humanResources",
    legacyTitle: "Ressources Humaines",
    icon: Briefcase,
    subItems: [
      { titleKey: "sidebar.hrDashboard", url: "/hr/tableau-bord" },
      { titleKey: "sidebar.personnelFile", url: "/hr" },
      { titleKey: "sidebar.assignments", url: "/hr/affectations" },
      { titleKey: "sidebar.leaveAbsences", url: "/hr/conges" },
      { titleKey: "sidebar.attendance", url: "/hr/pointage" },
      { titleKey: "sidebar.careerHistory", url: "/hr/historique" },
      { titleKey: "sidebar.contracts", url: "/hr/contrats" },
      { titleKey: "sidebar.annualReviews", url: "/hr/entretiens" },
      { titleKey: "sidebar.training", url: "/hr/formations" },
      { titleKey: "sidebar.skills", url: "/hr/competences" },
      { titleKey: "sidebar.recruitment", url: "/hr/recrutement" },
      { titleKey: "sidebar.printListsHR", url: "/hr/listes" },
    ],
  },
  {
    titleKey: "sidebar.pedagogicalManagement",
    legacyTitle: "Gestion Pédagogique",
    icon: School,
    subItems: [
      { titleKey: "sidebar.cyclesClasses", url: "/classes" },
      { titleKey: "sidebar.schedules", url: "/pedagogie/emplois-du-temps" },
      { titleKey: "sidebar.teacherAssignment", url: "/pedagogie/attribution" },
      { titleKey: "sidebar.subjectsPrograms", url: "/pedagogie/matieres" },
      { titleKey: "sidebar.classCouncils", url: "/pedagogie/conseils" },
      { titleKey: "sidebar.menaBulletins", url: "/pedagogie/bulletins" },
      { titleKey: "sidebar.discipline", url: "/pedagogie/discipline" },
      { titleKey: "sidebar.parentConvocations", url: "/pedagogie/convocations" },
      { titleKey: "sidebar.elearning", url: "/pedagogie/elearning" },
      { titleKey: "sidebar.printListsPedagogie", url: "/pedagogie/listes" },
    ],
  },
  {
    titleKey: "sidebar.tuitionManagement",
    legacyTitle: "Gestion de la Scolarité",
    icon: ClipboardList,
    subItems: [
      { titleKey: "sidebar.enrollment", url: "/students" },
      { titleKey: "sidebar.payments", url: "/scolarite/paiements" },
      { titleKey: "sidebar.matriculeGeneration", url: "/scolarite/matricule" },
      { titleKey: "sidebar.deadlineTracking", url: "/scolarite/echeances" },
      { titleKey: "sidebar.schoolHistory", url: "/scolarite/historique" },
      { titleKey: "sidebar.menaImportExport", url: "/scolarite/mena" },
      { titleKey: "sidebar.documents", url: "/scolarite/documents" },
      { titleKey: "sidebar.alerts", url: "/scolarite/alertes" },
      { titleKey: "sidebar.printLists", url: "/scolarite/listes" },
    ],
  },
  {
    titleKey: "sidebar.gradesEvaluations",
    legacyTitle: "Notes & Évaluations",
    icon: BookOpenCheck,
    subItems: [
      { titleKey: "sidebar.gradeEntry", url: "/grades" },
      { titleKey: "sidebar.scaleConfiguration", url: "/notes/baremes" },
      { titleKey: "sidebar.averageCalculation", url: "/notes/moyennes" },
      { titleKey: "sidebar.gradeValidation", url: "/notes/validation" },
      { titleKey: "sidebar.bulletinsTranscripts", url: "/notes/bulletins" },
      { titleKey: "sidebar.autoGradedQcm", url: "/notes/qcm" },
      { titleKey: "sidebar.printListsNotes", url: "/notes/listes" },
    ],
  },
  {
    titleKey: "sidebar.examManagement",
    legacyTitle: "Gestion des Examens",
    icon: ClipboardCheck,
    subItems: [
      { titleKey: "sidebar.examSetup", url: "/examens/parametrage" },
      { titleKey: "sidebar.candidateRegistration", url: "/examens/candidats" },
      { titleKey: "sidebar.juriesExaminers", url: "/examens/jurys" },
      { titleKey: "sidebar.roomsPlanning", url: "/examens/salles" },
      { titleKey: "sidebar.convocations", url: "/examens/convocations" },
      { titleKey: "sidebar.minutes", url: "/examens/pv" },
      { titleKey: "sidebar.examGradeEntry", url: "/examens/notes" },
      { titleKey: "sidebar.deliberations", url: "/examens/deliberations" },
      { titleKey: "sidebar.resultsRankings", url: "/examens/resultats" },
      { titleKey: "sidebar.officialDocuments", url: "/examens/documents" },
      { titleKey: "sidebar.communication", url: "/examens/communication" },
      { titleKey: "sidebar.auditSecurity", url: "/examens/audit" },
      { titleKey: "sidebar.decoReconciliation", url: "/examens/rapprochement" },
      { titleKey: "sidebar.examDashboard", url: "/examens/tableau-bord" },
      { titleKey: "sidebar.alertsMonitoring", url: "/examens/alertes-monitoring" },
      { titleKey: "sidebar.printListsExams", url: "/examens/listes" },
    ],
  },
  {
    titleKey: "sidebar.messagingSms",
    legacyTitle: "Messagerie & SMS",
    icon: MessageSquare,
    subItems: [
      { titleKey: "sidebar.internalChat", url: "/messaging" },
      { titleKey: "sidebar.professionalSms", url: "/messaging/sms" },
      { titleKey: "sidebar.autoNotifications", url: "/messaging/notifications" },
      { titleKey: "sidebar.sendEmails", url: "/messaging/emails" },
      { titleKey: "sidebar.internalForum", url: "/messaging/forum" },
    ],
  },
  {
    titleKey: "sidebar.parentStudentPortal",
    legacyTitle: "Portail Parents & Élèves",
    icon: Users2,
    subItems: [
      { titleKey: "sidebar.portalAccess", url: "/parent-portal" },
      { titleKey: "sidebar.secureLogin", url: "/parent-login" },
      { titleKey: "sidebar.gradesBulletins", url: "/portail/notes" },
      { titleKey: "sidebar.absencesSchedule", url: "/portail/absences" },
      { titleKey: "sidebar.payments", url: "/portail/paiements" },
      { titleKey: "sidebar.documents", url: "/portail/documents" },
      { titleKey: "sidebar.parentChat", url: "/portail/chat" },
      { titleKey: "sidebar.calendarAppointments", url: "/portail/calendrier" },
      { titleKey: "sidebar.printListsPortail", url: "/portail/listes" },
    ],
  },
  {
    titleKey: "sidebar.teacherTracking",
    legacyTitle: "Suivi Enseignants",
    icon: UserCheck,
    subItems: [
      { titleKey: "sidebar.weeklyPlanning", url: "/teachers" },
      { titleKey: "sidebar.courseTracking", url: "/enseignants/suivi-cours" },
      { titleKey: "sidebar.autoAttendance", url: "/enseignants/pointage" },
      { titleKey: "sidebar.attendanceReport", url: "/enseignants/assiduite" },
      { titleKey: "sidebar.serviceSheet", url: "/enseignants/fiche-service" },
      { titleKey: "sidebar.printListsTeachers", url: "/enseignants/listes" },
    ],
  },
  {
    titleKey: "sidebar.generalAccounting",
    legacyTitle: "Comptabilité Générale",
    icon: DollarSign,
    subItems: [
      { titleKey: "sidebar.incomeExpenses", url: "/finance" },
      { titleKey: "sidebar.cashManagement", url: "/comptabilite/caisse" },
      { titleKey: "sidebar.accountingJournals", url: "/comptabilite/journaux" },
      { titleKey: "sidebar.balanceSheet", url: "/comptabilite/bilan" },
      { titleKey: "sidebar.schoolPayments", url: "/comptabilite/paiements" },
      { titleKey: "sidebar.receipts", url: "/comptabilite/quittances" },
      { titleKey: "sidebar.printListsAccounting", url: "/comptabilite/listes" },
    ],
  },
  {
    titleKey: "sidebar.infrastructure",
    legacyTitle: "Infrastructures",
    icon: Building2,
    subItems: [
      { titleKey: "sidebar.roomsPremises", url: "/facilities" },
      { titleKey: "sidebar.maintenance", url: "/infrastructures/maintenance" },
      { titleKey: "sidebar.usagePlanning", url: "/infrastructures/planning" },
    ],
  },
  {
    titleKey: "sidebar.services",
    legacyTitle: "Services",
    icon: Utensils,
    subItems: [
      { titleKey: "sidebar.canteen", url: "/services/cantine" },
      { titleKey: "sidebar.schoolTransport", url: "/services/transport" },
      { titleKey: "sidebar.boarding", url: "/services/internat" },
      { titleKey: "sidebar.printListsServices", url: "/services/listes" },
    ],
  },
  {
    titleKey: "sidebar.library",
    legacyTitle: "Bibliothèque",
    icon: Library,
    subItems: [
      { titleKey: "sidebar.libraryDashboard", url: "/library" },
      { titleKey: "sidebar.catalog", url: "/bibliotheque/catalogue" },
      { titleKey: "sidebar.loansReturns", url: "/bibliotheque/emprunts" },
      { titleKey: "sidebar.qrCodeScan", url: "/bibliotheque/scan" },
      { titleKey: "sidebar.readingSuggestions", url: "/bibliotheque/suggestions" },
      { titleKey: "sidebar.acquisitions", url: "/bibliotheque/acquisitions" },
      { titleKey: "sidebar.reservations", url: "/bibliotheque/reservations" },
      { titleKey: "sidebar.overdueAlerts", url: "/bibliotheque/alertes" },
      { titleKey: "sidebar.inventory", url: "/bibliotheque/inventaire" },
      { titleKey: "sidebar.readerCards", url: "/bibliotheque/cartes" },
      { titleKey: "sidebar.libraryStatistics", url: "/bibliotheque/statistiques" },
      { titleKey: "sidebar.printListsLibrary", url: "/bibliotheque/listes" },
    ],
  },
  {
    titleKey: "sidebar.extracurricular",
    legacyTitle: "Activités Parascolaires",
    icon: Trophy,
    subItems: [
      { titleKey: "sidebar.clubsSports", url: "/extracurricular" },
      { titleKey: "sidebar.participation", url: "/parascolaire/participation" },
      { titleKey: "sidebar.events", url: "/parascolaire/evenements" },
      { titleKey: "sidebar.printListsExtracurricular", url: "/parascolaire/listes" },
    ],
  },
  {
    titleKey: "sidebar.infirmary",
    legacyTitle: "Infirmerie",
    icon: Heart,
    subItems: [
      { titleKey: "sidebar.medicalRecords", url: "/infirmary" },
      { titleKey: "sidebar.consultations", url: "/infirmerie/consultations" },
      { titleKey: "sidebar.medicalHistory", url: "/infirmerie/historique" },
      { titleKey: "sidebar.healthRecords", url: "/infirmerie/fiches" },
      { titleKey: "sidebar.medicationStock", url: "/infirmerie/stock" },
      { titleKey: "sidebar.periodicReports", url: "/infirmerie/rapports" },
      { titleKey: "sidebar.prescriptions", url: "/infirmerie/ordonnances" },
      { titleKey: "sidebar.smsEmailReminders", url: "/infirmerie/rappels" },
      { titleKey: "sidebar.urgentAlerts", url: "/infirmerie/alertes" },
      { titleKey: "sidebar.printListsInfirmary", url: "/infirmerie/listes" },
    ],
  },
  {
    titleKey: "sidebar.stocksAssets",
    legacyTitle: "Stocks & Patrimoine",
    icon: Package,
    subItems: [
      { titleKey: "sidebar.inOut", url: "/inventory" },
      { titleKey: "sidebar.alertThresholds", url: "/stocks/seuils" },
      { titleKey: "sidebar.autoInventory", url: "/stocks/inventaire" },
      { titleKey: "sidebar.printListsStocks", url: "/stocks/listes" },
    ],
  },
  {
    titleKey: "sidebar.partnerships",
    legacyTitle: "Partenariats",
    icon: Handshake,
    subItems: [
      { titleKey: "sidebar.apel", url: "/partnerships" },
      { titleKey: "sidebar.meetingsMinutes", url: "/partenariats/reunions" },
      { titleKey: "sidebar.sponsors", url: "/partenariats/sponsors" },
    ],
  },
  {
    titleKey: "sidebar.menaDesps",
    legacyTitle: "MENA/DESPS",
    icon: Link2,
    subItems: [
      { titleKey: "sidebar.synchronization", url: "/mena/sync" },
      { titleKey: "sidebar.nationalFile", url: "/mena/fichier" },
      { titleKey: "sidebar.preEnrollments", url: "/mena/preinscriptions" },
      { titleKey: "sidebar.decisionsReports", url: "/mena/decisions" },
      { titleKey: "sidebar.printListsMENA", url: "/mena/listes" },
    ],
  },
  {
    titleKey: "sidebar.productivityTools",
    legacyTitle: "Outils Productivité",
    icon: FileSpreadsheet,
    subItems: [
      { titleKey: "sidebar.officeSuite", url: "/outils/bureautique" },
      { titleKey: "sidebar.electronicSignature", url: "/outils/signature" },
      { titleKey: "sidebar.letterTemplates", url: "/outils/modeles" },
      { titleKey: "sidebar.secureCloud", url: "/outils/cloud" },
    ],
  },
  {
    titleKey: "sidebar.statisticsReports",
    legacyTitle: "Statistiques & Rapports",
    icon: BarChart3,
    subItems: [
      { titleKey: "sidebar.globalReports", url: "/statistiques/rapports" },
      { titleKey: "sidebar.crossTables", url: "/statistiques/tableaux" },
      { titleKey: "sidebar.multiFormatExport", url: "/statistiques/export" },
      { titleKey: "sidebar.scheduledReports", url: "/statistiques/planifies" },
    ],
  },
  {
    titleKey: "sidebar.settingsSecurity",
    legacyTitle: "Paramétrage & Sécurité",
    icon: Settings,
    subItems: [
      { titleKey: "sidebar.schoolConfiguration", url: "/parametrage/etablissement" },
      { titleKey: "sidebar.users", url: "/settings" },
      { titleKey: "sidebar.rolesRights", url: "/parametrage/roles" },
      { titleKey: "sidebar.advancedSecurity", url: "/parametrage/securite" },
      { titleKey: "sidebar.auditTraceability", url: "/parametrage/audit" },
      { titleKey: "sidebar.archivesYears", url: "/parametrage/archives" },
      { titleKey: "sidebar.backup", url: "/parametrage/sauvegarde" },
      { titleKey: "sidebar.multilingual", url: "/parametrage/langues" },
      { titleKey: "sidebar.systemLogs", url: "/parametrage/logs" },
    ],
  },
  {
    titleKey: "sidebar.optionalModules",
    legacyTitle: "Modules Optionnels",
    icon: Puzzle,
    subItems: [
      { titleKey: "sidebar.advancedElearning", url: "/modules/elearning" },
      { titleKey: "sidebar.mobileApp", url: "/modules/mobile" },
      { titleKey: "sidebar.schoolQrCode", url: "/modules/qrcode" },
      { titleKey: "sidebar.mobilePayment", url: "/modules/paiement-mobile" },
      { titleKey: "sidebar.artificialIntelligence", url: "/modules/ia" },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { t } = useLanguage();
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>(() => {
    const initialState: { [key: string]: boolean } = {};
    menuStructure.forEach(item => {
      if (item.subItems) {
        initialState[item.legacyTitle] = false;
      }
    });
    return initialState;
  });
  const { favorites } = useFavoritesContext();
  const { hasPermission } = usePermissions();

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const filteredMenuStructure = menuStructure.filter((item) => {
    const permissionKey = menuPermissionMap[item.legacyTitle];
    return permissionKey ? hasPermission(permissionKey) : true;
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          {open && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">NextGen Éducation</h2>
              <p className="text-xs text-sidebar-foreground/70">{t('nav.schoolManagement')}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {favorites.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {t('nav.favorites')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {favorites.map((fav) => (
                  <SidebarMenuItem key={fav.path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={fav.path}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{fav.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.mainNavigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuStructure.map((item) => (
                item.url ? (
                  <SidebarMenuItem key={item.legacyTitle}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.titleKey)}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <Collapsible
                    key={item.legacyTitle}
                    open={openGroups[item.legacyTitle]}
                    onOpenChange={() => toggleGroup(item.legacyTitle)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full">
                          <item.icon className="h-4 w-4" />
                          <span>{t(item.titleKey)}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton asChild>
                                <NavLink
                                  to={subItem.url}
                                  end
                                  className={({ isActive }) =>
                                    isActive
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                      : "hover:bg-sidebar-accent/50"
                                  }
                                >
                                  <span>{t(subItem.titleKey)}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
