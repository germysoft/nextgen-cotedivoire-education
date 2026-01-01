import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

export function LanguageSelector() {
  const { language, setLanguage, resetToEtablissementLanguage, availableLanguages, currentLanguageInfo, etablissementLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-3">
          <span className="text-lg">{currentLanguageInfo.flag}</span>
          <Badge variant="secondary" className="text-xs font-medium uppercase">
            {language}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between ${language === lang.code ? "bg-accent" : ""}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        {etablissementLanguage && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={resetToEtablissementLanguage}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{t('language.resetToDefault')}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
