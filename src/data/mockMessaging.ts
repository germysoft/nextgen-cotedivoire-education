// Mock data for messaging module

export interface Email {
  id: string;
  subject: string;
  to: string[];
  cc?: string[];
  content: string;
  template?: string;
  attachments: { name: string; size: string; type: string }[];
  status: 'draft' | 'sent' | 'scheduled' | 'failed';
  sentAt?: string;
  scheduledAt?: string;
  createdAt: string;
  openRate?: number;
  clickRate?: number;
  recipientCount: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'scolarite' | 'finance' | 'evenement' | 'discipline' | 'general';
  subject: string;
  content: string;
  variables: string[];
  usageCount: number;
  createdAt: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: 'parents' | 'enseignants' | 'eleves' | 'administration' | 'mixte';
  members: { id: string; name: string; email?: string; phone?: string }[];
}

export interface ForumDiscussion {
  id: string;
  title: string;
  author: { id: string; name: string; role: string; avatar?: string };
  category: string;
  content: string;
  createdAt: string;
  lastActivity: string;
  replies: ForumReply[];
  views: number;
  likes: number;
  isPinned: boolean;
  isLocked: boolean;
  status: 'active' | 'resolved' | 'closed';
  tags: string[];
}

export interface ForumReply {
  id: string;
  author: { id: string; name: string; role: string; avatar?: string };
  content: string;
  createdAt: string;
  likes: number;
  isAccepted?: boolean;
}

export interface ScheduledMessage {
  id: string;
  type: 'sms' | 'email' | 'notification';
  subject: string;
  content: string;
  recipients: string;
  recipientCount: number;
  scheduledAt: string;
  status: 'pending' | 'sent' | 'cancelled';
  createdBy: string;
}

// Email Templates
export const emailTemplates: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Convocation Réunion Parents',
    category: 'evenement',
    subject: 'Convocation: Réunion Parents-Professeurs du {{date}}',
    content: `Chers Parents,

Nous avons le plaisir de vous convier à la réunion parents-professeurs qui se tiendra le {{date}} à {{heure}} dans les locaux de l'établissement.

Cette réunion sera l'occasion de faire le point sur les résultats scolaires de votre enfant {{nom_eleve}} et d'échanger avec ses professeurs.

Ordre du jour:
- Bilan du trimestre
- Présentation des projets pédagogiques
- Questions diverses

Merci de confirmer votre présence en cliquant sur le lien ci-dessous.

Cordialement,
La Direction`,
    variables: ['date', 'heure', 'nom_eleve'],
    usageCount: 156,
    createdAt: '2024-09-01'
  },
  {
    id: 'tpl-2',
    name: 'Rappel Paiement Scolarité',
    category: 'finance',
    subject: 'Rappel: Échéance de paiement du {{date_echeance}}',
    content: `Cher(e) {{nom_parent}},

Nous vous rappelons que l'échéance de paiement de la scolarité de votre enfant {{nom_eleve}} arrive à terme le {{date_echeance}}.

Montant dû: {{montant}} FCFA

Vous pouvez effectuer le règlement:
- Sur place à la comptabilité de l'école
- Par virement bancaire (RIB disponible sur demande)
- Via Mobile Money (Orange, MTN, Moov)

En cas de difficulté, n'hésitez pas à nous contacter pour convenir d'un échéancier.

Cordialement,
Service Comptabilité`,
    variables: ['nom_parent', 'nom_eleve', 'date_echeance', 'montant'],
    usageCount: 234,
    createdAt: '2024-08-15'
  },
  {
    id: 'tpl-3',
    name: 'Publication Bulletin',
    category: 'scolarite',
    subject: 'Bulletin du {{trimestre}} disponible',
    content: `Chers Parents,

Le bulletin scolaire du {{trimestre}} de votre enfant {{nom_eleve}} (classe de {{classe}}) est désormais disponible.

Résumé:
- Moyenne générale: {{moyenne}}
- Rang: {{rang}}/{{effectif}}
- Appréciation générale: {{appreciation}}

Vous pouvez consulter le bulletin complet sur le portail parents avec vos identifiants personnels.

Pour toute question, le conseil de classe se tient à votre disposition.

Cordialement,
L'Équipe Pédagogique`,
    variables: ['trimestre', 'nom_eleve', 'classe', 'moyenne', 'rang', 'effectif', 'appreciation'],
    usageCount: 89,
    createdAt: '2024-10-01'
  },
  {
    id: 'tpl-4',
    name: 'Signalement Absence',
    category: 'discipline',
    subject: 'Signalement: Absence de {{nom_eleve}} le {{date}}',
    content: `Cher(e) {{nom_parent}},

Nous vous informons que votre enfant {{nom_eleve}} ({{classe}}) a été absent(e) ce jour {{date}}.

{{#si_non_justifie}}
Cette absence n'est pas justifiée à ce jour. Merci de nous faire parvenir un justificatif dans les plus brefs délais.
{{/si_non_justifie}}

Pour justifier cette absence, vous pouvez:
- Envoyer un mot écrit par le carnet de correspondance
- Envoyer un certificat médical par email
- Contacter le service de vie scolaire

Cordialement,
Vie Scolaire`,
    variables: ['nom_parent', 'nom_eleve', 'classe', 'date'],
    usageCount: 312,
    createdAt: '2024-07-20'
  },
  {
    id: 'tpl-5',
    name: 'Inscription Activité Parascolaire',
    category: 'evenement',
    subject: 'Inscription: {{nom_activite}}',
    content: `Chers Parents,

Les inscriptions pour l'activité "{{nom_activite}}" sont ouvertes!

Détails:
- Jours: {{jours}}
- Horaires: {{horaires}}
- Lieu: {{lieu}}
- Tarif: {{tarif}} FCFA/trimestre
- Places disponibles: {{places}}

Cette activité est encadrée par {{encadrant}}.

Pour inscrire votre enfant, merci de remplir le formulaire ci-joint et de le retourner à la vie scolaire avant le {{date_limite}}.

Cordialement,
Service Activités Parascolaires`,
    variables: ['nom_activite', 'jours', 'horaires', 'lieu', 'tarif', 'places', 'encadrant', 'date_limite'],
    usageCount: 67,
    createdAt: '2024-09-15'
  }
];

