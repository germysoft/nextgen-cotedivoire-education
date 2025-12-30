import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  FileSpreadsheet, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface Backup {
  id: string;
  date: string;
  size: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed';
}

interface BackupHistoryExportProps {
  backups: Backup[];
  onRestore: (backupId: string) => void;
  onDownload: () => void;
  isRestoring: boolean;
}

export function BackupHistoryExport({ 
  backups, 
  onRestore, 
  onDownload, 
  isRestoring 
}: BackupHistoryExportProps) {
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredBackups = backups.filter(backup => {
    // Filter by type
    if (filterType !== "all" && backup.type !== filterType) return false;
    
    // Filter by status
    if (filterStatus !== "all" && backup.status !== filterStatus) return false;
    
    // Filter by date range
    if (dateFrom) {
      const backupDate = new Date(backup.date.replace(" ", "T"));
      const fromDate = new Date(dateFrom);
      if (backupDate < fromDate) return false;
    }
    
    if (dateTo) {
      const backupDate = new Date(backup.date.replace(" ", "T"));
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59);
      if (backupDate > toDate) return false;
    }
    
    return true;
  });

  const exportToExcel = () => {
    const exportData = filteredBackups.map(backup => ({
      "ID": backup.id,
      "Date & Heure": backup.date,
      "Taille": backup.size,
      "Type": backup.type === 'auto' ? 'Automatique' : 'Manuelle',
      "Statut": backup.status === 'completed' ? 'Réussie' : 'Échouée'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique Sauvegardes");

    // Set column widths
    worksheet['!cols'] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 }
    ];

    const fileName = `historique_sauvegardes_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Export réussi",
      description: `${filteredBackups.length} enregistrement(s) exporté(s) vers ${fileName}`,
    });
  };

  const clearFilters = () => {
    setFilterType("all");
    setFilterStatus("all");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = filterType !== "all" || filterStatus !== "all" || dateFrom || dateTo;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Historique des Sauvegardes</CardTitle>
            <CardDescription>
              Liste des sauvegardes disponibles pour restauration
            </CardDescription>
          </div>
          <Button onClick={exportToExcel} variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Exporter Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Filtres</span>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="ml-auto text-xs"
                >
                  Réinitialiser
                </Button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-xs">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="auto">Automatique</SelectItem>
                    <SelectItem value="manual">Manuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Statut</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="completed">Réussie</SelectItem>
                    <SelectItem value="failed">Échouée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Date début
                </Label>
                <Input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Date fin
                </Label>
                <Input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredBackups.length} résultat(s) sur {backups.length} sauvegarde(s)
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary">
              Filtres actifs
            </Badge>
          )}
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Heure</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBackups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune sauvegarde ne correspond aux critères de filtrage
                </TableCell>
              </TableRow>
            ) : (
              filteredBackups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">
                    {backup.date}
                  </TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>
                    <Badge variant={backup.type === 'auto' ? 'secondary' : 'default'}>
                      {backup.type === 'auto' ? 'Automatique' : 'Manuelle'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {backup.status === 'completed' ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Réussie
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Échouée
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {backup.status === 'completed' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onRestore(backup.id)}
                          disabled={isRestoring}
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          Restaurer
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={onDownload}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Télécharger
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
