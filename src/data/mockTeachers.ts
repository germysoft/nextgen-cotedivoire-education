// Données mock complètes pour le suivi des enseignants

export interface Teacher {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  photo: string;
  matiere: string;
  matieres: string[];
  classes: string[];
  statut: "Permanent" | "Vacataire" | "Stagiaire";
  telephone: string;
  email: string;
  heuresHebdo: number;
  heuresMax: number;
  dateEmbauche: string;
  diplome: string;
  grade: string;
}

export interface CourseSession {
  id: string;
  teacherId: string;
  date: string;
  jour: string;
  heureDebut: string;
  heureFin: string;
  classe: string;
  matiere: string;
  salle: string;
  chapitre: string;
  statut: "Programmé" | "Dispensé" | "Annulé" | "Reporté";
  absents: number;
  remarques?: string;
}

export interface AttendanceRecord {
  id: string;
  teacherId: string;
  date: string;
  heureArrivee: string | null;
  heureDepart: string | null;
  statut: "Présent" | "Absent" | "Retard" | "Justifié";
  justification?: string;
  pointageMethode: "Badge" | "Manuel" | "Biométrique";
}

export interface TeacherSchedule {
  teacherId: string;
  jour: string;
  heureDebut: string;
  heureFin: string;
  classe: string;
  matiere: string;
  salle: string;
}

export const mockTeachers: Teacher[] = [
  {
    id: "T001",
    matricule: "ENS-2015-001",
    nom: "KOUADIO",
    prenom: "Marc",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    matiere: "Mathématiques",
    matieres: ["Mathématiques"],
    classes: ["3ème A", "3ème B", "2nde C", "Tle D"],
    statut: "Permanent",
    telephone: "+225 07 00 00 01",
    email: "marc.k@school.ci",
    heuresHebdo: 22,
    heuresMax: 24,
    dateEmbauche: "2015-09-01",
    diplome: "CAPES Mathématiques",
    grade: "Professeur Certifié"
  },
  {
    id: "T002",
    matricule: "ENS-2018-015",
    nom: "DIABATÉ",
    prenom: "Sarah",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    matiere: "Français",
    matieres: ["Français", "Latin"],
    classes: ["6ème A", "5ème B", "5ème C", "4ème A"],
    statut: "Permanent",
    telephone: "+225 07 00 00 02",
    email: "sarah.d@school.ci",
    heuresHebdo: 20,
    heuresMax: 22,
    dateEmbauche: "2018-09-01",
    diplome: "Maîtrise Lettres Modernes",
    grade: "Professeur"
  },
  {
    id: "T003",
    matricule: "ENS-2020-032",
    nom: "BROU",
    prenom: "Emmanuel",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    matiere: "Anglais",
    matieres: ["Anglais"],
    classes: ["4ème B", "3ème C", "2nde A"],
    statut: "Vacataire",
    telephone: "+225 07 00 00 03",
    email: "emmanuel.b@school.ci",
    heuresHebdo: 12,
    heuresMax: 18,
    dateEmbauche: "2020-09-01",
    diplome: "Licence Anglais",
    grade: "Professeur Vacataire"
  },
  {
    id: "T004",
    matricule: "ENS-2017-020",
    nom: "TOURÉ",
    prenom: "Aminata",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
    matiere: "SVT",
    matieres: ["SVT"],
    classes: ["2nde A", "2nde B", "1ère S", "Tle S"],
    statut: "Permanent",
    telephone: "+225 07 00 00 04",
    email: "aminata.t@school.ci",
    heuresHebdo: 18,
    heuresMax: 20,
    dateEmbauche: "2017-09-01",
    diplome: "Master Biologie",
    grade: "Professeur Certifié"
  },
  {
    id: "T005",
    matricule: "ENS-2016-018",
    nom: "KOFFI",
    prenom: "Daniel",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    matiere: "Histoire-Géo",
    matieres: ["Histoire-Géographie", "EMC"],
    classes: ["Tle A", "Tle D", "1ère L", "2nde A"],
    statut: "Permanent",
    telephone: "+225 07 00 00 05",
    email: "daniel.k@school.ci",
    heuresHebdo: 20,
    heuresMax: 22,
    dateEmbauche: "2016-09-01",
    diplome: "Agrégation Histoire",
    grade: "Professeur Agrégé"
  },
  {
    id: "T006",
    matricule: "ENS-2019-028",
    nom: "N'GUESSAN",
    prenom: "Sylvie",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    matiere: "Physique-Chimie",
    matieres: ["Physique-Chimie"],
    classes: ["1ère S", "Tle S", "Tle D"],
    statut: "Permanent",
    telephone: "+225 07 00 00 06",
    email: "sylvie.n@school.ci",
    heuresHebdo: 16,
    heuresMax: 20,
    dateEmbauche: "2019-09-01",
    diplome: "CAPES Physique-Chimie",
    grade: "Professeur Certifié"
  },
  {
    id: "T007",
    matricule: "ENS-2021-041",
    nom: "COULIBALY",
    prenom: "Moussa",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    matiere: "Philosophie",
    matieres: ["Philosophie"],
    classes: ["Tle A", "Tle D", "Tle S"],
    statut: "Stagiaire",
    telephone: "+225 07 00 00 07",
    email: "moussa.c@school.ci",
    heuresHebdo: 10,
    heuresMax: 12,
    dateEmbauche: "2021-09-01",
    diplome: "Master Philosophie",
    grade: "Professeur Stagiaire"
  },
  {
    id: "T008",
    matricule: "ENS-2014-008",
    nom: "YAPI",
    prenom: "Kouassi",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    matiere: "EPS",
    matieres: ["EPS"],
    classes: ["6ème A", "5ème A", "4ème A", "3ème A"],
    statut: "Permanent",
    telephone: "+225 07 00 00 08",
    email: "kouassi.y@school.ci",
    heuresHebdo: 24,
    heuresMax: 26,
    dateEmbauche: "2014-09-01",
    diplome: "Licence STAPS",
    grade: "Professeur d'EPS"
  }
];

