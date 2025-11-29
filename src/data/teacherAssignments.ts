// Mock data pour les attributions enseignant-classe-matière
// En production, ces données viendront de la base de données

export interface TeacherAssignment {
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
}

// Simule différents enseignants avec leurs attributions
export const mockTeacherAssignments: TeacherAssignment[] = [
  // Enseignant 1 - Prof de Maths
  {
    teacherId: "teacher_1",
    teacherName: "M. Dupont",
    classId: "6emeA",
    className: "6èmeA",
    subjectId: "maths",
    subjectName: "Mathématiques"
  },
  {
    teacherId: "teacher_1",
    teacherName: "M. Dupont",
    classId: "5emeB",
    className: "5èmeB",
    subjectId: "maths",
    subjectName: "Mathématiques"
  },
  
  // Enseignant 2 - Prof de Français
  {
    teacherId: "teacher_2",
    teacherName: "Mme Martin",
    classId: "6emeA",
    className: "6èmeA",
    subjectId: "francais",
    subjectName: "Français"
  },
  {
    teacherId: "teacher_2",
    teacherName: "Mme Martin",
    classId: "4emeC",
    className: "4èmeC",
    subjectId: "francais",
    subjectName: "Français"
  },
  
  // Enseignant 3 - Prof d'Anglais
  {
    teacherId: "teacher_3",
    teacherName: "M. Brown",
    classId: "3emeA",
    className: "3èmeA",
    subjectId: "anglais",
    subjectName: "Anglais"
  },
  {
    teacherId: "teacher_3",
    teacherName: "M. Brown",
    classId: "4emeC",
    className: "4èmeC",
    subjectId: "anglais",
    subjectName: "Anglais"
  },
  
  // Enseignant 4 - Prof d'Histoire-Géo
  {
    teacherId: "teacher_4",
    teacherName: "Mme Lefebvre",
    classId: "5emeB",
    className: "5èmeB",
    subjectId: "histoire",
    subjectName: "Histoire-Géographie"
  },
  {
    teacherId: "teacher_4",
    teacherName: "Mme Lefebvre",
    classId: "3emeA",
    className: "3èmeA",
    subjectId: "histoire",
    subjectName: "Histoire-Géographie"
  },
  
  // Enseignant 5 - Prof de SVT
  {
    teacherId: "teacher_5",
    teacherName: "M. Bernard",
    classId: "6emeA",
    className: "6èmeA",
    subjectId: "svt",
    subjectName: "SVT"
  },
  {
    teacherId: "teacher_5",
    teacherName: "M. Bernard",
    classId: "5emeB",
    className: "5èmeB",
    subjectId: "svt",
    subjectName: "SVT"
  },
];

// Fonction pour obtenir les classes d'un enseignant
export function getTeacherClasses(teacherId: string) {
  const assignments = mockTeacherAssignments.filter(a => a.teacherId === teacherId);
  const uniqueClasses = Array.from(new Set(assignments.map(a => a.classId)))
    .map(classId => {
      const assignment = assignments.find(a => a.classId === classId)!;
      return { id: classId, name: assignment.className };
    });
  return uniqueClasses;
}

// Fonction pour obtenir les matières d'un enseignant pour une classe donnée
export function getTeacherSubjectsForClass(teacherId: string, classId: string) {
  const assignments = mockTeacherAssignments.filter(
    a => a.teacherId === teacherId && a.classId === classId
  );
  return assignments.map(a => ({ id: a.subjectId, name: a.subjectName }));
}

// Fonction pour obtenir toutes les matières d'un enseignant (toutes classes confondues)
export function getTeacherSubjects(teacherId: string) {
  const assignments = mockTeacherAssignments.filter(a => a.teacherId === teacherId);
  const uniqueSubjects = Array.from(new Set(assignments.map(a => a.subjectId)))
    .map(subjectId => {
      const assignment = assignments.find(a => a.subjectId === subjectId)!;
      return { id: subjectId, name: assignment.subjectName };
    });
  return uniqueSubjects;
}
