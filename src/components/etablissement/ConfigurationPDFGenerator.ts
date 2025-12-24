import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfigurationEtablissement } from '@/types/etablissement';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const typeEtablissementLabels: Record<string, string> = {
  public: 'Public',
  prive: 'Privé Laïc',
  prive_confessionnel: 'Privé Confessionnel',
  confessionnel: 'Confessionnel',
  technique: 'Technique',
  professionnel: 'Professionnel',
  prive_laic: 'Privé Laïc',
};

const statutJuridiqueLabels: Record<string, string> = {
  association: 'Association',
  entreprise_individuelle: 'Entreprise Individuelle',
  sarl: 'SARL',
  sa: 'SA',
  fondation: 'Fondation',
  cooperative: 'Coopérative',
  etat: 'État',
};

const fonctionLabels: Record<string, string> = {
  fondateur: 'Fondateur',
  directeur: 'Directeur',
  proviseur: 'Proviseur',
  directeur_etudes: 'Directeur des Études',
  principal: 'Principal',
  censeur: 'Censeur',
  surveillant_general: 'Surveillant Général',
};

const cycleLabels: Record<string, string> = {
  prescolaire: 'Préscolaire',
  primaire: 'Primaire',
  premier_cycle: '1er Cycle (Collège)',
  second_cycle: '2nd Cycle (Lycée)',
  technique: 'Technique',
  professionnel: 'Professionnel',
};