// Emploi du temps par enseignant
export const mockSchedules: TeacherSchedule[] = [
  // KOUADIO Marc - Mathématiques
  { teacherId: "T001", jour: "Lundi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème A", matiere: "Mathématiques", salle: "A12" },
  { teacherId: "T001", jour: "Lundi", heureDebut: "10:00", heureFin: "12:00", classe: "Tle D", matiere: "Mathématiques", salle: "A15" },
  { teacherId: "T001", jour: "Lundi", heureDebut: "14:00", heureFin: "16:00", classe: "2nde C", matiere: "Mathématiques", salle: "B08" },
  { teacherId: "T001", jour: "Mardi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème B", matiere: "Mathématiques", salle: "A12" },
  { teacherId: "T001", jour: "Mardi", heureDebut: "10:00", heureFin: "12:00", classe: "Tle D", matiere: "Mathématiques", salle: "A15" },
  { teacherId: "T001", jour: "Mercredi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème A", matiere: "Mathématiques", salle: "A12" },
  { teacherId: "T001", jour: "Mercredi", heureDebut: "10:00", heureFin: "12:00", classe: "2nde C", matiere: "Mathématiques", salle: "B08" },
  { teacherId: "T001", jour: "Jeudi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème B", matiere: "Mathématiques", salle: "A12" },
  { teacherId: "T001", jour: "Jeudi", heureDebut: "14:00", heureFin: "16:00", classe: "Tle D", matiere: "Mathématiques", salle: "A15" },
  { teacherId: "T001", jour: "Vendredi", heureDebut: "08:00", heureFin: "10:00", classe: "2nde C", matiere: "Mathématiques", salle: "B08" },
  { teacherId: "T001", jour: "Vendredi", heureDebut: "10:00", heureFin: "12:00", classe: "3ème A", matiere: "Mathématiques", salle: "A12" },

  // DIABATÉ Sarah - Français
  { teacherId: "T002", jour: "Lundi", heureDebut: "08:00", heureFin: "10:00", classe: "6ème A", matiere: "Français", salle: "B01" },
  { teacherId: "T002", jour: "Lundi", heureDebut: "10:00", heureFin: "12:00", classe: "5ème B", matiere: "Français", salle: "B02" },
  { teacherId: "T002", jour: "Mardi", heureDebut: "08:00", heureFin: "10:00", classe: "5ème C", matiere: "Français", salle: "B03" },
  { teacherId: "T002", jour: "Mardi", heureDebut: "14:00", heureFin: "16:00", classe: "4ème A", matiere: "Français", salle: "B04" },
  { teacherId: "T002", jour: "Mercredi", heureDebut: "08:00", heureFin: "10:00", classe: "6ème A", matiere: "Français", salle: "B01" },
  { teacherId: "T002", jour: "Jeudi", heureDebut: "08:00", heureFin: "10:00", classe: "5ème B", matiere: "Français", salle: "B02" },
  { teacherId: "T002", jour: "Jeudi", heureDebut: "10:00", heureFin: "12:00", classe: "5ème C", matiere: "Français", salle: "B03" },
  { teacherId: "T002", jour: "Vendredi", heureDebut: "08:00", heureFin: "10:00", classe: "4ème A", matiere: "Français", salle: "B04" },
  { teacherId: "T002", jour: "Vendredi", heureDebut: "14:00", heureFin: "16:00", classe: "6ème A", matiere: "Latin", salle: "B01" },

  // BROU Emmanuel - Anglais
  { teacherId: "T003", jour: "Lundi", heureDebut: "10:00", heureFin: "12:00", classe: "4ème B", matiere: "Anglais", salle: "C01" },
  { teacherId: "T003", jour: "Mardi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème C", matiere: "Anglais", salle: "C02" },
  { teacherId: "T003", jour: "Mercredi", heureDebut: "10:00", heureFin: "12:00", classe: "2nde A", matiere: "Anglais", salle: "C03" },
  { teacherId: "T003", jour: "Jeudi", heureDebut: "14:00", heureFin: "16:00", classe: "4ème B", matiere: "Anglais", salle: "C01" },
  { teacherId: "T003", jour: "Vendredi", heureDebut: "10:00", heureFin: "12:00", classe: "3ème C", matiere: "Anglais", salle: "C02" },
  { teacherId: "T003", jour: "Vendredi", heureDebut: "14:00", heureFin: "16:00", classe: "2nde A", matiere: "Anglais", salle: "C03" },
];

