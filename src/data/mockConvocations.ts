import { StudentAlert, Convocation, ConvocationTemplate } from "@/types/convocation";

// Élèves détectés automatiquement en difficulté
export const mockStudentAlerts: StudentAlert[] = [
  {
    studentId: "s3",
    studentName: "Ibrahima Sarr",
    studentNumber: "2024003",
    classId: "6emeA",
    className: "6ème A",
    alertType: "academic_difficulty",
    severity: "high",
    details: {
      academicAverage: 8.5,
      absenceCount: 8,
      tardinessCount: 5,
      disciplinePoints: 75,
      failingSubjects: ["Mathématiques", "Français", "Anglais"],
    },
    autoDetected: true,
    detectionDate: "2024-11-25",
  },
  {
    studentId: "s4",
    studentName: "Fatou Gueye",
    studentNumber: "2024004",
    classId: "5emeB",
    className: "5ème B",
    alertType: "repeated_absences",
    severity: "urgent",
    details: {
      academicAverage: 11.2,
      absenceCount: 15,
      tardinessCount: 8,
      disciplinePoints: 80,
    },
    autoDetected: true,
    detectionDate: "2024-11-22",
  },
  {
    studentId: "s5",
    studentName: "Ousmane Diop",
    studentNumber: "2024005",
    classId: "4emeC",
    className: "4ème C",
    alertType: "behavior_issue",
    severity: "high",
    details: {
      academicAverage: 12.5,
      absenceCount: 3,
      tardinessCount: 12,
      disciplinePoints: 55,
      recentIncidents: [
        "Altercation avec un camarade - 15/11",
        "Manque de respect envers un enseignant - 10/11",
        "Perturbation en classe - 05/11"
      ],
    },
    autoDetected: true,
    detectionDate: "2024-11-20",
  },
  {
    studentId: "s6",
    studentName: "Awa Fall",
    studentNumber: "2024006",
    classId: "3emeA",
    className: "3ème A",
    alertType: "attitude_problem",
    severity: "medium",
    details: {
      academicAverage: 9.8,
      absenceCount: 6,
      tardinessCount: 10,
      disciplinePoints: 70,
      failingSubjects: ["Mathématiques", "Physique"],
    },
    autoDetected: true,
    detectionDate: "2024-11-18",
  },
];

// Convocations existantes
export const mockConvocations: Convocation[] = [
  {
    id: "conv_001",
    studentId: "s3",
    studentName: "Ibrahima Sarr",
    studentNumber: "2024003",
    classId: "6emeA",
    className: "6ème A",
    parentName: "Mme Sarr Aissatou",
    parentEmail: "aissatou.sarr@email.com",
    parentPhone: "+221 77 123 45 67",
    reason: "academic_difficulty",
    priority: "high",
    status: "sent",
    createdDate: "2024-11-25",
    sentDate: "2024-11-26",
    appointmentDate: "2024-12-02",
    appointmentTime: "14:00",
    location: "Bureau du Directeur",
    convener: "M. Diagne",
    convenerRole: "Directeur",
    customMessage: "Nous souhaitons discuter des résultats scolaires de votre fils qui nécessitent une attention particulière.",
    followUpRequired: true,
  },
  {
    id: "conv_002",
    studentId: "s4",
    studentName: "Fatou Gueye",
    studentNumber: "2024004",
    classId: "5emeB",
    className: "5ème B",
    parentName: "M. Gueye Mamadou",
    parentEmail: "mamadou.gueye@email.com",
    parentPhone: "+221 77 234 56 78",
    reason: "repeated_absences",
    priority: "urgent",
    status: "confirmed",
    createdDate: "2024-11-22",
    sentDate: "2024-11-23",
    appointmentDate: "2024-11-30",
    appointmentTime: "10:00",
    location: "Bureau du CPE",
    convener: "Mme Ndiaye",
    convenerRole: "CPE",
    customMessage: "Les absences répétées de votre fille compromettent sa scolarité. Votre présence est indispensable.",
    followUpRequired: true,
  },
  {
    id: "conv_003",
    studentId: "s5",
    studentName: "Ousmane Diop",
    studentNumber: "2024005",
    classId: "4emeC",
    className: "4ème C",
    parentName: "M. Diop Cheikh",
    parentPhone: "+221 77 345 67 89",
    reason: "behavior_issue",
    priority: "high",
    status: "completed",
    createdDate: "2024-11-15",
    sentDate: "2024-11-16",
    appointmentDate: "2024-11-20",
    appointmentTime: "15:30",
    location: "Salle de réunion",
    convener: "M. Diagne",
    convenerRole: "Directeur",
    outcome: "Engagement pris par les parents de suivre le comportement. Mise en place d'un suivi hebdomadaire.",
    followUpRequired: true,
  },
];

