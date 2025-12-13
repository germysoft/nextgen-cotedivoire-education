// Mock data for Extracurricular Activities

export interface ClubMember {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  joinDate: string;
  role: 'member' | 'leader' | 'secretary' | 'treasurer';
  attendance: number;
  photo: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  supervisor: string;
  supervisorEmail: string;
  category: 'Culture' | 'Technologie' | 'Sciences' | 'Arts' | 'Citoyenneté' | 'Langues';
  members: ClubMember[];
  maxMembers: number;
  schedule: string;
  room: string;
  budget: number;
  budgetUsed: number;
  createdDate: string;
  status: 'active' | 'inactive' | 'suspended';
  activities: ClubActivity[];
  icon: string;
}

export interface ClubActivity {
  id: string;
  title: string;
  date: string;
  description: string;
  participantsCount: number;
  photos?: string[];
}

export interface SportTeam {
  id: string;
  sport: string;
  coach: string;
  coachPhone: string;
  level: 'Débutant' | 'Régional' | 'National' | 'Excellence';
  trainingSchedule: TrainingSession[];
  players: TeamPlayer[];
  maxPlayers: number;
  budget: number;
  budgetUsed: number;
  equipment: string[];
  competitions: Competition[];
  icon: string;
}

export interface TeamPlayer {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  position: string;
  jerseyNumber?: number;
  gender: 'M' | 'F';
  joinDate: string;
  performance: 'Excellent' | 'Bon' | 'Moyen' | 'À améliorer';
  photo: string;
}

export interface TrainingSession {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface Competition {
  id: string;
  name: string;
  date: string;
  location: string;
  opponent?: string;
  result?: string;
  ranking?: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  type: 'Culture' | 'Sport' | 'Académique' | 'Social' | 'Cérémonie';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  budget: number;
  budgetUsed: number;
  maxParticipants: number;
  registrations: EventRegistration[];
  status: 'draft' | 'open' | 'closed' | 'ongoing' | 'completed' | 'cancelled';
  requiresRegistration: boolean;
  targetAudience: string[];
  program?: string;
}

export interface EventRegistration {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  attended?: boolean;
}

export interface BudgetTransaction {
  id: string;
  activityType: 'club' | 'sport' | 'event';
  activityId: string;
  activityName: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  approvedBy?: string;
}

// Mock Club Members
const generateClubMembers = (count: number, clubName: string): ClubMember[] => {
  const names = [
    'Koné Amadou', 'Touré Fatoumata', 'Diallo Ibrahim', 'Coulibaly Mariam',
    'Bamba Moussa', 'Traoré Aminata', 'Ouattara Youssouf', 'Sanogo Kadiatou',
    'Konaté Sekou', 'Diabaté Aissata', 'Cissé Mamadou', 'Fofana Rokia'
  ];
  const classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];
  const roles: ClubMember['role'][] = ['member', 'leader', 'secretary', 'treasurer'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `member-${clubName}-${i + 1}`,
    studentId: `STU${1000 + i}`,
    studentName: names[i % names.length],
    class: classes[i % classes.length],
    joinDate: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    role: i === 0 ? 'leader' : i === 1 ? 'secretary' : i === 2 ? 'treasurer' : 'member',
    attendance: Math.floor(Math.random() * 30) + 70,
    photo: `https://images.unsplash.com/photo-${1507003211169 + i * 100}-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`
  }));
};

// Mock Activities
const generateClubActivities = (count: number): ClubActivity[] => {
  const activities = [
    'Répétition générale', 'Atelier créatif', 'Sortie culturelle', 'Compétition interne',
    'Formation', 'Exposition', 'Présentation', 'Réunion mensuelle'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i + 1}`,
    title: activities[i % activities.length],
    date: `2024-${String(Math.floor(Math.random() * 3) + 10).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    description: `Description de l'activité ${i + 1}`,
    participantsCount: Math.floor(Math.random() * 20) + 10
  }));
};

