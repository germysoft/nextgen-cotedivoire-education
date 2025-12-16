import jsPDF from 'jspdf';

interface ContratData {
  type: 'CDI' | 'CDD' | 'Vacation' | 'Stage';
  employeNom: string;
  employePrenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  numeroCNI: string;
  poste: string;
  departement: string;
  dateDebut: string;
  dateFin?: string;
  salaireBase: number;
  heuresHebdo: number;
  periodEssai?: number; // en mois
  avantages?: string[];
}

interface AttestationData {
  type: 'travail' | 'salaire' | 'stage' | 'fin_contrat' | 'domiciliation';
  employeNom: string;
  employePrenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  numeroCNI: string;
  poste: string;
  departement: string;
  dateEmbauche: string;
  dateFin?: string;
  salaireBase?: number;
  salaireNet?: number;
  motifDepart?: string;
}

const SCHOOL_NAME = "Groupe Scolaire Excellence";
const SCHOOL_ADDRESS = "Boulevard de l'Université, Cocody";
const SCHOOL_CITY = "Abidjan, Côte d'Ivoire";
const SCHOOL_PHONE = "+225 27 22 44 55 66";
const SCHOOL_EMAIL = "contact@gs-excellence.ci";

export function generateContratPDF(data: ContratData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // En-tête
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_NAME, pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_ADDRESS} - ${SCHOOL_CITY}`, pageWidth / 2, 23, { align: 'center' });
  doc.text(`Tél: ${SCHOOL_PHONE} | Email: ${SCHOOL_EMAIL}`, pageWidth / 2, 30, { align: 'center' });
  
  // Titre du contrat
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const typeContrat = {
    'CDI': 'CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE',
    'CDD': 'CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE',
    'Vacation': 'CONTRAT DE VACATION',
    'Stage': 'CONVENTION DE STAGE'
  };
  doc.text(typeContrat[data.type], pageWidth / 2, 50, { align: 'center' });
  
  // Ligne de séparation
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(20, 55, pageWidth - 20, 55);
  
  let yPos = 70;
  doc.setFontSize(11);
  
  // Entre les soussignés
  doc.setFont('helvetica', 'bold');
  doc.text('ENTRE LES SOUSSIGNÉS :', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_NAME}, établissement d'enseignement privé,`, 20, yPos);
  yPos += 6;
  doc.text(`sis au ${SCHOOL_ADDRESS}, ${SCHOOL_CITY},`, 20, yPos);
  yPos += 6;
  doc.text(`représenté par son Directeur Général,`, 20, yPos);
  yPos += 6;
  doc.text(`ci-après dénommé "l'Employeur",`, 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text("D'UNE PART,", 20, yPos);
  yPos += 12;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Et ${data.employePrenom} ${data.employeNom.toUpperCase()},`, 20, yPos);
  yPos += 6;
  doc.text(`né(e) le ${data.dateNaissance} à ${data.lieuNaissance},`, 20, yPos);
  yPos += 6;
  doc.text(`demeurant au ${data.adresse},`, 20, yPos);
  yPos += 6;
  doc.text(`titulaire de la CNI n° ${data.numeroCNI},`, 20, yPos);
  yPos += 6;
  doc.text(`ci-après dénommé(e) "l'Employé(e)",`, 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text("D'AUTRE PART,", 20, yPos);
  yPos += 15;
  
  // IL A ÉTÉ CONVENU
  doc.setFont('helvetica', 'bold');
  doc.text("IL A ÉTÉ CONVENU CE QUI SUIT :", 20, yPos);
  yPos += 12;
  
  // Article 1 - Engagement
  doc.setFont('helvetica', 'bold');
  doc.text('Article 1 - ENGAGEMENT', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  const engagement = `L'Employeur engage ${data.employePrenom} ${data.employeNom.toUpperCase()} en qualité de ${data.poste} au sein du département ${data.departement}, à compter du ${data.dateDebut}.`;
  const engagementLines = doc.splitTextToSize(engagement, pageWidth - 40);
  doc.text(engagementLines, 20, yPos);
  yPos += engagementLines.length * 6 + 5;
  
  // Article 2 - Durée
  doc.setFont('helvetica', 'bold');
  doc.text('Article 2 - DURÉE DU CONTRAT', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  let duree = '';
  if (data.type === 'CDI') {
    duree = 'Le présent contrat est conclu pour une durée indéterminée.';
  } else if (data.dateFin) {
    duree = `Le présent contrat est conclu pour une durée déterminée du ${data.dateDebut} au ${data.dateFin}.`;
  }
  if (data.periodEssai) {
    duree += ` Une période d'essai de ${data.periodEssai} mois est prévue.`;
  }
  const dureeLines = doc.splitTextToSize(duree, pageWidth - 40);
  doc.text(dureeLines, 20, yPos);
  yPos += dureeLines.length * 6 + 5;
  
  // Article 3 - Fonctions
  doc.setFont('helvetica', 'bold');
  doc.text('Article 3 - FONCTIONS', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  const fonctions = `L'Employé(e) exercera les fonctions de ${data.poste}. Il/Elle sera placé(e) sous l'autorité du responsable du département ${data.departement}.`;
  const fonctionsLines = doc.splitTextToSize(fonctions, pageWidth - 40);
  doc.text(fonctionsLines, 20, yPos);
  yPos += fonctionsLines.length * 6 + 5;
  
  // Article 4 - Horaires
  doc.setFont('helvetica', 'bold');
  doc.text('Article 4 - DURÉE DU TRAVAIL', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`La durée hebdomadaire de travail est fixée à ${data.heuresHebdo} heures.`, 20, yPos);
  yPos += 10;
  
  // Article 5 - Rémunération
  doc.setFont('helvetica', 'bold');
  doc.text('Article 5 - RÉMUNÉRATION', 20, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`L'Employé(e) percevra un salaire mensuel brut de ${data.salaireBase.toLocaleString('fr-FR')} FCFA.`, 20, yPos);
  yPos += 6;
  if (data.avantages && data.avantages.length > 0) {
    doc.text('Avantages complémentaires :', 20, yPos);
    yPos += 6;
    data.avantages.forEach(avantage => {
      doc.text(`• ${avantage}`, 25, yPos);
      yPos += 5;
    });
  }
  yPos += 10;
  
  // Nouvelle page si nécessaire
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  // Signatures
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Fait à Abidjan, le ' + new Date().toLocaleDateString('fr-FR'), 20, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('En deux exemplaires originaux.', 20, yPos);
  yPos += 20;
  
  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.text("L'Employeur", 40, yPos);
  doc.text("L'Employé(e)", pageWidth - 60, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text('(signature et cachet)', 40, yPos);
  doc.text('(signature précédée de la mention', pageWidth - 75, yPos);
  yPos += 4;
  doc.text('"lu et approuvé")', pageWidth - 60, yPos);
  
  // Pied de page
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(37, 99, 235);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Document généré automatiquement - Système de Gestion Scolaire', pageWidth / 2, pageHeight - 6, { align: 'center' });
  
  doc.save(`Contrat_${data.type}_${data.employeNom}_${data.employePrenom}.pdf`);
}

export function generateAttestationPDF(data: AttestationData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // En-tête
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_NAME, pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_ADDRESS} - ${SCHOOL_CITY}`, pageWidth / 2, 23, { align: 'center' });
  doc.text(`Tél: ${SCHOOL_PHONE} | Email: ${SCHOOL_EMAIL}`, pageWidth / 2, 30, { align: 'center' });
  
  // Numéro et date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const refNum = `REF: ATT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  doc.text(refNum, pageWidth - 20, 45, { align: 'right' });
  doc.text(`Abidjan, le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, 52, { align: 'right' });
  
  // Titre de l'attestation
  const titres: Record<string, string> = {
    'travail': "ATTESTATION DE TRAVAIL",
    'salaire': "ATTESTATION DE SALAIRE",
    'stage': "ATTESTATION DE STAGE",
    'fin_contrat': "CERTIFICAT DE TRAVAIL",
    'domiciliation': "ATTESTATION DE DOMICILIATION DE SALAIRE"
  };
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(titres[data.type], pageWidth / 2, 70, { align: 'center' });
  
  // Ligne de séparation
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(60, 75, pageWidth - 60, 75);
  
  let yPos = 95;
  doc.setFontSize(11);
  
  // Corps de l'attestation
  doc.setFont('helvetica', 'normal');
  doc.text('Je soussigné, Directeur Général du ' + SCHOOL_NAME + ',', 20, yPos);
  yPos += 10;
  doc.text('atteste par la présente que :', 20, yPos);
  yPos += 15;
  
  // Informations de l'employé
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.employePrenom} ${data.employeNom.toUpperCase()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`né(e) le ${data.dateNaissance} à ${data.lieuNaissance}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  doc.text(`CNI n° ${data.numeroCNI}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Contenu spécifique selon le type
  let contenu = '';
  
  switch (data.type) {
    case 'travail':
      contenu = `est employé(e) au sein de notre établissement depuis le ${data.dateEmbauche} en qualité de ${data.poste} au département ${data.departement}.\n\nÀ ce jour, l'intéressé(e) fait toujours partie de notre effectif.`;
      break;
    case 'salaire':
      contenu = `est employé(e) au sein de notre établissement depuis le ${data.dateEmbauche} en qualité de ${data.poste}.\n\nSon salaire mensuel brut s'élève à ${data.salaireBase?.toLocaleString('fr-FR')} FCFA, soit un salaire net de ${data.salaireNet?.toLocaleString('fr-FR')} FCFA.`;
      break;
    case 'stage':
      contenu = `a effectué un stage au sein de notre établissement du ${data.dateEmbauche} au ${data.dateFin} en qualité de ${data.poste} au département ${data.departement}.\n\nL'intéressé(e) a fait preuve de sérieux et d'engagement tout au long de son stage.`;
      break;
    case 'fin_contrat':
      contenu = `a été employé(e) au sein de notre établissement du ${data.dateEmbauche} au ${data.dateFin} en qualité de ${data.poste} au département ${data.departement}.\n\nMotif de fin de contrat : ${data.motifDepart || 'Démission'}\n\nL'intéressé(e) quitte notre établissement libre de tout engagement.`;
      break;
    case 'domiciliation':
      contenu = `est employé(e) au sein de notre établissement depuis le ${data.dateEmbauche} en qualité de ${data.poste}.\n\nSon salaire mensuel net de ${data.salaireNet?.toLocaleString('fr-FR')} FCFA est domicilié sur son compte bancaire personnel.\n\nCette attestation est délivrée pour servir et valoir ce que de droit auprès des établissements bancaires.`;
      break;
  }
  
  const contenuLines = doc.splitTextToSize(contenu, pageWidth - 40);
  doc.text(contenuLines, 20, yPos);
  yPos += contenuLines.length * 7 + 20;
  
  // Formule de conclusion
  doc.text('Cette attestation est délivrée pour servir et valoir ce que de droit.', 20, yPos);
  yPos += 30;
  
  // Signature
  doc.setFont('helvetica', 'bold');
  doc.text('Le Directeur Général', pageWidth - 50, yPos, { align: 'center' });
  yPos += 25;
  
  // Espace pour signature
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text('(Signature et cachet)', pageWidth - 50, yPos, { align: 'center' });
  
  // Filigrane
  doc.setTextColor(230, 230, 230);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  doc.text('ORIGINAL', pageWidth / 2, 180, { align: 'center', angle: 45 });
  
  // Pied de page
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(37, 99, 235);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Document généré automatiquement - Système de Gestion Scolaire', pageWidth / 2, pageHeight - 6, { align: 'center' });
  
  doc.save(`Attestation_${data.type}_${data.employeNom}_${data.employePrenom}.pdf`);
}

export function generateCVPDF(personnel: any): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // En-tête avec photo placeholder
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Nom
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${personnel.prenom} ${personnel.nom.toUpperCase()}`, 60, 20);
  
  // Poste
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(personnel.poste, 60, 30);
  
  // Contact
  doc.setFontSize(10);
  doc.text(`${personnel.email} | ${personnel.telephone}`, 60, 40);
  
  let yPos = 65;
  
  // Informations personnelles
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS PERSONNELLES', 20, yPos);
  yPos += 3;
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date de naissance: ${personnel.dateNaissance}`, 20, yPos);
  yPos += 6;
  doc.text(`Lieu de naissance: ${personnel.lieuNaissance}`, 20, yPos);
  yPos += 6;
  doc.text(`Nationalité: ${personnel.nationalite}`, 20, yPos);
  yPos += 6;
  doc.text(`Adresse: ${personnel.adresse}, ${personnel.ville}`, 20, yPos);
  yPos += 15;
  
  // Expérience professionnelle
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EXPÉRIENCE PROFESSIONNELLE', 20, yPos);
  yPos += 3;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${personnel.poste}`, 20, yPos);
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${SCHOOL_NAME} - Depuis ${personnel.dateEmbauche}`, 20, yPos);
  yPos += 6;
  doc.text(`Département: ${personnel.departement}`, 20, yPos);
  yPos += 6;
  doc.text(`Statut: ${personnel.statut} - ${personnel.typeContrat}`, 20, yPos);
  
  if (personnel.historiquePostes && personnel.historiquePostes.length > 0) {
    yPos += 10;
    personnel.historiquePostes.forEach((poste: any) => {
      doc.setFont('helvetica', 'bold');
      doc.text(poste.poste, 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`${poste.departement} | ${poste.dateDebut} - ${poste.dateFin}`, 20, yPos);
      yPos += 8;
    });
  }
  yPos += 10;
  
  // Formation
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMATION', 20, yPos);
  yPos += 3;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  doc.setTextColor(0, 0, 0);
  if (personnel.diplomes && personnel.diplomes.length > 0) {
    personnel.diplomes.forEach((diplome: any) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(diplome.intitule, 20, yPos);
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${diplome.etablissement} - ${diplome.anneeObtention}${diplome.mention ? ' - ' + diplome.mention : ''}`, 20, yPos);
      yPos += 8;
    });
  }
  yPos += 5;
  
  // Compétences
  if (personnel.competences && personnel.competences.length > 0) {
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPÉTENCES', 20, yPos);
    yPos += 3;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const competencesText = personnel.competences.join(' • ');
    const competencesLines = doc.splitTextToSize(competencesText, pageWidth - 40);
    doc.text(competencesLines, 20, yPos);
    yPos += competencesLines.length * 6 + 10;
  }
  
  // Langues
  if (personnel.languesParles && personnel.languesParles.length > 0) {
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('LANGUES', 20, yPos);
    yPos += 3;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    personnel.languesParles.forEach((langue: any) => {
      doc.text(`${langue.langue}: ${langue.niveau}`, 20, yPos);
      yPos += 6;
    });
  }
  
  // Pied de page
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text(`CV généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  doc.save(`CV_${personnel.nom}_${personnel.prenom}.pdf`);
}
