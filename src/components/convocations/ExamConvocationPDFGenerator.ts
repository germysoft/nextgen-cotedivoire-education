import jsPDF from 'jspdf';
import { ExamCandidate, JuryMember, ExamSchedule, ExamCenter, roleLabels } from '@/data/mockExamConvocations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function generateCandidateConvocationPDF(
  candidate: ExamCandidate,
  schedule: ExamSchedule[],
  center: ExamCenter
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 15;

  // En-tête officiel
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉPUBLIQUE DE CÔTE D\'IVOIRE', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Union - Discipline - Travail', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(9);
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text('Direction des Examens et Concours (DECO)', pageWidth / 2, yPos, { align: 'center' });
  
  // Ligne de séparation
  yPos += 8;
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  // Titre principal
  yPos += 12;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`CONVOCATION - ${candidate.examType} ${new Date().getFullYear()}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(11);
  doc.text(`Session ${candidate.session}`, pageWidth / 2, yPos, { align: 'center' });
  
  // Numéro de convocation
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° Candidat: ${candidate.candidateNumber}`, pageWidth - margin, yPos, { align: 'right' });
  
  // Informations du candidat (encadré)
  yPos += 10;
  const infoBoxHeight = 45;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPos, pageWidth - 2 * margin, infoBoxHeight, 'F');
  doc.setDrawColor(100, 100, 100);
  doc.rect(margin, yPos, pageWidth - 2 * margin, infoBoxHeight);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('INFORMATIONS DU CANDIDAT', margin + 5, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nom et Prénoms: ${candidate.lastName} ${candidate.firstName}`, margin + 5, yPos);
  
  yPos += 6;
  doc.text(`Date de naissance: ${format(new Date(candidate.birthDate), 'dd MMMM yyyy', { locale: fr })}`, margin + 5, yPos);
  doc.text(`Lieu: ${candidate.birthPlace}`, pageWidth / 2, yPos);
  
  yPos += 6;
  doc.text(`Établissement d'origine: ${candidate.schoolName}`, margin + 5, yPos);
  
  yPos += 6;
  doc.text(`Classe: ${candidate.className}`, margin + 5, yPos);
  
  // Centre d'examen
  yPos += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CENTRE D\'EXAMEN', margin, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Centre: ${center.name}`, margin, yPos);
  
  yPos += 5;
  doc.text(`Adresse: ${center.address}, ${center.city}`, margin, yPos);
  
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text(`Salle: ${candidate.roomNumber}`, margin, yPos);
  doc.text(`Table N°: ${candidate.tableNumber}`, pageWidth / 2, yPos);
  
  // Calendrier des épreuves
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CALENDRIER DES ÉPREUVES', margin, yPos);
  
  yPos += 8;
  
  // En-têtes du tableau
  const colWidths = [40, 25, 25, 55, 20];
  const headers = ['Date', 'Début', 'Fin', 'Épreuve', 'Durée'];
  
  doc.setFillColor(59, 130, 246);
  doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  
  let xPos = margin + 2;
  headers.forEach((header, i) => {
    doc.text(header, xPos, yPos);
    xPos += colWidths[i];
  });
  
  doc.setTextColor(0, 0, 0);
  yPos += 6;
  
  // Filtrer les épreuves par type d'examen
  const relevantSchedule = schedule.filter(s => s.examType === candidate.examType);
  
  doc.setFont('helvetica', 'normal');
  relevantSchedule.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 7, 'F');
    }
    
    xPos = margin + 2;
    doc.text(format(new Date(item.date), 'dd/MM/yyyy'), xPos, yPos);
    xPos += colWidths[0];
    doc.text(item.startTime, xPos, yPos);
    xPos += colWidths[1];
    doc.text(item.endTime, xPos, yPos);
    xPos += colWidths[2];
    doc.text(item.subject, xPos, yPos);
    xPos += colWidths[3];
    doc.text(item.duration, xPos, yPos);
    
    yPos += 7;
  });
  
  // Instructions importantes
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('INSTRUCTIONS IMPORTANTES', margin, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const instructions = [
    '• Se présenter 30 minutes avant le début de chaque épreuve',
    '• Munissez-vous de cette convocation et d\'une pièce d\'identité valide',
    '• Apporter le matériel nécessaire (stylos, règle, calculatrice autorisée, etc.)',
    '• Les téléphones portables sont strictement interdits dans les salles d\'examen',
    '• Tout retard de plus de 30 minutes après le début de l\'épreuve entraîne l\'exclusion',
    '• En cas de fraude, le candidat sera exclu et pourra faire l\'objet de poursuites'
  ];
  
  instructions.forEach(instruction => {
    doc.text(instruction, margin, yPos);
    yPos += 5;
  });
  
  // Cachet et signature
  yPos = doc.internal.pageSize.getHeight() - 45;
  doc.setFontSize(9);
  doc.text(`Fait à Abidjan, le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}`, margin, yPos);
  
  yPos += 10;
  doc.text('Le Directeur des Examens et Concours', pageWidth - margin - 60, yPos);
  
  yPos += 15;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('(Cachet et signature)', pageWidth - margin - 50, yPos);
  
  // QR Code placeholder
  doc.setDrawColor(150, 150, 150);
  doc.rect(margin, doc.internal.pageSize.getHeight() - 40, 25, 25);
  doc.setFontSize(6);
  doc.text('QR Code', margin + 5, doc.internal.pageSize.getHeight() - 25);
  doc.text('Vérification', margin + 3, doc.internal.pageSize.getHeight() - 20);
  
  // Télécharger
  const fileName = `Convocation_${candidate.examType}_${candidate.candidateNumber}.pdf`;
  doc.save(fileName);
}

export function generateJuryConvocationPDF(
  member: JuryMember,
  schedule: ExamSchedule[],
  center: ExamCenter
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 15;

  // En-tête officiel
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉPUBLIQUE DE CÔTE D\'IVOIRE', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Union - Discipline - Travail', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(9);
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text('Direction des Examens et Concours (DECO)', pageWidth / 2, yPos, { align: 'center' });
  
  // Ligne de séparation
  yPos += 8;
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  // Titre principal
  yPos += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`CONVOCATION DE JURY - ${member.examType} ${new Date().getFullYear()}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(11);
  doc.text(`Session ${member.session}`, pageWidth / 2, yPos, { align: 'center' });
  
  // Référence
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Réf: DECO/${member.examType}/${new Date().getFullYear()}/JURY-${member.id.split('-')[1]}`, margin, yPos);
  doc.text(`Matricule: ${member.matricule}`, pageWidth - margin, yPos, { align: 'right' });
  
  // Informations du membre (encadré)
  yPos += 12;
  const infoBoxHeight = 35;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPos, pageWidth - 2 * margin, infoBoxHeight, 'F');
  doc.setDrawColor(100, 100, 100);
  doc.rect(margin, yPos, pageWidth - 2 * margin, infoBoxHeight);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('INFORMATIONS DU MEMBRE DE JURY', margin + 5, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${member.title} ${member.lastName} ${member.firstName}`, margin + 5, yPos);
  
  yPos += 6;
  doc.text(`Établissement: ${member.school}`, margin + 5, yPos);
  
  yPos += 6;
  doc.text(`Discipline: ${member.subject}`, margin + 5, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`Fonction: ${roleLabels[member.role]}`, pageWidth / 2 + 10, yPos);
  
  // Affectation
  yPos += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('AFFECTATION', margin, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Centre d'examen: ${center.name}`, margin, yPos);
  
  yPos += 5;
  doc.text(`Adresse: ${center.address}, ${center.city}`, margin, yPos);
  
  yPos += 5;
  doc.text(`Salles assignées: ${member.assignedRooms.join(', ')}`, margin, yPos);
  
  // Dates de service
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('DATES DE SERVICE', margin, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  
  member.assignedDates.forEach(date => {
    doc.text(`• ${format(new Date(date), 'EEEE dd MMMM yyyy', { locale: fr })}`, margin + 5, yPos);
    yPos += 5;
  });
  
  // Obligations
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('OBLIGATIONS', margin, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const obligations = [
    '• Se présenter au centre d\'examen 1 heure avant le début de la première épreuve',
    '• Être muni de cette convocation et d\'une pièce d\'identité',
    '• Respecter le règlement des examens et les consignes de la DECO',
    '• Signaler immédiatement toute anomalie au chef de centre',
    '• Remplir et signer les procès-verbaux à la fin de chaque épreuve',
    '• La présence est obligatoire pour toutes les dates indiquées'
  ];
  
  obligations.forEach(obligation => {
    doc.text(obligation, margin, yPos);
    yPos += 5;
  });
  
  // Indemnités
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('INDEMNITÉS', margin, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Les indemnités de jury seront versées selon le barème en vigueur après', margin, yPos);
  yPos += 5;
  doc.text('transmission des pièces justificatives (PV signés, fiches de présence).', margin, yPos);
  
  // Signature
  yPos = doc.internal.pageSize.getHeight() - 45;
  doc.setFontSize(9);
  doc.text(`Fait à Abidjan, le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}`, margin, yPos);
  
  yPos += 10;
  doc.text('Le Directeur des Examens et Concours', pageWidth - margin - 60, yPos);
  
  yPos += 15;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('(Cachet et signature)', pageWidth - margin - 50, yPos);
  
  // Accusé de réception
  yPos = doc.internal.pageSize.getHeight() - 20;
  doc.setLineWidth(0.3);
  doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Accusé de réception: Je soussigné(e) ________________________ certifie avoir reçu cette convocation le ____/____/______', margin, yPos);
  doc.text('Signature: ____________________', pageWidth - margin - 45, yPos + 5);
  
  // Télécharger
  const fileName = `Convocation_Jury_${member.examType}_${member.matricule}.pdf`;
  doc.save(fileName);
}

export function generateBatchCandidatePDFs(
  candidates: ExamCandidate[],
  schedule: ExamSchedule[],
  centers: ExamCenter[]
) {
  candidates.forEach(candidate => {
    const center = centers.find(c => c.id === candidate.centerId);
    if (center) {
      generateCandidateConvocationPDF(candidate, schedule, center);
    }
  });
}

export function generateBatchJuryPDFs(
  members: JuryMember[],
  schedule: ExamSchedule[],
  centers: ExamCenter[]
) {
  members.forEach(member => {
    const center = centers.find(c => c.id === member.centerId);
    if (center) {
      generateJuryConvocationPDF(member, schedule, center);
    }
  });
}
