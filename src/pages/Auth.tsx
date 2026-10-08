import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Loader2, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { language, setLanguage, t, availableLanguages, currentLanguageInfo } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setChargement(true);
    try {
      await login(email, password);
      const destination = (location.state as { from?: Location })?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch {
      setErreur("Email ou mot de passe incorrect.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="mica-login min-h-svh flex items-center justify-center p-4 sm:p-6">
      <Card className="fluent-window w-full max-w-[440px] bg-card/80 backdrop-blur-2xl overflow-hidden">
        <CardHeader className="space-y-5 px-6 pt-8 pb-7 text-center sm:px-10 sm:pt-10">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold">{t('auth.welcome')}</CardTitle>
            <CardDescription className="mt-2 leading-relaxed">{t('auth.subtitle')}</CardDescription>
          </div>
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-xs">
                  <Languages className="h-4 w-4" />
                  {currentLanguageInfo.nativeName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? "bg-muted text-foreground" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.nativeName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-8 sm:px-10 sm:pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@ecole.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-xs font-normal cursor-pointer text-muted-foreground">
                  {t('auth.rememberMe')}
                </Label>
              </div>
              <Button variant="link" className="p-0 h-auto text-xs">
                {t('auth.forgotPassword')}
              </Button>
            </div>
            {erreur && (
              <p className="text-sm text-destructive" role="alert">{erreur}</p>
            )}
            <Button type="submit" className="w-full" disabled={chargement}>
              {chargement ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.signIn')}
            </Button>
          </form>
          <div className="mt-8 border-t border-border/60 pt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
            <p>© 2024 NextGen Éducation</p>
            <p className="mt-1">Conforme aux standards MENA - Côte d'Ivoire</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}