// Contact Groups
export const contactGroups: ContactGroup[] = [
  {
    id: 'grp-1',
    name: 'Tous les Parents',
    description: 'Ensemble des parents d\'élèves',
    memberCount: 465,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-2',
    name: 'Parents 6ème',
    description: 'Parents des élèves de 6ème',
    memberCount: 75,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-3',
    name: 'Parents 5ème',
    description: 'Parents des élèves de 5ème',
    memberCount: 80,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-4',
    name: 'Parents 4ème',
    description: 'Parents des élèves de 4ème',
    memberCount: 78,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-5',
    name: 'Parents 3ème',
    description: 'Parents des élèves de 3ème',
    memberCount: 82,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-6',
    name: 'Parents Seconde',
    description: 'Parents des élèves de Seconde',
    memberCount: 55,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-7',
    name: 'Parents Première',
    description: 'Parents des élèves de Première',
    memberCount: 48,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-8',
    name: 'Parents Terminale',
    description: 'Parents des élèves de Terminale',
    memberCount: 47,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-9',
    name: 'Enseignants',
    description: 'Corps professoral',
    memberCount: 32,
    type: 'enseignants',
    members: []
  },
  {
    id: 'grp-10',
    name: 'Parents Impayés',
    description: 'Parents avec paiement en retard',
    memberCount: 65,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-11',
    name: 'Délégués Parents',
    description: 'Représentants des parents par classe',
    memberCount: 24,
    type: 'parents',
    members: []
  },
  {
    id: 'grp-12',
    name: 'Administration',
    description: 'Personnel administratif',
    memberCount: 12,
    type: 'administration',
    members: []
  }
];

