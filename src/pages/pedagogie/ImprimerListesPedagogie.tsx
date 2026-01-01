import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Printer, FileText, FileSpreadsheet, Download, Eye, Filter, 
  GraduationCap, Users, Calendar, BookOpen, ClipboardList, 
  FileCheck, AlertTriangle, MessageSquare, Monitor, History,
  Search, RefreshCw, Building, Layers
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEtablissement } from '@/contexts/EtablissementContext';
import { useRole } from '@/contexts/RoleContext';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Types
interface ListeConfig {
  id: string;
  nom: string;
  description: string;
  categorie: string;
  filtresDisponibles: string[];
  colonnes: { key: string; label: string }[];
  rolesAutorises: string[];
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  utilisateur: string;
  role: string;
  action: 'generation' | 'export_pdf' | 'export_excel' | 'impression';
  listeId: string;
  listeNom: string;
  categorie: string;
  filtres: Record<string, string>;
  nombreResultats: number;
}

// Hook d'audit local
function useAuditListesPedagogie() {
  const [entries, setEntries] = useState<AuditEntry[]>(() => {
    const stored = localStorage.getItem('audit_listes_pedagogie');
    return stored ? JSON.parse(stored) : [];
  });

  const logAction = useCallback((
    action: AuditEntry['action'],
    listeId: string,
    listeNom: string,
    categorie: string,
    filtres: Record<string, string>,
    nombreResultats: number,
    utilisateur: string,
    role: string
  ) => {
    const newEntry: AuditEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      utilisateur,
      role,
      action,
      listeId,
      listeNom,
      categorie,
      filtres,
      nombreResultats
    };
    
    const updated = [newEntry, ...entries].slice(0, 500);
    setEntries(updated);
    localStorage.setItem('audit_listes_pedagogie', JSON.stringify(updated));
  }, [entries]);

  const getStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    return {
      total: entries.length,
      aujourdhui: entries.filter(e => new Date(e.timestamp) >= today).length,
      cetteSemaine: entries.filter(e => new Date(e.timestamp) >= thisWeek).length,
      parAction: {
        generation: entries.filter(e => e.action === 'generation').length,
        export_pdf: entries.filter(e => e.action === 'export_pdf').length,
        export_excel: entries.filter(e => e.action === 'export_excel').length,
        impression: entries.filter(e => e.action === 'impression').length,
      }
    };
  }, [entries]);

  return { entries, logAction, getStats };
}

// Configuration des catégories et listes
const categories = [
  { id: 'cycles', nom: 'Cycles, Niveaux & Classes', icon: Layers },
  { id: 'enseignants', nom: 'Enseignants & Attributions', icon: Users },
  { id: 'emplois', nom: 'Emplois du Temps', icon: Calendar },
  { id: 'matieres', nom: 'Matières & Programmes', icon: BookOpen },
  { id: 'conseils', nom: 'Conseils de Classe', icon: ClipboardList },
  { id: 'bulletins', nom: 'Bulletins MENA', icon: FileCheck },
  { id: 'discipline', nom: 'Discipline', icon: AlertTriangle },
  { id: 'convocations', nom: 'Convocations Parents', icon: MessageSquare },
  { id: 'elearning', nom: 'E-learning', icon: Monitor },
];