export const mockClubs: Club[] = [
  {
    id: 'club-1',
    name: 'Club Théâtre',
    description: 'Club de théâtre et d\'arts dramatiques. Représentations annuelles et ateliers d\'expression.',
    supervisor: 'Mme Diallo Aminata',
    supervisorEmail: 'a.diallo@ecole.ci',
    category: 'Arts',
    members: generateClubMembers(25, 'theatre'),
    maxMembers: 30,
    schedule: 'Mercredi 15h-17h',
    room: 'Salle Polyvalente',
    budget: 500000,
    budgetUsed: 320000,
    createdDate: '2022-09-01',
    status: 'active',
    activities: generateClubActivities(8),
    icon: 'Theater'
  },
  {
    id: 'club-2',
    name: 'Club Informatique',
    description: 'Apprentissage de la programmation, robotique et nouvelles technologies.',
    supervisor: 'M. Kouassi Jean',
    supervisorEmail: 'j.kouassi@ecole.ci',
    category: 'Technologie',
    members: generateClubMembers(30, 'info'),
    maxMembers: 35,
    schedule: 'Jeudi 16h-18h',
    room: 'Salle Informatique',
    budget: 800000,
    budgetUsed: 650000,
    createdDate: '2021-09-01',
    status: 'active',
    activities: generateClubActivities(12),
    icon: 'Laptop'
  },
  {
    id: 'club-3',
    name: 'Club Lecture',
    description: 'Promotion de la lecture, cercles littéraires et rencontres avec des auteurs.',
    supervisor: 'Mme Traoré Kadiatou',
    supervisorEmail: 'k.traore@ecole.ci',
    category: 'Culture',
    members: generateClubMembers(18, 'lecture'),
    maxMembers: 25,
    schedule: 'Vendredi 15h-16h30',
    room: 'Bibliothèque',
    budget: 300000,
    budgetUsed: 180000,
    createdDate: '2023-01-15',
    status: 'active',
    activities: generateClubActivities(6),
    icon: 'BookOpen'
  },
  {
    id: 'club-4',
    name: 'Club Débat',
    description: 'Développement de l\'éloquence et de l\'argumentation. Participation aux concours.',
    supervisor: 'M. Bamba Ousmane',
    supervisorEmail: 'o.bamba@ecole.ci',
    category: 'Citoyenneté',
    members: generateClubMembers(22, 'debat'),
    maxMembers: 30,
    schedule: 'Mardi 16h-18h',
    room: 'Salle de Conférence',
    budget: 250000,
    budgetUsed: 120000,
    createdDate: '2022-10-01',
    status: 'active',
    activities: generateClubActivities(10),
    icon: 'MessageCircle'
  },
  {
    id: 'club-5',
    name: 'Club Sciences',
    description: 'Expériences scientifiques, préparation aux olympiades et projets innovants.',
    supervisor: 'M. Konaté Ibrahim',
    supervisorEmail: 'i.konate@ecole.ci',
    category: 'Sciences',
    members: generateClubMembers(28, 'sciences'),
    maxMembers: 32,
    schedule: 'Lundi 16h-18h',
    room: 'Laboratoire',
    budget: 600000,
    budgetUsed: 480000,
    createdDate: '2021-09-01',
    status: 'active',
    activities: generateClubActivities(15),
    icon: 'FlaskConical'
  },
  {
    id: 'club-6',
    name: 'Club Anglais',
    description: 'Pratique de l\'anglais, échanges culturels et préparation aux certifications.',
    supervisor: 'Mme Sanogo Fatim',
    supervisorEmail: 'f.sanogo@ecole.ci',
    category: 'Langues',
    members: generateClubMembers(24, 'anglais'),
    maxMembers: 30,
    schedule: 'Mercredi 14h-15h30',
    room: 'Salle A12',
    budget: 350000,
    budgetUsed: 200000,
    createdDate: '2022-09-01',
    status: 'active',
    activities: generateClubActivities(8),
    icon: 'Globe'
  },
  {
    id: 'club-7',
    name: 'Club Musique',
    description: 'Chorale, instruments et formation musicale. Concerts annuels.',
    supervisor: 'M. Cissé Moussa',
    supervisorEmail: 'm.cisse@ecole.ci',
    category: 'Arts',
    members: generateClubMembers(35, 'musique'),
    maxMembers: 40,
    schedule: 'Samedi 09h-11h',
    room: 'Salle de Musique',
    budget: 700000,
    budgetUsed: 550000,
    createdDate: '2020-09-01',
    status: 'active',
    activities: generateClubActivities(18),
    icon: 'Music'
  },
  {
    id: 'club-8',
    name: 'Club Environnement',
    description: 'Sensibilisation écologique, jardinage et projets de développement durable.',
    supervisor: 'Mme Diabaté Aicha',
    supervisorEmail: 'a.diabate@ecole.ci',
    category: 'Citoyenneté',
    members: generateClubMembers(20, 'environnement'),
    maxMembers: 25,
    schedule: 'Samedi 08h-10h',
    room: 'Jardin Scolaire',
    budget: 400000,
    budgetUsed: 280000,
    createdDate: '2023-02-01',
    status: 'active',
    activities: generateClubActivities(10),
    icon: 'TreePine'
  }
];

