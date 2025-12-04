import { format, addDays } from 'date-fns';

export type ExamType = 'BEPC' | 'BAC';
export type ExamSession = 'Normale' | 'Rattrapage';
export type ConvocationExamStatus = 'draft' | 'generated' | 'printed' | 'sent' | 'received';

export interface ExamCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  rooms: string[];
}

export interface ExamCandidate {
  id: string;
  candidateNumber: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  gender: 'M' | 'F';
  className: string;
  schoolName: string;
  examType: ExamType;
  session: ExamSession;
  centerId: string;
  centerName: string;
  roomNumber: string;
  tableNumber: number;
  subjects: string[];
  convocationStatus: ConvocationExamStatus;
  convocationGeneratedAt?: string;
  convocationSentAt?: string;
  parentPhone?: string;
  parentEmail?: string;
}

export interface JuryMember {
  id: string;
  matricule: string;
  lastName: string;
  firstName: string;
  title: string;
  subject: string;
  school: string;
  phone: string;
  email: string;
  role: 'president' | 'examinateur' | 'correcteur' | 'surveillant';
  examType: ExamType;
  session: ExamSession;
  centerId: string;
  centerName: string;
  assignedRooms: string[];
  assignedDates: string[];
  convocationStatus: ConvocationExamStatus;
  convocationGeneratedAt?: string;
  convocationSentAt?: string;
}

export interface ExamSchedule {
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  duration: string;
  examType: ExamType;
}

export const mockExamCenters: ExamCenter[] = [
  {
    id: 'center-1',
    name: 'Lycée Classique d\'Abidjan',
    address: 'Boulevard de la République',
    city: 'Abidjan',
    capacity: 500,
    rooms: ['Salle A1', 'Salle A2', 'Salle A3', 'Salle B1', 'Salle B2']
  },
  {
    id: 'center-2',
    name: 'Lycée Moderne de Cocody',
    address: 'Rue des Jardins',
    city: 'Cocody',
    capacity: 400,
    rooms: ['Salle 101', 'Salle 102', 'Salle 103', 'Salle 104']
  },
  {
    id: 'center-3',
    name: 'Collège Municipal de Yopougon',
    address: 'Avenue de l\'Indépendance',
    city: 'Yopougon',
    capacity: 350,
    rooms: ['Salle 1', 'Salle 2', 'Salle 3']
  }
];

export const mockExamSchedule: ExamSchedule[] = [
  { date: '2024-06-10', startTime: '08:00', endTime: '12:00', subject: 'Français', duration: '4h', examType: 'BEPC' },
  { date: '2024-06-10', startTime: '14:00', endTime: '17:00', subject: 'Mathématiques', duration: '3h', examType: 'BEPC' },
  { date: '2024-06-11', startTime: '08:00', endTime: '11:00', subject: 'Histoire-Géographie', duration: '3h', examType: 'BEPC' },
  { date: '2024-06-11', startTime: '14:00', endTime: '16:00', subject: 'Anglais', duration: '2h', examType: 'BEPC' },
  { date: '2024-06-12', startTime: '08:00', endTime: '10:00', subject: 'SVT', duration: '2h', examType: 'BEPC' },
  { date: '2024-06-12', startTime: '14:00', endTime: '16:00', subject: 'Physique-Chimie', duration: '2h', examType: 'BEPC' },
  { date: '2024-06-17', startTime: '08:00', endTime: '12:00', subject: 'Philosophie', duration: '4h', examType: 'BAC' },
  { date: '2024-06-17', startTime: '14:00', endTime: '18:00', subject: 'Mathématiques', duration: '4h', examType: 'BAC' },
  { date: '2024-06-18', startTime: '08:00', endTime: '12:00', subject: 'Français', duration: '4h', examType: 'BAC' },
  { date: '2024-06-18', startTime: '14:00', endTime: '17:00', subject: 'Histoire-Géographie', duration: '3h', examType: 'BAC' },
  { date: '2024-06-19', startTime: '08:00', endTime: '11:00', subject: 'Anglais', duration: '3h', examType: 'BAC' },
  { date: '2024-06-19', startTime: '14:00', endTime: '17:00', subject: 'Spécialité', duration: '3h', examType: 'BAC' },
];

