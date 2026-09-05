import { z } from 'zod';
import { createCrudRouter } from '../utils/crudFactory';
import { PermissionModule } from '../lib/permissions';

/**
 * Toutes les entités du schéma qui n'ont pas de logique métier sur-mesure
 * (voir eleves/personnel/pedagogie/notes/finance/bibliotheque/infirmerie/
 * messagerie/examens/portail-parents .routes.ts) reçoivent ici un vrai
 * routeur REST générique (list/get/create/update/delete), monté dans
 * routes/index.ts derrière le contrôle d'accès du module concerné.
 *
 * C'est ce qui permet de couvrir la totalité du schéma sans avoir à écrire
 * 90 contrôleurs quasi identiques : chaque entrée reste néanmoins un vrai
 * point d'entrée Prisma, pas une simulation.
 */
export const genericResources: Array<{ path: string; module: PermissionModule; model: string; searchableFields?: string[] }> = [
  // --- Établissement / calendrier ---
  { path: '/etablissement', module: 'parametrage', model: 'etablissement' },
  { path: '/annees-scolaires', module: 'parametrage', model: 'anneeScolaire' },
  { path: '/periodes-scolaires', module: 'parametrage', model: 'periodeScolaire' },
  { path: '/calendrier', module: 'dashboards', model: 'evenementCalendrier', searchableFields: ['titre'] },

  // --- RH complémentaire ---
  { path: '/rh/diplomes', module: 'rh', model: 'diplome' },
  { path: '/rh/formations', module: 'rh', model: 'formation' },
  { path: '/rh/contrats', module: 'rh', model: 'contrat' },
  { path: '/rh/recrutements', module: 'rh', model: 'recrutement', searchableFields: ['poste'] },
  { path: '/rh/candidatures', module: 'rh', model: 'candidature', searchableFields: ['nomCandidat'] },
  { path: '/rh/entretiens', module: 'rh', model: 'entretien' },

  // --- Pédagogie complémentaire ---
  { path: '/pedagogie/salles', module: 'infrastructures', model: 'salle', searchableFields: ['nom'] },
  { path: '/pedagogie/conseils-classe', module: 'pedagogie', model: 'conseilClasse' },
  { path: '/pedagogie/elearning', module: 'pedagogie', model: 'ressourceElearning', searchableFields: ['titre'] },
  { path: '/scolarite/absences', module: 'scolarite', model: 'absence' },
  { path: '/scolarite/documents', module: 'scolarite', model: 'documentEleve' },
  { path: '/scolarite/certificats', module: 'scolarite', model: 'certificat' },
  { path: '/scolarite/inscriptions', module: 'scolarite', model: 'inscription' },
  { path: '/scolarite/liens-parents', module: 'scolarite', model: 'elevePar' },
  { path: '/scolarite/parents', module: 'scolarite', model: 'parentProfil', searchableFields: ['nom', 'prenom', 'email'] },

  // --- Notes complémentaire ---
  { path: '/notes/baremes', module: 'notes', model: 'bareme' },
  { path: '/notes/qcm', module: 'notes', model: 'qCM', searchableFields: ['titre'] },

  // --- Examens complémentaire ---
  { path: '/examens/jurys', module: 'examens', model: 'jury' },
  { path: '/examens/salles', module: 'examens', model: 'salleExamen' },
  { path: '/examens/proces-verbaux', module: 'examens', model: 'procesVerbal' },
  { path: '/examens/deliberations', module: 'examens', model: 'deliberation' },
  { path: '/examens/rapprochement-deco', module: 'examens', model: 'rapprochementDECO' },

  // --- Finance complémentaire ---
  { path: '/finance/grilles-tarifs', module: 'comptabilite', model: 'grilleTarif' },
  { path: '/finance/annees-tarifaires', module: 'comptabilite', model: 'anneeTarifaire' },
  { path: '/finance/comptes', module: 'comptabilite', model: 'compteComptable', searchableFields: ['libelle', 'numero'] },
  { path: '/finance/journaux', module: 'comptabilite', model: 'journalComptable' },
  { path: '/finance/quittances', module: 'comptabilite', model: 'quittance', searchableFields: ['numero'] },

  // --- Bibliothèque complémentaire ---
  { path: '/bibliotheque/exemplaires', module: 'bibliotheque', model: 'exemplaireLivre', searchableFields: ['codeBarre'] },
  { path: '/bibliotheque/cartes-lecteur', module: 'bibliotheque', model: 'carteLecteur', searchableFields: ['numeroCarte'] },
  { path: '/bibliotheque/reservations', module: 'bibliotheque', model: 'reservation' },
  { path: '/bibliotheque/suggestions', module: 'bibliotheque', model: 'suggestionAchat' },
  { path: '/bibliotheque/acquisitions', module: 'bibliotheque', model: 'acquisitionLivre' },

  // --- Infirmerie complémentaire ---
  { path: '/infirmerie/ordonnances', module: 'infirmerie', model: 'ordonnance' },
  { path: '/infirmerie/stock-medicaments', module: 'infirmerie', model: 'stockMedicament', searchableFields: ['nom'] },

  // --- Services ---
  { path: '/services/offres', module: 'services', model: 'serviceOffert', searchableFields: ['nom'] },
  { path: '/services/affectations', module: 'services', model: 'affectationService' },

  // --- Parascolaire ---
  { path: '/parascolaire/activites', module: 'parascolaire', model: 'activiteParascolaire', searchableFields: ['nom'] },
  { path: '/parascolaire/participations', module: 'parascolaire', model: 'participationParascolaire' },
  { path: '/parascolaire/evenements', module: 'parascolaire', model: 'evenementParascolaire', searchableFields: ['titre'] },

  // --- Stocks & patrimoine ---
  { path: '/stocks/articles', module: 'stocks', model: 'articleStock', searchableFields: ['nom'] },
  { path: '/stocks/mouvements', module: 'stocks', model: 'mouvementStock' },

  // --- Infrastructures ---
  { path: '/infrastructures/maintenances', module: 'infrastructures', model: 'maintenance' },

  // --- Partenariats ---
  { path: '/partenariats/partenaires', module: 'partenariats', model: 'partenaire', searchableFields: ['nom'] },
  { path: '/partenariats/sponsors', module: 'partenariats', model: 'sponsor' },
  { path: '/partenariats/reunions', module: 'partenariats', model: 'reunionPartenariat', searchableFields: ['titre'] },

  // --- MENA / DESPS ---
  { path: '/mena/preinscriptions', module: 'mena', model: 'preinscriptionMENA', searchableFields: ['nomCandidat', 'prenomCandidat'] },
  { path: '/mena/synchronisations', module: 'mena', model: 'synchronisationMENA' },
  { path: '/mena/decisions-bilans', module: 'mena', model: 'decisionBilanMENA' },

  // --- Paramétrage / sécurité ---
  { path: '/parametrage/audit-logs', module: 'parametrage', model: 'auditLog' },
  { path: '/parametrage/api-keys', module: 'parametrage', model: 'apiKeyExterne', searchableFields: ['nom'] },

  // --- Archives ---
  { path: '/archives', module: 'archives', model: 'archive' },
];

export const validationSchemas: Partial<Record<string, { create?: z.ZodSchema; update?: z.ZodSchema }>> = {};

export function buildGenericRouters() {
  return genericResources.map((r) => ({
    ...r,
    router: createCrudRouter(r.model as any, { searchableFields: r.searchableFields }),
  }));
}
