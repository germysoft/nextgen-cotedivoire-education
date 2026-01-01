import { useState } from "react";
import {
  Printer,
  FileDown,
  FileSpreadsheet,
  Eye,
  Filter,
  Users,
  Wallet,
  FileText,
  BarChart3,
  Search,
  RefreshCw,
  CheckCircle,
  Building2,
  GraduationCap,
  Calendar,
  Image,
  UserCheck,
  AlertCircle,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";
import { DataTableExport } from "@/components/data-table/DataTableExport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Types
interface ListeConfig {
  id: string;
  nom: string;
  description: string;
  categorie: "eleves" | "financieres" | "administratives" | "statistiques";
  colonnes: { key: string; label: string }[];
  filtresDisponibles: string[];
}

interface Eleve {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: "M" | "F";
  classe: string;
  niveau: string;
  cycle: string;
  statut: "nouveau" | "ancien" | "redoublant";
  affecte: boolean;
  boursier: boolean;
  lv2: "Espagnol" | "Allemand" | "Aucune";
  photo?: string;
  paiementComplet: boolean;
  montantPaye: number;
  montantDu: number;
  documentsComplets: boolean;
  residence: string;
  dateInscription: string;
  anneeScolaire: string;
}

interface Filtres {
  anneeScolaire: string;
  cycle: string;
  niveau: string;
  classe: string;
  sexe: string;
  statut: string;
  paiement: string;
  recherche: string;
  avecPhoto: boolean;
}

// Configuration des listes disponibles
const listesConfig: ListeConfig[] = [
  // Listes des Élèves
  {
    id: "eleves-classe",
    nom: "Liste des élèves par classe",
    description: "Liste nominative des élèves d'une classe",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "dateNaissance", label: "Date de naissance" },
      { key: "sexe", label: "Sexe" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe"],
  },
  {
    id: "eleves-niveau",
    nom: "Liste des élèves par niveau",
    description: "Liste des élèves regroupés par niveau",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "sexe", label: "Sexe" },
    ],
    filtresDisponibles: ["anneeScolaire", "niveau"],
  },
  {
    id: "eleves-cycle",
    nom: "Liste des élèves par cycle",
    description: "Liste des élèves regroupés par cycle",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "niveau", label: "Niveau" },
      { key: "classe", label: "Classe" },
    ],
    filtresDisponibles: ["anneeScolaire", "cycle"],
  },
  {
    id: "eleves-tous",
    nom: "Liste de tous les élèves",
    description: "Liste complète de tous les élèves de l'établissement",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "sexe", label: "Sexe" },
      { key: "statut", label: "Statut" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "eleves-sexe",
    nom: "Liste des élèves par sexe",
    description: "Liste des élèves filtrée par sexe",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "dateNaissance", label: "Date de naissance" },
    ],
    filtresDisponibles: ["anneeScolaire", "sexe", "classe"],
  },
  {
    id: "eleves-nouveaux-anciens",
    nom: "Liste des élèves nouveaux/anciens",
    description: "Liste des élèves selon leur statut d'inscription",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "statut", label: "Statut" },
    ],
    filtresDisponibles: ["anneeScolaire", "statut", "classe"],
  },
  {
    id: "eleves-redoublants",
    nom: "Liste des élèves redoublants",
    description: "Liste des élèves redoublants",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "niveau", label: "Niveau" },
    ],
    filtresDisponibles: ["anneeScolaire", "niveau"],
  },
  {
    id: "eleves-affectes",
    nom: "Liste des élèves affectés/non affectés",
    description: "Liste selon le statut d'affectation",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "affecte", label: "Affecté" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe"],
  },
  {
    id: "eleves-boursiers",
    nom: "Liste des élèves boursiers",
    description: "Liste des élèves boursiers et non boursiers",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "boursier", label: "Boursier" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe"],
  },
  {
    id: "eleves-lv2",
    nom: "Liste des élèves par LV2",
    description: "Liste des élèves par langue vivante 2",
    categorie: "eleves",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "lv2", label: "LV2" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe"],
  },
  {
    id: "eleves-photo",
    nom: "Liste des élèves avec photo",
    description: "Trombinoscope ou liste avec photos",
    categorie: "eleves",
    colonnes: [
      { key: "photo", label: "Photo" },
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe", "avecPhoto"],
  },

  // Listes Financières
  {
    id: "finance-payes",
    nom: "Liste des élèves ayant payé",
    description: "Élèves à jour de leurs paiements",
    categorie: "financieres",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "montantPaye", label: "Montant payé" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe", "paiement"],
  },
  {
    id: "finance-impayes",
    nom: "Liste des élèves en impayés",
    description: "Élèves ayant des paiements en retard",
    categorie: "financieres",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "montantDu", label: "Montant dû" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe"],
  },
  {
    id: "finance-tranches",
    nom: "Liste par tranche payée",
    description: "Élèves selon les tranches de paiement",
    categorie: "financieres",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "montantPaye", label: "Montant payé" },
      { key: "montantDu", label: "Reste à payer" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe"],
  },

  // Listes Administratives
  {
    id: "admin-documents-incomplets",
    nom: "Liste documents incomplets",
    description: "Élèves avec dossiers incomplets",
    categorie: "administratives",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "documentsComplets", label: "Statut" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe"],
  },
  {
    id: "admin-residence",
    nom: "Liste par résidence",
    description: "Élèves par lieu de résidence",
    categorie: "administratives",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "residence", label: "Résidence" },
    ],
    filtresDisponibles: ["anneeScolaire", "classe"],
  },
  {
    id: "admin-mena",
    nom: "Liste pour MENA/Inspection",
    description: "Format officiel pour le ministère",
    categorie: "administratives",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "dateNaissance", label: "Date naissance" },
      { key: "sexe", label: "Sexe" },
      { key: "classe", label: "Classe" },
    ],
    filtresDisponibles: ["anneeScolaire", "niveau", "cycle"],
  },

  // Listes Statistiques
  {
    id: "stats-effectif-classe",
    nom: "Effectif par classe",
    description: "Statistiques d'effectifs par classe",
    categorie: "statistiques",
    colonnes: [
      { key: "classe", label: "Classe" },
      { key: "garcons", label: "Garçons" },
      { key: "filles", label: "Filles" },
      { key: "total", label: "Total" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "stats-effectif-niveau",
    nom: "Effectif par niveau",
    description: "Statistiques d'effectifs par niveau",
    categorie: "statistiques",
    colonnes: [
      { key: "niveau", label: "Niveau" },
      { key: "garcons", label: "Garçons" },
      { key: "filles", label: "Filles" },
      { key: "total", label: "Total" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "stats-paiement",
    nom: "Taux de paiement",
    description: "Statistiques de paiement par classe",
    categorie: "statistiques",
    colonnes: [
      { key: "classe", label: "Classe" },
      { key: "totalEleves", label: "Effectif" },
      { key: "aPaye", label: "À jour" },
      { key: "enRetard", label: "En retard" },
      { key: "tauxPaiement", label: "Taux %" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
];

// Données mock
const generateMockEleves = (): Eleve[] => {
  const classes = ["6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B"];
  const niveaux = ["6ème", "5ème", "4ème", "3ème"];
  const cycles = ["Collège"];
  const residences = ["Abidjan", "Yopougon", "Cocody", "Marcory", "Plateau"];
  const prenomsMasculins = ["Kouadio", "Yao", "Koffi", "Dje", "Aka", "Brou", "Assi"];
  const prenomsFeminins = ["Adjoua", "Akissi", "Aya", "Amoin", "Affoué"];
  const noms = ["Koffi", "Coulibaly", "Traoré", "Koné", "Ouattara", "Bamba", "Diallo"];

  return Array.from({ length: 150 }, (_, i) => {
    const sexe = Math.random() > 0.5 ? "M" : "F";
    const prenoms = sexe === "M" ? prenomsMasculins : prenomsFeminins;
    const classe = classes[Math.floor(Math.random() * classes.length)];
    const niveau = classe.split(" ")[0];

    return {
      id: `eleve-${i + 1}`,
      matricule: `2024${String(i + 1).padStart(4, "0")}`,
      nom: noms[Math.floor(Math.random() * noms.length)],
      prenom: prenoms[Math.floor(Math.random() * prenoms.length)],
      dateNaissance: `${2008 + Math.floor(Math.random() * 6)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      sexe,
      classe,
      niveau,
      cycle: "Collège",
      statut: ["nouveau", "ancien", "redoublant"][Math.floor(Math.random() * 3)] as "nouveau" | "ancien" | "redoublant",
      affecte: Math.random() > 0.3,
      boursier: Math.random() > 0.7,
      lv2: ["Espagnol", "Allemand", "Aucune"][Math.floor(Math.random() * 3)] as "Espagnol" | "Allemand" | "Aucune",
      paiementComplet: Math.random() > 0.4,
      montantPaye: Math.floor(Math.random() * 500000),
      montantDu: Math.floor(Math.random() * 200000),
      documentsComplets: Math.random() > 0.3,
      residence: residences[Math.floor(Math.random() * residences.length)],
      dateInscription: `2024-${String(Math.floor(Math.random() * 3) + 8).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      anneeScolaire: "2024-2025",
    };
  });
};

const mockEleves = generateMockEleves();

export default function ImprimerListes() {
  const { toast } = useToast();
  const { hasPermission } = useRole();

  const [activeTab, setActiveTab] = useState("eleves");
  const [selectedListe, setSelectedListe] = useState<ListeConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filtres, setFiltres] = useState<Filtres>({
    anneeScolaire: "2024-2025",
    cycle: "tous",
    niveau: "tous",
    classe: "tous",
    sexe: "tous",
    statut: "tous",
    paiement: "tous",
    recherche: "",
    avecPhoto: false,
  });

  // Options pour les filtres
  const anneesScolaires = ["2024-2025", "2023-2024", "2022-2023"];
  const cycles = ["tous", "Collège", "Lycée"];
  const niveaux = ["tous", "6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Tle"];
  const classes = ["tous", "6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B"];

  // Filtrer les données selon les critères
  const applyFilters = () => {
    if (!selectedListe) return;

    setIsLoading(true);

    let data = [...mockEleves];

    if (filtres.anneeScolaire) {
      data = data.filter((e) => e.anneeScolaire === filtres.anneeScolaire);
    }

    if (filtres.cycle !== "tous") {
      data = data.filter((e) => e.cycle === filtres.cycle);
    }

    if (filtres.niveau !== "tous") {
      data = data.filter((e) => e.niveau === filtres.niveau);
    }

    if (filtres.classe !== "tous") {
      data = data.filter((e) => e.classe === filtres.classe);
    }

    if (filtres.sexe !== "tous") {
      data = data.filter((e) => e.sexe === filtres.sexe);
    }

    if (filtres.statut !== "tous") {
      data = data.filter((e) => e.statut === filtres.statut);
    }

    if (filtres.paiement === "paye") {
      data = data.filter((e) => e.paiementComplet);
    } else if (filtres.paiement === "impaye") {
      data = data.filter((e) => !e.paiementComplet);
    }

    if (filtres.recherche) {
      const search = filtres.recherche.toLowerCase();
      data = data.filter(
        (e) =>
          e.nom.toLowerCase().includes(search) ||
          e.prenom.toLowerCase().includes(search) ||
          e.matricule.toLowerCase().includes(search)
      );
    }

    // Filtres spécifiques selon le type de liste
    if (selectedListe.id === "eleves-redoublants") {
      data = data.filter((e) => e.statut === "redoublant");
    }

    if (selectedListe.id === "eleves-boursiers") {
      data = data.filter((e) => e.boursier);
    }

    if (selectedListe.id === "finance-impayes") {
      data = data.filter((e) => !e.paiementComplet);
    }

    if (selectedListe.id === "admin-documents-incomplets") {
      data = data.filter((e) => !e.documentsComplets);
    }

    setTimeout(() => {
      setFilteredData(data);
      setIsLoading(false);
    }, 300);
  };

  // Générer des données statistiques
  const generateStatsData = () => {
    if (!selectedListe) return [];

    if (selectedListe.id === "stats-effectif-classe") {
      const classesStats = classes.filter((c) => c !== "tous").map((classe) => {
        const elevesByClasse = mockEleves.filter((e) => e.classe === classe);
        return {
          classe,
          garcons: elevesByClasse.filter((e) => e.sexe === "M").length,
          filles: elevesByClasse.filter((e) => e.sexe === "F").length,
          total: elevesByClasse.length,
        };
      });
      return classesStats;
    }

    if (selectedListe.id === "stats-effectif-niveau") {
      const niveauxStats = niveaux.filter((n) => n !== "tous").map((niveau) => {
        const elevesByNiveau = mockEleves.filter((e) => e.niveau === niveau);
        return {
          niveau,
          garcons: elevesByNiveau.filter((e) => e.sexe === "M").length,
          filles: elevesByNiveau.filter((e) => e.sexe === "F").length,
          total: elevesByNiveau.length,
        };
      });
      return niveauxStats;
    }

    if (selectedListe.id === "stats-paiement") {
      const paiementStats = classes.filter((c) => c !== "tous").map((classe) => {
        const elevesByClasse = mockEleves.filter((e) => e.classe === classe);
        const aPaye = elevesByClasse.filter((e) => e.paiementComplet).length;
        return {
          classe,
          totalEleves: elevesByClasse.length,
          aPaye,
          enRetard: elevesByClasse.length - aPaye,
          tauxPaiement: elevesByClasse.length > 0 ? Math.round((aPaye / elevesByClasse.length) * 100) : 0,
        };
      });
      return paiementStats;
    }

    return [];
  };

  // Sélectionner une liste
  const handleSelectListe = (liste: ListeConfig) => {
    setSelectedListe(liste);
    setFilteredData([]);

    if (liste.categorie === "statistiques") {
      setFilteredData(generateStatsData());
    }
  };

  // Prévisualiser
  const handlePreview = () => {
    if (selectedListe?.categorie !== "statistiques") {
      applyFilters();
    }
    setShowPreview(true);
  };

  // Export PDF
  const exportToPDF = () => {
    if (!selectedListe || filteredData.length === 0) return;

    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(12);
    doc.text("Établissement Scolaire", 14, 15);
    doc.setFontSize(10);
    doc.text(`Année scolaire: ${filtres.anneeScolaire}`, 14, 22);

    // Titre
    doc.setFontSize(16);
    doc.text(selectedListe.nom, 14, 35);

    // Date
    doc.setFontSize(9);
    doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 14, 42);

    // Table
    const headers = selectedListe.colonnes.map((col) => col.label);
    const rows = filteredData.map((row) =>
      selectedListe.colonnes.map((col) => {
        const value = row[col.key];
        if (typeof value === "boolean") return value ? "Oui" : "Non";
        if (typeof value === "number" && col.key.includes("montant")) {
          return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
        }
        return String(value || "");
      })
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 48,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Pied de page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    doc.save(`${selectedListe.nom.replace(/ /g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);

    toast({
      title: "Export PDF réussi",
      description: `Le fichier a été téléchargé.`,
    });
  };

  // Export Excel
  const exportToExcel = () => {
    if (!selectedListe || filteredData.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((row) => {
        const formattedRow: any = {};
        selectedListe.colonnes.forEach((col) => {
          const value = row[col.key];
          if (typeof value === "boolean") {
            formattedRow[col.label] = value ? "Oui" : "Non";
          } else {
            formattedRow[col.label] = value;
          }
        });
        return formattedRow;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Liste");

    XLSX.writeFile(
      workbook,
      `${selectedListe.nom.replace(/ /g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    toast({
      title: "Export Excel réussi",
      description: `Le fichier a été téléchargé.`,
    });
  };

  // Imprimer
  const handlePrint = () => {
    window.print();
  };

  // Filtrer les listes par catégorie
  const getListesByCategorie = (categorie: string) => {
    return listesConfig.filter((l) => l.categorie === categorie);
  };

  // Réinitialiser les filtres
  const resetFiltres = () => {
    setFiltres({
      anneeScolaire: "2024-2025",
      cycle: "tous",
      niveau: "tous",
      classe: "tous",
      sexe: "tous",
      statut: "tous",
      paiement: "tous",
      recherche: "",
      avecPhoto: false,
    });
    setFilteredData([]);
  };

  const getCategorieIcon = (categorie: string) => {
    switch (categorie) {
      case "eleves":
        return <Users className="h-4 w-4" />;
      case "financieres":
        return <Wallet className="h-4 w-4" />;
      case "administratives":
        return <FileText className="h-4 w-4" />;
      case "statistiques":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Printer className="h-8 w-8 text-primary" />
            Imprimer Listes
          </h1>
          <p className="text-muted-foreground">
            Génération et impression des listes scolaires
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetFiltres}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau gauche - Sélection de liste */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Catégories de listes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 lg:grid-cols-1 w-full h-auto p-1">
                  <TabsTrigger value="eleves" className="justify-start gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden lg:inline">Élèves</span>
                  </TabsTrigger>
                  <TabsTrigger value="financieres" className="justify-start gap-2">
                    <Wallet className="h-4 w-4" />
                    <span className="hidden lg:inline">Financières</span>
                  </TabsTrigger>
                  <TabsTrigger value="administratives" className="justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden lg:inline">Administratives</span>
                  </TabsTrigger>
                  <TabsTrigger value="statistiques" className="justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden lg:inline">Statistiques</span>
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[400px] p-4">
                  <TabsContent value="eleves" className="mt-0 space-y-2">
                    {getListesByCategorie("eleves").map((liste) => (
                      <Button
                        key={liste.id}
                        variant={selectedListe?.id === liste.id ? "default" : "ghost"}
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleSelectListe(liste)}
                      >
                        <div>
                          <p className="font-medium text-sm">{liste.nom}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {liste.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </TabsContent>

                  <TabsContent value="financieres" className="mt-0 space-y-2">
                    {getListesByCategorie("financieres").map((liste) => (
                      <Button
                        key={liste.id}
                        variant={selectedListe?.id === liste.id ? "default" : "ghost"}
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleSelectListe(liste)}
                      >
                        <div>
                          <p className="font-medium text-sm">{liste.nom}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {liste.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </TabsContent>

                  <TabsContent value="administratives" className="mt-0 space-y-2">
                    {getListesByCategorie("administratives").map((liste) => (
                      <Button
                        key={liste.id}
                        variant={selectedListe?.id === liste.id ? "default" : "ghost"}
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleSelectListe(liste)}
                      >
                        <div>
                          <p className="font-medium text-sm">{liste.nom}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {liste.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </TabsContent>

                  <TabsContent value="statistiques" className="mt-0 space-y-2">
                    {getListesByCategorie("statistiques").map((liste) => (
                      <Button
                        key={liste.id}
                        variant={selectedListe?.id === liste.id ? "default" : "ghost"}
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleSelectListe(liste)}
                      >
                        <div>
                          <p className="font-medium text-sm">{liste.nom}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {liste.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Panneau droit - Configuration et prévisualisation */}
        <div className="lg:col-span-3 space-y-6">
          {!selectedListe ? (
            <Card className="min-h-[500px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Printer className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Sélectionnez une liste à générer</p>
                <p className="text-sm">
                  Choisissez une catégorie puis une liste dans le panneau de gauche
                </p>
              </div>
            </Card>
          ) : (
            <>
              {/* Info liste sélectionnée */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategorieIcon(selectedListe.categorie)}
                      <div>
                        <CardTitle>{selectedListe.nom}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedListe.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{selectedListe.categorie}</Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Filtres */}
              {selectedListe.categorie !== "statistiques" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filtres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Recherche */}
                      <div className="lg:col-span-2">
                        <Label>Rechercher un élève</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Nom, prénom ou matricule..."
                            value={filtres.recherche}
                            onChange={(e) =>
                              setFiltres({ ...filtres, recherche: e.target.value })
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Année scolaire */}
                      <div>
                        <Label>Année scolaire</Label>
                        <Select
                          value={filtres.anneeScolaire}
                          onValueChange={(v) =>
                            setFiltres({ ...filtres, anneeScolaire: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {anneesScolaires.map((annee) => (
                              <SelectItem key={annee} value={annee}>
                                {annee}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Cycle */}
                      <div>
                        <Label>Cycle</Label>
                        <Select
                          value={filtres.cycle}
                          onValueChange={(v) => setFiltres({ ...filtres, cycle: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cycles.map((cycle) => (
                              <SelectItem key={cycle} value={cycle}>
                                {cycle === "tous" ? "Tous les cycles" : cycle}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Niveau */}
                      <div>
                        <Label>Niveau</Label>
                        <Select
                          value={filtres.niveau}
                          onValueChange={(v) => setFiltres({ ...filtres, niveau: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {niveaux.map((niveau) => (
                              <SelectItem key={niveau} value={niveau}>
                                {niveau === "tous" ? "Tous les niveaux" : niveau}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Classe */}
                      <div>
                        <Label>Classe</Label>
                        <Select
                          value={filtres.classe}
                          onValueChange={(v) => setFiltres({ ...filtres, classe: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((classe) => (
                              <SelectItem key={classe} value={classe}>
                                {classe === "tous" ? "Toutes les classes" : classe}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sexe */}
                      <div>
                        <Label>Sexe</Label>
                        <Select
                          value={filtres.sexe}
                          onValueChange={(v) => setFiltres({ ...filtres, sexe: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tous">Tous</SelectItem>
                            <SelectItem value="M">Masculin</SelectItem>
                            <SelectItem value="F">Féminin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Statut */}
                      <div>
                        <Label>Statut élève</Label>
                        <Select
                          value={filtres.statut}
                          onValueChange={(v) => setFiltres({ ...filtres, statut: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tous">Tous les statuts</SelectItem>
                            <SelectItem value="nouveau">Nouveaux</SelectItem>
                            <SelectItem value="ancien">Anciens</SelectItem>
                            <SelectItem value="redoublant">Redoublants</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Paiement */}
                      {selectedListe.categorie === "financieres" && (
                        <div>
                          <Label>Statut paiement</Label>
                          <Select
                            value={filtres.paiement}
                            onValueChange={(v) =>
                              setFiltres({ ...filtres, paiement: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tous">Tous</SelectItem>
                              <SelectItem value="paye">À jour</SelectItem>
                              <SelectItem value="impaye">En retard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Option photo */}
                      {selectedListe.id === "eleves-photo" && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="avecPhoto"
                            checked={filtres.avecPhoto}
                            onCheckedChange={(checked) =>
                              setFiltres({ ...filtres, avecPhoto: checked })
                            }
                          />
                          <Label htmlFor="avecPhoto">Avec photos uniquement</Label>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handlePreview} className="gap-2">
                      <Eye className="h-4 w-4" />
                      Prévisualiser
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportToPDF}
                      disabled={filteredData.length === 0}
                      className="gap-2"
                    >
                      <FileDown className="h-4 w-4" />
                      Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportToExcel}
                      disabled={filteredData.length === 0}
                      className="gap-2"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Export Excel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handlePrint}
                      disabled={filteredData.length === 0}
                      className="gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Imprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Aperçu des données */}
              {filteredData.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Aperçu ({filteredData.length} résultats)
                      </CardTitle>
                      <Badge>{filteredData.length} éléments</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            {selectedListe.colonnes.map((col) => (
                              <TableHead key={col.key}>{col.label}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.slice(0, 20).map((row, index) => (
                            <TableRow key={row.id || index}>
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              {selectedListe.colonnes.map((col) => (
                                <TableCell key={col.key}>
                                  {typeof row[col.key] === "boolean" ? (
                                    <Badge
                                      variant={row[col.key] ? "default" : "secondary"}
                                    >
                                      {row[col.key] ? "Oui" : "Non"}
                                    </Badge>
                                  ) : col.key.includes("montant") ? (
                                    new Intl.NumberFormat("fr-FR").format(
                                      row[col.key]
                                    ) + " FCFA"
                                  ) : col.key === "tauxPaiement" ? (
                                    `${row[col.key]}%`
                                  ) : (
                                    row[col.key]
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {filteredData.length > 20 && (
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        Affichage des 20 premiers résultats sur{" "}
                        {filteredData.length}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Message si pas de données */}
              {filteredData.length === 0 && selectedListe.categorie !== "statistiques" && (
                <Card className="min-h-[200px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Cliquez sur "Prévisualiser" pour générer la liste</p>
                    <p className="text-sm">
                      Configurez les filtres puis lancez la prévisualisation
                    </p>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog de prévisualisation pour impression */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Prévisualisation - {selectedListe?.nom}
            </DialogTitle>
          </DialogHeader>

          <div className="print-area space-y-4">
            {/* En-tête d'impression */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Établissement Scolaire
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Année scolaire: {filtres.anneeScolaire}
                  </p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Généré le: {new Date().toLocaleDateString("fr-FR")}</p>
                  <p>Total: {filteredData.length} éléments</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-4">{selectedListe?.nom}</h3>
            </div>

            {/* Table */}
            {selectedListe && (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      {selectedListe.colonnes.map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row, index) => (
                      <TableRow key={row.id || index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        {selectedListe.colonnes.map((col) => (
                          <TableCell key={col.key}>
                            {typeof row[col.key] === "boolean"
                              ? row[col.key]
                                ? "Oui"
                                : "Non"
                              : col.key.includes("montant")
                              ? new Intl.NumberFormat("fr-FR").format(row[col.key]) +
                                " FCFA"
                              : col.key === "tauxPaiement"
                              ? `${row[col.key]}%`
                              : row[col.key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4 print:hidden">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Fermer
            </Button>
            <Button variant="outline" onClick={exportToExcel} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" onClick={exportToPDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