export const mockExamCandidates: ExamCandidate[] = [
  {
    id: 'cand-1',
    candidateNumber: 'BEPC-2024-00001',
    lastName: 'KOUASSI',
    firstName: 'Aya Marie',
    birthDate: '2008-03-15',
    birthPlace: 'Abidjan',
    gender: 'F',
    className: '3ème A',
    schoolName: 'Collège Moderne d\'Adjamé',
    examType: 'BEPC',
    session: 'Normale',
    centerId: 'center-1',
    centerName: 'Lycée Classique d\'Abidjan',
    roomNumber: 'Salle A1',
    tableNumber: 1,
    subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Anglais', 'SVT', 'Physique-Chimie'],
    convocationStatus: 'generated',
    convocationGeneratedAt: '2024-05-20T10:30:00',
    parentPhone: '+225 07 12 34 56 78',
    parentEmail: 'parent.kouassi@email.com'
  },
  {
    id: 'cand-2',
    candidateNumber: 'BEPC-2024-00002',
    lastName: 'BAMBA',
    firstName: 'Moussa',
    birthDate: '2008-07-22',
    birthPlace: 'Bouaké',
    gender: 'M',
    className: '3ème B',
    schoolName: 'Collège Moderne d\'Adjamé',
    examType: 'BEPC',
    session: 'Normale',
    centerId: 'center-1',
    centerName: 'Lycée Classique d\'Abidjan',
    roomNumber: 'Salle A1',
    tableNumber: 2,
    subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Anglais', 'SVT', 'Physique-Chimie'],
    convocationStatus: 'sent',
    convocationGeneratedAt: '2024-05-20T10:30:00',
    convocationSentAt: '2024-05-21T14:00:00',
    parentPhone: '+225 05 98 76 54 32',
    parentEmail: 'bamba.famille@email.com'
  },
  {
    id: 'cand-3',
    candidateNumber: 'BEPC-2024-00003',
    lastName: 'DIALLO',
    firstName: 'Fatou',
    birthDate: '2008-11-08',
    birthPlace: 'Daloa',
    gender: 'F',
    className: '3ème A',
    schoolName: 'Collège Saint-Michel',
    examType: 'BEPC',
    session: 'Normale',
    centerId: 'center-2',
    centerName: 'Lycée Moderne de Cocody',
    roomNumber: 'Salle 101',
    tableNumber: 1,
    subjects: ['Français', 'Mathématiques', 'Histoire-Géographie', 'Anglais', 'SVT', 'Physique-Chimie'],
    convocationStatus: 'draft',
    parentPhone: '+225 01 23 45 67 89'
  },
  {
    id: 'cand-4',
    candidateNumber: 'BAC-2024-00001',
    lastName: 'TRAORE',
    firstName: 'Ibrahim',
    birthDate: '2006-02-28',
    birthPlace: 'Abidjan',
    gender: 'M',
    className: 'Terminale D',
    schoolName: 'Lycée Classique d\'Abidjan',
    examType: 'BAC',
    session: 'Normale',
    centerId: 'center-1',
    centerName: 'Lycée Classique d\'Abidjan',
    roomNumber: 'Salle B1',
    tableNumber: 1,
    subjects: ['Philosophie', 'Mathématiques', 'Français', 'Histoire-Géographie', 'Anglais', 'SVT'],
    convocationStatus: 'printed',
    convocationGeneratedAt: '2024-05-18T09:00:00',
    parentPhone: '+225 07 11 22 33 44',
    parentEmail: 'traore.papa@email.com'
  },
  {
    id: 'cand-5',
    candidateNumber: 'BAC-2024-00002',
    lastName: 'KONE',
    firstName: 'Aminata',
    birthDate: '2006-09-14',
    birthPlace: 'San-Pédro',
    gender: 'F',
    className: 'Terminale A',
    schoolName: 'Lycée Moderne de Cocody',
    examType: 'BAC',
    session: 'Normale',
    centerId: 'center-2',
    centerName: 'Lycée Moderne de Cocody',
    roomNumber: 'Salle 102',
    tableNumber: 1,
    subjects: ['Philosophie', 'Mathématiques', 'Français', 'Histoire-Géographie', 'Anglais', 'Littérature'],
    convocationStatus: 'received',
    convocationGeneratedAt: '2024-05-18T09:00:00',
    convocationSentAt: '2024-05-19T10:00:00',
    parentPhone: '+225 05 44 55 66 77',
    parentEmail: 'kone.mere@email.com'
  },
  {
    id: 'cand-6',
    candidateNumber: 'BAC-2024-00003',
    lastName: 'YAO',
    firstName: 'Konan Jean',
    birthDate: '2006-04-30',
    birthPlace: 'Yamoussoukro',
    gender: 'M',
    className: 'Terminale C',
    schoolName: 'Lycée Scientifique de Yamoussoukro',
    examType: 'BAC',
    session: 'Normale',
    centerId: 'center-1',
    centerName: 'Lycée Classique d\'Abidjan',
    roomNumber: 'Salle B2',
    tableNumber: 1,
    subjects: ['Philosophie', 'Mathématiques', 'Français', 'Physique-Chimie', 'Anglais', 'SVT'],
    convocationStatus: 'draft',
    parentPhone: '+225 07 88 99 00 11'
  }
];

