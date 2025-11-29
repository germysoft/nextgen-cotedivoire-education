import { Widget } from "@/types/dashboard";

export const availableWidgets: Widget[] = [
  // Stats Widgets
  {
    id: "stats-students",
    type: "stats-students",
    title: "Total Élèves",
    description: "Nombre total d'élèves inscrits",
    icon: "Users",
    category: "stats",
  },
  {
    id: "stats-payments",
    type: "stats-payments",
    title: "Paiements du Mois",
    description: "Montant total des paiements reçus",
    icon: "DollarSign",
    category: "stats",
  },
  {
    id: "stats-teachers",
    type: "stats-teachers",
    title: "Enseignants",
    description: "Nombre d'enseignants actifs",
    icon: "GraduationCap",
    category: "stats",
  },
  {
    id: "stats-absences",
    type: "stats-absences",
    title: "Absences Aujourd'hui",
    description: "Nombre d'absences signalées",
    icon: "UserX",
    category: "stats",
  },

  // Chart Widgets
  {
    id: "payment-chart",
    type: "payment-chart",
    title: "Évolution des Paiements",
    description: "Graphique des paiements sur 6 mois",
    icon: "BarChart3",
    category: "charts",
  },
  {
    id: "attendance-chart",
    type: "attendance-chart",
    title: "Taux de Présence",
    description: "Évolution de l'assiduité par mois",
    icon: "LineChart",
    category: "charts",
  },
  {
    id: "class-distribution",
    type: "class-distribution",
    title: "Répartition par Classe",
    description: "Distribution des élèves par niveau",
    icon: "PieChart",
    category: "charts",
  },

  // List Widgets
  {
    id: "recent-payments",
    type: "recent-payments",
    title: "Paiements Récents",
    description: "Derniers paiements enregistrés",
    icon: "Receipt",
    category: "lists",
  },
  {
    id: "recent-absences",
    type: "recent-absences",
    title: "Absences Récentes",
    description: "Dernières absences signalées",
    icon: "AlertCircle",
    category: "lists",
  },
  {
    id: "upcoming-events",
    type: "upcoming-events",
    title: "Événements à Venir",
    description: "Prochains événements scolaires",
    icon: "Calendar",
    category: "lists",
  },
  {
    id: "alerts-summary",
    type: "alerts-summary",
    title: "Alertes Importantes",
    description: "Résumé des alertes et impayés",
    icon: "AlertTriangle",
    category: "lists",
  },

  // Action Widgets
  {
    id: "quick-actions",
    type: "quick-actions",
    title: "Actions Rapides",
    description: "Raccourcis vers les fonctions principales",
    icon: "Zap",
    category: "actions",
  },
];
