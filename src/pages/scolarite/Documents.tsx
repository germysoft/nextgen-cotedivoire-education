import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, CheckCircle, XCircle, Search, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dossiers = [
  { eleve: "KOUASSI Jean", classe: "Tle D", acteNaissance: true, certificatScolarite: true, photo: true, certificatMedical: true, completude: 100 },
  { eleve: "DIALLO Fatoumata", classe: "1ère A", acteNaissance: true, certificatScolarite: true, photo: false, certificatMedical: true, completude: 75 },
  { eleve: "TOURÉ Mohamed", classe: "2nde B", acteNaissance: true, certificatScolarite: false, photo: true, certificatMedical: false, completude: 50 },
  { eleve: "SANOGO Aminata", classe: "3ème C", acteNaissance: true, certificatScolarite: true, photo: true, certificatMedical: true, completude: 100 },
];

const documentsRequis = [
  { nom: "Acte de Naissance", obligatoire: true, format: "PDF", taille: "< 2MB" },
  { nom: "Certificat de Scolarité", obligatoire: true, format: "PDF", taille: "< 2MB" },
  { nom: "Photo d'identité", obligatoire: true, format: "JPG/PNG", taille: "< 500KB" },
  { nom: "Certificat Médical", obligatoire: true, format: "PDF", taille: "< 2MB" },
  { nom: "Relevé de Notes", obligatoire: false, format: "PDF", taille: "< 2MB" },
];

export default function Documents() {
  const complets = dossiers.filter(d => d.completude === 100).length;
  const incomplets = dossiers.filter(d => d.completude < 100).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents Élèves</h1>
          <p className="text-muted-foreground">Gestion des dossiers scolaires</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Téléverser Document
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dossiers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">687</div>
            <p className="text-xs text-muted-foreground">Élèves inscrits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complets</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">664</div>
            <p className="text-xs text-muted-foreground">96.7%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incomplets</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">3.3%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Totaux</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,748</div>
            <p className="text-xs text-muted-foreground">Fichiers stockés</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>État des Dossiers</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher un élève..." className="pl-10 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead className="text-center">Acte Naissance</TableHead>
                  <TableHead className="text-center">Certificat Scol.</TableHead>
                  <TableHead className="text-center">Photo</TableHead>
                  <TableHead className="text-center">Cert. Médical</TableHead>
                  <TableHead>Complétude</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dossiers.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{d.eleve}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{d.classe}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {d.acteNaissance ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {d.certificatScolarite ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {d.photo ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {d.certificatMedical ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={d.completude === 100 ? "default" : "destructive"}>
                          {d.completude}%
                        </Badge>
                        {d.completude < 100 && (
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents Requis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentsRequis.map((doc, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{doc.nom}</p>
                        <p className="text-xs text-muted-foreground">{doc.format}</p>
                      </div>
                      <Badge variant={doc.obligatoire ? "destructive" : "secondary"}>
                        {doc.obligatoire ? "Obligatoire" : "Optionnel"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Taille max: {doc.taille}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
