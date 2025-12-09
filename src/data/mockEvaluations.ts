import { Evaluation, ObjectifSMART } from "@/types/evaluation";

export const mockEvaluations: Evaluation[] = [
  {
    id: "eval-001",
    personnelId: "1",
    evaluateurId: "dir-001",
    evaluateurNom: "M. Kouassi Jean-Pierre",
    periode: "2023-2024",
    dateEvaluation: "2024-06-15",
    typeEvaluation: "Annuelle",
    statut: "Validée",
    criteres: [
      { id: "c1", categorie: "competences_techniques", critere: "Maîtrise du domaine d'expertise", note: 5, poids: 20 },
      { id: "c2", categorie: "competences_techniques", critere: "Qualité du travail fourni", note: 4, poids: 20 },
      { id: "c3", categorie: "competences_relationnelles", critere: "Communication orale et écrite", note: 4, poids: 15 },
      { id: "c4", categorie: "competences_relationnelles", critere: "Travail en équipe", note: 5, poids: 15 },
      { id: "c5", categorie: "engagement", critere: "Ponctualité et assiduité", note: 5, poids: 15 },
      { id: "c6", categorie: "engagement", critere: "Implication dans les projets", note: 4, poids: 15 },
    ],
    objectifsPrecedents: [
      {
        id: "obj-001",
        titre: "Améliorer les résultats au BEPC",
        description: "Augmenter le taux de réussite des élèves au BEPC en mathématiques",
        specifique: "Augmenter le taux de réussite de 75% à 85%",
        mesurable: "Taux de réussite au BEPC en mathématiques",
        atteignable: "Renforcement des cours de soutien",
        realiste: "Basé sur les résultats des années précédentes",
        temporel: "Fin de l'année scolaire 2023-2024",
        dateEcheance: "2024-06-30",
        progression: 100,
        statut: "Atteint",
        commentaires: "Objectif atteint avec un taux de 87%"
      },
      {
        id: "obj-002",
        titre: "Formation en pédagogie numérique",
        description: "Suivre une formation sur l'utilisation des outils numériques en classe",
        specifique: "Maîtriser 3 outils pédagogiques numériques",
        mesurable: "Certification obtenue",
        atteignable: "Formation disponible en ligne",
        realiste: "10h de formation sur 6 mois",
        temporel: "Décembre 2023",
        dateEcheance: "2023-12-31",
        progression: 100,
        statut: "Atteint"
      }
    ],
    objectifsFuturs: [
      {
        id: "obj-003",
        titre: "Mentorat des nouveaux enseignants",
        description: "Accompagner 2 nouveaux enseignants dans leur prise de fonction",
        specifique: "Assurer le suivi de 2 enseignants stagiaires",
        mesurable: "Évaluations positives des stagiaires",
        atteignable: "Expérience et disponibilité confirmées",
        realiste: "2h par semaine",
        temporel: "Année scolaire 2024-2025",
        dateEcheance: "2025-06-30",
        progression: 0,
        statut: "En cours"
      }
    ],
    noteGlobale: 4.5,
    appreciationGenerale: "Excellent professeur, très impliqué et apprécié des élèves et collègues.",
    pointsForts: ["Pédagogie exemplaire", "Résultats des élèves", "Esprit d'équipe"],
    axesAmelioration: ["Communication écrite", "Utilisation du numérique"],
    besoinsFormation: ["Formation avancée TICE", "Gestion de projets pédagogiques"],
    signatureEmploye: {
      date: "2024-06-16",
      accord: true,
      commentaire: "Je suis d'accord avec cette évaluation"
    },
    signatureEvaluateur: {
      date: "2024-06-15"
    },
    signatureDirection: {
      date: "2024-06-18",
      commentaire: "Excellent élément à promouvoir"
    },
    dateCreation: "2024-06-10",
    dateModification: "2024-06-18"
  }
];

export function generateEvaluationId(): string {
  return `eval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateObjectifId(): string {
  return `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
