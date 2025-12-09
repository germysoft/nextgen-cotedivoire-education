export interface ObjectifSMART {
  id: string;
  titre: string;
  description: string;
  specifique: string;
  mesurable: string;
  atteignable: string;
  realiste: string;
  temporel: string;
  dateEcheance: string;
  progression: number; // 0-100
  statut: 'En cours' | 'Atteint' | 'Non atteint' | 'Reporté' | 'Annulé';
  commentaires?: string;
}

export interface CritereEvaluation {
  id: string;
  categorie: string;
  critere: string;
  note: number; // 1-5
  commentaire?: string;
  poids: number; // Pondération en %
}

export interface Evaluation {
  id: string;
  personnelId: string;
  evaluateurId: string;
  evaluateurNom: string;
  periode: string; // "2023-2024"
  dateEvaluation: string;
  typeEvaluation: 'Annuelle' | 'Semestrielle' | 'Trimestrielle' | 'Probatoire';
  statut: 'Brouillon' | 'En cours' | 'Validée' | 'Signée';
  
  // Critères d'évaluation par catégorie
  criteres: CritereEvaluation[];
  
  // Objectifs SMART
  objectifsPrecedents: ObjectifSMART[];
  objectifsFuturs: ObjectifSMART[];
  
  // Notes globales
  noteGlobale: number;
  appreciationGenerale: string;
  pointsForts: string[];
  axesAmelioration: string[];
  
  // Besoins de formation
  besoinsFormation: string[];
  
  // Signatures
  signatureEmploye?: {
    date: string;
    commentaire?: string;
    accord: boolean;
  };
  signatureEvaluateur?: {
    date: string;
  };
  signatureDirection?: {
    date: string;
    commentaire?: string;
  };
  
  // Métadonnées
  dateCreation: string;
  dateModification: string;
}

export const categoriesEvaluation = [
  {
    id: 'competences_techniques',
    nom: 'Compétences Techniques',
    criteres: [
      'Maîtrise du domaine d\'expertise',
      'Qualité du travail fourni',
      'Respect des délais',
      'Capacité d\'innovation',
      'Utilisation des outils'
    ]
  },
  {
    id: 'competences_relationnelles',
    nom: 'Compétences Relationnelles',
    criteres: [
      'Communication orale et écrite',
      'Travail en équipe',
      'Relation avec les élèves/parents',
      'Gestion des conflits',
      'Écoute et empathie'
    ]
  },
  {
    id: 'competences_organisationnelles',
    nom: 'Compétences Organisationnelles',
    criteres: [
      'Gestion du temps',
      'Organisation du travail',
      'Priorisation des tâches',
      'Autonomie',
      'Adaptabilité'
    ]
  },
  {
    id: 'engagement',
    nom: 'Engagement & Motivation',
    criteres: [
      'Ponctualité et assiduité',
      'Implication dans les projets',
      'Esprit d\'initiative',
      'Respect des valeurs de l\'établissement',
      'Participation à la vie scolaire'
    ]
  },
  {
    id: 'leadership',
    nom: 'Leadership & Management',
    criteres: [
      'Capacité à motiver',
      'Prise de décision',
      'Délégation',
      'Gestion d\'équipe',
      'Vision stratégique'
    ]
  }
] as const;

export const niveauxNotation = [
  { value: 1, label: 'Insuffisant', color: 'bg-red-500' },
  { value: 2, label: 'À améliorer', color: 'bg-orange-500' },
  { value: 3, label: 'Satisfaisant', color: 'bg-yellow-500' },
  { value: 4, label: 'Bon', color: 'bg-green-500' },
  { value: 5, label: 'Excellent', color: 'bg-emerald-600' }
] as const;
