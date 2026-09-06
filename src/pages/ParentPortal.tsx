import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User, BookOpen, Calendar, TrendingUp, Download, FileText, AlertCircle,
  CheckCircle, LogOut, GraduationCap, Award, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import NotificationCenter, { type Notification } from "@/components/parent/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAbsencesEnfantQuery,
  useBulletinsEnfantQuery,
  useEcheancesEnfantQuery,
  useEnfantsQuery,
  useNotesEnfantQuery,
} from "@/hooks/api/useParentPortal";
import { resteAPayer } from "@/hooks/api/useFinance";

function calculerAge(dateNaissance: string): number {
  return Math.floor((Date.now() - new Date(dateNaissance).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export default function ParentPortal() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedEleveId, setSelectedEleveId] = useState<string | undefined>();

  // Non connecté (ou pas un compte parent/élève) : retour à la connexion.
  useEffect(() => {
    if (user && user.role !== "parent" && user.role !== "eleve") {
      navigate("/parent-login", { replace: true });
    }
  }, [user, navigate]);

  const { data: enfants = [], isLoading: loadingEnfants } = useEnfantsQuery();

  useEffect(() => {
    if (!selectedEleveId && enfants.length > 0) setSelectedEleveId(enfants[0].id);
  }, [enfants, selectedEleveId]);

  const enfant = enfants.find((e) => e.id === selectedEleveId);
  const { data: notes = [] } = useNotesEnfantQuery(selectedEleveId);
  const { data: absences = [] } = useAbsencesEnfantQuery(selectedEleveId);
  const { data: echeances = [] } = useEcheancesEnfantQuery(selectedEleveId);
  const { data: bulletins = [], isLoading: loadingBulletins } = useBulletinsEnfantQuery(selectedEleveId);

  const dernierBulletin = bulletins[0]; // trié par genereLe desc côté API
  const moyenneGenerale = dernierBulletin?.moyenneGenerale ?? 0;
  const absencesNonJustifiees = absences.filter((a) => !a.justifiee).length;
  const pendingPayments = echeances.filter((e) => e.statut !== "Payée").length;

  const handleLogout = async () => {
    await logout();
    toast.success("Déconnexion réussie");
    navigate("/parent-login");
  };

  const handleDownloadBulletin = (documentUrl?: string) => {
    if (!documentUrl) {
      toast.info("Le PDF de ce bulletin n'a pas encore été archivé par l'établissement.");
      return;
    }
    window.open(documentUrl, "_blank");
  };

  const handleNotificationClick = (notification: Notification) => {
    toast.info("Navigation vers " + notification.title);
  };

  if (loadingEnfants) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Portail Parents & Élèves</h1>
                <p className="text-xs text-muted-foreground">NextGen Éducation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {enfants.length > 1 && (
                <Select value={selectedEleveId} onValueChange={setSelectedEleveId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choisir un enfant" />
                  </SelectTrigger>
                  <SelectContent>
                    {enfants.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nom} {e.prenom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <NotificationCenter onNotificationClick={handleNotificationClick} />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {!enfant ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Aucun enfant rattaché à ce compte.</CardContent></Card>
        ) : (
        <>
        <Card className="border-l-4 border-l-primary shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{enfant.nom} {enfant.prenom}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Classe: <span className="font-medium text-foreground">{enfant.inscriptions?.[0]?.classe?.nom ?? "—"}</span>
                    </span>
                    <span>•</span>
                    <span>Matricule: <span className="font-mono font-medium text-foreground">{enfant.matricule}</span></span>
                  </div>
                  {user?.parentProfil && (
                    <p className="text-sm text-muted-foreground mt-1">Parent: {user.parentProfil.nom} {user.parentProfil.prenom}</p>
                  )}
                </div>
              </div>
              <Button onClick={() => handleDownloadBulletin(dernierBulletin?.documentUrl)}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger Bulletin
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{moyenneGenerale ? moyenneGenerale.toFixed(2) : "—"}/20</div>
              <Progress value={(moyenneGenerale / 20) * 100} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {dernierBulletin ? `${dernierBulletin.anneeScolaire}` : "Aucun bulletin publié"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absences non justifiées</CardTitle>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{absencesNonJustifiees}</div>
              <p className="text-xs text-muted-foreground mt-3">sur {absences.length} au total</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements</CardTitle>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {pendingPayments > 0 ? <span className="text-destructive">{pendingPayments}</span> : <span className="text-success">À jour</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-3">{pendingPayments > 0 ? "en attente" : "Tous payés"}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Suivi Scolaire Complet
            </CardTitle>
            <CardDescription>Consultez toutes les informations concernant la scolarité de votre enfant</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="grades" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 h-auto">
                <TabsTrigger value="grades" className="flex flex-col gap-1 py-2"><BookOpen className="h-4 w-4" /><span className="text-xs">Notes</span></TabsTrigger>
                <TabsTrigger value="bulletins" className="flex flex-col gap-1 py-2"><FileText className="h-4 w-4" /><span className="text-xs">Bulletins</span></TabsTrigger>
                <TabsTrigger value="attendance" className="flex flex-col gap-1 py-2"><Calendar className="h-4 w-4" /><span className="text-xs">Assiduité</span></TabsTrigger>
                <TabsTrigger value="payments" className="flex flex-col gap-1 py-2"><CheckCircle className="h-4 w-4" /><span className="text-xs">Paiements</span></TabsTrigger>
                <TabsTrigger value="info" className="flex flex-col gap-1 py-2"><User className="h-4 w-4" /><span className="text-xs">Informations</span></TabsTrigger>
              </TabsList>

              <TabsContent value="grades" className="space-y-4">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Matière</TableHead>
                        <TableHead className="text-center">Type</TableHead>
                        <TableHead className="text-center">Note</TableHead>
                        <TableHead className="text-center">Coef</TableHead>
                        <TableHead className="text-center">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notes.map((n) => (
                        <TableRow key={n.id}>
                          <TableCell className="font-medium">{n.matiere.nom}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{n.type}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={n.valeur >= n.noteMax / 2 ? "default" : "destructive"} className="min-w-[60px]">
                              {n.valeur}/{n.noteMax}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-medium">{n.coefficient}</TableCell>
                          <TableCell className="text-center font-mono text-sm">{new Date(n.dateEvaluation).toLocaleDateString('fr-FR')}</TableCell>
                        </TableRow>
                      ))}
                      {notes.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucune note saisie pour le moment</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="bulletins" className="space-y-4">
                {loadingBulletins ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Chargement...</div>
                ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Année Scolaire</TableHead>
                        <TableHead className="text-center">Moyenne</TableHead>
                        <TableHead className="text-center">Classement</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulletins.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{b.anneeScolaire}</div>
                          </TableCell>
                          <TableCell className="text-center"><Badge variant="default" className="min-w-[60px]">{b.moyenneGenerale.toFixed(2)}/20</Badge></TableCell>
                          <TableCell className="text-center">
                            {b.rang ? <Badge variant="outline">{b.rang}ème / {b.effectifClasse}</Badge> : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => handleDownloadBulletin(b.documentUrl)}>
                              <Download className="mr-2 h-4 w-4" />Télécharger
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {bulletins.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Aucun bulletin publié pour le moment</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                )}
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Durée</TableHead>
                        <TableHead className="text-center">Justification</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {absences.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-mono text-sm"><div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{new Date(a.date).toLocaleDateString('fr-FR')}</div></TableCell>
                          <TableCell className="text-center">{a.dureeHeures}h</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={a.justifiee ? "secondary" : "destructive"}>{a.justifiee ? "✓ Justifiée" : "✗ Non justifiée"}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {absences.length === 0 && (
                        <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Aucune absence enregistrée</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Échéance</TableHead>
                        <TableHead className="text-right">Reste à payer</TableHead>
                        <TableHead className="text-center">Date limite</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {echeances.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-medium">{e.libelle}</TableCell>
                          <TableCell className="font-mono text-right font-bold">{resteAPayer(e).toLocaleString()} FCFA</TableCell>
                          <TableCell className="text-center font-mono text-sm">{new Date(e.dateEcheance).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={e.statut === "Payée" ? "default" : "destructive"} className="min-w-[90px]">
                              {e.statut === "Payée" ? "✓ Payé" : e.statut}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {e.statut !== "Payée" && (
                              <Button size="sm" onClick={() => toast.info("Le paiement en ligne (Mobile Money) n'est pas encore disponible — rendez-vous au secrétariat.")}>
                                Payer maintenant
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {echeances.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucune échéance enregistrée</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-l-4 border-l-primary">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-primary" />Informations Élève</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Nom complet:</span><span className="text-sm font-medium">{enfant.nom} {enfant.prenom}</span></div>
                      <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Matricule:</span><Badge variant="outline" className="font-mono">{enfant.matricule}</Badge></div>
                      <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Classe:</span><Badge variant="secondary">{enfant.inscriptions?.[0]?.classe?.nom ?? "—"}</Badge></div>
                      <div className="flex justify-between py-2"><span className="text-sm text-muted-foreground">Âge:</span><span className="text-sm font-medium">{calculerAge(enfant.dateNaissance)} ans</span></div>
                    </CardContent>
                  </Card>

                  {user?.parentProfil && (
                    <Card className="border-l-4 border-l-accent">
                      <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-accent" />Contact Parent</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Nom:</span><span className="text-sm font-medium">{user.parentProfil.nom} {user.parentProfil.prenom}</span></div>
                        <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Téléphone:</span><span className="text-sm font-medium font-mono">{user.parentProfil.telephone}</span></div>
                        <div className="flex justify-between py-2"><span className="text-sm text-muted-foreground">Email:</span><span className="text-sm font-medium break-all">{user.parentProfil.email}</span></div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base">Résumé de l'Année Scolaire</CardTitle>
                    <CardDescription>Vue d'ensemble des performances et de l'assiduité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Dernière moyenne publiée</p>
                        <p className="text-2xl font-bold text-primary">{moyenneGenerale ? moyenneGenerale.toFixed(2) : "—"}/20</p>
                        <Progress value={(moyenneGenerale / 20) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Paiements</p>
                        <p className="text-2xl font-bold">
                          {pendingPayments === 0 ? <span className="text-success">À jour</span> : <span className="text-destructive">{pendingPayments} en attente</span>}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </>
        )}
      </div>
    </div>
  );
}
