// Types pour la configuration de l'établissement scolaire

export type TypeEtablissement = 
  | 'public' 
  | 'prive' 
  | 'confessionnel' 
  | 'technique' 
  | 'professionnel'
  | 'prive_laic'
  | 'prive_confessionnel';

export type TypeEvaluation = 'trimestre' | 'semestre';

export type LangueDefaut = 'fr' | 'en' | 'es';

export type Cycle = 
  | 'prescolaire'
  | 'primaire' 
  | 'premier_cycle' 
  | 'second_cycle' 
  | 'technique' 
  | 'professionnel';

export type StatutJuridique = 
  | 'association'
  | 'entreprise_individuelle'
  | 'sarl'
  | 'sa'
  | 'fondation'
  | 'cooperative'
  | 'etat';

export type FonctionResponsable = 
  | 'fondateur'
  | 'directeur'
  | 'proviseur'
  | 'directeur_etudes'
  | 'principal'
  | 'censeur'
  | 'surveillant_general';

export interface IdentiteEtablissement {
  logo?: string; // Base64 ou URL
  nom: string;
  sigle?: string;
  type: TypeEtablissement;
  devise?: string;
  anneeCreation?: number;
}

export interface InformationsAdministratives {
  numeroAutorisation?: string;
  dateCreation?: string;
  ministereTutelle: string;
  inspection?: string; // DRENA ou IEP
  codeEtablissement?: string;
  statutJuridique: StatutJuridique;
  numeroAgrement?: string;
  numeroRegistreCommerce?: string;
  numeroContribuable?: string;
}

export interface LocalisationContacts {
  pays: string;
  ville: string;
  commune: string;
  quartier?: string;
  adresseComplete?: string;
  boitePostale?: string;
  telephonePrincipal: string;
  telephoneSecondaire?: string;
  emailOfficiel: string;
  siteWeb?: string;
  coordonneesGPS?: {
    latitude: number;
    longitude: number;
  };
}

export interface ResponsableEtablissement {
  nom: string;
  prenoms: string;
  fonction: FonctionResponsable;
  telephone: string;
  email: string;
  signatureScanee?: string; // Base64 ou URL
  photo?: string;
}

export interface ParametresPedagogiques {
  anneeScolaireEnCours: string;
  typeEvaluation: TypeEvaluation;
  noteMaximale: number;
  noteEliminatoire?: number;
  moyennePassage?: number;
  moyenneConduitePriseEnCompte: boolean;
  gestionLV2: ('espagnol' | 'allemand' | 'chinois' | 'arabe')[];
  options: ('art_plastique' | 'musique' | 'theatre' | 'informatique' | 'eps')[];
  cyclesPrisEnCharge: Cycle[];
  nombreTrimestresSemestres: number;
  heureDebutCours: string;
  heureFinCours: string;
  dureeRecreation: number; // en minutes
  joursOuvrables: ('lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi')[];
  langueParDefaut: LangueDefaut;
}

export interface SignataireDocuments {
  nomSignataire: string;
  fonctionSignataire: FonctionResponsable;
  ministereTutelleDocuments: string;
}

export interface FiligraneArchive {
  texte: string;
  couleur: string; // Format HSL ou HEX
  opacite: number; // 0-100
  taille: number; // Taille de police
  angle: number; // Angle de rotation
  afficherBandeau: boolean;
  couleurBandeau: string;
}

export interface ParametresSauvegarde {
  sauvegardeAutoActive: boolean;
  frequence: 'quotidienne' | 'hebdomadaire' | 'mensuelle';
  heureExecution: string;
  jourExecution?: number; // 0-6 pour hebdo, 1-31 pour mensuel
  retentionJours: number;
  notificationEmail: boolean;
  emailsNotification: string[];
  inclureMedias: boolean;
  compressionActivee: boolean;
  derniereExecution?: string;
  prochainExecution?: string;
}

export interface ParametresVisuels {
  couleurPrincipale: string;
  couleurSecondaire?: string;
  piedDePage: string;
  cachetScane?: string; // Base64 ou URL
  filigrane?: string;
  policeDocuments?: string;
  filigraneArchive: FiligraneArchive;
}

export interface HistoriqueModification {
  id: string;
  dateModification: string;
  utilisateur: string;
  champModifie: string;
  ancienneValeur?: string;
  nouvelleValeur?: string;
}

export interface SecuriteTracabilite {
  dateCreationConfig: string;
  utilisateurCreation: string;
  derniereModification?: string;
  utilisateurDerniereModification?: string;
  historiqueModifications: HistoriqueModification[];
  configurationVerrouillee: boolean;
  motDePasseVerrouillage?: string;
}

