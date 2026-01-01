import { useState } from "react";
import {
  Printer,
  FileDown,
  FileSpreadsheet,
  Eye,
  Filter,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Search,
  RefreshCw,
  CheckCircle,
  Building2,
  Calendar,
  UserCheck,
  AlertCircle,
  Download,
  GraduationCap,
  Clock,
  Award,
  FileSignature,
  BookOpen,
  ClipboardList,
  Shield,
  Lock,
  History,
  Trash2,
  Layers,
  X,
  CheckSquare,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";
import { useEtablissement } from "@/contexts/EtablissementContext";
import { UserRole, roleLabels } from "@/types/roles";
import { mockPersonnel } from "@/data/mockPersonnel";
import { mockTeachers } from "@/data/mockTeachers";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Types pour les permissions de listes RH
type CategoriePermission = {
  rolesAutorises: UserRole[];
  description: string;
};

// Configuration des permissions par catégorie de listes RH
const categoriePermissions: Record<string, CategoriePermission> = {
  personnel: {
    rolesAutorises: ["admin", "directeur", "secretaire"],
    description: "Listes du personnel",
  },
  enseignants: {
    rolesAutorises: ["admin", "directeur", "secretaire", "enseignant"],
    description: "Listes des enseignants",
  },
  affectations: {
    rolesAutorises: ["admin", "directeur", "secretaire"],
    description: "Affectations & Promotions",
  },
  conges: {
    rolesAutorises: ["admin", "directeur", "secretaire"],
    description: "Congés & Absences",
  },
  pointage: {
    rolesAutorises: ["admin", "directeur", "secretaire", "surveillant"],
    description: "Pointage",
  },
  contrats: {
    rolesAutorises: ["admin", "directeur", "comptable"],
    description: "Contrats & Attestations",
  },
  formations: {
    rolesAutorises: ["admin", "directeur", "secretaire"],
    description: "Formations & Compétences",
  },
  recrutement: {
    rolesAutorises: ["admin", "directeur"],
    description: "Recrutement",
  },
};

// Permissions spécifiques pour certaines listes sensibles
const listesRestreintes: Record<string, UserRole[]> = {
  "personnel-salaires": ["admin", "directeur", "comptable"],
  "contrats-expiration": ["admin", "directeur", "comptable"],
  "recrutement-candidats": ["admin", "directeur"],
};

// Types
interface ListeConfig {
  id: string;
  nom: string;
  description: string;
  categorie: "personnel" | "enseignants" | "affectations" | "conges" | "pointage" | "contrats" | "formations" | "recrutement";
  colonnes: { key: string; label: string }[];
  filtresDisponibles: string[];
}

interface FiltresRH {
  anneeScolaire: string;
  service: string;
  fonction: string;
  statut: string;
  sexe: string;
  typeContrat: string;
  periode: string;
  dateDebut: string;
  dateFin: string;
  recherche: string;
  avecPhoto: boolean;
}

// Configuration des listes disponibles
const listesConfig: ListeConfig[] = [
  // Listes du Personnel (générales)
  {
    id: "personnel-tous",
    nom: "Liste de tout le personnel",
    description: "Liste complète de tous les employés",
    categorie: "personnel",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
      { key: "departement", label: "Département" },
      { key: "statut", label: "Statut" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "personnel-fonction",
    nom: "Liste du personnel par fonction",
    description: "Personnel regroupé par fonction",
    categorie: "personnel",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
      { key: "departement", label: "Département" },
    ],
    filtresDisponibles: ["anneeScolaire", "fonction"],
  },
  {
    id: "personnel-service",
    nom: "Liste du personnel par service",
    description: "Personnel regroupé par service/département",
    categorie: "personnel",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
      { key: "telephone", label: "Téléphone" },
    ],
    filtresDisponibles: ["anneeScolaire", "service"],
  },
  {
    id: "personnel-statut",
    nom: "Liste du personnel par statut",
    description: "Personnel par statut (titulaire, contractuel, vacataire)",
    categorie: "personnel",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
      { key: "statut", label: "Statut" },
      { key: "typeContrat", label: "Type contrat" },
    ],
    filtresDisponibles: ["anneeScolaire", "statut"],
  },
  {
    id: "personnel-sexe",
    nom: "Liste du personnel par sexe",
    description: "Personnel regroupé par sexe",
    categorie: "personnel",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "sexe", label: "Sexe" },
      { key: "poste", label: "Poste" },
    ],
    filtresDisponibles: ["anneeScolaire", "sexe"],
  },
  {
    id: "personnel-photo",
    nom: "Liste du personnel avec photo",
    description: "Trombinoscope du personnel",
    categorie: "personnel",
    colonnes: [
      { key: "photo", label: "Photo" },
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
    ],
    filtresDisponibles: ["anneeScolaire", "service", "avecPhoto"],
  },
  {
    id: "personnel-prise-service",
    nom: "Liste par date de prise de service",
    description: "Personnel par date d'embauche",
    categorie: "personnel",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
      { key: "dateEmbauche", label: "Date embauche" },
      { key: "anciennete", label: "Ancienneté" },
    ],
    filtresDisponibles: ["anneeScolaire", "periode"],
  },
  {
    id: "personnel-actif-inactif",
    nom: "Liste du personnel actif/inactif",
    description: "Personnel selon le statut d'activité",
    categorie: "personnel",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
      { key: "actif", label: "Statut" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },

  // Listes Enseignants
  {
    id: "enseignants-matiere",
    nom: "Liste des enseignants par matière",
    description: "Enseignants regroupés par matière enseignée",
    categorie: "enseignants",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "matiere", label: "Matière" },
      { key: "chargeHoraire", label: "Charge horaire" },
    ],
    filtresDisponibles: ["anneeScolaire", "fonction"],
  },
  {
    id: "enseignants-classe",
    nom: "Liste des enseignants par classe",
    description: "Enseignants affectés par classe",
    categorie: "enseignants",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "matiere", label: "Matière" },
      { key: "classes", label: "Classes" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "enseignants-pp",
    nom: "Liste des Professeurs Principaux",
    description: "Liste des professeurs principaux par classe",
    categorie: "enseignants",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "classe", label: "Classe" },
      { key: "telephone", label: "Téléphone" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "enseignants-charge-horaire",
    nom: "Liste des enseignants avec charge horaire",
    description: "Charge horaire hebdomadaire des enseignants",
    categorie: "enseignants",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "matiere", label: "Matière" },
      { key: "chargeHoraire", label: "Heures/sem" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "enseignants-anciennete",
    nom: "Liste des enseignants par ancienneté",
    description: "Enseignants classés par ancienneté",
    categorie: "enseignants",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "matiere", label: "Matière" },
      { key: "dateEmbauche", label: "Date embauche" },
      { key: "anciennete", label: "Ancienneté" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },

  // Affectations & Promotions
  {
    id: "affectations-annee",
    nom: "Liste des affectations par année",
    description: "Affectations de l'année scolaire",
    categorie: "affectations",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "ancienPoste", label: "Ancien poste" },
      { key: "nouveauPoste", label: "Nouveau poste" },
      { key: "dateAffectation", label: "Date" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "promotions-grade",
    nom: "Liste des promotions par grade",
    description: "Promotions et avancements",
    categorie: "affectations",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "ancienGrade", label: "Ancien grade" },
      { key: "nouveauGrade", label: "Nouveau grade" },
      { key: "datePromotion", label: "Date" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
  {
    id: "historique-affectations",
    nom: "Historique des affectations par agent",
    description: "Historique complet des affectations",
    categorie: "affectations",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste actuel" },
      { key: "nombreAffectations", label: "Nb affectations" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },

  // Congés & Absences
  {
    id: "conges-en-cours",
    nom: "Liste des agents en congé",
    description: "Personnel actuellement en congé",
    categorie: "conges",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "typeConge", label: "Type congé" },
      { key: "dateDebut", label: "Début" },
      { key: "dateFin", label: "Fin" },
    ],
    filtresDisponibles: ["periode"],
  },
  {
    id: "absences-periode",
    nom: "Liste des absences par période",
    description: "Absences sur une période donnée",
    categorie: "conges",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "dateAbsence", label: "Date" },
      { key: "motif", label: "Motif" },
      { key: "justifiee", label: "Justifiée" },
    ],
    filtresDisponibles: ["periode", "service"],
  },
  {
    id: "absences-justifiees",
    nom: "Liste des absences justifiées/non justifiées",
    description: "Absences selon la justification",
    categorie: "conges",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "nombreAbsences", label: "Nb absences" },
      { key: "justifiees", label: "Justifiées" },
      { key: "nonJustifiees", label: "Non justifiées" },
    ],
    filtresDisponibles: ["periode", "service"],
  },
  {
    id: "stats-absences-service",
    nom: "Statistiques d'absences par service",
    description: "Statistiques par département",
    categorie: "conges",
    colonnes: [
      { key: "service", label: "Service" },
      { key: "effectif", label: "Effectif" },
      { key: "totalAbsences", label: "Total absences" },
      { key: "tauxAbsenteisme", label: "Taux" },
    ],
    filtresDisponibles: ["periode"],
  },

  // Pointage
  {
    id: "pointage-journalier",
    nom: "Liste de présence journalière",
    description: "Pointage du jour",
    categorie: "pointage",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "heureArrivee", label: "Arrivée" },
      { key: "heureDepart", label: "Départ" },
      { key: "statut", label: "Statut" },
    ],
    filtresDisponibles: ["periode", "service"],
  },
  {
    id: "pointage-mensuel",
    nom: "Liste mensuelle de pointage",
    description: "Récapitulatif mensuel",
    categorie: "pointage",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "joursPresent", label: "Jours présent" },
      { key: "heuresTotal", label: "Heures total" },
    ],
    filtresDisponibles: ["periode", "service"],
  },
  {
    id: "pointage-retards",
    nom: "Liste des retards",
    description: "Personnel en retard",
    categorie: "pointage",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "nombreRetards", label: "Nb retards" },
      { key: "dureeTotal", label: "Durée total" },
    ],
    filtresDisponibles: ["periode", "service"],
  },
  {
    id: "pointage-absences-repetees",
    nom: "Liste des absences répétées",
    description: "Personnel avec absences fréquentes",
    categorie: "pointage",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "nombreAbsences", label: "Nb absences" },
      { key: "dernierAbsence", label: "Dernière absence" },
    ],
    filtresDisponibles: ["periode", "service"],
  },

  // Contrats & Attestations
  {
    id: "contrats-agents",
    nom: "Liste des agents sous contrat",
    description: "Personnel sous contrat",
    categorie: "contrats",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "typeContrat", label: "Type" },
      { key: "dateDebut", label: "Début" },
      { key: "dateFin", label: "Fin" },
    ],
    filtresDisponibles: ["typeContrat"],
  },
  {
    id: "contrats-echeance",
    nom: "Liste des contrats à échéance",
    description: "Contrats arrivant à terme",
    categorie: "contrats",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "typeContrat", label: "Type" },
      { key: "dateFin", label: "Échéance" },
      { key: "joursRestants", label: "Jours restants" },
    ],
    filtresDisponibles: ["periode"],
  },
  {
    id: "contrats-expires",
    nom: "Liste des contrats expirés",
    description: "Contrats expirés",
    categorie: "contrats",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "typeContrat", label: "Type" },
      { key: "dateFin", label: "Date expiration" },
    ],
    filtresDisponibles: ["periode"],
  },
  {
    id: "attestations-generees",
    nom: "Liste des attestations générées",
    description: "Attestations émises",
    categorie: "contrats",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "typeAttestation", label: "Type" },
      { key: "dateGeneration", label: "Date" },
    ],
    filtresDisponibles: ["periode"],
  },

  // Formations & Compétences
  {
    id: "formations-agents",
    nom: "Liste des agents par formation",
    description: "Personnel par formation suivie",
    categorie: "formations",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "formation", label: "Formation" },
      { key: "dateFormation", label: "Date" },
    ],
    filtresDisponibles: ["periode"],
  },
  {
    id: "competences-agents",
    nom: "Liste des agents par compétence",
    description: "Personnel par compétence",
    categorie: "formations",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "competences", label: "Compétences" },
      { key: "niveau", label: "Niveau" },
    ],
    filtresDisponibles: ["service"],
  },
  {
    id: "formations-periode",
    nom: "Liste des formations suivies",
    description: "Formations par période",
    categorie: "formations",
    colonnes: [
      { key: "formation", label: "Formation" },
      { key: "organisme", label: "Organisme" },
      { key: "nombreParticipants", label: "Participants" },
      { key: "duree", label: "Durée" },
      { key: "cout", label: "Coût" },
    ],
    filtresDisponibles: ["periode"],
  },
  {
    id: "besoins-formation",
    nom: "Liste des besoins en formation",
    description: "Besoins identifiés",
    categorie: "formations",
    colonnes: [
      { key: "service", label: "Service" },
      { key: "competence", label: "Compétence" },
      { key: "nombreAgents", label: "Nb agents" },
      { key: "priorite", label: "Priorité" },
    ],
    filtresDisponibles: ["service"],
  },

  // Recrutement
  {
    id: "candidats-tous",
    nom: "Liste des candidats",
    description: "Tous les candidats",
    categorie: "recrutement",
    colonnes: [
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste visé" },
      { key: "dateCandidature", label: "Date" },
      { key: "statut", label: "Statut" },
    ],
    filtresDisponibles: ["periode", "fonction"],
  },
  {
    id: "candidats-retenus",
    nom: "Liste des candidats retenus",
    description: "Candidats sélectionnés",
    categorie: "recrutement",
    colonnes: [
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
      { key: "dateSelection", label: "Date sélection" },
      { key: "dateIntegration", label: "Date intégration" },
    ],
    filtresDisponibles: ["periode"],
  },
  {
    id: "recrutements-periode",
    nom: "Liste des recrutements par période",
    description: "Recrutements effectués",
    categorie: "recrutement",
    colonnes: [
      { key: "matricule", label: "Matricule" },
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "poste", label: "Poste" },
      { key: "dateRecrutement", label: "Date" },
    ],
    filtresDisponibles: ["periode"],
  },
  {
    id: "historique-recrutements",
    nom: "Historique des recrutements",
    description: "Historique complet",
    categorie: "recrutement",
    colonnes: [
      { key: "annee", label: "Année" },
      { key: "nombreRecrutements", label: "Nb recrutements" },
      { key: "parCategorie", label: "Par catégorie" },
    ],
    filtresDisponibles: ["anneeScolaire"],
  },
];

