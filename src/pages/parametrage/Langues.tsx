import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Check, Download, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
  default: boolean;
  completeness: number;
}

export default function LanguesPage() {
  const { toast } = useToast();
  const [languages, setLanguages] = useState<Language[]>([
    { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', enabled: true, default: true, completeness: 100 },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', enabled: true, default: false, completeness: 100 },
    { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', enabled: true, default: false, completeness: 100 },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', enabled: false, default: false, completeness: 75 },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', enabled: false, default: false, completeness: 60 },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', enabled: false, default: false, completeness: 50 },
  ]);

  const toggleLanguage = (code: string) => {
    setLanguages(prev => prev.map(lang => 
      lang.code === code ? { ...lang, enabled: !lang.enabled } : lang
    ));
    const lang = languages.find(l => l.code === code);
    toast({
      title: lang?.enabled ? "Langue désactivée" : "Langue activée",
      description: `La langue ${lang?.name} a été ${lang?.enabled ? 'désactivée' : 'activée'}.`,
    });
  };

  const setDefaultLanguage = (code: string) => {
    setLanguages(prev => prev.map(lang => ({
      ...lang,
      default: lang.code === code,
    })));
    const lang = languages.find(l => l.code === code);
    toast({
      title: "Langue par défaut modifiée",
      description: `${lang?.name} est maintenant la langue par défaut.`,
    });
  };

  const enabledCount = languages.filter(l => l.enabled).length;
  const avgCompleteness = Math.round(
    languages.filter(l => l.enabled).reduce((sum, l) => sum + l.completeness, 0) / enabledCount
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration Multilingue</h1>
        <p className="text-muted-foreground mt-2">
          Gestion des langues disponibles dans l'application
        </p>
      </div>

      <Alert>
        <Globe className="h-4 w-4" />
        <AlertTitle>Système Trilingue Actif</AlertTitle>
        <AlertDescription>
          L'application supporte nativement le français, l'anglais et l'espagnol. 
          D'autres langues peuvent être ajoutées avec des traductions personnalisées.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Langues Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enabledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              sur {languages.length} disponibles
            </p>
            <div className="flex gap-1 mt-3">
              {languages.filter(l => l.enabled).map(lang => (
                <span key={lang.code} className="text-2xl">{lang.flag}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Complétude Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompleteness}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              traductions complètes
            </p>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${avgCompleteness}%` }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Langue par Défaut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {languages.find(l => l.default)?.flag}
              </span>
              <div>
                <div className="font-bold">
                  {languages.find(l => l.default)?.name}
                </div>
                <p className="text-xs text-muted-foreground">
                  {languages.find(l => l.default)?.nativeName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Langues Disponibles</CardTitle>
          <CardDescription>
            Activer ou désactiver les langues de l'interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Langue</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Traduction</TableHead>
                <TableHead>Par Défaut</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {languages.map((lang) => (
                <TableRow key={lang.code}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <div className="font-medium">{lang.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {lang.nativeName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lang.code.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{lang.completeness}%</div>
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full ${lang.completeness === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${lang.completeness}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lang.default && (
                      <Badge variant="default">
                        <Check className="mr-1 h-3 w-3" />
                        Défaut
                      </Badge>
                    )}
                    {!lang.default && lang.enabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultLanguage(lang.code)}
                      >
                        Définir
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={lang.enabled}
                      onCheckedChange={() => toggleLanguage(lang.code)}
                      disabled={lang.default}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="mr-1 h-3 w-3" />
                      Export
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Import de Traductions</CardTitle>
            <CardDescription>
              Importer des fichiers de traduction JSON
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Importez des fichiers de traduction au format JSON pour ajouter ou mettre à jour les traductions de l'interface.
            </p>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Importer des Traductions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export de Traductions</CardTitle>
            <CardDescription>
              Exporter les traductions pour édition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Exportez les fichiers de traduction pour les éditer dans un éditeur externe ou pour les partager.
            </p>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Exporter Toutes les Langues
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
