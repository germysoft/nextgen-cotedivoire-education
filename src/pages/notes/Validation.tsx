import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const validations = [
  { id: 1, classe: "Tle D", matiere: "Mathématiques", enseignant: "M. KOFFI", trimestre: "T1", notesTotal: 38, notesSaisies: 38, dateValidation: null, statut: "En attente", validateur: null },
  { id: 2, classe: "1ère A", matiere: "Français", enseignant: "Mme SANOGO", trimestre: "T1", notesTotal: 45, notesSaisies: 45, dateValidation: "12 Déc 2024", statut: "Validé", validateur: "Censeur DIALLO" },
  { id: 3, classe: "2nde B", matiere: "Physique", enseignant: "M. TOURÉ", trimestre: "T1", notesTotal: 42, notesSaisies: 38, dateValidation: null, statut: "Incomplet", validateur: null },
  { id: 4, classe: "3ème C", matiere: "Anglais", enseignant: "M. JOHNSON", trimestre: "T1", notesTotal: 48, notesSaisies: 48, dateValidation: null, statut: "En attente", validateur: null },
  { id: 5, classe: "Tle A", matiere: "Philosophie", enseignant: "Mme BAMBA", trimestre: "T1", notesTotal: 41, notesSaisies: 41, dateValidation: "10 Déc 2024", statut: "Validé", validateur: "Prof Principal TRAORE" },
  { id: 6, classe: "1ère C", matiere: "SVT", enseignant: "M. KONE", trimestre: "T1", notesTotal: 43, notesSaisies: 40, dateValidation: null, statut: "Incomplet", validateur: null },
  { id: 7, classe: "4ème A", matiere: "Histoire-Géo", enseignant: "Mme YAO", trimestre: "T1", notesTotal: 52, notesSaisies: 52, dateValidation: "14 Déc 2024", statut: "Validé", validateur: "Censeur DIALLO" },
  { id: 8, classe: "6ème B", matiere: "Mathématiques", enseignant: "M. KOUADIO", trimestre: "T1", notesTotal: 46, notesSaisies: 32, dateValidation: null, statut: "Rejeté", validateur: "Censeur DIALLO" },
];

export default function Validation() {
  const stats = {
    total: validations.length,
    valides: validations.filter(v => v.statut === "Validé").length,
    attente: validations.filter(v => v.statut === "En attente").length,
    rejetes: validations.filter(v => v.statut === "Rejeté").length,
    incomplets: validations.filter(v => v.statut === "Incomplet").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Validation des Notes</h1>
          <p className="text-muted-foreground">Contrôle et approbation des notes saisies</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saisies</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.valides}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.attente}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incomplets</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.incomplets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejetes}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
          <TabsTrigger value="attente">En Attente ({stats.attente})</TabsTrigger>
          <TabsTrigger value="valides">Validés ({stats.valides})</TabsTrigger>
          <TabsTrigger value="incomplets">Incomplets ({stats.incomplets})</TabsTrigger>
          <TabsTrigger value="rejetes">Rejetés ({stats.rejetes})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les Saisies</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Trimestre</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Date Validation</TableHead>
                    <TableHead>Validateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validations.map((validation) => (
                    <TableRow key={validation.id}>
                      <TableCell>
                        <Badge variant="outline">{validation.classe}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{validation.matiere}</TableCell>
                      <TableCell>{validation.enseignant}</TableCell>
                      <TableCell>
                        <Badge>{validation.trimestre}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={validation.notesSaisies === validation.notesTotal ? "text-green-600 font-semibold" : "text-orange-600"}>
                            {validation.notesSaisies}/{validation.notesTotal}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {validation.dateValidation || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {validation.validateur || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {validation.statut === "Validé" && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Validé
                          </Badge>
                        )}
                        {validation.statut === "En attente" && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            En attente
                          </Badge>
                        )}
                        {validation.statut === "Rejeté" && (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Rejeté
                          </Badge>
                        )}
                        {validation.statut === "Incomplet" && (
                          <Badge variant="outline" className="gap-1 border-orange-500 text-orange-600">
                            <AlertCircle className="h-3 w-3" />
                            Incomplet
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {validation.statut === "En attente" && (
                            <>
                              <Button size="sm" variant="default">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attente">
          <Card>
            <CardHeader>
              <CardTitle>Saisies En Attente de Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validations.filter(v => v.statut === "En attente").map((validation) => (
                    <TableRow key={validation.id}>
                      <TableCell>
                        <Badge variant="outline">{validation.classe}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{validation.matiere}</TableCell>
                      <TableCell>{validation.enseignant}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">
                          {validation.notesSaisies}/{validation.notesTotal}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Valider
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valides">
          <Card>
            <CardHeader>
              <CardTitle>Saisies Validées</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Date Validation</TableHead>
                    <TableHead>Validateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validations.filter(v => v.statut === "Validé").map((validation) => (
                    <TableRow key={validation.id}>
                      <TableCell>
                        <Badge variant="outline">{validation.classe}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{validation.matiere}</TableCell>
                      <TableCell>{validation.enseignant}</TableCell>
                      <TableCell>{validation.dateValidation}</TableCell>
                      <TableCell>{validation.validateur}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incomplets">
          <Card>
            <CardHeader>
              <CardTitle>Saisies Incomplètes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Notes Manquantes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validations.filter(v => v.statut === "Incomplet").map((validation) => (
                    <TableRow key={validation.id}>
                      <TableCell>
                        <Badge variant="outline">{validation.classe}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{validation.matiere}</TableCell>
                      <TableCell>{validation.enseignant}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {validation.notesTotal - validation.notesSaisies} manquantes
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Relancer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejetes">
          <Card>
            <CardHeader>
              <CardTitle>Saisies Rejetées</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validations.filter(v => v.statut === "Rejeté").map((validation) => (
                    <TableRow key={validation.id}>
                      <TableCell>
                        <Badge variant="outline">{validation.classe}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{validation.matiere}</TableCell>
                      <TableCell>{validation.enseignant}</TableCell>
                      <TableCell className="text-red-600">Notes incomplètes - {validation.notesTotal - validation.notesSaisies} manquantes</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Corriger
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
