import { Home, Users, GraduationCap, BookOpen, Calendar, DollarSign, MessageSquare, Settings, BarChart3, FileText, Building2, Heart, Library, Briefcase, Bus, Trophy, Package, Handshake } from "lucide-react";
import { NavLink } from "react-router-dom";
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
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tableau de Bord", url: "/dashboard", icon: Home },
  { title: "Élèves", url: "/students", icon: Users },
  { title: "Enseignants", url: "/teachers", icon: GraduationCap },
  { title: "Classes", url: "/classes", icon: BookOpen },
  { title: "Notes", url: "/grades", icon: FileText },
  { title: "Emploi du Temps", url: "/schedule", icon: Calendar },
  { title: "Comptabilité", url: "/finance", icon: DollarSign },
  { title: "Ressources Humaines", url: "/hr", icon: Briefcase },
  { title: "Messagerie", url: "/messaging", icon: MessageSquare },
  { title: "Infrastructures", url: "/facilities", icon: Bus },
  { title: "Bibliothèque", url: "/library", icon: Library },
  { title: "Infirmerie", url: "/infirmary", icon: Heart },
  { title: "Parascolaire", url: "/extracurricular", icon: Trophy },
  { title: "Stocks", url: "/inventory", icon: Package },
  { title: "Partenariats", url: "/partnerships", icon: Handshake },
  { title: "Statistiques", url: "/statistics", icon: BarChart3 },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();

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
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
