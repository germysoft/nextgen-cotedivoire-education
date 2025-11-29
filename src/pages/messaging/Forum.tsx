import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, ThumbsUp, MessageCircle, Clock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const discussions = [
  { id: 1, titre: "Organisation Sortie Pédagogique 1ère", auteur: "Mme DIALLO", categorie: "Pédagogie", reponses: 12, vues: 45, derniereActivite: "Il y a 2h", statut: "Actif" },
  { id: 2, titre: "Révision Programme SVT Terminale", auteur: "M. KONE", categorie: "Pédagogie", reponses: 8, vues: 32, derniereActivite: "Il y a 5h", statut: "Actif" },
  { id: 3, titre: "Gestion Retards Élèves", auteur: "M. KOUADIO", categorie: "Discipline", reponses: 15, vues: 68, derniereActivite: "Hier", statut: "Résolu" },
  { id: 4, titre: "Proposition Activité Parascolaire", auteur: "Mme BAMBA", categorie: "Activités", reponses: 6, vues: 28, derniereActivite: "Il y a 3h", statut: "Actif" },
  { id: 5, titre: "Planification Examens T2", auteur: "M. KOFFI", categorie: "Examens", reponses: 20, vues: 92, derniereActivite: "Il y a 1h", statut: "Important" },
];

const categories = [
  { nom: "Pédagogie", count: 45, color: "bg-blue-500" },
  { nom: "Discipline", count: 23, color: "bg-red-500" },
  { nom: "Activités", count: 18, color: "bg-green-500" },
  { nom: "Examens", count: 34, color: "bg-purple-500" },
  { nom: "Général", count: 56, color: "bg-gray-500" },
];

export default function Forum() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forum Interne</h1>
          <p className="text-muted-foreground">Espace d'échange et de collaboration</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer une Discussion</DialogTitle>
              <DialogDescription>Lancer un nouveau sujet de discussion</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre</Label>
                <Input id="titre" placeholder="Titre de la discussion" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Input id="categorie" placeholder="Ex: Pédagogie, Discipline..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Votre message..." rows={6} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Publier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discussions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">176</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Réponses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground">Membres actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-green-600">Nouveaux messages</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${cat.color}`} />
                    <span className="font-medium">{cat.nom}</span>
                  </div>
                  <Badge variant="secondary">{cat.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Discussions Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {discussions.map((disc) => (
                <Card key={disc.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{disc.titre}</h3>
                          {disc.statut === "Important" && (
                            <Badge variant="destructive">Important</Badge>
                          )}
                          {disc.statut === "Résolu" && (
                            <Badge variant="default">Résolu</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {disc.auteur}
                          </div>
                          <Badge variant="outline">{disc.categorie}</Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {disc.derniereActivite}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MessageCircle className="h-3 w-3" />
                            {disc.reponses}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            {disc.vues}
                          </div>
                        </div>
                      </div>
                    </div>
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
