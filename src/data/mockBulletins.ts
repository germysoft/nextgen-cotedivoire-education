import { StudentBulletin } from "@/types/bulletin";

export const mockBulletins: StudentBulletin[] = [
  {
    studentId: "s1",
    studentName: "Aminata Diallo",
    studentNumber: "2024001",
    classId: "6emeA",
    className: "6ème A",
    trimester: 1,
    academicYear: "2024-2025",
    generalAverage: 15.5,
    classGeneralAverage: 13.2,
    rank: 3,
    totalStudents: 35,
    absences: 2,
    tardiness: 1,
    disciplinePoints: 95,
    generalComment: "Excellente élève, très attentive en classe. Bon travail, continuez ainsi !",
    directorComment: "Félicitations pour ces résultats encourageants.",
    appreciations: {
      work: "excellent",
      behavior: "excellent",
      participation: "excellent"
    },
    subjects: [
      {
        subjectId: "math",
        subjectName: "Mathématiques",
        coefficient: 3,
        grades: { trimester1: 16 },
        average: 16,
        maxGrade: 20,
        classAverage: 13.5,
        comment: "Très bonne élève, raisonnement logique excellent",
        teacherName: "M. Dupont"
      },
      {
        subjectId: "francais",
        subjectName: "Français",
        coefficient: 3,
        grades: { trimester1: 15 },
        average: 15,
        maxGrade: 20,
        classAverage: 12.8,
        comment: "Expression écrite soignée, bonne maîtrise de l'orthographe",
        teacherName: "Mme Martin"
      },
      {
        subjectId: "anglais",
        subjectName: "Anglais",
        coefficient: 2,
        grades: { trimester1: 17 },
        average: 17,
        maxGrade: 20,
        classAverage: 13.1,
        comment: "Excellent niveau, participation active",
        teacherName: "M. Brown"
      },
      {
        subjectId: "histoire",
        subjectName: "Histoire-Géographie",
        coefficient: 2,
        grades: { trimester1: 14 },
        average: 14,
        maxGrade: 20,
        classAverage: 12.5,
        comment: "Bonne acquisition des connaissances",
        teacherName: "Mme Lefebvre"
      },
      {
        subjectId: "svt",
        subjectName: "SVT",
        coefficient: 2,
        grades: { trimester1: 15.5 },
        average: 15.5,
        maxGrade: 20,
        classAverage: 13,
        comment: "Élève sérieuse et investie",
        teacherName: "M. Bernard"
      },
      {
        subjectId: "physique",
        subjectName: "Physique-Chimie",
        coefficient: 2,
        grades: { trimester1: 14.5 },
        average: 14.5,
        maxGrade: 20,
        classAverage: 12.2,
        comment: "Bons résultats, travail régulier",
        teacherName: "Mme Dupuis"
      },
      {
        subjectId: "eps",
        subjectName: "EPS",
        coefficient: 1,
        grades: { trimester1: 16 },
        average: 16,
        maxGrade: 20,
        classAverage: 14.5,
        comment: "Très sportive, bon esprit d'équipe",
        teacherName: "M. Sow"
      },
      {
        subjectId: "arts",
        subjectName: "Arts Plastiques",
        coefficient: 1,
        grades: { trimester1: 15 },
        average: 15,
        maxGrade: 20,
        classAverage: 13.8,
        comment: "Créativité appréciable",
        teacherName: "Mme Fall"
      }
    ]
  },
  {
    studentId: "s2",
    studentName: "Moussa Ndiaye",
    studentNumber: "2024002",
    classId: "6emeA",
    className: "6ème A",
    trimester: 1,
    academicYear: "2024-2025",
    generalAverage: 12.8,
    classGeneralAverage: 13.2,
    rank: 18,
    totalStudents: 35,
    absences: 5,
    tardiness: 3,
    disciplinePoints: 85,
    generalComment: "Élève sérieux mais manque parfois de régularité dans le travail. Attention aux absences.",
    appreciations: {
      work: "good",
      behavior: "good",
      participation: "average"
    },
    subjects: [
      {
        subjectId: "math",
        subjectName: "Mathématiques",
        coefficient: 3,
        grades: { trimester1: 13 },
        average: 13,
        maxGrade: 20,
        classAverage: 13.5,
        comment: "Peut mieux faire avec plus de travail personnel",
        teacherName: "M. Dupont"
      },
      {
        subjectId: "francais",
        subjectName: "Français",
        coefficient: 3,
        grades: { trimester1: 11.5 },
        average: 11.5,
        maxGrade: 20,
        classAverage: 12.8,
        comment: "Doit améliorer l'expression écrite",
        teacherName: "Mme Martin"
      },
      {
        subjectId: "anglais",
        subjectName: "Anglais",
        coefficient: 2,
        grades: { trimester1: 12 },
        average: 12,
        maxGrade: 20,
        classAverage: 13.1,
        comment: "Participation timide, doit s'exprimer davantage",
        teacherName: "M. Brown"
      },
      {
        subjectId: "histoire",
        subjectName: "Histoire-Géographie",
        coefficient: 2,
        grades: { trimester1: 13.5 },
        average: 13.5,
        maxGrade: 20,
        classAverage: 12.5,
        comment: "Bonnes connaissances historiques",
        teacherName: "Mme Lefebvre"
      },
      {
        subjectId: "svt",
        subjectName: "SVT",
        coefficient: 2,
        grades: { trimester1: 12 },
        average: 12,
        maxGrade: 20,
        classAverage: 13,
        comment: "Résultats corrects",
        teacherName: "M. Bernard"
      },
      {
        subjectId: "physique",
        subjectName: "Physique-Chimie",
        coefficient: 2,
        grades: { trimester1: 11.5 },
        average: 11.5,
        maxGrade: 20,
        classAverage: 12.2,
        comment: "Doit revoir les bases",
        teacherName: "Mme Dupuis"
      },
      {
        subjectId: "eps",
        subjectName: "EPS",
        coefficient: 1,
        grades: { trimester1: 15 },
        average: 15,
        maxGrade: 20,
        classAverage: 14.5,
        comment: "Très bon en sport",
        teacherName: "M. Sow"
      },
      {
        subjectId: "arts",
        subjectName: "Arts Plastiques",
        coefficient: 1,
        grades: { trimester1: 13 },
        average: 13,
        maxGrade: 20,
        classAverage: 13.8,
        comment: "Bon travail",
        teacherName: "Mme Fall"
      }
    ]
  }
];