// Sent Emails
export const sentEmails: Email[] = [
  {
    id: 'email-1',
    subject: 'Convocation: Réunion Parents-Professeurs du 20 décembre',
    to: ['Parents 6ème A'],
    content: 'Chers Parents, nous avons le plaisir de vous convier...',
    template: 'Convocation Réunion Parents',
    attachments: [{ name: 'ordre_du_jour.pdf', size: '125 Ko', type: 'pdf' }],
    status: 'sent',
    sentAt: '2024-12-10 09:30',
    createdAt: '2024-12-10 09:15',
    openRate: 78,
    clickRate: 45,
    recipientCount: 25
  },
  {
    id: 'email-2',
    subject: 'Rappel: Échéance de paiement du 15 décembre',
    to: ['Parents Impayés'],
    content: 'Cher(e) Parent, Nous vous rappelons que l\'échéance...',
    template: 'Rappel Paiement Scolarité',
    attachments: [],
    status: 'sent',
    sentAt: '2024-12-08 14:00',
    createdAt: '2024-12-08 13:45',
    openRate: 92,
    clickRate: 28,
    recipientCount: 65
  },
  {
    id: 'email-3',
    subject: 'Bulletin du 1er Trimestre disponible',
    to: ['Tous les Parents'],
    content: 'Chers Parents, Le bulletin scolaire du 1er Trimestre...',
    template: 'Publication Bulletin',
    attachments: [],
    status: 'sent',
    sentAt: '2024-12-05 16:00',
    createdAt: '2024-12-05 15:30',
    openRate: 85,
    clickRate: 72,
    recipientCount: 465
  },
  {
    id: 'email-4',
    subject: 'Vacances de Noël - Informations importantes',
    to: ['Tous les Parents', 'Enseignants'],
    content: 'Chers Parents et Enseignants, Les vacances de Noël...',
    attachments: [{ name: 'calendrier_vacances.pdf', size: '98 Ko', type: 'pdf' }],
    status: 'scheduled',
    scheduledAt: '2024-12-18 08:00',
    createdAt: '2024-12-10 11:00',
    recipientCount: 497
  },
  {
    id: 'email-5',
    subject: 'Inscription Activités Parascolaires - 2ème Trimestre',
    to: ['Tous les Parents'],
    content: 'Chers Parents, Les inscriptions pour les activités...',
    template: 'Inscription Activité Parascolaire',
    attachments: [
      { name: 'liste_activites.pdf', size: '256 Ko', type: 'pdf' },
      { name: 'formulaire_inscription.pdf', size: '89 Ko', type: 'pdf' }
    ],
    status: 'draft',
    createdAt: '2024-12-11 10:00',
    recipientCount: 465
  }
];

