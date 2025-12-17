import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  QrCode, Download, Users, Clock, CheckCircle, XCircle, 
  Scan, Eye, Settings, Printer, RefreshCw, Shield, Camera,
  UserCheck, AlertTriangle, Calendar, MapPin
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface StudentQR {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  qrCode: string;
  generatedAt: string;
  validUntil: string;
  status: "active" | "expired" | "revoked";
  scans: number;
}

interface ScanLog {
  id: string;
  studentId: string;
  studentName: string;
  action: "entry" | "exit" | "canteen" | "library";
  location: string;
  timestamp: string;
  verifiedBy: string;
}

const mockStudentQRs: StudentQR[] = [
  { id: "1", studentId: "STU001", studentName: "Kouamé Yao", class: "6ème A", qrCode: "QR-2024-001", generatedAt: "2024-09-01", validUntil: "2025-06-30", status: "active", scans: 245 },
  { id: "2", studentId: "STU002", studentName: "Diallo Aminata", class: "5ème B", qrCode: "QR-2024-002", generatedAt: "2024-09-01", validUntil: "2025-06-30", status: "active", scans: 312 },
  { id: "3", studentId: "STU003", studentName: "Koné Mamadou", class: "4ème A", qrCode: "QR-2024-003", generatedAt: "2024-09-01", validUntil: "2025-06-30", status: "active", scans: 198 },
  { id: "4", studentId: "STU004", studentName: "Bamba Fatou", class: "3ème C", qrCode: "QR-2024-004", generatedAt: "2024-09-01", validUntil: "2024-12-31", status: "expired", scans: 156 },
  { id: "5", studentId: "STU005", studentName: "Traoré Sekou", class: "2nde A", qrCode: "QR-2024-005", generatedAt: "2024-09-01", validUntil: "2025-06-30", status: "revoked", scans: 89 },
];

const mockScanLogs: ScanLog[] = [
  { id: "1", studentId: "STU001", studentName: "Kouamé Yao", action: "entry", location: "Portail principal", timestamp: "2024-01-15 07:45:23", verifiedBy: "Gardien 1" },
  { id: "2", studentId: "STU002", studentName: "Diallo Aminata", action: "entry", location: "Portail principal", timestamp: "2024-01-15 07:48:12", verifiedBy: "Gardien 1" },
  { id: "3", studentId: "STU001", studentName: "Kouamé Yao", action: "canteen", location: "Cantine scolaire", timestamp: "2024-01-15 12:05:45", verifiedBy: "Agent cantine" },
  { id: "4", studentId: "STU003", studentName: "Koné Mamadou", action: "library", location: "Bibliothèque", timestamp: "2024-01-15 14:30:00", verifiedBy: "Bibliothécaire" },
  { id: "5", studentId: "STU002", studentName: "Diallo Aminata", action: "exit", location: "Portail principal", timestamp: "2024-01-15 17:15:33", verifiedBy: "Gardien 2" },
];

const dailyScans = [
  { hour: "07h", scans: 145 },
  { hour: "08h", scans: 89 },
  { hour: "09h", scans: 23 },
  { hour: "10h", scans: 12 },
  { hour: "11h", scans: 8 },
  { hour: "12h", scans: 234 },
  { hour: "13h", scans: 189 },
  { hour: "14h", scans: 45 },
  { hour: "15h", scans: 34 },
  { hour: "16h", scans: 67 },
  { hour: "17h", scans: 178 },
];

const scansByType = [
  { name: "Entrées", value: 45, color: "#22c55e" },
  { name: "Sorties", value: 35, color: "#ef4444" },
  { name: "Cantine", value: 15, color: "#f59e0b" },
  { name: "Bibliothèque", value: 5, color: "#3b82f6" },
];

