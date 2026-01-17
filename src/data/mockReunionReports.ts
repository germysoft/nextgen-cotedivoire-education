import { StoredReport } from '@/hooks/useReportStorage';

export const mockReunionReports: StoredReport[] = [
  {
    id: 'report_demo_001',
    titre: 'Conseil de Classe 3ème A - 1er Trimestre',
    type: 'conseil_classe',
    date: '2026-01-10',
    heureDebut: '14:00',
    heureFin: '16:30',
    lieu: 'Salle de conférence A',
    president: 'M. Kouamé Yao',
    secretaire: 'Mme Bamba Awa',
    participants: [
      { nom: 'M. Diallo Moussa', fonction: 'Professeur de Mathématiques', present: true },
      { nom: 'Mme Koné Fatou', fonction: 'Professeur de Français', present: true },
      { nom: 'M. Traoré Ibrahim', fonction: 'Professeur de Sciences', present: true },
      { nom: 'Mme Coulibaly Marie', fonction: 'Déléguée des parents', present: true },
      { nom: 'M. Ouattara Seydou', fonction: 'Délégué des élèves', present: false },
    ],
    ordreJour: [
      'Bilan du premier trimestre',
      'Résultats scolaires par matière',
      'Cas particuliers d\'élèves',
      'Préparation du deuxième trimestre',
    ],
    discussions: [
      {
        sujet: 'Bilan général du trimestre',
        intervenant: 'M. Kouamé Yao',
        contenu: 'Le trimestre s\'est bien déroulé avec une moyenne de classe de 12.5/20. Quelques difficultés ont été observées en mathématiques.',
      },
      {
        sujet: 'Cas des élèves en difficulté',
        intervenant: 'Mme Koné Fatou',
        contenu: 'Trois élèves nécessitent un suivi particulier. Des cours de soutien seront mis en place.',
      },
    ],
    decisions: [
      {
        numero: 1,
        description: 'Mise en place de cours de soutien en mathématiques',
        responsable: 'M. Diallo Moussa',
        echeance: '2026-01-20',
      },
      {
        numero: 2,
        description: 'Rencontre avec les parents des élèves en difficulté',
        responsable: 'M. Kouamé Yao',
        echeance: '2026-01-25',
      },
    ],
    pointsDivers: ['Organisation de la journée portes ouvertes'],
    electronicSignatures: [
      {
        id: 'sig_demo_001',
        signerName: 'M. Kouamé Yao',
        signerRole: 'president',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signedAt: '2026-01-10T17:00:00.000Z',
        verified: true,
      },
    ],
    createdAt: '2026-01-10T14:00:00.000Z',
    updatedAt: '2026-01-10T17:00:00.000Z',
    version: 2,
    status: 'finalized',
    emailsSent: [],
  },
  {
    id: 'report_demo_002',
    titre: 'Réunion Parents-Professeurs Terminale S',
    type: 'reunion_parents',
    date: '2026-01-12',
    heureDebut: '17:00',
    heureFin: '19:00',
    lieu: 'Amphithéâtre principal',
    president: 'Mme Aka Christelle',
    secretaire: 'M. N\'Guessan Paul',
    participants: [
      { nom: 'M. Konan Pierre', fonction: 'Professeur principal', present: true },
      { nom: 'Mme Yao Sylvie', fonction: 'Professeur de Physique', present: true },
      { nom: 'M. Esso Jean', fonction: 'Parent délégué', present: true },
      { nom: 'Mme Koffi Adèle', fonction: 'Parent délégué', present: true },
      { nom: 'M. Brou Alain', fonction: 'Professeur de Philosophie', present: true },
    ],
    ordreJour: [
      'Présentation de l\'année scolaire',
      'Préparation au Baccalauréat',
      'Planning des examens blancs',
      'Questions diverses',
    ],
    discussions: [
      {
        sujet: 'Préparation au Baccalauréat',
        intervenant: 'M. Konan Pierre',
        contenu: 'Les révisions intensives commenceront en mars. Des sessions de préparation aux épreuves orales sont prévues.',
      },
    ],
    decisions: [
      {
        numero: 1,
        description: 'Organisation d\'un bac blanc en février',
        responsable: 'Mme Aka Christelle',
        echeance: '2026-02-15',
      },
    ],
    pointsDivers: [],
    electronicSignatures: [
      {
        id: 'sig_demo_002',
        signerName: 'Mme Aka Christelle',
        signerRole: 'president',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signedAt: '2026-01-12T19:30:00.000Z',
        verified: true,
      },
      {
        id: 'sig_demo_003',
        signerName: 'M. N\'Guessan Paul',
        signerRole: 'secretaire',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signedAt: '2026-01-12T19:35:00.000Z',
        verified: true,
      },
    ],
    createdAt: '2026-01-12T17:00:00.000Z',
    updatedAt: '2026-01-12T19:35:00.000Z',
    version: 3,
    status: 'sent',
    emailsSent: [
      {
        date: '2026-01-13T08:00:00.000Z',
        recipients: ['parents-terminale@lycee.ci'],
      },
    ],
  },
  {
    id: 'report_demo_003',
    titre: 'Réunion Pédagogique - Nouvelles Méthodes',
    type: 'reunion_pedagogique',
    date: '2026-01-14',
    heureDebut: '09:00',
    heureFin: '12:00',
    lieu: 'Salle des professeurs',
    president: 'M. Dosso Mamadou',
    secretaire: 'Mme Sanogo Aminata',
    participants: [
      { nom: 'M. Cissé Oumar', fonction: 'Coordinateur pédagogique', present: true },
      { nom: 'Mme Diabaté Fanta', fonction: 'Professeur référent', present: true },
      { nom: 'M. Kouyaté Lamine', fonction: 'Professeur de Mathématiques', present: true },
      { nom: 'Mme Sidibé Rokia', fonction: 'Professeur de Langues', present: true },
    ],
    ordreJour: [
      'Introduction aux méthodes actives',
      'Utilisation des outils numériques',
      'Retour d\'expérience',
    ],
    discussions: [
      {
        sujet: 'Méthodes actives en classe',
        intervenant: 'M. Cissé Oumar',
        contenu: 'Présentation des techniques de classe inversée et d\'apprentissage par projet.',
      },
      {
        sujet: 'Outils numériques',
        intervenant: 'Mme Diabaté Fanta',
        contenu: 'Formation sur l\'utilisation des tablettes et du tableau interactif.',
      },
    ],
    decisions: [
      {
        numero: 1,
        description: 'Formation continue sur les outils numériques',
        responsable: 'M. Cissé Oumar',
        echeance: '2026-02-01',
      },
      {
        numero: 2,
        description: 'Expérimentation de la classe inversée en 2nde',
        responsable: 'M. Kouyaté Lamine',
        echeance: '2026-02-15',
      },
    ],
    pointsDivers: ['Achat de nouveaux équipements'],
    electronicSignatures: [],
    createdAt: '2026-01-14T09:00:00.000Z',
    updatedAt: '2026-01-14T12:00:00.000Z',
    version: 1,
    status: 'draft',
    emailsSent: [],
  },
  {
    id: 'report_demo_004',
    titre: 'Conseil d\'Administration - Budget 2026',
    type: 'reunion_administrative',
    date: '2026-01-08',
    heureDebut: '10:00',
    heureFin: '13:00',
    lieu: 'Salle du conseil',
    president: 'M. Touré Abdoulaye',
    secretaire: 'Mme Keita Mariam',
    participants: [
      { nom: 'M. Soro Lacina', fonction: 'Directeur financier', present: true },
      { nom: 'Mme Bah Oumou', fonction: 'Représentante des parents', present: true },
      { nom: 'M. Camara Sékou', fonction: 'Représentant des enseignants', present: true },
      { nom: 'M. Fofana Drissa', fonction: 'Intendant', present: true },
      { nom: 'Mme Diarra Aïcha', fonction: 'Comptable', present: true },
    ],
    ordreJour: [
      'Approbation du budget 2026',
      'Projets d\'investissement',
      'Bilan financier 2025',
      'Questions diverses',
    ],
    discussions: [
      {
        sujet: 'Budget 2026',
        intervenant: 'M. Soro Lacina',
        contenu: 'Présentation du budget prévisionnel avec une augmentation de 5% pour les équipements pédagogiques.',
      },
      {
        sujet: 'Projets d\'investissement',
        intervenant: 'M. Fofana Drissa',
        contenu: 'Proposition de rénovation de la bibliothèque et d\'aménagement d\'une salle informatique.',
      },
    ],
    decisions: [
      {
        numero: 1,
        description: 'Approbation du budget 2026 à l\'unanimité',
        responsable: 'M. Touré Abdoulaye',
        echeance: '2026-01-15',
      },
      {
        numero: 2,
        description: 'Lancement de l\'appel d\'offres pour la rénovation',
        responsable: 'M. Fofana Drissa',
        echeance: '2026-02-01',
      },
      {
        numero: 3,
        description: 'Audit des comptes 2025',
        responsable: 'Mme Diarra Aïcha',
        echeance: '2026-01-31',
      },
    ],
    pointsDivers: ['Recrutement d\'un assistant administratif'],
    electronicSignatures: [
      {
        id: 'sig_demo_004',
        signerName: 'M. Touré Abdoulaye',
        signerRole: 'president',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signedAt: '2026-01-08T13:30:00.000Z',
        verified: true,
      },
      {
        id: 'sig_demo_005',
        signerName: 'Mme Keita Mariam',
        signerRole: 'secretaire',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signedAt: '2026-01-08T13:35:00.000Z',
        verified: true,
      },
      {
        id: 'sig_demo_006',
        signerName: 'M. Soro Lacina',
        signerRole: 'participant',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signedAt: '2026-01-08T13:40:00.000Z',
        verified: true,
      },
      {
        id: 'sig_demo_007',
        signerName: 'Mme Bah Oumou',
        signerRole: 'participant',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signedAt: '2026-01-08T13:45:00.000Z',
        verified: true,
      },
    ],
    createdAt: '2026-01-08T10:00:00.000Z',
    updatedAt: '2026-01-08T13:45:00.000Z',
    version: 4,
    status: 'sent',
    emailsSent: [
      {
        date: '2026-01-09T09:00:00.000Z',
        recipients: ['conseil@lycee.ci', 'direction@lycee.ci'],
      },
    ],
  },
  {
    id: 'report_demo_005',
    titre: 'Conseil de Classe 6ème B - 1er Trimestre',
    type: 'conseil_classe',
    date: '2025-12-20',
    heureDebut: '15:00',
    heureFin: '17:00',
    lieu: 'Salle B12',
    president: 'Mme Zadi Hortense',
    secretaire: 'M. Gnamba Serge',
    participants: [
      { nom: 'M. Assié Didier', fonction: 'Professeur de Français', present: true },
      { nom: 'Mme Yapi Clarisse', fonction: 'Professeur de Mathématiques', present: true },
      { nom: 'M. Brou Martial', fonction: 'Professeur d\'Anglais', present: true },
      { nom: 'Mme Kassi Jeannette', fonction: 'Déléguée des parents', present: true },
    ],
    ordreJour: [
      'Bilan du trimestre',
      'Adaptation des élèves au collège',
      'Résultats par matière',
    ],
    discussions: [
      {
        sujet: 'Adaptation au collège',
        intervenant: 'Mme Zadi Hortense',
        contenu: 'La majorité des élèves s\'est bien adaptée. Quelques difficultés d\'organisation constatées.',
      },
    ],
    decisions: [
      {
        numero: 1,
        description: 'Mise en place d\'un carnet de suivi',
        responsable: 'M. Assié Didier',
        echeance: '2026-01-10',
      },
    ],
    pointsDivers: [],
    electronicSignatures: [],
    createdAt: '2025-12-20T15:00:00.000Z',
    updatedAt: '2025-12-20T17:00:00.000Z',
    version: 1,
    status: 'draft',
    emailsSent: [],
  },
];