// Mock Team Players
const generateTeamPlayers = (count: number, sport: string, boysCount: number): TeamPlayer[] => {
  const maleNames = ['Koné Amadou', 'Diallo Ibrahim', 'Bamba Moussa', 'Ouattara Youssouf', 'Konaté Sekou', 'Cissé Mamadou', 'Sanogo Issouf', 'Touré Ali'];
  const femaleNames = ['Touré Fatoumata', 'Coulibaly Mariam', 'Traoré Aminata', 'Sanogo Kadiatou', 'Diabaté Aissata', 'Fofana Rokia', 'Koné Mariame', 'Bamba Sita'];
  const classes = ['6ème A', '5ème A', '4ème A', '3ème A', '6ème B', '5ème B', '4ème B', '3ème B'];
  const positions: Record<string, string[]> = {
    'Football': ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'],
    'Basketball': ['Meneur', 'Arrière', 'Ailier', 'Pivot', 'Ailier fort'],
    'Handball': ['Gardien', 'Arrière', 'Demi-centre', 'Ailier', 'Pivot'],
    'Volleyball': ['Passeur', 'Attaquant', 'Libero', 'Central'],
    'Athlétisme': ['Sprint', 'Demi-fond', 'Fond', 'Saut', 'Lancer']
  };
  const performances: TeamPlayer['performance'][] = ['Excellent', 'Bon', 'Moyen', 'À améliorer'];
  
  return Array.from({ length: count }, (_, i) => {
    const isMale = i < boysCount;
    const names = isMale ? maleNames : femaleNames;
    return {
      id: `player-${sport}-${i + 1}`,
      studentId: `STU${2000 + i}`,
      studentName: names[i % names.length],
      class: classes[i % classes.length],
      position: positions[sport]?.[i % (positions[sport]?.length || 1)] || 'Joueur',
      jerseyNumber: sport !== 'Athlétisme' ? i + 1 : undefined,
      gender: isMale ? 'M' : 'F',
      joinDate: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      performance: performances[Math.floor(Math.random() * 4)],
      photo: `https://images.unsplash.com/photo-${1507003211169 + i * 200}-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`
    };
  });
};

