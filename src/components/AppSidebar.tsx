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
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  icon: any;
  url?: string;
  subItems?: SubMenuItem[];
}

const menuStructure: MenuItem[] = [
  {
    title: "Tableaux de Bord",
    icon: Home,
    subItems: [
      { title: "Vue Globale", url: "/dashboard" },
      { title: "Dashboard Personnalisé", url: "/dashboard/custom" },
    ],
  },
  {
    title: "Ressources Humaines",
    icon: Briefcase,
    subItems: [
      { title: "Tableau de Bord RH", url: "/hr/tableau-bord" },
      { title: "Dossier Personnel", url: "/hr" },
      { title: "Affectations & Promotions", url: "/hr/affectations" },
      { title: "Congés & Absences", url: "/hr/conges" },
      { title: "Pointage", url: "/hr/pointage" },
      { title: "Historique Carrière", url: "/hr/historique" },
      { title: "Contrats & Attestations", url: "/hr/contrats" },
      { title: "Entretiens Annuels", url: "/hr/entretiens" },
      { title: "Formations", url: "/hr/formations" },
      { title: "Compétences", url: "/hr/competences" },
      { title: "Recrutement", url: "/hr/recrutement" },
    ],
  },
  {
    title: "Gestion Pédagogique",
    icon: School,
    subItems: [
      { title: "Cycles & Classes", url: "/classes" },
      { title: "Emplois du Temps", url: "/pedagogie/emplois-du-temps" },
      { title: "Attribution Enseignants", url: "/pedagogie/attribution" },
      { title: "Matières & Programmes", url: "/pedagogie/matieres" },
      { title: "Conseils de Classe", url: "/pedagogie/conseils" },
      { title: "Bulletins MENA", url: "/pedagogie/bulletins" },
      { title: "Discipline", url: "/pedagogie/discipline" },
      { title: "Convocations Parents", url: "/pedagogie/convocations" },
      { title: "E-learning", url: "/pedagogie/elearning" },
    ],
  },
  {
    title: "Gestion de la Scolarité",
    icon: ClipboardList,
    subItems: [
      { title: "Inscription/Réinscription", url: "/students" },
      { title: "Paiements", url: "/scolarite/paiements" },
      { title: "Génération Matricule", url: "/scolarite/matricule" },
      { title: "Suivi Échéances", url: "/scolarite/echeances" },
      { title: "Historique Scolaire", url: "/scolarite/historique" },
      { title: "Import/Export MENA", url: "/scolarite/mena" },
    ],
  },
  {
    title: "Notes & Évaluations",
    icon: BookOpenCheck,
    subItems: [
      { title: "Saisie des Notes", url: "/grades" },
      { title: "Configuration Barèmes", url: "/notes/baremes" },
      { title: "Calcul Moyennes", url: "/notes/moyennes" },
      { title: "Validation Notes", url: "/notes/validation" },
      { title: "Bulletins & Relevés", url: "/notes/bulletins" },
      { title: "QCM Auto-corrigé", url: "/notes/qcm" },
    ],
  },
  {
    title: "Gestion des Examens",
    icon: ClipboardCheck,
    subItems: [
      { title: "Paramétrage Examens", url: "/examens/parametrage" },
      { title: "Inscription Candidats", url: "/examens/candidats" },
      { title: "Jurys & Examinateurs", url: "/examens/jurys" },
      { title: "Salles & Planning", url: "/examens/salles" },
      { title: "Convocations", url: "/examens/convocations" },
      { title: "Procès-Verbaux", url: "/examens/pv" },
      { title: "Saisie Notes Examens", url: "/examens/notes" },
      { title: "Délibérations", url: "/examens/deliberations" },
      { title: "Résultats & Classements", url: "/examens/resultats" },
      { title: "Documents Officiels", url: "/examens/documents" },
      { title: "Communication", url: "/examens/communication" },
      { title: "Audit & Sécurité", url: "/examens/audit" },
      { title: "Rapprochement DECO", url: "/examens/rapprochement" },
      { title: "Tableau de Bord Examens", url: "/examens/tableau-bord" },
      { title: "Alertes & Monitoring", url: "/examens/alertes-monitoring" },
    ],
  },
  {
    title: "Messagerie & SMS",
    icon: MessageSquare,
    subItems: [
      { title: "Chat Interne", url: "/messaging" },
      { title: "SMS Professionnels", url: "/messaging/sms" },
      { title: "Notifications Auto", url: "/messaging/notifications" },
      { title: "Envoi Emails", url: "/messaging/emails" },
      { title: "Forum Interne", url: "/messaging/forum" },
    ],
  },
  {
    title: "Portail Parents & Élèves",
    icon: Users2,
    subItems: [
      { title: "Accès Portail", url: "/parent-portal" },
      { title: "Connexion Sécurisée", url: "/parent-login" },
      { title: "Notes & Bulletins", url: "/portail/notes" },
      { title: "Absences & Emploi", url: "/portail/absences" },
      { title: "Paiements", url: "/portail/paiements" },
      { title: "Documents", url: "/portail/documents" },
      { title: "Chat Parents", url: "/portail/chat" },
      { title: "Calendrier & RDV", url: "/portail/calendrier" },
    ],
  },
  {
    title: "Suivi Enseignants",
    icon: UserCheck,
    subItems: [
      { title: "Planning Hebdomadaire", url: "/teachers" },
      { title: "Suivi des Cours", url: "/enseignants/suivi-cours" },
      { title: "Pointage Auto", url: "/enseignants/pointage" },
      { title: "Rapport Assiduité", url: "/enseignants/assiduite" },
      { title: "Fiche de Service", url: "/enseignants/fiche-service" },
    ],
  },
  {
    title: "Comptabilité Générale",
    icon: DollarSign,
    subItems: [
      { title: "Recettes & Dépenses", url: "/finance" },
      { title: "Gestion Caisse", url: "/comptabilite/caisse" },
      { title: "Journaux Comptables", url: "/comptabilite/journaux" },
      { title: "Balance & Bilan", url: "/comptabilite/bilan" },
      { title: "Paiements Scolaires", url: "/comptabilite/paiements" },
      { title: "Quittances", url: "/comptabilite/quittances" },
    ],
  },
  {
    title: "Infrastructures",
    icon: Building2,
    subItems: [
      { title: "Salles & Locaux", url: "/facilities" },
      { title: "Maintenance", url: "/infrastructures/maintenance" },
      { title: "Planning Utilisation", url: "/infrastructures/planning" },
    ],
  },
  {
    title: "Services",
    icon: Utensils,
    subItems: [
      { title: "Cantine", url: "/services/cantine" },
      { title: "Transport Scolaire", url: "/services/transport" },
      { title: "Internat", url: "/services/internat" },
    ],
  },
  {
    title: "Bibliothèque",
    icon: Library,
    subItems: [
      { title: "Tableau de Bord", url: "/library" },
      { title: "Catalogue", url: "/bibliotheque/catalogue" },
      { title: "Emprunts & Retours", url: "/bibliotheque/emprunts" },
      { title: "Scan QR Code", url: "/bibliotheque/scan" },
      { title: "Suggestions Lecture", url: "/bibliotheque/suggestions" },
      { title: "Acquisitions", url: "/bibliotheque/acquisitions" },
      { title: "Réservations", url: "/bibliotheque/reservations" },
      { title: "Alertes Retard", url: "/bibliotheque/alertes" },
      { title: "Inventaire", url: "/bibliotheque/inventaire" },
      { title: "Cartes Lecteur", url: "/bibliotheque/cartes" },
      { title: "Statistiques", url: "/bibliotheque/statistiques" },
    ],
  },
  {
    title: "Activités Parascolaires",
    icon: Trophy,
    subItems: [
      { title: "Clubs & Sports", url: "/extracurricular" },
      { title: "Participation", url: "/parascolaire/participation" },
      { title: "Événements", url: "/parascolaire/evenements" },
    ],
  },
  {
    title: "Infirmerie",
    icon: Heart,
    subItems: [
      { title: "Fiches Médicales", url: "/infirmary" },
      { title: "Consultations", url: "/infirmerie/consultations" },
      { title: "Historique Médical", url: "/infirmerie/historique" },
      { title: "Fiches Santé", url: "/infirmerie/fiches" },
      { title: "Stock Médicaments", url: "/infirmerie/stock" },
      { title: "Rapports Périodiques", url: "/infirmerie/rapports" },
      { title: "Ordonnances", url: "/infirmerie/ordonnances" },
      { title: "Rappels SMS/Email", url: "/infirmerie/rappels" },
      { title: "Alertes Urgentes", url: "/infirmerie/alertes" },
    ],
  },
  {
    title: "Stocks & Patrimoine",
    icon: Package,
    subItems: [
      { title: "Entrées/Sorties", url: "/inventory" },
      { title: "Seuils Alerte", url: "/stocks/seuils" },
      { title: "Inventaire Auto", url: "/stocks/inventaire" },
    ],
  },
  {
    title: "Partenariats",
    icon: Handshake,
    subItems: [
      { title: "APEL", url: "/partnerships" },
      { title: "Réunions & PV", url: "/partenariats/reunions" },
      { title: "Sponsors", url: "/partenariats/sponsors" },
    ],
  },
  {
    title: "MENA/DESPS",
    icon: Link2,
    subItems: [
      { title: "Synchronisation", url: "/mena/sync" },
      { title: "Fichier National", url: "/mena/fichier" },
      { title: "Préinscriptions", url: "/mena/preinscriptions" },
      { title: "Décisions & Bilans", url: "/mena/decisions" },
    ],
  },
  {
    title: "Outils Productivité",
    icon: FileSpreadsheet,
    subItems: [
      { title: "Suite Bureautique", url: "/outils/bureautique" },
      { title: "Signature Électronique", url: "/outils/signature" },
      { title: "Modèles Courriers", url: "/outils/modeles" },
      { title: "Cloud Sécurisé", url: "/outils/cloud" },
    ],
  },
  {
    title: "Statistiques & Rapports",
    icon: BarChart3,
    subItems: [
      { title: "Rapports Globaux", url: "/statistiques/rapports" },
      { title: "Tableaux Croisés", url: "/statistiques/tableaux" },
      { title: "Export Multi-format", url: "/statistiques/export" },
      { title: "Rapports Planifiés", url: "/statistiques/planifies" },
    ],
  },
  {
    title: "Paramétrage & Sécurité",
    icon: Settings,
    subItems: [
      { title: "Configuration Établissement", url: "/parametrage/etablissement" },
      { title: "Utilisateurs", url: "/settings" },
      { title: "Rôles & Droits", url: "/parametrage/roles" },
      { title: "Sécurité Avancée", url: "/parametrage/securite" },
      { title: "Audit & Traçabilité", url: "/parametrage/audit" },
      { title: "Sauvegarde", url: "/parametrage/sauvegarde" },
      { title: "Multilingue", url: "/parametrage/langues" },
      { title: "Logs Système", url: "/parametrage/logs" },
    ],
  },
  {
    title: "Modules Optionnels",
    icon: Puzzle,
    subItems: [
      { title: "E-learning Avancé", url: "/modules/elearning" },
      { title: "App Mobile", url: "/modules/mobile" },
      { title: "QR Code Scolaire", url: "/modules/qrcode" },
      { title: "Paiement Mobile", url: "/modules/paiement-mobile" },
      { title: "Intelligence Artificielle", url: "/modules/ia" },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  // Initialiser tous les groupes comme fermés pour éviter le warning controlled/uncontrolled
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>(() => {
    const initialState: { [key: string]: boolean } = {};
    menuStructure.forEach(item => {
      if (item.subItems) {
        initialState[item.title] = false;
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

  // Filtrer les items du menu selon les permissions
  const filteredMenuStructure = menuStructure.filter((item) => {
    const permissionKey = menuPermissionMap[item.title];
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
              <p className="text-xs text-sidebar-foreground/70">Gestion Scolaire</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {favorites.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              Favoris
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
          <SidebarGroupLabel>Navigation Principale</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuStructure.map((item) => (
                item.url ? (
                  <SidebarMenuItem key={item.title}>
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
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <Collapsible
                    key={item.title}
                    open={openGroups[item.title]}
                    onOpenChange={() => toggleGroup(item.title)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
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
                                  <span>{subItem.title}</span>
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