const listesPedagogiques: ListeConfig[] = [
  // Cycles, Niveaux & Classes
  { id: 'cycles_list', nom: 'Liste des cycles', description: 'Tous les cycles de l\'établissement', categorie: 'cycles', filtresDisponibles: ['anneeScolaire'], colonnes: [{ key: 'code', label: 'Code' }, { key: 'nom', label: 'Nom' }, { key: 'niveaux', label: 'Nombre de niveaux' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'niveaux_cycle', nom: 'Liste des niveaux par cycle', description: 'Niveaux regroupés par cycle', categorie: 'cycles', filtresDisponibles: ['anneeScolaire', 'cycle'], colonnes: [{ key: 'cycle', label: 'Cycle' }, { key: 'niveau', label: 'Niveau' }, { key: 'classes', label: 'Nb Classes' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'classes_niveau', nom: 'Liste des classes par niveau', description: 'Classes regroupées par niveau', categorie: 'cycles', filtresDisponibles: ['anneeScolaire', 'cycle', 'niveau'], colonnes: [{ key: 'niveau', label: 'Niveau' }, { key: 'classe', label: 'Classe' }, { key: 'effectif', label: 'Effectif' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'classes_complete', nom: 'Liste complète des classes', description: 'Toutes les classes de l\'établissement', categorie: 'cycles', filtresDisponibles: ['anneeScolaire', 'cycle', 'niveau'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'niveau', label: 'Niveau' }, { key: 'effectif', label: 'Effectif' }, { key: 'profPrincipal', label: 'Prof. Principal' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'effectifs_classe', nom: 'Effectifs par classe / niveau / cycle', description: 'Statistiques des effectifs', categorie: 'cycles', filtresDisponibles: ['anneeScolaire', 'cycle', 'niveau'], colonnes: [{ key: 'entite', label: 'Entité' }, { key: 'garcons', label: 'Garçons' }, { key: 'filles', label: 'Filles' }, { key: 'total', label: 'Total' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'classes_pp', nom: 'Classes avec professeur principal', description: 'Attribution des professeurs principaux', categorie: 'cycles', filtresDisponibles: ['anneeScolaire', 'cycle', 'niveau'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'profPrincipal', label: 'Prof. Principal' }, { key: 'contact', label: 'Contact' }], rolesAutorises: ['admin', 'direction'] },

  // Enseignants & Attributions
  { id: 'enseignants_classe', nom: 'Liste des enseignants par classe', description: 'Enseignants affectés à chaque classe', categorie: 'enseignants', filtresDisponibles: ['anneeScolaire', 'classe'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'enseignant', label: 'Enseignant' }, { key: 'matiere', label: 'Matière' }, { key: 'heures', label: 'Heures/sem' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'enseignants_matiere', nom: 'Liste des enseignants par matière', description: 'Enseignants par discipline', categorie: 'enseignants', filtresDisponibles: ['anneeScolaire', 'matiere'], colonnes: [{ key: 'matiere', label: 'Matière' }, { key: 'enseignant', label: 'Enseignant' }, { key: 'classes', label: 'Classes' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'enseignants_niveau', nom: 'Liste des enseignants par niveau', description: 'Enseignants par niveau scolaire', categorie: 'enseignants', filtresDisponibles: ['anneeScolaire', 'niveau'], colonnes: [{ key: 'niveau', label: 'Niveau' }, { key: 'enseignant', label: 'Enseignant' }, { key: 'matiere', label: 'Matière' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'enseignants_sans_attribution', nom: 'Enseignants sans attribution', description: 'Enseignants non affectés', categorie: 'enseignants', filtresDisponibles: ['anneeScolaire'], colonnes: [{ key: 'enseignant', label: 'Enseignant' }, { key: 'specialite', label: 'Spécialité' }, { key: 'statut', label: 'Statut' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'enseignants_charges', nom: 'Enseignants avec charges horaires', description: 'Répartition des charges', categorie: 'enseignants', filtresDisponibles: ['anneeScolaire'], colonnes: [{ key: 'enseignant', label: 'Enseignant' }, { key: 'heuresPrevues', label: 'H. Prévues' }, { key: 'heuresEffectives', label: 'H. Effectives' }, { key: 'ecart', label: 'Écart' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'profs_principaux', nom: 'Liste des Professeurs Principaux', description: 'Tous les PP de l\'établissement', categorie: 'enseignants', filtresDisponibles: ['anneeScolaire', 'niveau'], colonnes: [{ key: 'enseignant', label: 'Enseignant' }, { key: 'classe', label: 'Classe' }, { key: 'niveau', label: 'Niveau' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },

  // Emplois du Temps
  { id: 'edt_classe', nom: 'Emploi du temps par classe', description: 'EDT hebdomadaire par classe', categorie: 'emplois', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'jour', label: 'Jour' }, { key: 'heure', label: 'Heure' }, { key: 'matiere', label: 'Matière' }, { key: 'enseignant', label: 'Enseignant' }, { key: 'salle', label: 'Salle' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'edt_enseignant', nom: 'Emploi du temps par enseignant', description: 'EDT hebdomadaire par enseignant', categorie: 'emplois', filtresDisponibles: ['anneeScolaire', 'enseignant', 'periode'], colonnes: [{ key: 'jour', label: 'Jour' }, { key: 'heure', label: 'Heure' }, { key: 'classe', label: 'Classe' }, { key: 'matiere', label: 'Matière' }, { key: 'salle', label: 'Salle' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'edt_jour', nom: 'Emploi du temps par jour', description: 'Planning journalier', categorie: 'emplois', filtresDisponibles: ['anneeScolaire', 'classe', 'jour'], colonnes: [{ key: 'heure', label: 'Heure' }, { key: 'classe', label: 'Classe' }, { key: 'matiere', label: 'Matière' }, { key: 'enseignant', label: 'Enseignant' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'edt_niveau', nom: 'Emploi du temps par niveau', description: 'EDT consolidé par niveau', categorie: 'emplois', filtresDisponibles: ['anneeScolaire', 'niveau', 'periode'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'jour', label: 'Jour' }, { key: 'heure', label: 'Heure' }, { key: 'matiere', label: 'Matière' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'edt_hebdo_mensuel', nom: 'EDT hebdomadaire / mensuel', description: 'Vue consolidée', categorie: 'emplois', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'semaine', label: 'Semaine' }, { key: 'heuresTotal', label: 'H. Total' }, { key: 'coursDispenses', label: 'Cours' }], rolesAutorises: ['admin', 'direction'] },

  // Matières & Programmes
  { id: 'matieres_niveau', nom: 'Liste des matières par niveau', description: 'Matières enseignées par niveau', categorie: 'matieres', filtresDisponibles: ['anneeScolaire', 'niveau'], colonnes: [{ key: 'niveau', label: 'Niveau' }, { key: 'matiere', label: 'Matière' }, { key: 'coefficient', label: 'Coef.' }, { key: 'heures', label: 'Heures/sem' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'matieres_classe', nom: 'Liste des matières par classe', description: 'Matières par classe', categorie: 'matieres', filtresDisponibles: ['anneeScolaire', 'classe'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'matiere', label: 'Matière' }, { key: 'enseignant', label: 'Enseignant' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'programmes_matiere', nom: 'Liste des programmes par matière', description: 'Contenu des programmes', categorie: 'matieres', filtresDisponibles: ['anneeScolaire', 'matiere', 'niveau'], colonnes: [{ key: 'matiere', label: 'Matière' }, { key: 'chapitre', label: 'Chapitre' }, { key: 'duree', label: 'Durée prévue' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'volumes_horaires', nom: 'Volumes horaires par matière', description: 'Répartition horaire', categorie: 'matieres', filtresDisponibles: ['anneeScolaire', 'niveau'], colonnes: [{ key: 'matiere', label: 'Matière' }, { key: 'heuresHebdo', label: 'H/Semaine' }, { key: 'heuresAnnuelles', label: 'H/Année' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'matieres_optionnelles', nom: 'Matières optionnelles', description: 'LV2, arts, options...', categorie: 'matieres', filtresDisponibles: ['anneeScolaire', 'niveau'], colonnes: [{ key: 'matiere', label: 'Matière' }, { key: 'type', label: 'Type' }, { key: 'inscrits', label: 'Inscrits' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },

  // Conseils de Classe
  { id: 'conseils_periode', nom: 'Conseils de classe par période', description: 'Planning des conseils', categorie: 'conseils', filtresDisponibles: ['anneeScolaire', 'periode', 'niveau'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'date', label: 'Date' }, { key: 'heure', label: 'Heure' }, { key: 'salle', label: 'Salle' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'eleves_convoques', nom: 'Élèves convoqués', description: 'Élèves appelés au conseil', categorie: 'conseils', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'classe', label: 'Classe' }, { key: 'motif', label: 'Motif' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'enseignants_participants', nom: 'Enseignants participants', description: 'Présence aux conseils', categorie: 'conseils', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'enseignant', label: 'Enseignant' }, { key: 'classe', label: 'Classe' }, { key: 'presence', label: 'Présence' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'decisions_conseil', nom: 'Décisions prises', description: 'Compte-rendu des décisions', categorie: 'conseils', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'decision', label: 'Décision' }, { key: 'observation', label: 'Observation' }], rolesAutorises: ['admin', 'direction'] },

  // Bulletins MENA
  { id: 'bulletins_generes', nom: 'Bulletins générés', description: 'Tous les bulletins créés', categorie: 'bulletins', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'classe', label: 'Classe' }, { key: 'periode', label: 'Période' }, { key: 'dateGeneration', label: 'Date' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'bulletins_valides', nom: 'Bulletins validés / non validés', description: 'État de validation', categorie: 'bulletins', filtresDisponibles: ['anneeScolaire', 'classe', 'periode', 'statut'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'valides', label: 'Validés' }, { key: 'nonValides', label: 'Non validés' }, { key: 'taux', label: 'Taux' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'bulletins_classe', nom: 'Bulletins par classe', description: 'Liste par classe', categorie: 'bulletins', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'moyenne', label: 'Moyenne' }, { key: 'rang', label: 'Rang' }, { key: 'statut', label: 'Statut' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'bulletins_periode', nom: 'Bulletins par période', description: 'Trimestre / Semestre', categorie: 'bulletins', filtresDisponibles: ['anneeScolaire', 'periode'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'effectif', label: 'Effectif' }, { key: 'generes', label: 'Générés' }, { key: 'imprimes', label: 'Imprimés' }], rolesAutorises: ['admin', 'direction'] },

  // Discipline
  { id: 'sanctions_eleve', nom: 'Sanctions par élève', description: 'Historique disciplinaire', categorie: 'discipline', filtresDisponibles: ['anneeScolaire', 'classe', 'eleve'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'sanction', label: 'Sanction' }, { key: 'date', label: 'Date' }, { key: 'motif', label: 'Motif' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'sanctions_classe', nom: 'Sanctions par classe', description: 'Discipline par classe', categorie: 'discipline', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'nbSanctions', label: 'Nb Sanctions' }, { key: 'types', label: 'Types' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'avertissements', nom: 'Liste des avertissements', description: 'Tous les avertissements', categorie: 'discipline', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'classe', label: 'Classe' }, { key: 'date', label: 'Date' }, { key: 'motif', label: 'Motif' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'exclusions', nom: 'Liste des exclusions', description: 'Exclusions temporaires/définitives', categorie: 'discipline', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'type', label: 'Type' }, { key: 'duree', label: 'Durée' }, { key: 'date', label: 'Date' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'stats_discipline', nom: 'Statistiques disciplinaires', description: 'Synthèse disciplinaire', categorie: 'discipline', filtresDisponibles: ['anneeScolaire', 'periode'], colonnes: [{ key: 'categorie', label: 'Catégorie' }, { key: 'nombre', label: 'Nombre' }, { key: 'evolution', label: 'Évolution' }], rolesAutorises: ['admin', 'direction'] },

  // Convocations Parents
  { id: 'convocations_envoyees', nom: 'Convocations envoyées', description: 'Toutes les convocations', categorie: 'convocations', filtresDisponibles: ['anneeScolaire', 'classe', 'periode'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'parent', label: 'Parent' }, { key: 'date', label: 'Date' }, { key: 'motif', label: 'Motif' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'convocations_classe', nom: 'Convocations par classe', description: 'Par classe', categorie: 'convocations', filtresDisponibles: ['anneeScolaire', 'classe'], colonnes: [{ key: 'classe', label: 'Classe' }, { key: 'nbConvocations', label: 'Nombre' }, { key: 'retirees', label: 'Retirées' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'convocations_motif', nom: 'Convocations par motif', description: 'Regroupement par motif', categorie: 'convocations', filtresDisponibles: ['anneeScolaire', 'periode'], colonnes: [{ key: 'motif', label: 'Motif' }, { key: 'nombre', label: 'Nombre' }, { key: 'pourcentage', label: '%' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'convocations_non_retirees', nom: 'Convocations non retirées', description: 'En attente', categorie: 'convocations', filtresDisponibles: ['anneeScolaire', 'classe'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'classe', label: 'Classe' }, { key: 'dateEnvoi', label: 'Date envoi' }, { key: 'jours', label: 'Jours' }], rolesAutorises: ['admin', 'direction'] },

  // E-learning
  { id: 'cours_ligne', nom: 'Cours en ligne', description: 'Catalogue des cours', categorie: 'elearning', filtresDisponibles: ['anneeScolaire', 'matiere', 'niveau'], colonnes: [{ key: 'titre', label: 'Titre' }, { key: 'matiere', label: 'Matière' }, { key: 'enseignant', label: 'Enseignant' }, { key: 'inscrits', label: 'Inscrits' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'enseignants_elearning', nom: 'Enseignants e-learning', description: 'Formateurs en ligne', categorie: 'elearning', filtresDisponibles: ['anneeScolaire', 'matiere'], colonnes: [{ key: 'enseignant', label: 'Enseignant' }, { key: 'cours', label: 'Nb Cours' }, { key: 'eleves', label: 'Élèves' }], rolesAutorises: ['admin', 'direction'] },
  { id: 'eleves_inscrits_cours', nom: 'Élèves inscrits aux cours', description: 'Inscriptions e-learning', categorie: 'elearning', filtresDisponibles: ['anneeScolaire', 'classe', 'matiere'], colonnes: [{ key: 'eleve', label: 'Élève' }, { key: 'classe', label: 'Classe' }, { key: 'cours', label: 'Cours' }, { key: 'progression', label: 'Progression' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
  { id: 'evaluations_ligne', nom: 'Évaluations en ligne', description: 'Tests et examens en ligne', categorie: 'elearning', filtresDisponibles: ['anneeScolaire', 'matiere', 'classe'], colonnes: [{ key: 'titre', label: 'Titre' }, { key: 'matiere', label: 'Matière' }, { key: 'participants', label: 'Participants' }, { key: 'moyenneClasse', label: 'Moyenne' }], rolesAutorises: ['admin', 'direction', 'enseignant'] },
];

// Données de démonstration
const generateMockData = (listeId: string, count: number = 15): any[] => {
  const baseData: Record<string, any[]> = {
    'cycles_list': [
      { code: 'CYC1', nom: 'Primaire', niveaux: 6 },
      { code: 'CYC2', nom: 'Collège', niveaux: 4 },
      { code: 'CYC3', nom: 'Lycée', niveaux: 3 },
    ],
    'classes_complete': [
      { classe: '6ème A', niveau: '6ème', effectif: 35, profPrincipal: 'M. Dupont' },
      { classe: '6ème B', niveau: '6ème', effectif: 33, profPrincipal: 'Mme Martin' },
      { classe: '5ème A', niveau: '5ème', effectif: 32, profPrincipal: 'M. Bernard' },
      { classe: '4ème A', niveau: '4ème', effectif: 30, profPrincipal: 'Mme Petit' },
      { classe: '3ème A', niveau: '3ème', effectif: 28, profPrincipal: 'M. Robert' },
    ],
    'enseignants_classe': [
      { classe: '6ème A', enseignant: 'M. Dupont', matiere: 'Mathématiques', heures: 4 },
      { classe: '6ème A', enseignant: 'Mme Martin', matiere: 'Français', heures: 5 },
      { classe: '6ème A', enseignant: 'M. Bernard', matiere: 'Histoire-Géo', heures: 3 },
      { classe: '6ème B', enseignant: 'M. Dupont', matiere: 'Mathématiques', heures: 4 },
      { classe: '6ème B', enseignant: 'Mme Petit', matiere: 'Anglais', heures: 3 },
    ],
    'profs_principaux': [
      { enseignant: 'M. Dupont', classe: '6ème A', niveau: '6ème' },
      { enseignant: 'Mme Martin', classe: '6ème B', niveau: '6ème' },
      { enseignant: 'M. Bernard', classe: '5ème A', niveau: '5ème' },
      { enseignant: 'Mme Petit', classe: '4ème A', niveau: '4ème' },
      { enseignant: 'M. Robert', classe: '3ème A', niveau: '3ème' },
    ],
  };

  return baseData[listeId] || Array.from({ length: count }, (_, i) => ({
    id: `item_${i + 1}`,
    col1: `Valeur ${i + 1}`,
    col2: `Donnée ${i + 1}`,
    col3: Math.floor(Math.random() * 100),
  }));
};

export default function ImprimerListesPedagogie() {
  const { t } = useLanguage();
  const { configuration } = useEtablissement();
  const nomEtablissement = configuration.identite.nom || 'Établissement Scolaire';
  const anneeScolaire = '2024-2025';
  const { currentRole, currentUserId } = useRole();
  const { entries: auditEntries, logAction, getStats } = useAuditListesPedagogie();

  const [selectedCategorie, setSelectedCategorie] = useState('cycles');
  const [selectedListe, setSelectedListe] = useState<ListeConfig | null>(null);
  const [filtres, setFiltres] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les listes par rôle
  const listesAccessibles = listesPedagogiques.filter(liste => 
    liste.rolesAutorises.includes(currentRole) || currentRole === 'admin'
  );

  const listesFiltrees = listesAccessibles.filter(liste => 
    liste.categorie === selectedCategorie &&
    (liste.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
     liste.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categoriesAccessibles = categories.filter(cat =>
    listesAccessibles.some(liste => liste.categorie === cat.id)
  );

  const handleSelectListe = (liste: ListeConfig) => {
    setSelectedListe(liste);
    setFiltres({});
    setShowPreview(false);
  };

  const handleGenererListe = () => {
    if (!selectedListe) return;
    
    const data = generateMockData(selectedListe.id);
    setPreviewData(data);
    setShowPreview(true);
    
    logAction('generation', selectedListe.id, selectedListe.nom, selectedListe.categorie, filtres, data.length, currentUserId, currentRole);
    toast.success(`Liste "${selectedListe.nom}" générée avec ${data.length} résultats`);
  };

  const handleExportPDF = () => {
    if (!selectedListe || previewData.length === 0) return;

    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(16);
    doc.text(nomEtablissement, 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Année scolaire : ${anneeScolaire}`, 105, 22, { align: 'center' });
    doc.setFontSize(14);
    doc.text(selectedListe.nom, 105, 32, { align: 'center' });

    // Table
    const headers = selectedListe.colonnes.map(c => c.label);
    const rows = previewData.map(row => 
      selectedListe.colonnes.map(col => String(row[col.key] || ''))
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 40,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save(`${selectedListe.id}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    logAction('export_pdf', selectedListe.id, selectedListe.nom, selectedListe.categorie, filtres, previewData.length, currentUserId, currentRole);
    toast.success('Export PDF réussi');
  };

  const handleExportExcel = () => {
    if (!selectedListe || previewData.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(
      previewData.map(row => {
        const formattedRow: any = {};
        selectedListe.colonnes.forEach(col => {
          formattedRow[col.label] = row[col.key];
        });
        return formattedRow;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
    XLSX.writeFile(workbook, `${selectedListe.id}_${new Date().toISOString().split('T')[0]}.xlsx`);

    logAction('export_excel', selectedListe.id, selectedListe.nom, selectedListe.categorie, filtres, previewData.length, currentUserId, currentRole);
    toast.success('Export Excel réussi');
  };

  const handlePrint = () => {
    if (!selectedListe || previewData.length === 0) return;
    
    logAction('impression', selectedListe.id, selectedListe.nom, selectedListe.categorie, filtres, previewData.length, currentUserId, currentRole);
    window.print();
    toast.success('Impression lancée');
  };

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Printer className="h-8 w-8 text-primary" />
            Imprimer Listes Pédagogiques
          </h1>
          <p className="text-muted-foreground mt-1">
            Générer, filtrer et imprimer toutes les listes pédagogiques
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAudit} onOpenChange={setShowAudit}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="mr-2 h-4 w-4" />
                Journal ({stats.total})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Journal d'audit - Listes Pédagogiques</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.aujourdhui}</div>
                    <div className="text-sm text-muted-foreground">Aujourd'hui</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.parAction.export_pdf}</div>
                    <div className="text-sm text-muted-foreground">Exports PDF</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.parAction.impression}</div>
                    <div className="text-sm text-muted-foreground">Impressions</div>
                  </CardContent>
                </Card>
              </div>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Liste</TableHead>
                      <TableHead>Résultats</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditEntries.slice(0, 50).map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-sm">
                          {new Date(entry.timestamp).toLocaleString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={entry.action === 'impression' ? 'default' : 'secondary'}>
                            {entry.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.listeNom}</TableCell>
                        <TableCell>{entry.nombreResultats}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau de catégories */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Catégories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-2">
                {categoriesAccessibles.map(cat => {
                  const Icon = cat.icon;
                  const count = listesAccessibles.filter(l => l.categorie === cat.id).length;
                  return (
                    <Button
                      key={cat.id}
                      variant={selectedCategorie === cat.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategorie(cat.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span className="flex-1 text-left truncate">{cat.nom}</span>
                      <Badge variant="secondary" className="ml-2">{count}</Badge>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Liste des listes disponibles */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Listes disponibles</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[430px]">
              <div className="space-y-1 p-2">
                {listesFiltrees.map(liste => (
                  <Button
                    key={liste.id}
                    variant={selectedListe?.id === liste.id ? 'default' : 'ghost'}
                    className="w-full justify-start h-auto py-2"
                    onClick={() => handleSelectListe(liste)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{liste.nom}</div>
                      <div className="text-xs text-muted-foreground truncate">{liste.description}</div>
                    </div>
                  </Button>
                ))}
                {listesFiltrees.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Aucune liste trouvée</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Panneau de configuration et prévisualisation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {selectedListe ? selectedListe.nom : 'Sélectionnez une liste'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedListe ? (
              <div className="space-y-4">
                {/* Filtres */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Année scolaire</Label>
                    <Select value={filtres.anneeScolaire || ''} onValueChange={(v) => setFiltres({...filtres, anneeScolaire: v})}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedListe.filtresDisponibles.includes('cycle') && (
                    <div>
                      <Label>Cycle</Label>
                      <Select value={filtres.cycle || ''} onValueChange={(v) => setFiltres({...filtres, cycle: v})}>
                        <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primaire">Primaire</SelectItem>
                          <SelectItem value="college">Collège</SelectItem>
                          <SelectItem value="lycee">Lycée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {selectedListe.filtresDisponibles.includes('niveau') && (
                    <div>
                      <Label>Niveau</Label>
                      <Select value={filtres.niveau || ''} onValueChange={(v) => setFiltres({...filtres, niveau: v})}>
                        <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6eme">6ème</SelectItem>
                          <SelectItem value="5eme">5ème</SelectItem>
                          <SelectItem value="4eme">4ème</SelectItem>
                          <SelectItem value="3eme">3ème</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {selectedListe.filtresDisponibles.includes('classe') && (
                    <div>
                      <Label>Classe</Label>
                      <Select value={filtres.classe || ''} onValueChange={(v) => setFiltres({...filtres, classe: v})}>
                        <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6A">6ème A</SelectItem>
                          <SelectItem value="6B">6ème B</SelectItem>
                          <SelectItem value="5A">5ème A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {selectedListe.filtresDisponibles.includes('periode') && (
                    <div>
                      <Label>Période</Label>
                      <Select value={filtres.periode || ''} onValueChange={(v) => setFiltres({...filtres, periode: v})}>
                        <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="T1">Trimestre 1</SelectItem>
                          <SelectItem value="T2">Trimestre 2</SelectItem>
                          <SelectItem value="T3">Trimestre 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {selectedListe.filtresDisponibles.includes('matiere') && (
                    <div>
                      <Label>Matière</Label>
                      <Select value={filtres.matiere || ''} onValueChange={(v) => setFiltres({...filtres, matiere: v})}>
                        <SelectTrigger><SelectValue placeholder="Toutes" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maths">Mathématiques</SelectItem>
                          <SelectItem value="francais">Français</SelectItem>
                          <SelectItem value="anglais">Anglais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleGenererListe}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Générer la liste
                  </Button>
                  {showPreview && (
                    <>
                      <Button variant="outline" onClick={handleExportPDF}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button variant="outline" onClick={handleExportExcel}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Export Excel
                      </Button>
                      <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </Button>
                    </>
                  )}
                </div>

                {/* Prévisualisation */}
                {showPreview && previewData.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-3 border-b">
                      <div className="text-center">
                        <div className="font-bold">{nomEtablissement}</div>
                        <div className="text-sm text-muted-foreground">Année scolaire : {anneeScolaire}</div>
                        <div className="font-semibold mt-1">{selectedListe.nom}</div>
                      </div>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {selectedListe.colonnes.map(col => (
                              <TableHead key={col.key}>{col.label}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, idx) => (
                            <TableRow key={idx}>
                              {selectedListe.colonnes.map(col => (
                                <TableCell key={col.key}>{row[col.key]}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                    <div className="bg-muted p-2 border-t text-center text-sm text-muted-foreground">
                      {previewData.length} résultat(s)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez une catégorie puis une liste pour commencer</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