// Historique des cours
export const mockCourseSessions: CourseSession[] = [
  { id: "CS001", teacherId: "T001", date: "2024-12-11", jour: "Mercredi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème A", matiere: "Mathématiques", salle: "A12", chapitre: "Théorème de Thalès", statut: "Programmé", absents: 0 },
  { id: "CS002", teacherId: "T001", date: "2024-12-10", jour: "Mardi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème B", matiere: "Mathématiques", salle: "A12", chapitre: "Équations du second degré", statut: "Dispensé", absents: 2 },
  { id: "CS003", teacherId: "T001", date: "2024-12-10", jour: "Mardi", heureDebut: "10:00", heureFin: "12:00", classe: "Tle D", matiere: "Mathématiques", salle: "A15", chapitre: "Intégrales", statut: "Dispensé", absents: 0 },
  { id: "CS004", teacherId: "T001", date: "2024-12-09", jour: "Lundi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème A", matiere: "Mathématiques", salle: "A12", chapitre: "Théorème de Thalès", statut: "Dispensé", absents: 1 },
  { id: "CS005", teacherId: "T001", date: "2024-12-09", jour: "Lundi", heureDebut: "10:00", heureFin: "12:00", classe: "Tle D", matiere: "Mathématiques", salle: "A15", chapitre: "Primitives", statut: "Dispensé", absents: 0 },
  { id: "CS006", teacherId: "T001", date: "2024-12-09", jour: "Lundi", heureDebut: "14:00", heureFin: "16:00", classe: "2nde C", matiere: "Mathématiques", salle: "B08", chapitre: "Fonctions affines", statut: "Dispensé", absents: 3 },
  { id: "CS007", teacherId: "T001", date: "2024-12-06", jour: "Vendredi", heureDebut: "08:00", heureFin: "10:00", classe: "2nde C", matiere: "Mathématiques", salle: "B08", chapitre: "Fonctions affines", statut: "Annulé", absents: 0, remarques: "Conseil de classe" },
  { id: "CS008", teacherId: "T001", date: "2024-12-05", jour: "Jeudi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème B", matiere: "Mathématiques", salle: "A12", chapitre: "Équations", statut: "Dispensé", absents: 1 },
  
  { id: "CS009", teacherId: "T002", date: "2024-12-11", jour: "Mercredi", heureDebut: "08:00", heureFin: "10:00", classe: "6ème A", matiere: "Français", salle: "B01", chapitre: "Conjugaison", statut: "Programmé", absents: 0 },
  { id: "CS010", teacherId: "T002", date: "2024-12-10", jour: "Mardi", heureDebut: "08:00", heureFin: "10:00", classe: "5ème C", matiere: "Français", salle: "B03", chapitre: "Rédaction", statut: "Dispensé", absents: 1 },
  { id: "CS011", teacherId: "T002", date: "2024-12-10", jour: "Mardi", heureDebut: "14:00", heureFin: "16:00", classe: "4ème A", matiere: "Français", salle: "B04", chapitre: "Analyse littéraire", statut: "Dispensé", absents: 0 },
  
  { id: "CS012", teacherId: "T003", date: "2024-12-11", jour: "Mercredi", heureDebut: "10:00", heureFin: "12:00", classe: "2nde A", matiere: "Anglais", salle: "C03", chapitre: "Present Perfect", statut: "Programmé", absents: 0 },
  { id: "CS013", teacherId: "T003", date: "2024-12-10", jour: "Mardi", heureDebut: "08:00", heureFin: "10:00", classe: "3ème C", matiere: "Anglais", salle: "C02", chapitre: "Past Simple", statut: "Dispensé", absents: 2 },
];

