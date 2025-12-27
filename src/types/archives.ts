export interface AnneeScolaire {
  id: string;
  libelle: string; // "2023-2024"
  dateDebut: string;
  dateFin: string;
  statut: 'active' | 'archivee' | 'en_cours_archivage';
  dateArchivage?: string;
  tailleDonnees?: string;
  nombreEleves?: number;
  nombreClasses?: number;
  nombreEnseignants?: number;
}

export interface AccesArchive {
  id: string;
  utilisateur: string;
  role: string;
  anneeScolaire: string;
  dateAcces: string;
  action: 'connexion' | 'consultation' | 'export' | 'impression';
  details?: string;
}

export interface DocumentArchive {
  type: 'bulletin' | 'certificat' | 'attestation' | 'releve' | 'autre';
  label: string;
}

export const documentsDisponibles: DocumentArchive[] = [
  { type: 'bulletin', label: 'Bulletins de notes' },
  { type: 'certificat', label: 'Certificats de scolarité' },
  { type: 'attestation', label: 'Attestations' },
  { type: 'releve', label: 'Relevés de notes' },
  { type: 'autre', label: 'Autres documents officiels' },
];

export const mockAnneesScolaires: AnneeScolaire[] = [
  {
    id: 'as-2024-2025',
    libelle: '2024-2025',
    dateDebut: '2024-09-02',
    dateFin: '2025-07-31',
    statut: 'active',
    nombreEleves: 1250,
    nombreClasses: 42,
    nombreEnseignants: 85,
    tailleDonnees: '2.4 GB',
  },
  {
    id: 'as-2023-2024',
    libelle: '2023-2024',
    dateDebut: '2023-09-04',
    dateFin: '2024-07-31',
    statut: 'archivee',
    dateArchivage: '2024-08-15',
    nombreEleves: 1180,
    nombreClasses: 40,
    nombreEnseignants: 82,
    tailleDonnees: '3.8 GB',
  },
  {
    id: 'as-2022-2023',
    libelle: '2022-2023',
    dateDebut: '2022-09-05',
    dateFin: '2023-07-31',
    statut: 'archivee',
    dateArchivage: '2023-08-20',
    nombreEleves: 1120,
    nombreClasses: 38,
    nombreEnseignants: 78,
    tailleDonnees: '3.5 GB',
  },
  {
    id: 'as-2021-2022',
    libelle: '2021-2022',
    dateDebut: '2021-09-06',
    dateFin: '2022-07-31',
    statut: 'archivee',
    dateArchivage: '2022-08-18',
    nombreEleves: 1050,
    nombreClasses: 36,
    nombreEnseignants: 75,
    tailleDonnees: '3.2 GB',
  },
];

export const mockAccesArchives: AccesArchive[] = [
  {
    id: 'acc-1',
    utilisateur: 'M. Kouassi Jean',
    role: 'Directeur',
    anneeScolaire: '2023-2024',
    dateAcces: '2024-12-20T10:30:00',
    action: 'consultation',
    details: 'Consultation dossier élève KONE Amadou',
  },
  {
    id: 'acc-2',
    utilisateur: 'Mme Yao Marie',
    role: 'Secrétaire',
    anneeScolaire: '2022-2023',
    dateAcces: '2024-12-18T14:15:00',
    action: 'impression',
    details: 'Impression bulletin Trimestre 3 - DIALLO Fatou',
  },
  {
    id: 'acc-3',
    utilisateur: 'M. Traoré Ibrahim',
    role: 'Administrateur',
    anneeScolaire: '2023-2024',
    dateAcces: '2024-12-15T09:00:00',
    action: 'export',
    details: 'Export liste élèves classe 6ème A',
  },
];
