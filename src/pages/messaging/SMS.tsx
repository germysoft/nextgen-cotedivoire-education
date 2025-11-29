import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Send, Clock, CheckCircle2, XCircle, Users, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const historiqueEnvois = [
  { id: 1, destinataires: "Parents 6ème A", nombre: 25, message: "Réunion parents-profs vendredi 14h", operateur: "MTN", statut: "Envoyé", date: "2024-12-01 09:30", cout: 2500 },
  { id: 2, destinataires: "Tous les parents", nombre: 465, message: "Vacances de Noël du 20/12 au 06/01", operateur: "Orange", statut: "Envoyé", date: "2024-11-28 15:00", cout: 46500 },
  { id: 3, destinataires: "Parents élèves impayés", nombre: 65, message: "Rappel échéance paiement 30/11", operateur: "Moov", statut: "Envoyé", date: "2024-11-25 10:00", cout: 6500 },
  { id: 4, destinataires: "Parents 3ème C", nombre: 30, message: "Composition Maths reportée au 15/12", operateur: "MTN", statut: "Échec partiel", date: "2024-11-20 08:00", cout: 2400 },
];

const statistiquesOperateurs = [
  { operateur: "MTN", envoyes: 1250, cout: 125000, taux_reussite: 98 },
  { operateur: "Orange", envoyes: 980, cout: 98000, taux_reussite: 97 },
  { operateur: "Moov", envoyes: 730, cout: 73000, taux_reussite: 96 },
  { operateur: "TrésorPay", envoyes: 120, cout: 12000, taux_reussite: 99 },
];

const evolutionMensuelle = [
  { mois: "Sep", envoyes: 450, cout: 45000 },
  { mois: "Oct", envoyes: 520, cout: 52000 },
  { mois: "Nov", envoyes: 680, cout: 68000 },
  { mois: "Déc", envoyes: 380, cout: 38000 },
];

const SMSPro = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroupe, setSelectedGroupe] = useState("");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleEnvoiSMS = () => {
    toast.success("SMS envoyé avec succès à " + selectedGroupe);
    setIsDialogOpen(false);
    setMessage("");
    setCharCount(0);
  };

  const totalEnvoyes = statistiquesOperateurs.reduce((sum, op) => sum + op.envoyes, 0);
  const totalCout = statistiquesOperateurs.reduce((sum, op) => sum + op.cout, 0);
  const tauxReussiteMoyen = (statistiquesOperateurs.reduce((sum, op) => sum + op.taux_reussite, 0) / statistiquesOperateurs.length).toFixed(1);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Messagerie SMS Professionnelle</h1>
          <p className="text-muted-foreground mt-2">Envoi de SMS groupés via MTN, Orange, Moov, TrésorPay</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Send className="mr-2 h-5 w-5" />
              Envoyer SMS
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvel Envoi SMS</DialogTitle>
              <DialogDescription>Composer et envoyer un SMS groupé</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Groupe Destinataires</Label>
                  <Select value={selectedGroupe} onValueChange={setSelectedGroupe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les parents (465)</SelectItem>
                      <SelectItem value="6eme">Parents 6ème (75)</SelectItem>
                      <SelectItem value="5eme">Parents 5ème (80)</SelectItem>
                      <SelectItem value="4eme">Parents 4ème (78)</SelectItem>
                      <SelectItem value="3eme">Parents 3ème (82)</SelectItem>
                      <SelectItem value="impayes">Parents impayés (65)</SelectItem>
                      <SelectItem value="enseignants">Enseignants (32)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Opérateur</Label>
                  <Select defaultValue="mtn">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN (98% réussite)</SelectItem>
                      <SelectItem value="orange">Orange (97% réussite)</SelectItem>
                      <SelectItem value="moov">Moov (96% réussite)</SelectItem>
                      <SelectItem value="tresorpay">TrésorPay (99% réussite)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Tapez votre message ici..."
                  className="min-h-[150px]"
                  value={message}
                  onChange={handleMessageChange}
                  maxLength={160}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{charCount}/160 caractères</span>
                  <span>{Math.ceil(charCount / 160)} SMS</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Options d'envoi</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="programmee" />
                  <label htmlFor="programmee" className="text-sm">Envoi programmé</label>
                </div>
              </div>

              {selectedGroupe && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Coût estimé:</span>
                    <span className="text-lg font-bold">{(parseInt(selectedGroupe === "tous" ? "465" : "75") * 100).toLocaleString()} FCFA</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleEnvoiSMS} disabled={!selectedGroupe || !message}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer Maintenant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Envoyés</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnvoyes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCout.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground">Novembre 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Réussite</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxReussiteMoyen}%</div>
            <p className="text-xs text-muted-foreground">Moyenne opérateurs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destinataires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">465</div>
            <p className="text-xs text-muted-foreground">Parents actifs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="historique" className="space-y-4">
        <TabsList>
          <TabsTrigger value="historique">Historique d'Envois</TabsTrigger>
          <TabsTrigger value="operateurs">Statistiques Opérateurs</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Derniers Envois SMS</CardTitle>
              <CardDescription>Historique des messages envoyés</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Coût</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historiqueEnvois.map((envoi) => (
                    <TableRow key={envoi.id}>
                      <TableCell className="text-sm">{envoi.date}</TableCell>
                      <TableCell className="font-medium">{envoi.destinataires}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{envoi.nombre}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{envoi.message}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{envoi.operateur}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={envoi.statut === "Envoyé" ? "default" : "destructive"}>
                          {envoi.statut === "Envoyé" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                          {envoi.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{envoi.cout.toLocaleString()} F</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operateurs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Opérateur</CardTitle>
                <CardDescription>Nombre de SMS et coûts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistiquesOperateurs.map((op) => (
                    <div key={op.operateur} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{op.operateur}</span>
                        <Badge variant="outline">{op.taux_reussite}% réussite</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Envoyés:</span>
                          <span className="ml-2 font-medium">{op.envoyes.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Coût:</span>
                          <span className="ml-2 font-medium">{op.cout.toLocaleString()} F</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Opérateur</CardTitle>
                <CardDescription>Volume d'envois</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistiquesOperateurs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="operateur" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="envoyes" fill="hsl(var(--primary))" name="SMS Envoyés" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
              <CardDescription>Volume et coûts des envois</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionMensuelle}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="envoyes" fill="hsl(var(--primary))" name="SMS Envoyés" />
                  <Bar yAxisId="right" dataKey="cout" fill="hsl(var(--chart-2))" name="Coût (FCFA)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SMSPro;