export interface ConfigurationEtablissement {
  id: string;
  identite: IdentiteEtablissement;
  administration: InformationsAdministratives;
  localisation: LocalisationContacts;
  responsable: ResponsableEtablissement;
  parametresPedagogiques: ParametresPedagogiques;
  parametresVisuels: ParametresVisuels;
  signataire: SignataireDocuments;
  securite: SecuriteTracabilite;
  parametresSauvegarde: ParametresSauvegarde;
}

// Configuration par défaut pour la Côte d'Ivoire
export const defaultConfiguration: ConfigurationEtablissement = {
  id: 'config-1',
  identite: {
    nom: '',
    type: 'prive',
  },
  administration: {
    ministereTutelle: 'Ministère de l\'Éducation Nationale et de l\'Alphabétisation',
    statutJuridique: 'entreprise_individuelle',
  },
  localisation: {
    pays: 'Côte d\'Ivoire',
    ville: '',
    commune: '',
    telephonePrincipal: '',
    emailOfficiel: '',
  },
  responsable: {
    nom: '',
    prenoms: '',
    fonction: 'directeur',
    telephone: '',
    email: '',
  },
  parametresPedagogiques: {
    anneeScolaireEnCours: '2024-2025',
    typeEvaluation: 'trimestre',
    noteMaximale: 20,
    moyennePassage: 10,
    moyenneConduitePriseEnCompte: false,
    gestionLV2: [],
    options: [],
    cyclesPrisEnCharge: [],
    nombreTrimestresSemestres: 3,
    heureDebutCours: '07:30',
    heureFinCours: '17:00',
    dureeRecreation: 15,
    joursOuvrables: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
    langueParDefaut: 'fr',
  },
  signataire: {
    nomSignataire: '',
    fonctionSignataire: 'directeur',
    ministereTutelleDocuments: "Ministère de l'Éducation Nationale et de l'Alphabétisation",
  },
  parametresVisuels: {
    couleurPrincipale: '#1e40af',
    piedDePage: '',
    filigraneArchive: {
      texte: 'ARCHIVE',
      couleur: '#c8c8c8',
      opacite: 30,
      taille: 60,
      angle: 45,
      afficherBandeau: true,
      couleurBandeau: '#dc3545',
    },
  },
  parametresSauvegarde: {
    sauvegardeAutoActive: true,
    frequence: 'quotidienne',
    heureExecution: '14:30',
    retentionJours: 30,
    notificationEmail: false,
    emailsNotification: [],
    inclureMedias: true,
    compressionActivee: true,
  },
  securite: {
    dateCreationConfig: new Date().toISOString(),
    utilisateurCreation: 'Admin',
    historiqueModifications: [],
    configurationVerrouillee: false,
  },
};

// Liste des DRENA de Côte d'Ivoire
export const listeDRENA = [
  'DRENA Abidjan 1',
  'DRENA Abidjan 2',
  'DRENA Abidjan 3',
  'DRENA Abidjan 4',
  'DRENA Abengourou',
  'DRENA Bondoukou',
  'DRENA Bouaflé',
  'DRENA Bouaké 1',
  'DRENA Bouaké 2',
  'DRENA Dabou',
  'DRENA Daloa 1',
  'DRENA Daloa 2',
  'DRENA Dimbokro',
  'DRENA Divo',
  'DRENA Duékoué',
  'DRENA Gagnoa',
  'DRENA Guiglo',
  'DRENA Korhogo',
  'DRENA Man',
  'DRENA Odienné',
  'DRENA San-Pédro',
  'DRENA Séguéla',
  'DRENA Soubré',
  'DRENA Yamoussoukro',
];

// Liste des villes de Côte d'Ivoire
export const villesCoteDIvoire = [
  'Abidjan',
  'Bouaké',
  'Daloa',
  'Yamoussoukro',
  'San-Pédro',
  'Korhogo',
  'Man',
  'Divo',
  'Gagnoa',
  'Abengourou',
  'Anyama',
  'Bingerville',
  'Grand-Bassam',
  'Agboville',
  'Dabou',
  'Dimbokro',
  'Bondoukou',
  'Séguéla',
  'Odienné',
  'Soubré',
  'Ferkessédougou',
  'Bouaflé',
  'Duékoué',
  'Sinfra',
  'Issia',
];

// Communes d'Abidjan
export const communesAbidjan = [
  'Abobo',
  'Adjamé',
  'Attécoubé',
  'Cocody',
  'Koumassi',
  'Marcory',
  'Plateau',
  'Port-Bouët',
  'Treichville',
  'Yopougon',
  'Bingerville',
  'Songon',
  'Anyama',
  'Grand-Bassam',
];