// Forum Discussions
export const forumDiscussions: ForumDiscussion[] = [
  {
    id: 'disc-1',
    title: 'Organisation de la sortie pédagogique à Grand-Bassam',
    author: { id: 'u1', name: 'Mme DIALLO Aminata', role: 'Professeur d\'Histoire-Géo' },
    category: 'Pédagogie',
    content: `Chers collègues,

Je propose d'organiser une sortie pédagogique à Grand-Bassam pour les classes de 3ème dans le cadre du programme d'histoire.

Objectifs:
- Découverte du patrimoine historique colonial
- Visite du musée national du costume
- Sensibilisation à la préservation du patrimoine

Date proposée: 15 janvier 2025
Budget estimé: 15 000 FCFA/élève (transport + entrées)

Qu'en pensez-vous? Des suggestions?`,
    createdAt: '2024-12-08 14:30',
    lastActivity: '2024-12-11 16:45',
    replies: [
      {
        id: 'rep-1',
        author: { id: 'u2', name: 'M. KONE Ibrahim', role: 'Professeur de SVT' },
        content: 'Excellente idée! On pourrait aussi prévoir une visite de la lagune pour les aspects environnementaux.',
        createdAt: '2024-12-08 15:20',
        likes: 5
      },
      {
        id: 'rep-2',
        author: { id: 'u3', name: 'M. KOUADIO Jean', role: 'Surveillant Général' },
        content: 'Pour l\'encadrement, il faudra prévoir au moins 4 accompagnateurs pour 80 élèves.',
        createdAt: '2024-12-09 08:15',
        likes: 3
      },
      {
        id: 'rep-3',
        author: { id: 'u4', name: 'Mme BAMBA Fatoumata', role: 'Directrice Adjointe' },
        content: 'Le budget est validé. Prière de soumettre la liste des accompagnateurs avant vendredi.',
        createdAt: '2024-12-11 16:45',
        likes: 8,
        isAccepted: true
      }
    ],
    views: 156,
    likes: 24,
    isPinned: true,
    isLocked: false,
    status: 'active',
    tags: ['sortie', 'histoire', '3ème']
  },
  {
    id: 'disc-2',
    title: 'Révision du programme de SVT - Classes de Terminale',
    author: { id: 'u2', name: 'M. KONE Ibrahim', role: 'Professeur de SVT' },
    category: 'Pédagogie',
    content: `Bonjour à tous,

Suite aux dernières directives du ministère, je souhaite partager les modifications apportées au programme de SVT pour les terminales scientifiques.

Points clés:
1. Nouveau chapitre sur la génétique moléculaire
2. Renforcement de la partie écologie
3. Suppression du chapitre sur la reproduction végétale

Je propose une réunion de coordination pour aligner nos cours. Disponibilités?`,
    createdAt: '2024-12-06 10:00',
    lastActivity: '2024-12-10 11:30',
    replies: [
      {
        id: 'rep-4',
        author: { id: 'u5', name: 'M. TRAORE Moussa', role: 'Professeur de SVT' },
        content: 'Merci pour ces informations. Je suis disponible mercredi après 15h.',
        createdAt: '2024-12-07 09:45',
        likes: 2
      }
    ],
    views: 89,
    likes: 12,
    isPinned: false,
    isLocked: false,
    status: 'active',
    tags: ['programme', 'SVT', 'terminale']
  },
  {
    id: 'disc-3',
    title: 'Gestion des retards répétés - Solutions proposées',
    author: { id: 'u3', name: 'M. KOUADIO Jean', role: 'Surveillant Général' },
    category: 'Discipline',
    content: `Chers collègues,

Face à l'augmentation des retards, notamment le lundi matin, je propose les mesures suivantes:

1. Fermeture du portail à 7h30 précises
2. Mise en place d'une salle d'attente pour les retardataires
3. Travail obligatoire pendant l'heure manquée
4. Convocation des parents après 3 retards

Ces mesures seront appliquées dès janvier. Vos avis?`,
    createdAt: '2024-12-01 11:00',
    lastActivity: '2024-12-05 14:20',
    replies: [
      {
        id: 'rep-5',
        author: { id: 'u6', name: 'M. KOFFI Yao', role: 'Professeur de Maths' },
        content: 'Je soutiens ces mesures. Les retards perturbent vraiment le début des cours.',
        createdAt: '2024-12-02 08:30',
        likes: 15
      },
      {
        id: 'rep-6',
        author: { id: 'u1', name: 'Mme DIALLO Aminata', role: 'Professeur d\'Histoire-Géo' },
        content: 'Peut-être faudrait-il aussi communiquer en amont avec les parents sur le nouveau règlement.',
        createdAt: '2024-12-03 16:00',
        likes: 8
      }
    ],
    views: 234,
    likes: 28,
    isPinned: false,
    isLocked: true,
    status: 'resolved',
    tags: ['discipline', 'retards', 'règlement']
  },
  {
    id: 'disc-4',
    title: 'Proposition: Club de lecture inter-classes',
    author: { id: 'u7', name: 'Mme TOURE Mariam', role: 'Professeur de Français' },
    category: 'Activités',
    content: `Bonjour à tous,

J'aimerais lancer un club de lecture pour encourager la lecture chez nos élèves.

Concept:
- Réunions hebdomadaires (mercredi 14h-15h)
- Un livre par mois à lire ensemble
- Discussions, débats, présentations
- Concours de lecture avec prix

Budget nécessaire: 100 000 FCFA pour l'achat des premiers livres.

Qui serait intéressé pour m'aider dans cette initiative?`,
    createdAt: '2024-12-09 09:00',
    lastActivity: '2024-12-11 10:15',
    replies: [
      {
        id: 'rep-7',
        author: { id: 'u8', name: 'M. SORO Lacina', role: 'Bibliothécaire' },
        content: 'Excellente idée! La bibliothèque peut mettre à disposition un espace et quelques ouvrages.',
        createdAt: '2024-12-10 14:30',
        likes: 6
      }
    ],
    views: 67,
    likes: 18,
    isPinned: false,
    isLocked: false,
    status: 'active',
    tags: ['club', 'lecture', 'activité']
  },
  {
    id: 'disc-5',
    title: 'Planification des examens du 2ème trimestre',
    author: { id: 'u6', name: 'M. KOFFI Yao', role: 'Coordinateur Pédagogique' },
    category: 'Examens',
    content: `Chers collègues,

Le planning des compositions du 2ème trimestre est en cours d'élaboration.

Dates clés:
- Dépôt des sujets: 15 janvier
- Début des compositions: 20 janvier
- Fin des compositions: 31 janvier
- Conseils de classe: 3-7 février

Merci de me transmettre vos disponibilités pour les surveillances.`,
    createdAt: '2024-12-10 08:00',
    lastActivity: '2024-12-11 17:00',
    replies: [
      {
        id: 'rep-8',
        author: { id: 'u9', name: 'M. DIABATE Sekou', role: 'Professeur de Physique' },
        content: 'Pour les sujets, est-ce qu\'on peut avoir un format type à respecter?',
        createdAt: '2024-12-10 10:00',
        likes: 3
      },
      {
        id: 'rep-9',
        author: { id: 'u6', name: 'M. KOFFI Yao', role: 'Coordinateur Pédagogique' },
        content: 'Oui, je vous envoie le modèle par email cet après-midi.',
        createdAt: '2024-12-10 14:00',
        likes: 1
      }
    ],
    views: 312,
    likes: 35,
    isPinned: true,
    isLocked: false,
    status: 'active',
    tags: ['examens', 'planning', 'T2']
  }
];