// Pointages
export const mockAttendanceRecords: AttendanceRecord[] = [
  // Semaine du 9-13 Décembre 2024
  { id: "ATT001", teacherId: "T001", date: "2024-12-11", heureArrivee: "07:45", heureDepart: null, statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT002", teacherId: "T002", date: "2024-12-11", heureArrivee: "07:52", heureDepart: null, statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT003", teacherId: "T003", date: "2024-12-11", heureArrivee: "08:15", heureDepart: null, statut: "Retard", pointageMethode: "Badge" },
  { id: "ATT004", teacherId: "T004", date: "2024-12-11", heureArrivee: "07:40", heureDepart: null, statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT005", teacherId: "T005", date: "2024-12-11", heureArrivee: null, heureDepart: null, statut: "Absent", pointageMethode: "Manuel", justification: "Maladie - certificat médical" },
  { id: "ATT006", teacherId: "T006", date: "2024-12-11", heureArrivee: "07:55", heureDepart: null, statut: "Présent", pointageMethode: "Biométrique" },
  { id: "ATT007", teacherId: "T007", date: "2024-12-11", heureArrivee: "07:48", heureDepart: null, statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT008", teacherId: "T008", date: "2024-12-11", heureArrivee: "07:30", heureDepart: null, statut: "Présent", pointageMethode: "Badge" },

  { id: "ATT009", teacherId: "T001", date: "2024-12-10", heureArrivee: "07:50", heureDepart: "17:30", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT010", teacherId: "T002", date: "2024-12-10", heureArrivee: "07:48", heureDepart: "17:15", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT011", teacherId: "T003", date: "2024-12-10", heureArrivee: "07:55", heureDepart: "16:00", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT012", teacherId: "T004", date: "2024-12-10", heureArrivee: "07:42", heureDepart: "17:45", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT013", teacherId: "T005", date: "2024-12-10", heureArrivee: "07:38", heureDepart: "17:20", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT014", teacherId: "T006", date: "2024-12-10", heureArrivee: "08:10", heureDepart: "17:00", statut: "Retard", pointageMethode: "Biométrique" },
  { id: "ATT015", teacherId: "T007", date: "2024-12-10", heureArrivee: "07:50", heureDepart: "16:30", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT016", teacherId: "T008", date: "2024-12-10", heureArrivee: "07:25", heureDepart: "17:00", statut: "Présent", pointageMethode: "Badge" },

  { id: "ATT017", teacherId: "T001", date: "2024-12-09", heureArrivee: "07:45", heureDepart: "17:35", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT018", teacherId: "T002", date: "2024-12-09", heureArrivee: "07:50", heureDepart: "17:20", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT019", teacherId: "T003", date: "2024-12-09", heureArrivee: null, heureDepart: null, statut: "Justifié", pointageMethode: "Manuel", justification: "Formation externe" },
  { id: "ATT020", teacherId: "T004", date: "2024-12-09", heureArrivee: "07:40", heureDepart: "17:40", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT021", teacherId: "T005", date: "2024-12-09", heureArrivee: "07:35", heureDepart: "17:15", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT022", teacherId: "T006", date: "2024-12-09", heureArrivee: "07:55", heureDepart: "17:05", statut: "Présent", pointageMethode: "Biométrique" },
  { id: "ATT023", teacherId: "T007", date: "2024-12-09", heureArrivee: "07:52", heureDepart: "16:45", statut: "Présent", pointageMethode: "Badge" },
  { id: "ATT024", teacherId: "T008", date: "2024-12-09", heureArrivee: "07:28", heureDepart: "17:10", statut: "Présent", pointageMethode: "Badge" },
];

// Statistiques d'assiduité par enseignant
export interface TeacherAttendanceStats {
  teacherId: string;
  mois: string;
  joursOuvres: number;
  joursPresent: number;
  joursAbsent: number;
  joursRetard: number;
  joursJustifies: number;
  tauxPresence: number;
  heuresEffectuees: number;
  heuresPrevues: number;
  coursDispenses: number;
  coursAnnules: number;
  tauxRealisation: number;
}

export const mockAttendanceStats: TeacherAttendanceStats[] = [
  { teacherId: "T001", mois: "Décembre 2024", joursOuvres: 22, joursPresent: 20, joursAbsent: 1, joursRetard: 1, joursJustifies: 1, tauxPresence: 95.5, heuresEffectuees: 84, heuresPrevues: 88, coursDispenses: 42, coursAnnules: 2, tauxRealisation: 95.5 },
  { teacherId: "T002", mois: "Décembre 2024", joursOuvres: 22, joursPresent: 21, joursAbsent: 0, joursRetard: 1, joursJustifies: 0, tauxPresence: 100, heuresEffectuees: 78, heuresPrevues: 80, coursDispenses: 39, coursAnnules: 1, tauxRealisation: 97.5 },
  { teacherId: "T003", mois: "Décembre 2024", joursOuvres: 22, joursPresent: 18, joursAbsent: 2, joursRetard: 2, joursJustifies: 2, tauxPresence: 90.9, heuresEffectuees: 44, heuresPrevues: 48, coursDispenses: 22, coursAnnules: 2, tauxRealisation: 91.7 },
  { teacherId: "T004", mois: "Décembre 2024", joursOuvres: 22, joursPresent: 22, joursAbsent: 0, joursRetard: 0, joursJustifies: 0, tauxPresence: 100, heuresEffectuees: 72, heuresPrevues: 72, coursDispenses: 36, coursAnnules: 0, tauxRealisation: 100 },
  { teacherId: "T005", mois: "Décembre 2024", joursOuvres: 22, joursPresent: 19, joursAbsent: 2, joursRetard: 1, joursJustifies: 1, tauxPresence: 90.9, heuresEffectuees: 76, heuresPrevues: 80, coursDispenses: 38, coursAnnules: 2, tauxRealisation: 95 },
  { teacherId: "T006", mois: "Décembre 2024", joursOuvres: 22, joursPresent: 20, joursAbsent: 1, joursRetard: 2, joursJustifies: 0, tauxPresence: 95.5, heuresEffectuees: 62, heuresPrevues: 64, coursDispenses: 31, coursAnnules: 1, tauxRealisation: 96.9 },
  { teacherId: "T007", mois: "Décembre 2024", joursOuvres: 22, joursPresent: 21, joursAbsent: 1, joursRetard: 0, joursJustifies: 1, tauxPresence: 100, heuresEffectuees: 38, heuresPrevues: 40, coursDispenses: 19, coursAnnules: 1, tauxRealisation: 95 },
  { teacherId: "T008", mois: "Décembre 2024", joursOuvres: 22, joursPresent: 22, joursAbsent: 0, joursRetard: 0, joursJustifies: 0, tauxPresence: 100, heuresEffectuees: 96, heuresPrevues: 96, coursDispenses: 48, coursAnnules: 0, tauxRealisation: 100 },
];

// Progression par classe pour chaque enseignant
export interface ClassProgression {
  teacherId: string;
  classe: string;
  matiere: string;
  chapitresPrevus: number;
  chapitresRealises: number;
  heuresPrevues: number;
  heuresRealisees: number;
  tauxProgression: number;
}

export const mockClassProgressions: ClassProgression[] = [
  { teacherId: "T001", classe: "3ème A", matiere: "Mathématiques", chapitresPrevus: 12, chapitresRealises: 9, heuresPrevues: 48, heuresRealisees: 38, tauxProgression: 79 },
  { teacherId: "T001", classe: "3ème B", matiere: "Mathématiques", chapitresPrevus: 12, chapitresRealises: 10, heuresPrevues: 48, heuresRealisees: 42, tauxProgression: 88 },
  { teacherId: "T001", classe: "2nde C", matiere: "Mathématiques", chapitresPrevus: 10, chapitresRealises: 8, heuresPrevues: 40, heuresRealisees: 32, tauxProgression: 80 },
  { teacherId: "T001", classe: "Tle D", matiere: "Mathématiques", chapitresPrevus: 15, chapitresRealises: 12, heuresPrevues: 60, heuresRealisees: 50, tauxProgression: 83 },
  { teacherId: "T002", classe: "6ème A", matiere: "Français", chapitresPrevus: 14, chapitresRealises: 12, heuresPrevues: 56, heuresRealisees: 50, tauxProgression: 89 },
  { teacherId: "T002", classe: "5ème B", matiere: "Français", chapitresPrevus: 14, chapitresRealises: 11, heuresPrevues: 56, heuresRealisees: 46, tauxProgression: 82 },
  { teacherId: "T002", classe: "5ème C", matiere: "Français", chapitresPrevus: 14, chapitresRealises: 13, heuresPrevues: 56, heuresRealisees: 52, tauxProgression: 93 },
  { teacherId: "T002", classe: "4ème A", matiere: "Français", chapitresPrevus: 12, chapitresRealises: 10, heuresPrevues: 48, heuresRealisees: 40, tauxProgression: 83 },
];

// Fonction utilitaire pour obtenir un enseignant par ID
export function getTeacherById(id: string): Teacher | undefined {
  return mockTeachers.find(t => t.id === id);
}

// Fonction pour obtenir l'emploi du temps d'un enseignant
export function getTeacherSchedule(teacherId: string): TeacherSchedule[] {
  return mockSchedules.filter(s => s.teacherId === teacherId);
}

// Fonction pour obtenir les cours d'un enseignant
export function getTeacherCourses(teacherId: string): CourseSession[] {
  return mockCourseSessions.filter(c => c.teacherId === teacherId);
}

// Fonction pour obtenir les pointages d'un enseignant
export function getTeacherAttendance(teacherId: string): AttendanceRecord[] {
  return mockAttendanceRecords.filter(a => a.teacherId === teacherId);
}

// Fonction pour obtenir les stats d'un enseignant
export function getTeacherStats(teacherId: string): TeacherAttendanceStats | undefined {
  return mockAttendanceStats.find(s => s.teacherId === teacherId);
}

// Fonction pour obtenir la progression des classes d'un enseignant
export function getTeacherProgressions(teacherId: string): ClassProgression[] {
  return mockClassProgressions.filter(p => p.teacherId === teacherId);
}
