import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/layout/Footer";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { RoleSelector } from "@/components/layout/RoleSelector";
import { ArchiveBanner } from "@/components/layout/ArchiveBanner";
import { ThemeSelector } from "@/components/layout/ThemeSelector";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { MessageSquare, Maximize, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { getRequiredModule } from "@/lib/routePermissions";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";


export function MainLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const { user, loading } = useAuth();

  // Non authentifié : on renvoie vers la page de connexion (corrige
  // l'absence totale de protection de route relevée dans ANALYSE.md).
  if (!loading && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Corrige l'incohérence n°5 de ANALYSE.md : bloque le rendu si le rôle
  // connecté n'a pas la permission requise pour cette route, indépendamment
  // de ce qu'affiche le menu (qui ne fait que masquer les liens).
  const requiredModule = getRequiredModule(location.pathname);
  const autorise = !requiredModule || hasPermission(requiredModule);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4">
              <GlobalSearch />
              <div className="ml-auto flex items-center gap-3">
                <RoleSelector />
                
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                
                <NotificationPanel />

                <LanguageSelector />

                <ThemeSelector />

                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  <Maximize className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-10">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>{t('nav.profile')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('common.settings')}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <ArchiveBanner />
          <main className="flex-1 p-6 bg-background">
            {autorise ? (
              children
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <ShieldAlert className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-semibold">Accès refusé</h2>
                <p className="max-w-md text-muted-foreground">
                  Votre rôle actuel n'a pas accès à cette section de l'application.
                  Contactez un administrateur si vous pensez qu'il s'agit d'une erreur.
                </p>
              </div>
            )}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