export const generateConfigurationPDF = async (config: ConfigurationEtablissement): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // En-tête avec logo si disponible
  if (config.identite.logo) {
    try {
      doc.addImage(config.identite.logo, 'JPEG', 15, 10, 30, 30);
      yPos = 15;
    } catch (e) {
      console.warn('Impossible de charger le logo');
    }
  }

  // Titre principal
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const title = 'FICHE RÉCAPITULATIVE DE L\'ÉTABLISSEMENT';
  doc.text(title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Nom de l'établissement
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175); // Bleu
  doc.text(config.identite.nom || 'Nom non renseigné', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;

  if (config.identite.sigle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`(${config.identite.sigle})`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
  }

  doc.setTextColor(0, 0, 0);
  yPos += 5;

  // Date de génération
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Document généré le ${format(new Date(), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Ligne de séparation
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 10;

  // Section 1: Identité
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('1. IDENTITÉ DE L\'ÉTABLISSEMENT', 15, yPos);
  yPos += 2;
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Nom officiel', config.identite.nom || '-'],
      ['Sigle / Acronyme', config.identite.sigle || '-'],
      ['Type d\'établissement', typeEtablissementLabels[config.identite.type] || '-'],
      ['Devise / Slogan', config.identite.devise || '-'],
      ['Année de création', config.identite.anneeCreation?.toString() || '-'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section 2: Administration
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('2. INFORMATIONS ADMINISTRATIVES', 15, yPos);
  yPos += 2;
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['N° Autorisation d\'ouverture', config.administration.numeroAutorisation || '-'],
      ['Date de création', config.administration.dateCreation || '-'],
      ['Ministère de tutelle', config.administration.ministereTutelle || '-'],
      ['DRENA / Inspection', config.administration.inspection || '-'],
      ['Code établissement', config.administration.codeEtablissement || '-'],
      ['Statut juridique', statutJuridiqueLabels[config.administration.statutJuridique] || '-'],
      ['N° Agrément MENA', config.administration.numeroAgrement || '-'],
      ['N° Registre Commerce', config.administration.numeroRegistreCommerce || '-'],
      ['N° Contribuable', config.administration.numeroContribuable || '-'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section 3: Localisation & Contacts
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('3. LOCALISATION & CONTACTS', 15, yPos);
  yPos += 2;
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Pays', config.localisation.pays || '-'],
      ['Ville', config.localisation.ville || '-'],
      ['Commune', config.localisation.commune || '-'],
      ['Quartier', config.localisation.quartier || '-'],
      ['Adresse complète', config.localisation.adresseComplete || '-'],
      ['Boîte postale', config.localisation.boitePostale || '-'],
      ['Téléphone principal', config.localisation.telephonePrincipal || '-'],
      ['Téléphone secondaire', config.localisation.telephoneSecondaire || '-'],
      ['Email officiel', config.localisation.emailOfficiel || '-'],
      ['Site web', config.localisation.siteWeb || '-'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 15, right: 15 },
  });

  // Nouvelle page
  doc.addPage();
  yPos = 20;

  // Section 4: Responsable
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('4. RESPONSABLE DE L\'ÉTABLISSEMENT', 15, yPos);
  yPos += 2;
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Nom', config.responsable.nom || '-'],
      ['Prénoms', config.responsable.prenoms || '-'],
      ['Fonction', fonctionLabels[config.responsable.fonction] || '-'],
      ['Téléphone', config.responsable.telephone || '-'],
      ['Email', config.responsable.email || '-'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section 5: Paramètres pédagogiques
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('5. PARAMÈTRES PÉDAGOGIQUES', 15, yPos);
  yPos += 2;
  doc.setTextColor(0, 0, 0);

  const cyclesText = config.parametresPedagogiques.cyclesPrisEnCharge
    .map(c => cycleLabels[c] || c)
    .join(', ') || '-';

  const lv2Text = config.parametresPedagogiques.gestionLV2
    .map(l => l.charAt(0).toUpperCase() + l.slice(1))
    .join(', ') || '-';

  const optionsText = config.parametresPedagogiques.options
    .map(o => o.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()))
    .join(', ') || '-';

  const joursText = config.parametresPedagogiques.joursOuvrables
    .map(j => j.charAt(0).toUpperCase() + j.slice(1))
    .join(', ') || '-';

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Année scolaire en cours', config.parametresPedagogiques.anneeScolaireEnCours || '-'],
      ['Type d\'évaluation', config.parametresPedagogiques.typeEvaluation === 'trimestre' ? 'Trimestrielle' : 'Semestrielle'],
      ['Nombre de périodes', config.parametresPedagogiques.nombreTrimestresSemestres.toString()],
      ['Note maximale', config.parametresPedagogiques.noteMaximale.toString() + '/20'],
      ['Moyenne de passage', config.parametresPedagogiques.moyennePassage?.toString() + '/20' || '-'],
      ['Cycles pris en charge', cyclesText],
      ['Langues vivantes 2', lv2Text],
      ['Options proposées', optionsText],
      ['Jours ouvrables', joursText],
      ['Horaires de cours', `${config.parametresPedagogiques.heureDebutCours} - ${config.parametresPedagogiques.heureFinCours}`],
      ['Durée récréation', `${config.parametresPedagogiques.dureeRecreation} minutes`],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section 6: Paramètres visuels
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('6. PARAMÈTRES VISUELS & DOCUMENTS', 15, yPos);
  yPos += 2;
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Couleur principale', config.parametresVisuels.couleurPrincipale || '-'],
      ['Couleur secondaire', config.parametresVisuels.couleurSecondaire || '-'],
      ['Police documents', config.parametresVisuels.policeDocuments || 'Par défaut'],
      ['Pied de page officiel', config.parametresVisuels.piedDePage || '-'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Section 7: Sécurité & Traçabilité
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('7. SÉCURITÉ & TRAÇABILITÉ', 15, yPos);
  yPos += 2;
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ['Date de création de la config.', format(new Date(config.securite.dateCreationConfig), "dd/MM/yyyy HH:mm", { locale: fr })],
      ['Créée par', config.securite.utilisateurCreation || '-'],
      ['Dernière modification', config.securite.derniereModification 
        ? format(new Date(config.securite.derniereModification), "dd/MM/yyyy HH:mm", { locale: fr }) 
        : '-'],
      ['Modifiée par', config.securite.utilisateurDerniereModification || '-'],
      ['Configuration verrouillée', config.securite.configurationVerrouillee ? 'Oui' : 'Non'],
      ['Nombre de modifications', config.securite.historiqueModifications.length.toString()],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 15, right: 15 },
  });

  // Pied de page sur toutes les pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Ligne de séparation en bas
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, 280, pageWidth - 15, 280);
    
    // Pied de page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    if (config.parametresVisuels.piedDePage) {
      doc.text(config.parametresVisuels.piedDePage, pageWidth / 2, 285, { align: 'center' });
    }
    
    doc.text(`Page ${i} / ${totalPages}`, pageWidth - 15, 290, { align: 'right' });
    doc.text('NextGen Éducation - Gestion Scolaire', 15, 290);
  }

  // Téléchargement
  const fileName = `Configuration_${config.identite.sigle || config.identite.nom || 'Etablissement'}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName.replace(/\s+/g, '_'));
};