const generateCompetitions = (count: number, sport: string): Competition[] => {
  const opponents = ['Lycée Sainte-Marie', 'Collège Excellence', 'Lycée Moderne', 'Institut Technique', 'Collège Français'];
  const locations = ['Stade Municipal', 'Gymnase Central', 'Complexe Sportif', 'Terrain École', 'Palais des Sports'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `comp-${sport}-${i + 1}`,
    name: i === 0 ? 'Championnat Régional' : i === 1 ? 'Coupe Inter-Écoles' : `Match ${i + 1}`,
    date: `2024-${String(Math.floor(Math.random() * 3) + 10).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    location: locations[i % locations.length],
    opponent: opponents[i % opponents.length],
    result: i > 1 ? ['Victoire 3-1', 'Défaite 2-3', 'Match nul 1-1', 'Victoire 5-0'][i % 4] : undefined,
    ranking: i > 1 ? Math.floor(Math.random() * 5) + 1 : undefined,
    status: i > 1 ? 'completed' : 'upcoming' as const
  }));
};

export const mockSportTeams: SportTeam[] = [
  {
    id: 'sport-1',
    sport: 'Football',
    coach: 'M. Koné Drissa',
    coachPhone: '+225 07 12 34 56',
    level: 'Excellence',
    trainingSchedule: [
      { id: 'ts-1', day: 'Mardi', startTime: '16h00', endTime: '18h00', location: 'Terrain Principal' },
      { id: 'ts-2', day: 'Jeudi', startTime: '16h00', endTime: '18h00', location: 'Terrain Principal' },
      { id: 'ts-3', day: 'Samedi', startTime: '08h00', endTime: '10h00', location: 'Terrain Principal' }
    ],
    players: generateTeamPlayers(28, 'Football', 28),
    maxPlayers: 30,
    budget: 1200000,
    budgetUsed: 950000,
    equipment: ['Ballons (20)', 'Maillots (30)', 'Cônes (50)', 'Chasubles (15)', 'Filets (2)'],
    competitions: generateCompetitions(5, 'Football'),
    icon: 'Dribbble'
  },
  {
    id: 'sport-2',
    sport: 'Basketball',
    coach: 'Mme Touré Awa',
    coachPhone: '+225 07 23 45 67',
    level: 'Régional',
    trainingSchedule: [
      { id: 'ts-4', day: 'Lundi', startTime: '16h30', endTime: '18h30', location: 'Gymnase' },
      { id: 'ts-5', day: 'Mercredi', startTime: '15h00', endTime: '17h00', location: 'Gymnase' }
    ],
    players: generateTeamPlayers(27, 'Basketball', 15),
    maxPlayers: 30,
    budget: 800000,
    budgetUsed: 620000,
    equipment: ['Ballons (15)', 'Maillots (30)', 'Paniers mobiles (2)', 'Chronomètres (3)'],
    competitions: generateCompetitions(4, 'Basketball'),
    icon: 'CircleDot'
  },
  {
    id: 'sport-3',
    sport: 'Athlétisme',
    coach: 'M. Yao Kouadio',
    coachPhone: '+225 07 34 56 78',
    level: 'National',
    trainingSchedule: [
      { id: 'ts-6', day: 'Mardi', startTime: '06h00', endTime: '07h30', location: 'Piste' },
      { id: 'ts-7', day: 'Jeudi', startTime: '06h00', endTime: '07h30', location: 'Piste' },
      { id: 'ts-8', day: 'Samedi', startTime: '07h00', endTime: '09h00', location: 'Stade Municipal' }
    ],
    players: generateTeamPlayers(18, 'Athlétisme', 10),
    maxPlayers: 25,
    budget: 600000,
    budgetUsed: 480000,
    equipment: ['Starting blocks (6)', 'Haies (20)', 'Disques (10)', 'Javelots (8)', 'Chronomètres (5)'],
    competitions: generateCompetitions(6, 'Athlétisme'),
    icon: 'Timer'
  },
  {
    id: 'sport-4',
    sport: 'Handball',
    coach: 'M. Soro Lacina',
    coachPhone: '+225 07 45 67 89',
    level: 'Régional',
    trainingSchedule: [
      { id: 'ts-9', day: 'Mercredi', startTime: '16h00', endTime: '18h00', location: 'Gymnase' },
      { id: 'ts-10', day: 'Vendredi', startTime: '16h00', endTime: '18h00', location: 'Gymnase' }
    ],
    players: generateTeamPlayers(22, 'Handball', 12),
    maxPlayers: 28,
    budget: 500000,
    budgetUsed: 380000,
    equipment: ['Ballons (12)', 'Maillots (28)', 'Buts mobiles (2)', 'Protections gardien (2)'],
    competitions: generateCompetitions(3, 'Handball'),
    icon: 'Target'
  },
  {
    id: 'sport-5',
    sport: 'Volleyball',
    coach: 'Mme Koffi Marie',
    coachPhone: '+225 07 56 78 90',
    level: 'Débutant',
    trainingSchedule: [
      { id: 'ts-11', day: 'Lundi', startTime: '15h00', endTime: '16h30', location: 'Terrain Extérieur' },
      { id: 'ts-12', day: 'Jeudi', startTime: '15h00', endTime: '16h30', location: 'Terrain Extérieur' }
    ],
    players: generateTeamPlayers(16, 'Volleyball', 8),
    maxPlayers: 20,
    budget: 350000,
    budgetUsed: 200000,
    equipment: ['Ballons (10)', 'Filet (2)', 'Poteaux (2)', 'Genouillères (16)'],
    competitions: generateCompetitions(2, 'Volleyball'),
    icon: 'Circle'
  }
];

// Mock Event Registrations
const generateEventRegistrations = (count: number, eventId: string): EventRegistration[] => {
  const names = [
    'Koné Amadou', 'Touré Fatoumata', 'Diallo Ibrahim', 'Coulibaly Mariam',
    'Bamba Moussa', 'Traoré Aminata', 'Ouattara Youssouf', 'Sanogo Kadiatou'
  ];
  const classes = ['6ème A', '5ème A', '4ème A', '3ème A'];
  const statuses: EventRegistration['status'][] = ['confirmed', 'pending', 'cancelled'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `reg-${eventId}-${i + 1}`,
    studentId: `STU${3000 + i}`,
    studentName: names[i % names.length],
    class: classes[i % classes.length],
    registrationDate: `2024-${String(Math.floor(Math.random() * 2) + 10).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    status: i < count * 0.8 ? 'confirmed' : statuses[Math.floor(Math.random() * 3)],
    attended: Math.random() > 0.1
  }));
};

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    name: 'Journée Culturelle',
    description: 'Grande journée de célébration de la culture ivoirienne avec spectacles, expositions et ateliers.',
    type: 'Culture',
    date: '2024-11-15',
    startTime: '08h00',
    endTime: '17h00',
    location: 'Cour Principale',
    organizer: 'Direction & Club Théâtre',
    budget: 2000000,
    budgetUsed: 1500000,
    maxParticipants: 500,
    registrations: generateEventRegistrations(450, 'event-1'),
    status: 'open',
    requiresRegistration: false,
    targetAudience: ['Tous les élèves', 'Parents', 'Enseignants'],
    program: '08h00: Ouverture officielle\n09h00: Spectacles traditionnels\n12h00: Pause déjeuner\n14h00: Ateliers\n16h00: Clôture'
  },
  {
    id: 'event-2',
    name: 'Compétition Inter-Écoles',
    description: 'Compétition sportive regroupant 8 établissements de la région.',
    type: 'Sport',
    date: '2024-11-20',
    startTime: '07h30',
    endTime: '18h00',
    location: 'Stade Municipal',
    organizer: 'Direction Sportive',
    budget: 1500000,
    budgetUsed: 0,
    maxParticipants: 150,
    registrations: generateEventRegistrations(80, 'event-2'),
    status: 'open',
    requiresRegistration: true,
    targetAudience: ['Équipes sportives', 'Athlètes sélectionnés'],
    program: '07h30: Échauffement\n08h00: Football\n10h00: Basketball\n14h00: Athlétisme\n17h00: Remise des prix'
  },
  {
    id: 'event-3',
    name: 'Fête de la Science',
    description: 'Exposition de projets scientifiques réalisés par les élèves.',
    type: 'Académique',
    date: '2024-10-28',
    startTime: '09h00',
    endTime: '16h00',
    location: 'Bâtiment Sciences',
    organizer: 'Club Sciences',
    budget: 800000,
    budgetUsed: 750000,
    maxParticipants: 400,
    registrations: generateEventRegistrations(380, 'event-3'),
    status: 'completed',
    requiresRegistration: false,
    targetAudience: ['Tous les élèves', 'Parents'],
    program: '09h00: Ouverture\n09h30: Présentations des projets\n12h00: Démonstrations\n15h00: Remise des prix'
  },
  {
    id: 'event-4',
    name: 'Tournoi de Football',
    description: 'Tournoi interne entre les différentes classes.',
    type: 'Sport',
    date: '2024-10-15',
    startTime: '14h00',
    endTime: '18h00',
    location: 'Terrain Principal',
    organizer: 'AS Football',
    budget: 300000,
    budgetUsed: 280000,
    maxParticipants: 120,
    registrations: generateEventRegistrations(120, 'event-4'),
    status: 'completed',
    requiresRegistration: true,
    targetAudience: ['Élèves inscrits au football'],
    program: '14h00: Phases de poules\n16h00: Demi-finales\n17h00: Finale\n17h45: Remise de la coupe'
  },
  {
    id: 'event-5',
    name: 'Cérémonie de Remise des Prix',
    description: 'Cérémonie honorant les meilleurs élèves du trimestre.',
    type: 'Cérémonie',
    date: '2024-12-20',
    startTime: '09h00',
    endTime: '12h00',
    location: 'Amphithéâtre',
    organizer: 'Direction',
    budget: 500000,
    budgetUsed: 0,
    maxParticipants: 300,
    registrations: generateEventRegistrations(50, 'event-5'),
    status: 'draft',
    requiresRegistration: true,
    targetAudience: ['Lauréats', 'Parents des lauréats', 'Enseignants'],
    program: '09h00: Accueil\n09h30: Discours du Directeur\n10h00: Remise des prix\n11h30: Cocktail'
  },
  {
    id: 'event-6',
    name: 'Journée Portes Ouvertes',
    description: 'Présentation de l\'établissement aux futurs élèves et parents.',
    type: 'Social',
    date: '2024-12-14',
    startTime: '08h00',
    endTime: '14h00',
    location: 'Établissement',
    organizer: 'Direction & Administration',
    budget: 400000,
    budgetUsed: 0,
    maxParticipants: 200,
    registrations: [],
    status: 'open',
    requiresRegistration: true,
    targetAudience: ['Futurs élèves', 'Parents'],
    program: '08h00: Accueil\n09h00: Visite guidée\n11h00: Présentations\n12h30: Échanges'
  },
  {
    id: 'event-7',
    name: 'Concert de Fin d\'Année',
    description: 'Concert annuel du club de musique avec chœur et orchestre.',
    type: 'Culture',
    date: '2024-12-18',
    startTime: '18h00',
    endTime: '21h00',
    location: 'Amphithéâtre',
    organizer: 'Club Musique',
    budget: 600000,
    budgetUsed: 100000,
    maxParticipants: 250,
    registrations: generateEventRegistrations(180, 'event-7'),
    status: 'open',
    requiresRegistration: true,
    targetAudience: ['Tous', 'Parents', 'Invités'],
    program: '18h00: Ouverture\n18h30: Chorale\n19h30: Orchestre\n20h30: Final ensemble'
  }
];

