// Types pour le système de convocations parents

export type ConvocationReason = 
  | 'academic_difficulty'      // Difficultés scolaires
  | 'behavior_issue'           // Problème de comportement
  | 'repeated_absences'        // Absences répétées
  | 'attitude_problem'         // Problème d'attitude
  | 'orientation'              // Orientation scolaire
  | 'exclusion_risk'          // Risque d'exclusion
  | 'other';                   // Autre motif

export type ConvocationStatus = 
  | 'pending'                  // En attente
  | 'sent'                     // Envoyée
  | 'confirmed'                // Confirmée
  | 'completed'                // Réalisée
  | 'cancelled'                // Annulée
  | 'no_show';                 // Parent absent

export type ConvocationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface StudentAlert {
  studentId: string;
  studentName: string;
  studentNumber: string;
  classId: string;
  className: string;
  alertType: ConvocationReason;
  severity: ConvocationPriority;
  details: {
    academicAverage?: number;
    absenceCount?: number;
    tardinessCount?: number;
    disciplinePoints?: number;
    failingSubjects?: string[];
    recentIncidents?: string[];
  };
  autoDetected: boolean;
  detectionDate: string;
}

export interface Convocation {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  classId: string;
  className: string;
  parentName: string;
  parentEmail?: string;
  parentPhone?: string;
  reason: ConvocationReason;
  priority: ConvocationPriority;
  status: ConvocationStatus;
  createdDate: string;
  sentDate?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  location?: string;
  convener: string; // Personne qui convoque
  convenerRole: string; // Rôle (Directeur, CPE, etc.)
  customMessage?: string;
  notes?: string;
  outcome?: string;
  followUpRequired: boolean;
}

export interface ConvocationTemplate {
  id: string;
  name: string;
  reason: ConvocationReason;
  subject: string;
  content: string;
  variables: string[]; // Variables disponibles: {studentName}, {className}, etc.
}
