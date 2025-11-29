import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Download, Upload, RefreshCw } from "lucide-react";

export default function MENAPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import/Export MENA</h1>
          <p className="text-muted-foreground mt-2">
            Synchronisation avec le système MENA (Ministère de l'Éducation)
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Synchroniser
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Dernière Synchro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Hier 15:30</div>
            <Badge variant="default" className="mt-2">Réussie</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Élèves Exportés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <p className="text-xs text-muted-foreground mt-1">fichiers transmis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">dossiers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exporter vers MENA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Générer et exporter les fichiers requis par le MENA
            </p>
            <Button className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Exporter les Données
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Importer depuis MENA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Importer les mises à jour et décisions du MENA
            </p>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Importer les Données
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Synchronisations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Link2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Module en développement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