export const mockBudgetTransactions: BudgetTransaction[] = [
  { id: 'bt-1', activityType: 'club', activityId: 'club-1', activityName: 'Club Théâtre', description: 'Achat costumes spectacle', amount: 150000, type: 'expense', date: '2024-10-15', category: 'Équipement' },
  { id: 'bt-2', activityType: 'club', activityId: 'club-2', activityName: 'Club Informatique', description: 'Réparation ordinateurs', amount: 200000, type: 'expense', date: '2024-10-20', category: 'Maintenance' },
  { id: 'bt-3', activityType: 'sport', activityId: 'sport-1', activityName: 'Football', description: 'Nouveaux maillots', amount: 350000, type: 'expense', date: '2024-09-15', category: 'Équipement' },
  { id: 'bt-4', activityType: 'sport', activityId: 'sport-1', activityName: 'Football', description: 'Subvention mairie', amount: 500000, type: 'income', date: '2024-09-01', category: 'Subvention' },
  { id: 'bt-5', activityType: 'event', activityId: 'event-1', activityName: 'Journée Culturelle', description: 'Location sono', amount: 300000, type: 'expense', date: '2024-11-10', category: 'Location' },
  { id: 'bt-6', activityType: 'event', activityId: 'event-3', activityName: 'Fête de la Science', description: 'Matériel expériences', amount: 400000, type: 'expense', date: '2024-10-20', category: 'Matériel' },
  { id: 'bt-7', activityType: 'club', activityId: 'club-7', activityName: 'Club Musique', description: 'Instruments', amount: 450000, type: 'expense', date: '2024-10-05', category: 'Équipement' },
  { id: 'bt-8', activityType: 'sport', activityId: 'sport-3', activityName: 'Athlétisme', description: 'Participation championnat', amount: 200000, type: 'expense', date: '2024-11-01', category: 'Compétition' }
];