// Hook d'audit pour les listes RH
interface AuditEntry {
  id: string;
  timestamp: string;
  utilisateur: string;
  role: string;
  action: "generation" | "export_pdf" | "export_excel" | "impression";
  listeId: string;
  listeNom: string;
  categorie: string;
  filtres: Record<string, string>;
  nombreResultats: number;
}

const useAuditListesRH = () => {
  const [entries, setEntries] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem("audit_listes_rh");
    return saved ? JSON.parse(saved) : [];
  });

  const logAction = (
    action: AuditEntry["action"],
    listeId: string,
    listeNom: string,
    categorie: string,
    filtres: Record<string, string>,
    nombreResultats: number
  ) => {
    const role = localStorage.getItem("currentRole") || "admin";
    const newEntry: AuditEntry = {
      id: `audit-rh-${Date.now()}`,
      timestamp: new Date().toISOString(),
      utilisateur: "Utilisateur actuel",
      role,
      action,
      listeId,
      listeNom,
      categorie,
      filtres,
      nombreResultats,
    };

    const updated = [newEntry, ...entries].slice(0, 500);
    setEntries(updated);
    localStorage.setItem("audit_listes_rh", JSON.stringify(updated));
  };

  const getStats = () => {
    const today = new Date().toDateString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: entries.length,
      today: entries.filter((e) => new Date(e.timestamp).toDateString() === today).length,
      thisWeek: entries.filter((e) => new Date(e.timestamp) >= weekAgo).length,
      byAction: {
        generation: entries.filter((e) => e.action === "generation").length,
        export_pdf: entries.filter((e) => e.action === "export_pdf").length,
        export_excel: entries.filter((e) => e.action === "export_excel").length,
        impression: entries.filter((e) => e.action === "impression").length,
      },
    };
  };

  const clearJournal = () => {
    setEntries([]);
    localStorage.removeItem("audit_listes_rh");
  };

  return { entries, logAction, getStats, clearJournal };
};

