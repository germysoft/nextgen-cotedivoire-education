// Types pour le système de bulletins scolaires

export type BulletinTemplate = 'classic' | 'modern' | 'detailed' | 'compact' | 'colorful';

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  coefficient: number;
  grades: {
    trimester1?: number;
    trimester2?: number;
    trimester3?: number;
  };
  average: number;
  maxGrade: number;
  classAverage: number;
  comment?: string;
  teacherName: string;
}

export interface StudentBulletin {
  studentId: string;
  studentName: string;
  studentNumber: string;
  classId: string;
  className: string;
  trimester: 1 | 2 | 3;
  academicYear: string;
  subjects: SubjectGrade[];
  generalAverage: number;
  classGeneralAverage: number;
  rank: number;
  totalStudents: number;
  absences: number;
  tardiness: number;
  disciplinePoints: number;
  generalComment?: string;
  directorComment?: string;
  appreciations: {
    work: 'excellent' | 'good' | 'average' | 'insufficient';
    behavior: 'excellent' | 'good' | 'average' | 'insufficient';
    participation: 'excellent' | 'good' | 'average' | 'insufficient';
  };
}

export interface BulletinGenerationConfig {
  template: BulletinTemplate;
  trimester: 1 | 2 | 3;
  classIds: string[];
  includeGraphs: boolean;
  includeComments: boolean;
  includeSignatureSpace: boolean;
  sendToParents: boolean;
  sendMethod: 'email' | 'sms' | 'both';
}