// Helper functions
export const getClubStats = () => {
  const totalMembers = mockClubs.reduce((acc, club) => acc + club.members.length, 0);
  const totalBudget = mockClubs.reduce((acc, club) => acc + club.budget, 0);
  const usedBudget = mockClubs.reduce((acc, club) => acc + club.budgetUsed, 0);
  const activeClubs = mockClubs.filter(club => club.status === 'active').length;
  
  return { totalMembers, totalBudget, usedBudget, activeClubs };
};

export const getSportStats = () => {
  const totalPlayers = mockSportTeams.reduce((acc, team) => acc + team.players.length, 0);
  const boysCount = mockSportTeams.reduce((acc, team) => acc + team.players.filter(p => p.gender === 'M').length, 0);
  const girlsCount = mockSportTeams.reduce((acc, team) => acc + team.players.filter(p => p.gender === 'F').length, 0);
  const totalCompetitions = mockSportTeams.reduce((acc, team) => acc + team.competitions.length, 0);
  const upcomingCompetitions = mockSportTeams.reduce((acc, team) => acc + team.competitions.filter(c => c.status === 'upcoming').length, 0);
  const totalBudget = mockSportTeams.reduce((acc, team) => acc + team.budget, 0);
  const usedBudget = mockSportTeams.reduce((acc, team) => acc + team.budgetUsed, 0);
  
  return { totalPlayers, boysCount, girlsCount, totalCompetitions, upcomingCompetitions, totalBudget, usedBudget };
};

export const getEventStats = () => {
  const totalEvents = mockEvents.length;
  const upcomingEvents = mockEvents.filter(e => e.status === 'open' || e.status === 'draft').length;
  const completedEvents = mockEvents.filter(e => e.status === 'completed').length;
  const totalRegistrations = mockEvents.reduce((acc, e) => acc + e.registrations.length, 0);
  const totalBudget = mockEvents.reduce((acc, e) => acc + e.budget, 0);
  const usedBudget = mockEvents.reduce((acc, e) => acc + e.budgetUsed, 0);
  
  return { totalEvents, upcomingEvents, completedEvents, totalRegistrations, totalBudget, usedBudget };
};

export const getCategoryDistribution = () => {
  const categories: Record<string, number> = {};
  mockClubs.forEach(club => {
    categories[club.category] = (categories[club.category] || 0) + club.members.length;
  });
  return Object.entries(categories).map(([name, value]) => ({ name, value }));
};

export const getGenderDistribution = () => {
  const stats = getSportStats();
  return [
    { name: 'Garçons', value: stats.boysCount },
    { name: 'Filles', value: stats.girlsCount }
  ];
};
