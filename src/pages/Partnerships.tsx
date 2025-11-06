import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Handshake, 
  Users, 
  Building2,
  Calendar,
  Plus,
  DollarSign,
  FileText
} from "lucide-react";

const mockAPEL = [
  { id: 1, year: "2024-2025", president: "M. Koné Yao", members: 450, meetings: 3, funds: 2500000, status: "Actif" },
  { id: 2, year: "2023-2024", president: "Mme Diallo Fatou", members: 428, meetings: 5, funds: 1800000, status: "Archivé" },
];

const mockPartners = [
  { id: 1, name: "Orange CI", type: "Entreprise", domain: "Technologie", contribution: "Fourniture internet", since: "2020", status: "Actif" },
  { id: 2, name: "UNICEF Côte d'Ivoire", type: "ONG", domain: "Éducation", contribution: "Bourses d'étude", since: "2018", status: "Actif" },
  { id: 3, name: "Ministère de l'Éducation", type: "Institution", domain: "Académique", contribution: "Manuels scolaires", since: "2015", status: "Actif" },
  { id: 4, name: "Banque Atlantique", type: "Entreprise", domain: "Finance", contribution: "Équipements", since: "2022", status: "Actif" },
];

const mockMeetings = [
  { id: 1, date: "2024-11-10", type: "APEL", subject: "Budget 2024-2025", participants: 25, pvStatus: "Validé" },
  { id: 2, date: "2024-10-15", type: "Partenaires", subject: "Renouvellement Orange", participants: 8, pvStatus: "En attente" },
  { id: 3, date: "2024-09-20", type: "APEL", subject: "Rentrée scolaire", participants: 32, pvStatus: "Validé" },
  { id: 4, date: "2024-09-05", type: "Conseil", subject: "Plan stratégique", participants: 15, pvStatus: "Validé" },
];

const mockDonations = [
  { id: 1, date: "2024-10-28", donor: "APEL", amount: 500000, purpose: "Fête de fin d'année", status: "Reçu" },
  { id: 2, date: "2024-09-15", donor: "Orange CI", amount: 1200000, purpose: "Connexion internet", status: "Reçu" },
  { id: 3, date: "2024-09-01", donor: "UNICEF", amount: 3000000, purpose: "Bourses élèves", status: "Versé" },
];

export default function Partnerships() {
  const totalFunds = mockAPEL[0].funds;
  const totalDonations = mockDonations.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Associations & Partenariats</h1>
          <p className="text-muted-foreground">APEL, sponsors et partenaires institutionnels</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres APEL</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAPEL[0].members}</div>
            <p className="text-xs text-muted-foreground">Année {mockAPEL[0].year}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partenaires Actifs</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPartners.length}</div>
            <p className="text-xs text-muted-foreground">Collaborations en cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caisse APEL</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFunds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations 2024</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA reçus</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Partenariats</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="apel">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="apel">APEL</TabsTrigger>
              <TabsTrigger value="partners">Partenaires</TabsTrigger>
              <TabsTrigger value="meetings">Réunions</TabsTrigger>
              <TabsTrigger value="donations">Contributions</TabsTrigger>
            </TabsList>

            <TabsContent value="apel" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Année Scolaire</TableHead>
                    <TableHead>Président</TableHead>
                    <TableHead>Membres</TableHead>
                    <TableHead>Réunions</TableHead>
                    <TableHead>Fonds</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAPEL.map((apel) => (
                    <TableRow key={apel.id}>
                      <TableCell className="font-medium">{apel.year}</TableCell>
                      <TableCell>{apel.president}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{apel.members}</span>
                        </div>
                      </TableCell>
                      <TableCell>{apel.meetings}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {apel.funds.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <Badge variant={apel.status === "Actif" ? "default" : "secondary"}>
                          {apel.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Voir</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="partners" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partenaire</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Contribution</TableHead>
                    <TableHead>Depuis</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {partner.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{partner.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{partner.domain}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {partner.contribution}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{partner.since}</TableCell>
                      <TableCell>
                        <Badge variant="default">{partner.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Détails</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="meetings" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Objet</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>PV</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {meeting.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{meeting.type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{meeting.subject}</TableCell>
                      <TableCell>{meeting.participants}</TableCell>
                      <TableCell>
                        <Badge variant={meeting.pvStatus === "Validé" ? "default" : "secondary"}>
                          {meeting.pvStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="donations" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donateur</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Objet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-mono text-sm">{donation.date}</TableCell>
                      <TableCell className="font-medium">{donation.donor}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {donation.amount.toLocaleString()} FCFA
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {donation.purpose}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{donation.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">Reçu</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