const QRCodeScolaire = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedStudent, setScannedStudent] = useState<StudentQR | null>(null);

  const stats = {
    totalQRs: mockStudentQRs.length,
    activeQRs: mockStudentQRs.filter(q => q.status === "active").length,
    totalScans: mockStudentQRs.reduce((acc, q) => acc + q.scans, 0),
    todayScans: 523,
  };

  const filteredQRs = mockStudentQRs.filter(qr => {
    const matchClass = selectedClass === "all" || qr.class === selectedClass;
    const matchSearch = qr.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       qr.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  const simulateScan = () => {
    const randomStudent = mockStudentQRs[Math.floor(Math.random() * mockStudentQRs.length)];
    setScannedStudent(randomStudent);
    if (randomStudent.status === "active") {
      toast.success(`Élève identifié: ${randomStudent.studentName}`);
    } else if (randomStudent.status === "expired") {
      toast.warning(`QR Code expiré pour ${randomStudent.studentName}`);
    } else {
      toast.error(`QR Code révoqué pour ${randomStudent.studentName}`);
    }
  };

  const generateBulkQR = () => {
    toast.success("Génération en masse lancée pour 156 élèves");
    setIsGenerateDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">QR Code Scolaire</h1>
          <p className="text-muted-foreground">Identification et suivi des élèves par QR Code</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsScannerOpen(true)}>
            <Scan className="h-4 w-4 mr-2" />
            Scanner
          </Button>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <QrCode className="h-4 w-4 mr-2" />
                Générer QR Codes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Générer des QR Codes</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Sélectionner les classes</Label>
                  <Select defaultValue="all">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les classes</SelectItem>
                      <SelectItem value="6eme">6ème uniquement</SelectItem>
                      <SelectItem value="5eme">5ème uniquement</SelectItem>
                      <SelectItem value="nouveaux">Nouveaux élèves</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Validité</Label>
                  <Select defaultValue="year">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Année scolaire (Juin 2025)</SelectItem>
                      <SelectItem value="semester">Semestre</SelectItem>
                      <SelectItem value="trimester">Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={generateBulkQR} className="flex-1">
                    Générer (156 élèves)
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Scanner Dialog */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scanner un QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Caméra du scanner</p>
                <Button className="mt-4" onClick={simulateScan}>
                  Simuler un scan
                </Button>
              </div>
            </div>
            {scannedStudent && (
              <Card className={scannedStudent.status === "active" ? "border-green-500" : scannedStudent.status === "expired" ? "border-amber-500" : "border-destructive"}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${
                      scannedStudent.status === "active" ? "bg-green-500/10" : 
                      scannedStudent.status === "expired" ? "bg-amber-500/10" : "bg-destructive/10"
                    }`}>
                      {scannedStudent.status === "active" ? (
                        <UserCheck className="h-6 w-6 text-green-500" />
                      ) : (
                        <AlertTriangle className={`h-6 w-6 ${scannedStudent.status === "expired" ? "text-amber-500" : "text-destructive"}`} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{scannedStudent.studentName}</p>
                      <p className="text-sm text-muted-foreground">{scannedStudent.class} - {scannedStudent.studentId}</p>
                      <Badge className="mt-1" variant={scannedStudent.status === "active" ? "default" : scannedStudent.status === "expired" ? "secondary" : "destructive"}>
                        {scannedStudent.status === "active" ? "Actif" : scannedStudent.status === "expired" ? "Expiré" : "Révoqué"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">QR Codes total</p>
                <p className="text-2xl font-bold">{stats.totalQRs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">QR Actifs</p>
                <p className="text-2xl font-bold">{stats.activeQRs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Scan className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scans total</p>
                <p className="text-2xl font-bold">{stats.totalScans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scans aujourd'hui</p>
                <p className="text-2xl font-bold">{stats.todayScans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="qrcodes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="qrcodes">QR Codes élèves</TabsTrigger>
          <TabsTrigger value="logs">Journal des scans</TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="qrcodes" className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Classe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="6ème A">6ème A</SelectItem>
                <SelectItem value="5ème B">5ème B</SelectItem>
                <SelectItem value="4ème A">4ème A</SelectItem>
                <SelectItem value="3ème C">3ème C</SelectItem>
                <SelectItem value="2nde A">2nde A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Code QR</TableHead>
                    <TableHead>Validité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Scans</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQRs.map(qr => (
                    <TableRow key={qr.id}>
                      <TableCell className="font-mono">{qr.studentId}</TableCell>
                      <TableCell className="font-medium">{qr.studentName}</TableCell>
                      <TableCell>{qr.class}</TableCell>
                      <TableCell className="font-mono text-sm">{qr.qrCode}</TableCell>
                      <TableCell>{new Date(qr.validUntil).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>
                        <Badge variant={qr.status === "active" ? "default" : qr.status === "expired" ? "secondary" : "destructive"}>
                          {qr.status === "active" ? "Actif" : qr.status === "expired" ? "Expiré" : "Révoqué"}
                        </Badge>
                      </TableCell>
                      <TableCell>{qr.scans}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
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

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Journal des scans - Aujourd'hui</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Heure</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Vérifié par</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockScanLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp.split(" ")[1]}</TableCell>
                      <TableCell className="font-medium">{log.studentName}</TableCell>
                      <TableCell>
                        <Badge variant={log.action === "entry" ? "default" : log.action === "exit" ? "secondary" : "outline"}>
                          {log.action === "entry" ? "Entrée" : log.action === "exit" ? "Sortie" : log.action === "canteen" ? "Cantine" : "Bibliothèque"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {log.location}
                        </div>
                      </TableCell>
                      <TableCell>{log.verifiedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scans par heure</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dailyScans}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="scans" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={scansByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {scansByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration du système QR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Durée de validité par défaut</Label>
                  <Select defaultValue="year">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Année scolaire</SelectItem>
                      <SelectItem value="semester">Semestre</SelectItem>
                      <SelectItem value="trimester">Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format du QR Code</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="detailed">Détaillé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRCodeScolaire;
