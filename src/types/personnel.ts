export interface Personnel {
  id: string;
  matricule: string;
  photo?: string;
  
  // Informations personnelles
  civilite: 'M.' | 'Mme' | 'Mlle';
  nom: string;
  prenom: string;
  nomJeuneFille?: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  sexe: 'Masculin' | 'Féminin';
  situationMatrimoniale: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf/Veuve' | 'Union libre';
  nombreEnfants: number;
  groupeSanguin?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  
  // Pièces d'identité
  numeroCNI: string;
  dateDelivranceCNI: string;
  lieuDelivranceCNI: string;
  dateExpirationCNI?: string;
  numeroPasseport?: string;
  dateExpirationPasseport?: string;
  
  // Contact
  adresse: string;
  ville: string;
  codePostal?: string;
  pays: string;
  telephone: string;
  telephoneSecondaire?: string;
  email: string;
  emailProfessionnel?: string;
  
  // Contact d'urgence
  contactUrgenceNom: string;
  contactUrgenceLien: string;
  contactUrgenceTelephone: string;
  
  // Informations professionnelles
  poste: string;
  departement: string;
  categoriePersonnel: 'Enseignant' | 'Administratif' | 'Technique' | 'Direction' | 'Médical' | 'Surveillance';
  statut: 'Permanent' | 'Vacataire' | 'Contractuel' | 'Stagiaire' | 'Intérimaire';
  typeContrat: 'CDI' | 'CDD' | 'Vacation' | 'Stage' | 'Apprentissage';
  dateEmbauche: string;
  dateFinContrat?: string;
  anciennete: number;
  heuresHebdo: number;
  
  // Affectation enseignant
  matieresPrincipales?: string[];
  classesAffectees?: string[];
  chargeHoraire?: number;
  
  // Diplômes et qualifications
  diplomes: Diplome[];
  certifications?: Certification[];
  languesParles: LangueParlée[];
  competences?: string[];
  
  // Informations financières
  salaireBase: number;
  primes?: Prime[];
  modePaiement: 'Virement' | 'Chèque' | 'Espèces';
  banque?: string;
  numeroCompte?: string;
  ribIban?: string;
  
  // Sécurité sociale et fiscale
  numeroSecuriteSociale?: string;
  numeroCNPS?: string;
  situationFiscale?: string;
  nombrePartsImpots?: number;
  
  // Documents
  documents: Document[];
  
  // Évaluations
  derniereEvaluation?: string;
  noteEvaluation?: number;
  
  // Absences et congés
  soldeCongesAnnuels: number;
  soldeRTT?: number;
  soldeMaladie?: number;
  
  // Historique
  historiquePostes?: HistoriquePoste[];
  historiqueFormations?: Formation[];
  
  // Notes et observations
  observations?: string;
  
  // Metadata
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
  actif: boolean;
}

export interface Diplome {
  id: string;
  intitule: string;
  etablissement: string;
  anneeObtention: string;
  mention?: string;
  niveau: 'CAP/BEP' | 'Baccalauréat' | 'BTS/DUT' | 'Licence' | 'Master' | 'Doctorat' | 'Autre';
}

export interface Certification {
  id: string;
  nom: string;
  organisme: string;
  dateObtention: string;
  dateExpiration?: string;
  valide: boolean;
}

export interface LangueParlée {
  langue: string;
  niveau: 'Notions' | 'Intermédiaire' | 'Courant' | 'Bilingue' | 'Natif';
  ecrit: boolean;
  oral: boolean;
}

export interface Prime {
  type: string;
  montant: number;
  frequence: 'Mensuel' | 'Trimestriel' | 'Annuel' | 'Ponctuel';
}

export interface Document {
  id: string;
  type: 'CV' | 'Diplôme' | 'CNI' | 'Contrat' | 'Certificat médical' | 'Autre';
  nom: string;
  dateAjout: string;
  url?: string;
}

export interface HistoriquePoste {
  poste: string;
  departement: string;
  dateDebut: string;
  dateFin: string;
  motifChangement?: string;
}

export interface Formation {
  id: string;
  intitule: string;
  organisme: string;
  dateDebut: string;
  dateFin: string;
  dureeHeures: number;
  certifiante: boolean;
  commentaire?: string;
}

export const categoriesPersonnel = [
  'Enseignant',
  'Administratif',
  'Technique',
  'Direction',
  'Médical',
  'Surveillance'
] as const;

export const statutsPersonnel = [
  'Permanent',
  'Vacataire',
  'Contractuel',
  'Stagiaire',
  'Intérimaire'
] as const;

export const typesContrat = [
  'CDI',
  'CDD',
  'Vacation',
  'Stage',
  'Apprentissage'
] as const;

export const departements = [
  'Direction',
  'Administration',
  'Pédagogie',
  'Mathématiques',
  'Français',
  'Anglais',
  'Sciences Physiques',
  'SVT',
  'Histoire-Géographie',
  'Philosophie',
  'Éducation Physique',
  'Informatique',
  'Arts Plastiques',
  'Musique',
  'Économie',
  'Comptabilité',
  'Surveillance',
  'Infirmerie',
  'Bibliothèque',
  'Maintenance',
  'Sécurité',
  'Restauration',
  'Transport'
] as const;

export const postes = [
  'Directeur',
  'Directeur Adjoint',
  'Censeur',
  'Surveillant Général',
  'Professeur Principal',
  'Professeur',
  'Professeur Vacataire',
  'Secrétaire Général',
  'Secrétaire',
  'Assistant(e) de Direction',
  'Comptable',
  'Aide-Comptable',
  'Caissier',
  'Surveillant',
  'Bibliothécaire',
  'Documentaliste',
  'Infirmier(ère)',
  'Médecin Scolaire',
  'Psychologue Scolaire',
  'Agent d\'entretien',
  'Agent de sécurité',
  'Chauffeur',
  'Cuisinier',
  'Agent de Restauration',
  'Technicien Informatique',
  'Conseiller d\'Orientation'
] as const;

export const matieres = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Physique-Chimie',
  'Sciences de la Vie et de la Terre (SVT)',
  'Histoire-Géographie',
  'Éducation Civique et Morale',
  'Philosophie',
  'Éducation Physique et Sportive (EPS)',
  'Informatique',
  'Arts Plastiques',
  'Éducation Musicale',
  'Économie',
  'Comptabilité',
  'Gestion',
  'Droit',
  'Sciences Économiques et Sociales (SES)'
] as const;
