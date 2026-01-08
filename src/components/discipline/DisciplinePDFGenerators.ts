import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types from Discipline.tsx
interface ConseilDiscipline {
  id: number;
  eleve: string;
  classe: string;
  dateConvocation: string;
  dateSeance: string;
  motifs: string[];
  membres: string[];
  statut: "Programmé" | "En cours" | "Délibéré" | "Annulé";
  decision?: string;
  appel?: boolean;
}

interface ConvocationParent {
  id: number;
  eleve: string;
  classe: string;
  parent: string;
  motif: string;
  dateConvocation: string;
  dateRdv?: string;
  statut: "Envoyée" | "Confirmée" | "Réalisée" | "Absence";
  canalEnvoi: "SMS" | "Email" | "Courrier";
  notes?: string;
}

interface Incident {
  id: number;
  eleve: string;
  classe: string;
  type: string;
  date: string;
  gravite: "Légère" | "Modérée" | "Grave";
  sanction: string;
  statut: "En cours" | "Traité";
  rapporteur: string;
  notifieParents: boolean;
}

// ============ PROCÈS-VERBAL CONSEIL DE DISCIPLINE ============
export function generateProcesVerbalPDF(
  conseil: ConseilDiscipline,
  incidents: Incident[],
  etablissement: string = "ÉTABLISSEMENT SCOLAIRE"
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // En-tête établissement
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(etablissement, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('République de Côte d\'Ivoire', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text('Ministère de l\'Éducation Nationale', pageWidth / 2, yPos, { align: 'center' });
  
  // Ligne de séparation
  yPos += 10;
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  // Titre
  yPos += 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROCÈS-VERBAL DU CONSEIL DE DISCIPLINE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${conseil.id}/${new Date().getFullYear()}`, pageWidth / 2, yPos, { align: 'center' });
  
  // Informations générales - encadré
  yPos += 15;
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 35, 'F');
  doc.setDrawColor(100, 100, 100);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 35);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS GÉNÉRALES', margin + 5, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Date du conseil: ${conseil.dateSeance}`, margin + 5, yPos);
  doc.text(`Date de convocation: ${conseil.dateConvocation}`, pageWidth / 2, yPos);
  
  yPos += 8;
  doc.text(`Élève concerné: ${conseil.eleve}`, margin + 5, yPos);
  doc.text(`Classe: ${conseil.classe}`, pageWidth / 2, yPos);
  
  // Membres du conseil
  yPos += 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('COMPOSITION DU CONSEIL', margin, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  conseil.membres.forEach((membre, index) => {
    doc.text(`• ${membre}`, margin + 5, yPos);
    yPos += 6;
  });
  
  // Motifs
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('MOTIFS DE LA CONVOCATION', margin, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  conseil.motifs.forEach((motif, index) => {
    doc.text(`${index + 1}. ${motif}`, margin + 5, yPos);
    yPos += 6;
  });
  
  // Historique des incidents
  const studentIncidents = incidents.filter(i => i.eleve === conseil.eleve);
  if (studentIncidents.length > 0) {
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('HISTORIQUE DES INCIDENTS', margin, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    // Table header
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Date', margin + 2, yPos + 5);
    doc.text('Type', margin + 35, yPos + 5);
    doc.text('Gravité', margin + 80, yPos + 5);
    doc.text('Sanction', margin + 115, yPos + 5);
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    studentIncidents.forEach(incident => {
      doc.text(incident.date, margin + 2, yPos + 5);
      doc.text(incident.type, margin + 35, yPos + 5);
      doc.text(incident.gravite, margin + 80, yPos + 5);
      doc.text(incident.sanction.substring(0, 25), margin + 115, yPos + 5);
      yPos += 7;
    });
  }
  
  // Délibération et décision
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('DÉLIBÉRATION', margin, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  if (conseil.statut === "Délibéré" && conseil.decision) {
    doc.text('Le conseil, après avoir entendu l\'élève et examiné son dossier, a décidé:', margin, yPos);
    yPos += 10;
    
    // Encadré décision
    doc.setFillColor(255, 250, 240);
    doc.setDrawColor(200, 100, 0);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 20, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`DÉCISION: ${conseil.decision}`, pageWidth / 2, yPos + 12, { align: 'center' });
    
    yPos += 30;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Appel possible: ${conseil.appel ? 'Non (appel déposé)' : 'Oui, dans un délai de 8 jours'}`, margin, yPos);
  } else {
    doc.text('Le conseil est en attente de délibération.', margin, yPos);
    yPos += 15;
  }
  
  // Signatures
  yPos = doc.internal.pageSize.getHeight() - 60;
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SIGNATURES', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  doc.setFont('helvetica', 'normal');
  
  // Colonnes de signatures
  const colWidth = (pageWidth - 2 * margin) / 3;
  doc.text('Le Président du Conseil', margin, yPos);
  doc.text('Le Secrétaire de séance', margin + colWidth, yPos);
  doc.text('Le Représentant des Parents', margin + 2 * colWidth, yPos);
  
  yPos += 20;
  doc.text('_____________________', margin, yPos);
  doc.text('_____________________', margin + colWidth, yPos);
  doc.text('_____________________', margin + 2 * colWidth, yPos);
  
  // Footer
  yPos = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Document généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, margin, yPos);
  doc.text(`Page 1/1`, pageWidth - margin - 15, yPos);
  
  // Télécharger
  const fileName = `PV_Conseil_${conseil.eleve.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
}

// ============ CONVOCATION PARENTS DISCIPLINE ============
export function generateConvocationParentPDF(
  convocation: ConvocationParent,
  incidents: Incident[],
  etablissement: string = "ÉTABLISSEMENT SCOLAIRE"
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // En-tête établissement
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(etablissement, margin, yPos);
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Adresse de l\'établissement', margin, yPos);
  yPos += 4;
  doc.text('Tél: XX XX XX XX XX', margin, yPos);
  
  // Date à droite
  doc.text(`Fait le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}`, pageWidth - margin - 50, yPos - 4);
  
  // Ligne de séparation
  yPos += 10;
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  // Destinataire
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`À l'attention de: ${convocation.parent}`, margin, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Parent de l'élève: ${convocation.eleve}`, margin, yPos);
  
  yPos += 6;
  doc.text(`Classe: ${convocation.classe}`, margin, yPos);
  
  // Titre
  yPos += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CONVOCATION', pageWidth / 2, yPos, { align: 'center' });
  
  // Urgence si conseil de discipline
  if (convocation.motif.toLowerCase().includes('conseil')) {
    yPos += 8;
    doc.setTextColor(200, 0, 0);
    doc.setFontSize(11);
    doc.text('CONSEIL DE DISCIPLINE', pageWidth / 2, yPos, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }
  
  // Objet
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Objet:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(convocation.motif, margin + 18, yPos);
  
  // Corps de la lettre
  yPos += 15;
  doc.setFontSize(11);
  
  const salutation = convocation.parent.startsWith('Mme') ? 'Madame,' : 
                     convocation.parent.startsWith('M.') ? 'Monsieur,' : 'Madame, Monsieur,';
  doc.text(salutation, margin, yPos);
  
  yPos += 10;
  let bodyText = '';
  
  if (convocation.motif.toLowerCase().includes('conseil')) {
    bodyText = `Nous avons l'honneur de vous informer que votre enfant ${convocation.eleve}, élève de la classe de ${convocation.classe}, fait l'objet d'une convocation devant le Conseil de Discipline de notre établissement.\n\nCette convocation fait suite à des faits graves qui nous ont été rapportés et qui nécessitent une décision collégiale concernant la scolarité de votre enfant.\n\nVotre présence est obligatoire lors de cette séance.`;
  } else {
    bodyText = `Nous souhaitons vous rencontrer afin d'échanger sur la situation de votre enfant ${convocation.eleve}, élève de la classe de ${convocation.classe}.\n\nCette rencontre s'inscrit dans le cadre du suivi disciplinaire et vise à trouver ensemble les meilleures solutions pour accompagner votre enfant.\n\nVotre présence est vivement souhaitée.`;
  }
  
  const bodyLines = doc.splitTextToSize(bodyText, pageWidth - 2 * margin);
  doc.text(bodyLines, margin, yPos);
  yPos += bodyLines.length * 5 + 10;
  
  // Incidents récents
  const studentIncidents = incidents.filter(i => i.eleve === convocation.eleve).slice(0, 3);
  if (studentIncidents.length > 0) {
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Faits reprochés:', margin, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    studentIncidents.forEach((incident, index) => {
      doc.text(`• ${incident.date}: ${incident.type} (${incident.gravite})`, margin + 5, yPos);
      yPos += 6;
    });
  }
  
  // Détails du rendez-vous
  if (convocation.dateRdv) {
    yPos += 10;
    doc.setFillColor(240, 248, 255);
    doc.setDrawColor(70, 130, 180);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 30, 'FD');
    
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('RENDEZ-VOUS', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date et heure: ${convocation.dateRdv}`, margin + 10, yPos);
    doc.text('Lieu: Bureau du Directeur', pageWidth / 2, yPos);
    
    yPos += 25;
  }
  
  // Note importante
  yPos += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Merci de vous munir de votre pièce d\'identité et du carnet de correspondance de votre enfant.', margin, yPos);
  
  yPos += 6;
  doc.text('En cas d\'empêchement, veuillez nous contacter dans les plus brefs délais.', margin, yPos);
  
  // Signature
  yPos += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Veuillez agréer, ' + salutation.replace(',', '') + ', l\'expression de nos salutations distinguées.', margin, yPos);
  
  yPos += 20;
  doc.text('Le Chef d\'Établissement', pageWidth - margin - 50, yPos);
  yPos += 15;
  doc.text('_______________________', pageWidth - margin - 55, yPos);
  
  // Coupon réponse
  yPos = doc.internal.pageSize.getHeight() - 55;
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([3, 3], 0);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  doc.setLineDashPattern([], 0);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('COUPON RÉPONSE - À RETOURNER À L\'ÉTABLISSEMENT', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Je soussigné(e) ${convocation.parent}, parent/tuteur de ${convocation.eleve} (${convocation.classe}),`, margin, yPos);
  
  yPos += 8;
  doc.text('☐ Confirme ma présence au rendez-vous', margin, yPos);
  
  yPos += 6;
  doc.text('☐ Ne pourrai pas être présent(e) et souhaite un autre rendez-vous', margin, yPos);
  
  yPos += 10;
  doc.text('Date: ________________', margin, yPos);
  doc.text('Signature:', pageWidth - margin - 50, yPos);
  
  // Footer
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text(`Réf: CONV-${convocation.id}-${format(new Date(), 'yyyyMMdd')}`, margin, doc.internal.pageSize.getHeight() - 5);
  
  // Télécharger
  const fileName = `Convocation_${convocation.eleve.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
}

// ============ FICHE DE SUIVI DISCIPLINAIRE ============
export function generateFicheSuiviPDF(
  eleve: string,
  classe: string,
  incidents: Incident[],
  etablissement: string = "ÉTABLISSEMENT SCOLAIRE"
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // En-tête
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(etablissement, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  doc.setFontSize(16);
  doc.text('FICHE DE SUIVI DISCIPLINAIRE', pageWidth / 2, yPos, { align: 'center' });
  
  // Informations élève
  yPos += 15;
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Élève: ${eleve}`, margin + 5, yPos);
  doc.text(`Classe: ${classe}`, pageWidth / 2, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.text(`Année scolaire: ${new Date().getFullYear() - 1}/${new Date().getFullYear()}`, margin + 5, yPos);
  doc.text(`Date d'édition: ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`, pageWidth / 2, yPos);
  
  // Statistiques
  const studentIncidents = incidents.filter(i => i.eleve === eleve);
  const graveCount = studentIncidents.filter(i => i.gravite === "Grave").length;
  const moderateCount = studentIncidents.filter(i => i.gravite === "Modérée").length;
  const lightCount = studentIncidents.filter(i => i.gravite === "Légère").length;
  
  yPos += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RÉCAPITULATIF', margin, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Total incidents: ${studentIncidents.length}`, margin + 5, yPos);
  doc.text(`Graves: ${graveCount}`, margin + 60, yPos);
  doc.text(`Modérés: ${moderateCount}`, margin + 100, yPos);
  doc.text(`Légers: ${lightCount}`, margin + 145, yPos);
  
  // Tableau des incidents
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('HISTORIQUE DES INCIDENTS', margin, yPos);
  
  yPos += 8;
  
  // En-tête tableau
  doc.setFillColor(70, 130, 180);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(9);
  doc.text('Date', margin + 3, yPos + 5.5);
  doc.text('Type', margin + 30, yPos + 5.5);
  doc.text('Gravité', margin + 75, yPos + 5.5);
  doc.text('Sanction', margin + 105, yPos + 5.5);
  doc.text('Rapporteur', margin + 145, yPos + 5.5);
  
  yPos += 8;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  studentIncidents.forEach((incident, index) => {
    if (yPos > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPos = 20;
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
    }
    
    doc.text(incident.date, margin + 3, yPos + 5);
    doc.text(incident.type.substring(0, 18), margin + 30, yPos + 5);
    
    // Color code gravity
    if (incident.gravite === "Grave") {
      doc.setTextColor(200, 0, 0);
    } else if (incident.gravite === "Modérée") {
      doc.setTextColor(200, 100, 0);
    } else {
      doc.setTextColor(0, 128, 0);
    }
    doc.text(incident.gravite, margin + 75, yPos + 5);
    doc.setTextColor(0, 0, 0);
    
    doc.text(incident.sanction.substring(0, 20), margin + 105, yPos + 5);
    doc.text(incident.rapporteur.substring(0, 15), margin + 145, yPos + 5);
    
    yPos += 7;
  });
  
  // Footer
  yPos = doc.internal.pageSize.getHeight() - 25;
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  doc.setFontSize(9);
  doc.text('Signature du CPE: _______________________', margin, yPos);
  doc.text('Signature du Chef d\'Établissement: _______________________', pageWidth / 2, yPos);
  
  // Télécharger
  const fileName = `Fiche_Suivi_${eleve.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
}
