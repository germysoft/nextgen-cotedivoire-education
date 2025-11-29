import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  Bell, 
  Calendar, 
  Plus, 
  Search,
  Users,
  CheckCircle2,
  Clock
} from "lucide-react";
import { StudentAlertCard } from "@/components/convocations/StudentAlertCard";
import { ConvocationForm } from "@/components/convocations/ConvocationForm";
import { ConvocationTracker } from "@/components/convocations/ConvocationTracker";
import { generateConvocationPDF } from "@/components/convocations/ConvocationPDFGenerator";
import { mockStudentAlerts, mockConvocations } from "@/data/mockConvocations";
import { StudentAlert, Convocation, ConvocationStatus } from "@/types/convocation";
import { toast } from "sonner";

export default function ConvocationsPage() {
  const [alerts] = useState<StudentAlert[]>(mockStudentAlerts);
  const [convocations, setConvocations] = useState<Convocation[]>(mockConvocations);
  const [showForm, setShowForm] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<StudentAlert | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateConvocation = (alert: StudentAlert) => {
    setSelectedAlert(alert);
    setShowForm(true);
  };

  const handleSaveConvocation = (data: any) => {
    const newConvocation: Convocation = {
      id: `conv_${Date.now()}`,
      ...data,
    };
    setConvocations([newConvocation, ...convocations]);
    setShowForm(false);
    setSelectedAlert(undefined);
    toast.success("Convocation créée avec succès !");
  };

  const handleDownloadPDF = (convocation: Convocation) => {
    generateConvocationPDF(convocation);
    toast.success("Convocation téléchargée en PDF");
  };

  const handleSendReminder = (convocation: Convocation) => {
    const method = convocation.parentEmail ? "email" : "SMS";
    toast.success(`Relance envoyée par ${method} à ${convocation.parentName}`);
  };

  const handleUpdateStatus = (convocationId: string, status: ConvocationStatus) => {
    setConvocations(convocations.map(c => 
      c.id === convocationId ? { ...c, status } : c
    ));
    toast.success("Statut mis à jour");
  };

  const filteredAlerts = alerts.filter(alert =>
    alert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConvocations = convocations.filter(conv =>
    conv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalAlerts: alerts.length,
    urgentAlerts: alerts.filter(a => a.severity === 'urgent').length,
    pendingConvocations: convocations.filter(c => c.status === 'pending').length,
    upcomingMeetings: convocations.filter(c => c.status === 'confirmed').length,
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Convocations Parents</h1>
          <p className="text-muted-foreground mt-2">
            Détection automatique et gestion des convocations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle convocation
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Élèves en alerte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dont {stats.urgentAlerts} urgents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingConvocations}</div>
            <p className="text-xs text-muted-foreground mt-1">convocations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              RDV confirmés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">à venir</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
              Réalisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {convocations.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <ConvocationForm
          alert={selectedAlert}
          onSave={handleSaveConvocation}
          onCancel={() => {
            setShowForm(false);
            setSelectedAlert(undefined);
          }}
        />
      )}

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un élève ou parent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs principale */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">
            <Bell className="mr-2 h-4 w-4" />
            Alertes auto ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <Users className="mr-2 h-4 w-4" />
            Suivi convocations ({convocations.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Alertes */}
        <TabsContent value="alerts" className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Aucune alerte détectée</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAlerts.map((alert) => (
                <StudentAlertCard
                  key={alert.studentId}
                  alert={alert}
                  onCreateConvocation={handleCreateConvocation}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab Suivi */}
        <TabsContent value="tracking">
          {filteredConvocations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Aucune convocation</p>
              </CardContent>
            </Card>
          ) : (
            <ConvocationTracker
              convocations={filteredConvocations}
              onViewDetails={(conv) => console.log("View details", conv)}
              onDownloadPDF={handleDownloadPDF}
              onSendReminder={handleSendReminder}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