// Function to seed demo data
export const seedDemoReports = () => {
  const STORAGE_KEY = 'reunion_reports';
  const existingData = localStorage.getItem(STORAGE_KEY);
  
  if (!existingData || JSON.parse(existingData).length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockReunionReports));
    return mockReunionReports.length;
  }
  
  return 0;
};

// Function to add demo tokens for public signing
export const seedDemoSigningTokens = () => {
  const TOKENS_KEY = 'public_signing_tokens';
  const existingTokens = localStorage.getItem(TOKENS_KEY);
  
  if (!existingTokens || JSON.parse(existingTokens).length === 0) {
    const demoTokens = [
      {
        id: 'demo-token-001',
        documentId: 'report_demo_001',
        documentTitle: 'Conseil de Classe 3ème A - 1er Trimestre',
        signerName: 'Mme Bamba Awa',
        signerRole: 'secretaire',
        signerEmail: 'bamba.awa@lycee.ci',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        signed: false,
      },
      {
        id: 'demo-token-002',
        documentId: 'report_demo_003',
        documentTitle: 'Réunion Pédagogique - Nouvelles Méthodes',
        signerName: 'M. Dosso Mamadou',
        signerRole: 'president',
        signerEmail: 'dosso.mamadou@lycee.ci',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        signed: false,
      },
      {
        id: 'demo-token-003',
        documentId: 'report_demo_003',
        documentTitle: 'Réunion Pédagogique - Nouvelles Méthodes',
        signerName: 'Mme Sanogo Aminata',
        signerRole: 'secretaire',
        signerEmail: 'sanogo.aminata@lycee.ci',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        signed: false,
      },
      {
        id: 'demo-token-004',
        documentId: 'report_demo_005',
        documentTitle: 'Conseil de Classe 6ème B - 1er Trimestre',
        signerName: 'Mme Zadi Hortense',
        signerRole: 'president',
        signerEmail: 'zadi.hortense@lycee.ci',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        signed: false,
      },
    ];
    
    localStorage.setItem(TOKENS_KEY, JSON.stringify(demoTokens));
    return demoTokens.length;
  }
  
  return 0;
};

// Initialize all demo data
export const initializeDemoData = () => {
  const reportsCount = seedDemoReports();
  const tokensCount = seedDemoSigningTokens();
  
  return { reportsCount, tokensCount };
};