// Scheduled Messages
export const scheduledMessages: ScheduledMessage[] = [
  {
    id: 'sched-1',
    type: 'email',
    subject: 'Vacances de Noël - Informations importantes',
    content: 'Chers Parents et Enseignants, Les vacances de Noël...',
    recipients: 'Tous les Parents + Enseignants',
    recipientCount: 497,
    scheduledAt: '2024-12-18 08:00',
    status: 'pending',
    createdBy: 'M. OUATTARA'
  },
  {
    id: 'sched-2',
    type: 'sms',
    subject: 'Rappel rentrée janvier',
    content: 'Rappel: La rentrée scolaire est fixée au lundi 6 janvier 2025 à 7h30.',
    recipients: 'Tous les Parents',
    recipientCount: 465,
    scheduledAt: '2025-01-05 09:00',
    status: 'pending',
    createdBy: 'Mme BAMBA'
  },
  {
    id: 'sched-3',
    type: 'notification',
    subject: 'Paiement T2',
    content: 'Rappel: L\'échéance du paiement du 2ème trimestre est le 15 janvier.',
    recipients: 'Parents avec solde dû',
    recipientCount: 180,
    scheduledAt: '2025-01-10 10:00',
    status: 'pending',
    createdBy: 'Service Comptabilité'
  }
];

// Forum Categories
export const forumCategories = [
  { id: 'cat-1', name: 'Pédagogie', count: 45, color: 'hsl(var(--primary))' },
  { id: 'cat-2', name: 'Discipline', count: 23, color: 'hsl(var(--destructive))' },
  { id: 'cat-3', name: 'Activités', count: 18, color: 'hsl(var(--chart-2))' },
  { id: 'cat-4', name: 'Examens', count: 34, color: 'hsl(var(--chart-3))' },
  { id: 'cat-5', name: 'Général', count: 56, color: 'hsl(var(--muted-foreground))' }
];

// Email Statistics
export const emailStatistics = {
  today: { sent: 45, opened: 38, clicked: 12 },
  thisWeek: { sent: 234, opened: 198, clicked: 67 },
  thisMonth: { sent: 856, opened: 712, clicked: 245 },
  openRate: 83.2,
  clickRate: 28.7,
  bounceRate: 2.1,
  byCategory: [
    { name: 'Scolarité', sent: 312, openRate: 88 },
    { name: 'Finance', sent: 234, openRate: 92 },
    { name: 'Événements', sent: 178, openRate: 75 },
    { name: 'Discipline', sent: 89, openRate: 95 },
    { name: 'Général', sent: 43, openRate: 68 }
  ],
  evolution: [
    { month: 'Sep', sent: 320, opened: 275 },
    { month: 'Oct', sent: 456, opened: 389 },
    { month: 'Nov', sent: 523, opened: 445 },
    { month: 'Déc', sent: 378, opened: 312 }
  ]
};
