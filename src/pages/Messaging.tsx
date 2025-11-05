import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Mail, 
  Phone,
  Users,
  Bell,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const mockMessages = [
  { 
    id: 1, 
    type: "SMS", 
    recipient: "Parents 6èmeA", 
    subject: "Réunion Parents-Professeurs", 
    date: "2024-11-05 10:30",
    status: "Envoyé",
    count: 25
  },
  { 
    id: 2, 
    type: "Email", 
    recipient: "Enseignants", 
    subject: "Conseil Pédagogique", 
    date: "2024-11-04 15:00",
    status: "Envoyé",
    count: 45
  },
  { 
    id: 3, 
    type: "Notification", 
    recipient: "Élèves TleA", 
    subject: "Publication des notes", 
    date: "2024-11-03 09:00",
    status: "En attente",
    count: 32
  },
];

export default function Messaging() {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messagerie & Communication</h1>
          <p className="text-muted-foreground">Envoi de SMS, emails et notifications</p>
        </div>
        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Nouveau Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Envoyer un message</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Type de message</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destinataires</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_parents">Tous les Parents</SelectItem>
                    <SelectItem value="all_teachers">Tous les Enseignants</SelectItem>
                    <SelectItem value="all_students">Tous les Élèves</SelectItem>
                    <SelectItem value="class_6a">Classe 6èmeA</SelectItem>
                    <SelectItem value="class_tle">Classe TleA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sujet</Label>
                <Input placeholder="Objet du message" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  placeholder="Votre message..." 
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 160 caractères pour SMS
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsNewMessageOpen(false)}>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Envoyés</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Envoyés</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,134</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de lecture</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Messages lus</p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Content */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="email">Emails</TabsTrigger>
              <TabsTrigger value="notification">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="space-y-3">
                {mockMessages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          {message.type === "SMS" && <Phone className="h-5 w-5 text-primary" />}
                          {message.type === "Email" && <Mail className="h-5 w-5 text-primary" />}
                          {message.type === "Notification" && <Bell className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{message.subject}</h3>
                            <Badge variant="outline" className="text-xs">
                              {message.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Destinataire: {message.recipient} ({message.count} personnes)
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {message.date}
                            </span>
                            <Badge 
                              variant={message.status === "Envoyé" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {message.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Voir détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sms">
              <div className="text-center py-12 text-muted-foreground">
                Filtre SMS appliqué
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="text-center py-12 text-muted-foreground">
                Filtre Email appliqué
              </div>
            </TabsContent>

            <TabsContent value="notification">
              <div className="text-center py-12 text-muted-foreground">
                Filtre Notifications appliqué
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Groupes de Contact</h3>
                <p className="text-sm text-muted-foreground">Gérer les listes de diffusion</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <MessageSquare className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Modèles de Messages</h3>
                <p className="text-sm text-muted-foreground">Messages prédéfinis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Bell className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Messages Programmés</h3>
                <p className="text-sm text-muted-foreground">Planifier l'envoi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