// Templates de courriers
export const mockConvocationTemplates: ConvocationTemplate[] = [
  {
    id: "tpl_academic",
    name: "Difficultés scolaires",
    reason: "academic_difficulty",
    subject: "Convocation - Suivi scolaire de {studentName}",
    content: `Madame, Monsieur,

Nous avons le regret de constater que {studentName}, élève de {className}, rencontre des difficultés dans sa scolarité.

Moyenne générale actuelle : {average}/20
Matières en difficulté : {failingSubjects}

Afin de trouver ensemble les solutions appropriées et de mettre en place un accompagnement adapté, nous vous convions à un entretien le {appointmentDate} à {appointmentTime} dans {location}.

Votre présence est essentielle pour le bien-être et la réussite scolaire de votre enfant.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

{convener}
{convenerRole}`,
    variables: ["studentName", "className", "average", "failingSubjects", "appointmentDate", "appointmentTime", "location", "convener", "convenerRole"],
  },
  {
    id: "tpl_absences",
    name: "Absences répétées",
    reason: "repeated_absences",
    subject: "URGENT - Convocation pour absences de {studentName}",
    content: `Madame, Monsieur,

Nous constatons avec préoccupation que {studentName}, élève de {className}, cumule {absenceCount} absences depuis le début du trimestre.

Ces absences répétées compromettent sérieusement la scolarité de votre enfant et peuvent entraîner des sanctions disciplinaires conformément au règlement intérieur.

Nous vous convoquons IMPÉRATIVEMENT le {appointmentDate} à {appointmentTime} dans {location}.

En cas d'impossibilité, merci de nous contacter au plus vite pour fixer un autre rendez-vous.

{convener}
{convenerRole}`,
    variables: ["studentName", "className", "absenceCount", "appointmentDate", "appointmentTime", "location", "convener", "convenerRole"],
  },
  {
    id: "tpl_behavior",
    name: "Problème de comportement",
    reason: "behavior_issue",
    subject: "Convocation urgente - Comportement de {studentName}",
    content: `Madame, Monsieur,

Le comportement de {studentName}, élève de {className}, nécessite une intervention urgente.

Incidents récents :
{recentIncidents}

Points de discipline restants : {disciplinePoints}/100

Nous devons absolument vous rencontrer pour discuter de cette situation et éviter des sanctions plus graves.

Rendez-vous fixé le {appointmentDate} à {appointmentTime} dans {location}.

Votre présence est OBLIGATOIRE.

{convener}
{convenerRole}`,
    variables: ["studentName", "className", "recentIncidents", "disciplinePoints", "appointmentDate", "appointmentTime", "location", "convener", "convenerRole"],
  },
  {
    id: "tpl_orientation",
    name: "Orientation scolaire",
    reason: "orientation",
    subject: "Entretien d'orientation - {studentName}",
    content: `Madame, Monsieur,

Dans le cadre du suivi de l'orientation scolaire de {studentName}, élève de {className}, nous souhaitons faire un point avec vous sur son parcours et ses perspectives d'avenir.

Cet entretien permettra de :
- Faire le bilan du trimestre
- Discuter des options d'orientation
- Définir ensemble les objectifs

Rendez-vous proposé le {appointmentDate} à {appointmentTime} dans {location}.

Merci de confirmer votre présence.

Cordialement,

{convener}
{convenerRole}`,
    variables: ["studentName", "className", "appointmentDate", "appointmentTime", "location", "convener", "convenerRole"],
  },
];
