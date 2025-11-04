import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.students': 'Élèves',
    'nav.teachers': 'Enseignants',
    'nav.classes': 'Classes',
    'nav.grades': 'Notes',
    'nav.schedule': 'Emploi du Temps',
    'nav.finance': 'Finance',
    'nav.statistics': 'Statistiques',
    'nav.messages': 'Messages',
    'nav.infrastructure': 'Infrastructure',
    'nav.settings': 'Paramètres',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord',
    'dashboard.subtitle': "Vue d'ensemble de l'établissement",
    'dashboard.totalStudents': 'Total Élèves',
    'dashboard.teachers': 'Enseignants',
    'dashboard.classes': 'Classes',
    'dashboard.attendance': 'Taux de Présence',
    'dashboard.enrollmentByLevel': 'Effectif par Niveau',
    'dashboard.performanceEvolution': 'Évolution des Moyennes',
    'dashboard.recentActivities': 'Activités Récentes',
    'dashboard.quickActions': 'Actions Rapides',
    
    // Students
    'students.title': 'Gestion des Élèves',
    'students.subtitle': 'Liste complète des élèves inscrits',
    'students.addNew': 'Nouvel Élève',
    'students.list': 'Liste des Élèves',
    'students.search': 'Rechercher...',
    'students.matricule': 'Matricule',
    'students.fullName': 'Nom Complet',
    'students.class': 'Classe',
    'students.age': 'Âge',
    'students.status': 'Statut',
    'students.fees': 'Frais',
    'students.actions': 'Actions',
    
    // Teachers
    'teachers.title': 'Gestion des Enseignants',
    'teachers.subtitle': "Corps professoral de l'établissement",
    'teachers.addNew': 'Nouvel Enseignant',
    'teachers.permanentTeachers': 'Enseignants Permanents',
    'teachers.contractors': 'Vacataires',
    'teachers.attendanceRate': 'Taux de Présence',
    'teachers.list': 'Liste des Enseignants',
    'teachers.subject': 'Matière',
    'teachers.classes': 'Classes',
    'teachers.contact': 'Contact',
    'teachers.status': 'Statut',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.signIn': 'Se connecter',
    'auth.welcome': 'Bienvenue sur NextGen Éducation',
    'auth.subtitle': 'Gestion intégrale des établissements scolaires',
    
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.export': 'Exporter',
    'common.print': 'Imprimer',
    'common.loading': 'Chargement...',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.students': 'Students',
    'nav.teachers': 'Teachers',
    'nav.classes': 'Classes',
    'nav.grades': 'Grades',
    'nav.schedule': 'Schedule',
    'nav.finance': 'Finance',
    'nav.statistics': 'Statistics',
    'nav.messages': 'Messages',
    'nav.infrastructure': 'Infrastructure',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'School overview',
    'dashboard.totalStudents': 'Total Students',
    'dashboard.teachers': 'Teachers',
    'dashboard.classes': 'Classes',
    'dashboard.attendance': 'Attendance Rate',
    'dashboard.enrollmentByLevel': 'Enrollment by Level',
    'dashboard.performanceEvolution': 'Performance Evolution',
    'dashboard.recentActivities': 'Recent Activities',
    'dashboard.quickActions': 'Quick Actions',
    
    // Students
    'students.title': 'Student Management',
    'students.subtitle': 'Complete list of enrolled students',
    'students.addNew': 'New Student',
    'students.list': 'Student List',
    'students.search': 'Search...',
    'students.matricule': 'ID Number',
    'students.fullName': 'Full Name',
    'students.class': 'Class',
    'students.age': 'Age',
    'students.status': 'Status',
    'students.fees': 'Fees',
    'students.actions': 'Actions',
    
    // Teachers
    'teachers.title': 'Teacher Management',
    'teachers.subtitle': 'School teaching staff',
    'teachers.addNew': 'New Teacher',
    'teachers.permanentTeachers': 'Permanent Teachers',
    'teachers.contractors': 'Contractors',
    'teachers.attendanceRate': 'Attendance Rate',
    'teachers.list': 'Teacher List',
    'teachers.subject': 'Subject',
    'teachers.classes': 'Classes',
    'teachers.contact': 'Contact',
    'teachers.status': 'Status',
    
    // Auth
    'auth.login': 'Login',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.signIn': 'Sign in',
    'auth.welcome': 'Welcome to NextGen Education',
    'auth.subtitle': 'Comprehensive school management system',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.print': 'Print',
    'common.loading': 'Loading...',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.students': 'Estudiantes',
    'nav.teachers': 'Profesores',
    'nav.classes': 'Clases',
    'nav.grades': 'Notas',
    'nav.schedule': 'Horario',
    'nav.finance': 'Finanzas',
    'nav.statistics': 'Estadísticas',
    'nav.messages': 'Mensajes',
    'nav.infrastructure': 'Infraestructura',
    'nav.settings': 'Configuración',
    
    // Dashboard
    'dashboard.title': 'Panel de Control',
    'dashboard.subtitle': 'Vista general del establecimiento',
    'dashboard.totalStudents': 'Total Estudiantes',
    'dashboard.teachers': 'Profesores',
    'dashboard.classes': 'Clases',
    'dashboard.attendance': 'Tasa de Asistencia',
    'dashboard.enrollmentByLevel': 'Matrícula por Nivel',
    'dashboard.performanceEvolution': 'Evolución del Rendimiento',
    'dashboard.recentActivities': 'Actividades Recientes',
    'dashboard.quickActions': 'Acciones Rápidas',
    
    // Students
    'students.title': 'Gestión de Estudiantes',
    'students.subtitle': 'Lista completa de estudiantes inscritos',
    'students.addNew': 'Nuevo Estudiante',
    'students.list': 'Lista de Estudiantes',
    'students.search': 'Buscar...',
    'students.matricule': 'Matrícula',
    'students.fullName': 'Nombre Completo',
    'students.class': 'Clase',
    'students.age': 'Edad',
    'students.status': 'Estado',
    'students.fees': 'Cuotas',
    'students.actions': 'Acciones',
    
    // Teachers
    'teachers.title': 'Gestión de Profesores',
    'teachers.subtitle': 'Cuerpo docente del establecimiento',
    'teachers.addNew': 'Nuevo Profesor',
    'teachers.permanentTeachers': 'Profesores Permanentes',
    'teachers.contractors': 'Contratados',
    'teachers.attendanceRate': 'Tasa de Asistencia',
    'teachers.list': 'Lista de Profesores',
    'teachers.subject': 'Materia',
    'teachers.classes': 'Clases',
    'teachers.contact': 'Contacto',
    'teachers.status': 'Estado',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.email': 'Correo',
    'auth.password': 'Contraseña',
    'auth.rememberMe': 'Recordarme',
    'auth.forgotPassword': '¿Olvidó su contraseña?',
    'auth.signIn': 'Entrar',
    'auth.welcome': 'Bienvenido a NextGen Educación',
    'auth.subtitle': 'Sistema integral de gestión escolar',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.print': 'Imprimir',
    'common.loading': 'Cargando...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
