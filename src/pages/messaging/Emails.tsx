import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, Send, Plus, Clock, CheckCircle2, Eye, Paperclip, 
  FileText, Trash2, Edit, Copy, Search, Filter, Download,
  TrendingUp, MousePointer, AlertCircle, Calendar, Users
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { 
  sentEmails, emailTemplates, contactGroups, emailStatistics, 
  Email, EmailTemplate 
} from "@/data/mockMessaging";

export default function EmailsPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Compose form state
  const [composeData, setComposeData] = useState({
    recipients: [] as string[],
    subject: "",
    content: "",
    template: "",
    schedule: false,
    scheduledDate: "",
    scheduledTime: ""
  });

  const handleSendEmail = () => {
    if (!composeData.recipients.length || !composeData.subject || !composeData.content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (composeData.schedule) {
      toast.success(`Email programmé pour le ${composeData.scheduledDate} à ${composeData.scheduledTime}`);
    } else {
      toast.success(`Email envoyé à ${composeData.recipients.length} destinataires`);
    }
    setIsComposeOpen(false);
    setComposeData({ recipients: [], subject: "", content: "", template: "", schedule: false, scheduledDate: "", scheduledTime: "" });
  };

  const handleUseTemplate = (template: EmailTemplate) => {
    setComposeData(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content,
      template: template.name
    }));
    setIsTemplateOpen(false);
    setIsComposeOpen(true);
    toast.success(`Modèle "${template.name}" appliqué`);
  };

  const filteredEmails = sentEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.to.join(" ").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || email.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Emails</h1>
          <p className="text-muted-foreground mt-1">
            Envoi d'emails aux parents, élèves et personnel avec suivi des performances
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Modèles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Modèles d'Emails</DialogTitle>
                <DialogDescription>Sélectionnez un modèle pour composer votre email</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[500px] pr-4">
                <div className="grid gap-4">
                  {emailTemplates.map((template) => (
                    <Card key={template.id} className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedTemplate(template)}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{template.name}</h3>
                              <Badge variant="outline">{template.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Utilisé {template.usageCount} fois</span>
                              <span>Variables: {template.variables.join(", ")}</span>
                            </div>
                          </div>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleUseTemplate(template); }}>
                            Utiliser
                          </Button>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{template.content}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Composer un Email</DialogTitle>
                <DialogDescription>
                  {composeData.template ? `Modèle: ${composeData.template}` : "Créer un nouvel email"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Destinataires *</Label>
                  <Select onValueChange={(value) => setComposeData(prev => ({ ...prev, recipients: [...prev.recipients, value] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ajouter des destinataires..." />
                    </SelectTrigger>
                    <SelectContent>
                      {contactGroups.map((group) => (
                        <SelectItem key={group.id} value={group.name}>
                          {group.name} ({group.memberCount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {composeData.recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {composeData.recipients.map((recipient, idx) => (
                        <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => setComposeData(prev => ({ ...prev, recipients: prev.recipients.filter((_, i) => i !== idx) }))}>
                          {recipient} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Objet *</Label>
                  <Input 
                    placeholder="Objet de l'email"
                    value={composeData.subject}
                    onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea 
                    placeholder="Votre message..."
                    rows={10}
                    value={composeData.content}
                    onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Joindre fichier
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="schedule" 
                      checked={composeData.schedule}
                      onCheckedChange={(checked) => setComposeData(prev => ({ ...prev, schedule: checked as boolean }))}
                    />
                    <label htmlFor="schedule" className="text-sm">Programmer l'envoi</label>
                  </div>
                </div>
                
                {composeData.schedule && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        type="date"
                        value={composeData.scheduledDate}
                        onChange={(e) => setComposeData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Heure</Label>
                      <Input 
                        type="time"
                        value={composeData.scheduledTime}
                        onChange={(e) => setComposeData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>Annuler</Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Sauvegarder brouillon
                </Button>
                <Button onClick={handleSendEmail}>
                  <Send className="mr-2 h-4 w-4" />
                  {composeData.schedule ? "Programmer" : "Envoyer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envoyés Aujourd'hui</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailStatistics.today.sent}</div>
            <p className="text-xs text-muted-foreground">{emailStatistics.today.opened} ouverts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette Semaine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailStatistics.thisWeek.sent}</div>
            <p className="text-xs text-muted-foreground">{emailStatistics.thisWeek.clicked} clics</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Ouverture</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{emailStatistics.openRate}%</div>
            <p className="text-xs text-green-600">+2.3% vs mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Clic</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{emailStatistics.clickRate}%</div>
            <p className="text-xs text-muted-foreground">sur liens inclus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Rebond</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{emailStatistics.bounceRate}%</div>
            <p className="text-xs text-green-600">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox">Boîte d'Envoi</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="contacts">Groupes de Contact</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Emails Envoyés</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="sent">Envoyés</SelectItem>
                      <SelectItem value="scheduled">Programmés</SelectItem>
                      <SelectItem value="draft">Brouillons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Objet</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{email.subject}</p>
                          {email.attachments.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Paperclip className="h-3 w-3" />
                              {email.attachments.length} pièce(s) jointe(s)
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{email.recipientCount}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{email.to.join(", ")}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {email.status === 'scheduled' ? email.scheduledAt : email.sentAt}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          email.status === 'sent' ? 'default' :
                          email.status === 'scheduled' ? 'secondary' :
                          email.status === 'draft' ? 'outline' : 'destructive'
                        }>
                          {email.status === 'sent' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {email.status === 'scheduled' && <Clock className="mr-1 h-3 w-3" />}
                          {email.status === 'sent' ? 'Envoyé' :
                           email.status === 'scheduled' ? 'Programmé' :
                           email.status === 'draft' ? 'Brouillon' : 'Échec'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {email.openRate !== undefined ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <Eye className="h-3 w-3 text-green-600" />
                              <span>{email.openRate}%</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MousePointer className="h-3 w-3" />
                              <span>{email.clickRate}%</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setSelectedEmail(email)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Copy className="h-4 w-4" />
                          </Button>
                          {email.status === 'draft' && (
                            <Button size="icon" variant="ghost">
                              <Edit className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Modèles d'Emails</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un Modèle
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.subject}</CardDescription>
                    </div>
                    <Badge>{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{template.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Utilisé {template.usageCount} fois
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Modifier
                      </Button>
                      <Button size="sm" onClick={() => handleUseTemplate(template)}>
                        Utiliser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Groupes de Contact</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un Groupe
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {contactGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{group.memberCount} membres</Badge>
                    <Badge variant="outline">{group.type}</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">Voir</Button>
                    <Button size="sm" className="flex-1" onClick={() => {
                      setComposeData(prev => ({ ...prev, recipients: [group.name] }));
                      setIsComposeOpen(true);
                    }}>
                      <Mail className="mr-1 h-3 w-3" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Envois</CardTitle>
                <CardDescription>Emails envoyés et ouverts par mois</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emailStatistics.evolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="hsl(var(--primary))" name="Envoyés" strokeWidth={2} />
                    <Line type="monotone" dataKey="opened" stroke="hsl(var(--chart-2))" name="Ouverts" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance par Catégorie</CardTitle>
                <CardDescription>Taux d'ouverture par type d'email</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emailStatistics.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="hsl(var(--primary))" name="Envoyés" />
                    <Bar dataKey="openRate" fill="hsl(var(--chart-2))" name="Taux ouverture %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Catégorie</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emailStatistics.byCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="sent"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emailStatistics.byCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résumé des Performances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux d'ouverture moyen</span>
                      <span className="font-bold text-green-600">{emailStatistics.openRate}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${emailStatistics.openRate}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de clic moyen</span>
                      <span className="font-bold text-blue-600">{emailStatistics.clickRate}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${emailStatistics.clickRate}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de rebond</span>
                      <span className="font-bold text-orange-600">{emailStatistics.bounceRate}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${emailStatistics.bounceRate * 10}%` }} />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{emailStatistics.thisMonth.sent}</p>
                        <p className="text-xs text-muted-foreground">Ce mois</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{emailStatistics.thisMonth.opened}</p>
                        <p className="text-xs text-muted-foreground">Ouverts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{emailStatistics.thisMonth.clicked}</p>
                        <p className="text-xs text-muted-foreground">Clics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Email Detail Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
            <DialogDescription>
              Envoyé le {selectedEmail?.sentAt || selectedEmail?.scheduledAt}
            </DialogDescription>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Destinataires</Label>
                  <p className="font-medium">{selectedEmail.to.join(", ")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nombre</Label>
                  <p className="font-medium">{selectedEmail.recipientCount} personnes</p>
                </div>
              </div>
              {selectedEmail.openRate !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Taux d'ouverture</Label>
                    <p className="font-medium text-green-600">{selectedEmail.openRate}%</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Taux de clic</Label>
                    <p className="font-medium text-blue-600">{selectedEmail.clickRate}%</p>
                  </div>
                </div>
              )}
              {selectedEmail.attachments.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Pièces jointes</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEmail.attachments.map((att, idx) => (
                      <Badge key={idx} variant="outline" className="py-1">
                        <Paperclip className="mr-1 h-3 w-3" />
                        {att.name} ({att.size})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Contenu</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedEmail.content}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