// Composant principal
export default function ImprimerListesRH() {
  const { toast } = useToast();
  const { currentRole } = useRole();
  const { configuration } = useEtablissement();
  const { entries, logAction, getStats, clearJournal } = useAuditListesRH();

  const nomEtablissement = configuration.identite.nom || "Établissement Scolaire";

  const [activeTab, setActiveTab] = useState("personnel");
  const [selectedListe, setSelectedListe] = useState<ListeConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Impression groupée
  const [selectedListes, setSelectedListes] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchFormat, setBatchFormat] = useState<'pdf' | 'excel' | 'print'>('pdf');

  const [filtres, setFiltres] = useState<FiltresRH>({
    anneeScolaire: "2024-2025",
    service: "tous",
    fonction: "tous",
    statut: "tous",
    sexe: "tous",
    typeContrat: "tous",
    periode: "tous",
    dateDebut: "",
    dateFin: "",
    recherche: "",
    avecPhoto: false,
  });

  // Vérification des permissions
  const hasAccessToCategorie = (categorie: string): boolean => {
    const permission = categoriePermissions[categorie];
    if (!permission) return false;
    return permission.rolesAutorises.includes(currentRole);
  };

  const hasAccessToListe = (liste: ListeConfig): boolean => {
    if (!hasAccessToCategorie(liste.categorie)) return false;
    const restriction = listesRestreintes[liste.id];
    if (restriction) {
      return restriction.includes(currentRole);
    }
    return true;
  };

  const hasRestrictedAccess = Object.keys(categoriePermissions).some(
    (cat) => !hasAccessToCategorie(cat)
  );

  // Catégories avec leurs icônes
  const categories = [
    { id: "personnel", label: "Personnel", icon: Users },
    { id: "enseignants", label: "Enseignants", icon: GraduationCap },
    { id: "affectations", label: "Affectations", icon: Award },
    { id: "conges", label: "Congés & Absences", icon: Calendar },
    { id: "pointage", label: "Pointage", icon: Clock },
    { id: "contrats", label: "Contrats", icon: FileSignature },
    { id: "formations", label: "Formations", icon: BookOpen },
    { id: "recrutement", label: "Recrutement", icon: ClipboardList },
  ];

  // Filtrer les listes par catégorie
  const getListesByCategorie = (categorie: string) => {
    return listesConfig.filter(
      (liste) => liste.categorie === categorie && hasAccessToListe(liste)
    );
  };

  // Fonctions pour impression groupée
  const toggleListeSelection = (listeId: string) => {
    setSelectedListes(prev => 
      prev.includes(listeId) 
        ? prev.filter(id => id !== listeId)
        : [...prev, listeId]
    );
  };

  const selectAllInCategory = (categoryId: string) => {
    const listes = getListesByCategorie(categoryId);
    const allSelected = listes.every(l => selectedListes.includes(l.id));
    if (allSelected) {
      setSelectedListes(prev => prev.filter(id => !listes.map(l => l.id).includes(id)));
    } else {
      setSelectedListes(prev => [...new Set([...prev, ...listes.map(l => l.id)])]);
    }
  };

  const handleBatchProcess = async () => {
    if (selectedListes.length === 0) {
      toast({ title: "Erreur", description: "Veuillez sélectionner au moins une liste", variant: "destructive" });
      return;
    }

    setIsBatchProcessing(true);
    setBatchProgress(0);

    for (let i = 0; i < selectedListes.length; i++) {
      const listeId = selectedListes[i];
      const liste = listesConfig.find(l => l.id === listeId);
      const category = categories.find(c => liste && c.id === liste.categorie);

      if (liste && category) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const action = batchFormat === 'pdf' ? 'export_pdf' : 
                       batchFormat === 'excel' ? 'export_excel' : 'impression';
        logAction(action, listeId, liste.nom, liste.categorie, { anneeScolaire: filtres.anneeScolaire }, Math.floor(Math.random() * 100) + 10);
      }

      setBatchProgress(Math.round(((i + 1) / selectedListes.length) * 100));
    }

    setIsBatchProcessing(false);
    setShowBatchDialog(false);
    const count = selectedListes.length;
    setSelectedListes([]);
    
    const formatLabel = batchFormat === 'pdf' ? 'PDF' : batchFormat === 'excel' ? 'Excel' : 'impression';
    toast({ title: "Succès", description: `${count} liste(s) exportée(s) en ${formatLabel}` });
  };

  const getSelectedListesInfo = () => {
    return selectedListes.map(id => {
      const liste = listesConfig.find(l => l.id === id);
      const category = categories.find(c => liste && c.id === liste.categorie);
      return { id, nom: liste?.nom || '', categorie: category?.label || '' };
    });
  };

  // Générer les données mock
  const generateData = (liste: ListeConfig) => {
    setIsLoading(true);

    setTimeout(() => {
      let data: any[] = [];

      // Générer des données basées sur le type de liste
      if (liste.categorie === "personnel" || liste.categorie === "enseignants") {
        data = mockPersonnel
          .filter((p) => {
            if (filtres.service !== "tous" && p.departement !== filtres.service) return false;
            if (filtres.statut !== "tous" && p.statut !== filtres.statut) return false;
            if (filtres.sexe !== "tous" && p.sexe !== filtres.sexe) return false;
            if (filtres.typeContrat !== "tous" && p.typeContrat !== filtres.typeContrat) return false;
            if (filtres.recherche) {
              const search = filtres.recherche.toLowerCase();
              return (
                p.nom.toLowerCase().includes(search) ||
                p.prenom.toLowerCase().includes(search) ||
                p.matricule.toLowerCase().includes(search)
              );
            }
            return true;
          })
          .map((p) => ({
            matricule: p.matricule,
            nom: p.nom,
            prenom: p.prenom,
            poste: p.poste,
            departement: p.departement,
            statut: p.statut,
            typeContrat: p.typeContrat,
            sexe: p.sexe,
            telephone: p.telephone,
            dateEmbauche: p.dateEmbauche,
            anciennete: `${p.anciennete} ans`,
            actif: p.actif ? "Actif" : "Inactif",
            photo: p.photo,
            matiere: p.matieresPrincipales?.join(", ") || "-",
            classes: p.classesAffectees?.join(", ") || "-",
            chargeHoraire: p.chargeHoraire || "-",
          }));
      } else {
        // Données mock génériques pour les autres catégories
        data = Array.from({ length: 20 }, (_, i) => {
          const base = {
            matricule: `RH${String(i + 1).padStart(4, "0")}`,
            nom: ["Koné", "Traoré", "Diallo", "Bamba", "Ouattara"][i % 5],
            prenom: ["Amadou", "Fatou", "Ibrahim", "Mariam", "Sekou"][i % 5],
          };

          switch (liste.categorie) {
            case "affectations":
              return {
                ...base,
                ancienPoste: "Professeur",
                nouveauPoste: "Professeur Principal",
                dateAffectation: "2024-09-01",
                ancienGrade: "Échelon 3",
                nouveauGrade: "Échelon 4",
                datePromotion: "2024-01-15",
                nombreAffectations: Math.floor(Math.random() * 5) + 1,
              };
            case "conges":
              return {
                ...base,
                typeConge: ["Annuel", "Maladie", "Maternité"][i % 3],
                dateDebut: "2024-12-01",
                dateFin: "2024-12-15",
                dateAbsence: "2024-11-15",
                motif: ["Maladie", "Personnel", "Formation"][i % 3],
                justifiee: i % 2 === 0 ? "Oui" : "Non",
                nombreAbsences: Math.floor(Math.random() * 10) + 1,
                justifiees: Math.floor(Math.random() * 5),
                nonJustifiees: Math.floor(Math.random() * 3),
                service: ["Direction", "Pédagogie", "Administration"][i % 3],
                effectif: Math.floor(Math.random() * 20) + 5,
                totalAbsences: Math.floor(Math.random() * 50) + 10,
                tauxAbsenteisme: `${(Math.random() * 10).toFixed(1)}%`,
              };
            case "pointage":
              return {
                ...base,
                heureArrivee: `0${7 + (i % 2)}:${String(i * 5).padStart(2, "0")}`,
                heureDepart: `17:${String(30 + (i % 30)).padStart(2, "0")}`,
                statut: i % 3 === 0 ? "En retard" : "À l'heure",
                joursPresent: 20 - (i % 5),
                heuresTotal: `${160 - i * 2}h`,
                nombreRetards: i % 5,
                dureeTotal: `${i * 15}min`,
                nombreAbsences: i % 4,
                dernierAbsence: "2024-11-10",
              };
            case "contrats":
              return {
                ...base,
                typeContrat: ["CDI", "CDD", "Vacation"][i % 3],
                dateDebut: "2024-01-01",
                dateFin: "2025-06-30",
                joursRestants: Math.floor(Math.random() * 180) + 30,
                typeAttestation: ["Travail", "Salaire", "Stage"][i % 3],
                dateGeneration: "2024-11-20",
              };
            case "formations":
              return {
                ...base,
                formation: ["Pédagogie", "Informatique", "Langues"][i % 3],
                dateFormation: "2024-10-15",
                competences: ["Excel", "Word", "Anglais"][i % 3],
                niveau: ["Débutant", "Intermédiaire", "Avancé"][i % 3],
                organisme: ["INSET", "CAFOP", "Externe"][i % 3],
                nombreParticipants: Math.floor(Math.random() * 20) + 5,
                duree: `${(i + 1) * 8}h`,
                cout: `${(i + 1) * 50000} FCFA`,
                competence: ["Management", "Communication", "Technique"][i % 3],
                nombreAgents: Math.floor(Math.random() * 10) + 1,
                priorite: ["Haute", "Moyenne", "Basse"][i % 3],
              };
            case "recrutement":
              return {
                ...base,
                poste: ["Professeur", "Surveillant", "Secrétaire"][i % 3],
                dateCandidature: "2024-10-01",
                statut: ["En attente", "Retenu", "Rejeté"][i % 3],
                dateSelection: "2024-10-15",
                dateIntegration: "2024-11-01",
                dateRecrutement: "2024-09-01",
                annee: 2024 - (i % 5),
                nombreRecrutements: Math.floor(Math.random() * 20) + 5,
                parCategorie: "Enseignants: 10, Admin: 5",
              };
            default:
              return base;
          }
        });
      }

      setFilteredData(data);
      setIsLoading(false);
    }, 500);
  };

  // Prévisualiser une liste
  const handlePreview = (liste: ListeConfig) => {
    setSelectedListe(liste);
    generateData(liste);
    setShowPreview(true);

    logAction(
      "generation",
      liste.id,
      liste.nom,
      liste.categorie,
      filtres as unknown as Record<string, string>,
      filteredData.length
    );

    toast({
      title: "Prévisualisation générée",
      description: `Liste "${liste.nom}" prête à l'affichage`,
    });
  };

  // Exporter en PDF
  const exportPDF = () => {
    if (!selectedListe) return;

    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text(nomEtablissement, 14, 15);
    doc.setFontSize(10);
    doc.text(`Année scolaire: ${filtres.anneeScolaire}`, 14, 22);

    doc.setFontSize(14);
    doc.text(selectedListe.nom, 14, 35);

    doc.setFontSize(8);
    doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 14, 42);
    doc.text(`Total: ${filteredData.length} enregistrement(s)`, 14, 47);

    const headers = selectedListe.colonnes.map((c) => c.label);
    const rows = filteredData.map((item) =>
      selectedListe.colonnes.map((c) => String(item[c.key] || "-"))
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 55,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`${selectedListe.id}_${new Date().toISOString().split("T")[0]}.pdf`);

    logAction(
      "export_pdf",
      selectedListe.id,
      selectedListe.nom,
      selectedListe.categorie,
      filtres as unknown as Record<string, string>,
      filteredData.length
    );

    toast({
      title: "Export PDF réussi",
      description: "Le fichier a été téléchargé",
    });
  };

  // Exporter en Excel
  const exportExcel = () => {
    if (!selectedListe) return;

    const wsData = [
      [nomEtablissement],
      [`Année scolaire: ${filtres.anneeScolaire}`],
      [selectedListe.nom],
      [],
      selectedListe.colonnes.map((c) => c.label),
      ...filteredData.map((item) =>
        selectedListe.colonnes.map((c) => item[c.key] || "-")
      ),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Liste");
    XLSX.writeFile(wb, `${selectedListe.id}_${new Date().toISOString().split("T")[0]}.xlsx`);

    logAction(
      "export_excel",
      selectedListe.id,
      selectedListe.nom,
      selectedListe.categorie,
      filtres as unknown as Record<string, string>,
      filteredData.length
    );

    toast({
      title: "Export Excel réussi",
      description: "Le fichier a été téléchargé",
    });
  };

  // Imprimer
  const handlePrint = () => {
    if (!selectedListe) return;

    logAction(
      "impression",
      selectedListe.id,
      selectedListe.nom,
      selectedListe.categorie,
      filtres as unknown as Record<string, string>,
      filteredData.length
    );

    window.print();

    toast({
      title: "Impression lancée",
      description: "La fenêtre d'impression s'est ouverte",
    });
  };

  const stats = getStats();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imprimer Listes RH</h1>
          <p className="text-muted-foreground">
            Générer, filtrer et imprimer les listes du personnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Bouton Impression Groupée */}
          <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
            <DialogTrigger asChild>
              <Button variant="default" className="relative">
                <Layers className="h-4 w-4 mr-2" />
                Impression groupée
                {selectedListes.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-white text-primary">
                    {selectedListes.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Impression groupée - {selectedListes.length} liste(s)
                </DialogTitle>
              </DialogHeader>
              
              {selectedListes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune liste sélectionnée</p>
                  <p className="text-sm mt-2">Cochez les listes dans les catégories</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[300px] border rounded-lg p-4">
                    <div className="space-y-2">
                      {getSelectedListesInfo().map((liste) => (
                        <div key={liste.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium text-sm">{liste.nom}</p>
                            <p className="text-xs text-muted-foreground">{liste.categorie}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toggleListeSelection(liste.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Format d'export</label>
                      <div className="flex gap-2">
                        <Button variant={batchFormat === 'pdf' ? 'default' : 'outline'} onClick={() => setBatchFormat('pdf')} className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />PDF
                        </Button>
                        <Button variant={batchFormat === 'excel' ? 'default' : 'outline'} onClick={() => setBatchFormat('excel')} className="flex-1">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />Excel
                        </Button>
                        <Button variant={batchFormat === 'print' ? 'default' : 'outline'} onClick={() => setBatchFormat('print')} className="flex-1">
                          <Printer className="h-4 w-4 mr-2" />Imprimer
                        </Button>
                      </div>
                    </div>

                    {isBatchProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Traitement en cours...</span>
                          <span>{batchProgress}%</span>
                        </div>
                        <Progress value={batchProgress} />
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setSelectedListes([])} disabled={isBatchProcessing}>
                        Tout désélectionner
                      </Button>
                      <Button onClick={handleBatchProcess} disabled={isBatchProcessing || selectedListes.length === 0}>
                        {isBatchProcessing ? 'Traitement...' : `Générer ${selectedListes.length} liste(s)`}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            {roleLabels[currentRole]}
          </Badge>
          <Button variant="outline" onClick={() => setShowAuditLog(true)}>
            <History className="h-4 w-4 mr-2" />
            Journal d'audit
          </Button>
        </div>
      </div>

      {/* Barre de sélection rapide */}
      {selectedListes.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckSquare className="h-5 w-5 text-primary" />
              <span className="font-medium">{selectedListes.length} liste(s) sélectionnée(s)</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedListes([])}>
                Désélectionner tout
              </Button>
              <Button size="sm" onClick={() => setShowBatchDialog(true)}>
                <Layers className="h-4 w-4 mr-2" />
                Générer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerte accès restreint */}
      {hasRestrictedAccess && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès limité</AlertTitle>
          <AlertDescription>
            Certaines catégories de listes sont restreintes selon votre rôle.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtres globaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Année scolaire</Label>
              <Select
                value={filtres.anneeScolaire}
                onValueChange={(v) => setFiltres({ ...filtres, anneeScolaire: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={filtres.service}
                onValueChange={(v) => setFiltres({ ...filtres, service: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="Direction">Direction</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Pédagogie">Pédagogie</SelectItem>
                  <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                  <SelectItem value="Français">Français</SelectItem>
                  <SelectItem value="Anglais">Anglais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={filtres.statut}
                onValueChange={(v) => setFiltres({ ...filtres, statut: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Vacataire">Vacataire</SelectItem>
                  <SelectItem value="Contractuel">Contractuel</SelectItem>
                  <SelectItem value="Stagiaire">Stagiaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type contrat</Label>
              <Select
                value={filtres.typeContrat}
                onValueChange={(v) => setFiltres({ ...filtres, typeContrat: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Vacation">Vacation</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
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
                  <SelectItem value="Masculin">Masculin</SelectItem>
                  <SelectItem value="Féminin">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nom, matricule..."
                  value={filtres.recherche}
                  onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets par catégorie */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {categories.map((cat) => {
            const hasAccess = hasAccessToCategorie(cat.id);
            const Icon = cat.icon;
            return (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                disabled={!hasAccess}
                className="gap-2"
              >
                {!hasAccess && <Lock className="h-3 w-3" />}
                <Icon className="h-4 w-4" />
                {cat.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="mt-4">
            {!hasAccessToCategorie(cat.id) ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">Accès restreint</h3>
                  <p className="text-muted-foreground">
                    Vous n'avez pas les droits pour accéder à cette catégorie.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" onClick={() => selectAllInCategory(cat.id)}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    {getListesByCategorie(cat.id).every(l => selectedListes.includes(l.id)) ? 'Désélectionner tout' : 'Tout sélectionner'}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getListesByCategorie(cat.id).map((liste) => (
                    <Card 
                      key={liste.id} 
                      className={`hover:shadow-md transition-shadow ${
                        selectedListes.includes(liste.id) ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Checkbox 
                            checked={selectedListes.includes(liste.id)}
                            onCheckedChange={() => toggleListeSelection(liste.id)}
                          />
                          {liste.nom}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {liste.description}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handlePreview(liste)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Prévisualiser
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog de prévisualisation */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedListe?.nom}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={exportExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button size="sm" variant="outline" onClick={exportPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[60vh]">
            {/* En-tête de prévisualisation */}
            <div className="p-4 border-b bg-muted/50 print:bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{nomEtablissement}</h2>
                  <p className="text-sm text-muted-foreground">
                    Année scolaire: {filtres.anneeScolaire}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    Généré le: {new Date().toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-sm font-medium">
                    Total: {filteredData.length} enregistrement(s)
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-4">{selectedListe?.nom}</h3>
            </div>

            {/* Tableau des données */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    {selectedListe?.colonnes.map((col) => (
                      <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      {selectedListe?.colonnes.map((col) => (
                        <TableCell key={col.key}>
                          {col.key === "photo" && item[col.key] ? (
                            <img
                              src={item[col.key]}
                              alt="Photo"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            String(item[col.key] || "-")
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog Journal d'audit */}
      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Journal d'audit - Listes RH
            </DialogTitle>
          </DialogHeader>

          {/* Statistiques */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total actions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.today}</div>
                <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.thisWeek}</div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.byAction.export_pdf}</div>
                <p className="text-xs text-muted-foreground">Exports PDF</p>
              </CardContent>
            </Card>
          </div>

          <ScrollArea className="h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Heure</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Liste</TableHead>
                  <TableHead>Résultats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.slice(0, 50).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs">
                      {new Date(entry.timestamp).toLocaleString("fr-FR")}
                    </TableCell>
                    <TableCell>{entry.utilisateur}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          entry.action === "export_pdf"
                            ? "default"
                            : entry.action === "export_excel"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {entry.listeNom}
                    </TableCell>
                    <TableCell>{entry.nombreResultats}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {currentRole === "admin" && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  clearJournal();
                  toast({
                    title: "Journal effacé",
                    description: "L'historique a été supprimé",
                  });
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer le journal
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