export const mockJuryMembers: JuryMember[] = [
  {
    id: 'jury-1',
    matricule: 'ENS-2010-0456',
    lastName: 'ESSO',
    firstName: 'Yves',
    title: 'Professeur Certifié',
    subject: 'Mathématiques',
    school: 'Lycée Classique d\'Abidjan',
    phone: '+225 07 00 11 22 33',
    email: 'yves.esso@education.ci',
    role: 'president',
    examType: 'BEPC',
    session: 'Normale',
    centerId: 'center-1',
    centerName: 'Lycée Classique d\'Abidjan',
    assignedRooms: ['Salle A1', 'Salle A2'],
    assignedDates: ['2024-06-10', '2024-06-11', '2024-06-12'],
    convocationStatus: 'sent',
    convocationGeneratedAt: '2024-05-15T08:00:00',
    convocationSentAt: '2024-05-16T10:00:00'
  },
  {
    id: 'jury-2',
    matricule: 'ENS-2012-0789',
    lastName: 'GNANGNAN',
    firstName: 'Marthe',
    title: 'Professeur Lycée',
    subject: 'Français',
    school: 'Lycée Moderne de Cocody',
    phone: '+225 05 22 33 44 55',
    email: 'marthe.gnangnan@education.ci',
    role: 'examinateur',
    examType: 'BEPC',
    session: 'Normale',
    centerId: 'center-1',
    centerName: 'Lycée Classique d\'Abidjan',
    assignedRooms: ['Salle A1'],
    assignedDates: ['2024-06-10'],
    convocationStatus: 'generated',
    convocationGeneratedAt: '2024-05-15T08:00:00'
  },
  {
    id: 'jury-3',
    matricule: 'ENS-2008-0234',
    lastName: 'OUATTARA',
    firstName: 'Seydou',
    title: 'Inspecteur Pédagogique',
    subject: 'Histoire-Géographie',
    school: 'DRENA Abidjan 1',
    phone: '+225 07 66 77 88 99',
    email: 'seydou.ouattara@education.ci',
    role: 'correcteur',
    examType: 'BAC',
    session: 'Normale',
    centerId: 'center-2',
    centerName: 'Lycée Moderne de Cocody',
    assignedRooms: ['Salle 101', 'Salle 102'],
    assignedDates: ['2024-06-17', '2024-06-18', '2024-06-19'],
    convocationStatus: 'printed',
    convocationGeneratedAt: '2024-05-14T09:00:00'
  },
  {
    id: 'jury-4',
    matricule: 'ENS-2015-0567',
    lastName: 'AHOU',
    firstName: 'Clémence',
    title: 'Professeur Collège',
    subject: 'Anglais',
    school: 'Collège Moderne d\'Adjamé',
    phone: '+225 01 44 55 66 77',
    email: 'clemence.ahou@education.ci',
    role: 'surveillant',
    examType: 'BEPC',
    session: 'Normale',
    centerId: 'center-3',
    centerName: 'Collège Municipal de Yopougon',
    assignedRooms: ['Salle 1', 'Salle 2'],
    assignedDates: ['2024-06-10', '2024-06-11'],
    convocationStatus: 'draft'
  },
  {
    id: 'jury-5',
    matricule: 'ENS-2009-0890',
    lastName: 'KONAN',
    firstName: 'Aimé',
    title: 'Professeur Certifié',
    subject: 'Philosophie',
    school: 'Lycée Moderne de Cocody',
    phone: '+225 07 99 88 77 66',
    email: 'aime.konan@education.ci',
    role: 'examinateur',
    examType: 'BAC',
    session: 'Normale',
    centerId: 'center-2',
    centerName: 'Lycée Moderne de Cocody',
    assignedRooms: ['Salle 103', 'Salle 104'],
    assignedDates: ['2024-06-17'],
    convocationStatus: 'received',
    convocationGeneratedAt: '2024-05-14T09:00:00',
    convocationSentAt: '2024-05-15T11:00:00'
  },
  {
    id: 'jury-6',
    matricule: 'ENS-2011-0345',
    lastName: 'DOSSO',
    firstName: 'Mamadou',
    title: 'Professeur Lycée',
    subject: 'Physique-Chimie',
    school: 'Lycée Scientifique de Yamoussoukro',
    phone: '+225 05 11 22 33 44',
    email: 'mamadou.dosso@education.ci',
    role: 'correcteur',
    examType: 'BAC',
    session: 'Normale',
    centerId: 'center-1',
    centerName: 'Lycée Classique d\'Abidjan',
    assignedRooms: ['Salle B1', 'Salle B2'],
    assignedDates: ['2024-06-17', '2024-06-18', '2024-06-19'],
    convocationStatus: 'sent',
    convocationGeneratedAt: '2024-05-14T09:00:00',
    convocationSentAt: '2024-05-15T14:00:00'
  }
];

export const convocationStatusLabels: Record<ConvocationExamStatus, string> = {
  draft: 'Brouillon',
  generated: 'Générée',
  printed: 'Imprimée',
  sent: 'Envoyée',
  received: 'Accusée'
};

export const convocationStatusColors: Record<ConvocationExamStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  generated: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  printed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  sent: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  received: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
};

export const roleLabels: Record<JuryMember['role'], string> = {
  president: 'Président de Jury',
  examinateur: 'Examinateur',
  correcteur: 'Correcteur',
  surveillant: 'Surveillant'
};
