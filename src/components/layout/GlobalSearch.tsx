import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Users, GraduationCap, Calendar, DollarSign, UserCheck, MessageSquare, Building, BookOpen, Activity, Briefcase, Box, Handshake, LayoutDashboard, ClipboardList, Settings, TrendingUp } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface Route {
  path: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const routes: Route[] = [
  // Dashboards
  { path: "/dashboard", title: "Tableau de bord principal", category: "Tableaux de bord", icon: LayoutDashboard },
  { path: "/dashboard/admin", title: "Dashboard Administratif", category: "Tableaux de bord", icon: LayoutDashboard },
  { path: "/dashboard/pedagogique", title: "Dashboard Pédagogique", category: "Tableaux de bord", icon: LayoutDashboard },
  { path: "/dashboard/alertes", title: "Alertes Impayés", category: "Tableaux de bord", icon: TrendingUp },
  
  // Élèves / Scolarité
  { path: "/students", title: "Gestion des Élèves", category: "Scolarité", icon: Users },
  { path: "/scolarite/paiements", title: "Paiements Scolarité", category: "Scolarité", icon: DollarSign },
  { path: "/scolarite/matricule", title: "Génération Matricule", category: "Scolarité", icon: FileText },
  { path: "/scolarite/historique", title: "Historique Scolaire", category: "Scolarité", icon: ClipboardList },
  { path: "/portail/documents", title: "Documents Élèves", category: "Scolarité", icon: FileText },
  
  // Enseignants
  { path: "/teachers", title: "Planning Enseignants", category: "Enseignants", icon: GraduationCap },
  { path: "/enseignants/suivi-cours", title: "Suivi des Cours", category: "Enseignants", icon: ClipboardList },
  
  // Classes
  { path: "/classes", title: "Gestion des Classes", category: "Pédagogie", icon: Users },
  
  // Pédagogie
  { path: "/pedagogie/elearning", title: "E-learning", category: "Pédagogie", icon: BookOpen },
  { path: "/pedagogie/attribution", title: "Attribution Cours", category: "Pédagogie", icon: Calendar },
  { path: "/pedagogie/matieres", title: "Gestion Matières", category: "Pédagogie", icon: BookOpen },
  { path: "/pedagogie/conseils", title: "Conseils de Classe", category: "Pédagogie", icon: Users },
  { path: "/pedagogie/discipline", title: "Discipline Élèves", category: "Pédagogie", icon: ClipboardList },
  { path: "/pedagogie/bulletins", title: "Bulletins MENA", category: "Pédagogie", icon: FileText },
  
  // Notes
  { path: "/grades", title: "Saisie des Notes", category: "Notes", icon: ClipboardList },
  { path: "/notes/baremes", title: "Barèmes d'Évaluation", category: "Notes", icon: Settings },
  { path: "/notes/validation", title: "Validation des Notes", category: "Notes", icon: ClipboardList },
  { path: "/notes/qcm", title: "QCM Auto-corrigé", category: "Notes", icon: FileText },
  { path: "/notes/moyennes", title: "Calcul des Moyennes", category: "Notes", icon: TrendingUp },
  
  // Ressources Humaines
  { path: "/hr", title: "Ressources Humaines", category: "RH", icon: UserCheck },
  { path: "/hr/affectations", title: "Affectations Personnel", category: "RH", icon: UserCheck },
  { path: "/hr/conges", title: "Gestion des Congés", category: "RH", icon: Calendar },
  { path: "/hr/pointage", title: "Pointage Personnel", category: "RH", icon: ClipboardList },
  { path: "/hr/historique", title: "Historique Carrière", category: "RH", icon: FileText },
  
  // Messagerie
  { path: "/messaging", title: "Messagerie", category: "Communication", icon: MessageSquare },
  { path: "/messaging/sms", title: "SMS Pro", category: "Communication", icon: MessageSquare },
  { path: "/messaging/forum", title: "Forum Interne", category: "Communication", icon: MessageSquare },
  { path: "/messaging/notifications", title: "Notifications Auto", category: "Communication", icon: MessageSquare },
  
  // Services
  { path: "/services/transport", title: "Gestion Transport", category: "Services", icon: Briefcase },
  { path: "/services/cantine", title: "Gestion Cantine", category: "Services", icon: Briefcase },
  { path: "/services/internat", title: "Gestion Internat", category: "Services", icon: Building },
  
  // Bibliothèque
  { path: "/library", title: "Bibliothèque", category: "Bibliothèque", icon: BookOpen },
  { path: "/bibliotheque/emprunts", title: "Gestion Emprunts", category: "Bibliothèque", icon: BookOpen },
  
  // Infirmerie
  { path: "/infirmary", title: "Infirmerie", category: "Infirmerie", icon: Activity },
  { path: "/infirmerie/consultations", title: "Consultations Médicales", category: "Infirmerie", icon: Activity },
  
  // Comptabilité
  { path: "/finance", title: "Finance & Comptabilité", category: "Comptabilité", icon: DollarSign },
  { path: "/comptabilite/bilan", title: "Bilan Comptable", category: "Comptabilité", icon: TrendingUp },
  
  // Infrastructures
  { path: "/facilities", title: "Infrastructures", category: "Infrastructures", icon: Building },
  { path: "/infrastructures/maintenance", title: "Maintenance Équipements", category: "Infrastructures", icon: Settings },
  
  // Stock
  { path: "/inventory", title: "Gestion Stock", category: "Stock", icon: Box },
  
  // Partenariats
  { path: "/partnerships", title: "Partenariats", category: "Partenariats", icon: Handshake },
  
  // Activités
  { path: "/extracurricular", title: "Activités Extra-scolaires", category: "Activités", icon: Briefcase },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  // Group routes by category
  const groupedRoutes = routes.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, Route[]>);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full max-w-md justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Rechercher une page...</span>
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher une page..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          {Object.entries(groupedRoutes).map(([category, categoryRoutes]) => (
            <CommandGroup key={category} heading={category}>
              {categoryRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <CommandItem
                    key={route.path}
                    value={route.title}
                    onSelect={() => handleSelect(route.path)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{route.title}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}