import jsPDF from 'jspdf';
import { Convocation } from '@/types/convocation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const reasonLabels: Record<string, string> = {
  academic_difficulty: "Difficultés scolaires",
  behavior_issue: "Problème de comportement",
  repeated_absences: "Absences répétées",
  attitude_problem: "Problème d'attitude",
  orientation: "Orientation scolaire",
  exclusion_risk: "Risque d'exclusion",
  other: "Autre motif",
};

export function generateConvocationPDF(convocation: Convocation) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // En-tête établissement
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉTABLISSEMENT SCOLAIRE', margin, yPos);
  
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Adresse de l\'établissement', margin, yPos);
  doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`, pageWidth - margin - 40, yPos);
  
  // Ligne de séparation
  yPos += 10;
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  // Titre
  yPos += 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CONVOCATION', pageWidth / 2, yPos, { align: 'center' });
  
  // Priorité
  yPos += 8;
  if (convocation.priority === 'urgent' || convocation.priority === 'high') {
    doc.setFontSize(12);
    doc.setTextColor(200, 0, 0);
    doc.text(convocation.priority === 'urgent' ? 'URGENT' : 'PRIORITAIRE', pageWidth / 2, yPos, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 8;
  }
  
  // Destinataire
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`À l'attention de: ${convocation.parentName}`, margin, yPos);
  
  yPos += 6;
  doc.text(`Parent de: ${convocation.studentName}`, margin, yPos);
  
  yPos += 6;
  doc.text(`Classe: ${convocation.className}`, margin, yPos);
  
  // Motif
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Objet:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(reasonLabels[convocation.reason], margin + 15, yPos);
  
  // Message
  yPos += 15;
  doc.setFont('helvetica', 'normal');
  
  if (convocation.customMessage) {
    const messageLines = doc.splitTextToSize(convocation.customMessage, pageWidth - 2 * margin);
    doc.text(messageLines, margin, yPos);
    yPos += messageLines.length * 5 + 10;
  } else {
    const defaultMessage = `Madame, Monsieur,\n\nNous souhaitons vous rencontrer afin d'échanger sur la situation de votre enfant ${convocation.studentName}, élève de ${convocation.className}.\n\nVotre présence est requise.`;
    const messageLines = doc.splitTextToSize(defaultMessage, pageWidth - 2 * margin);
    doc.text(messageLines, margin, yPos);
    yPos += messageLines.length * 5 + 10;
  }
  
  // Détails du rendez-vous (encadré)
  if (convocation.appointmentDate) {
    yPos += 5;
    const boxHeight = 30;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, pageWidth - 2 * margin, boxHeight, 'F');
    doc.setDrawColor(100, 100, 100);
    doc.rect(margin, yPos, pageWidth - 2 * margin, boxHeight);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DÉTAILS DU RENDEZ-VOUS', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const rdvDate = format(new Date(convocation.appointmentDate), 'EEEE dd MMMM yyyy', { locale: fr });
    doc.text(`Date: ${rdvDate}`, margin + 5, yPos);
    
    yPos += 6;
    doc.text(`Heure: ${convocation.appointmentTime}`, margin + 5, yPos);
    doc.text(`Lieu: ${convocation.location}`, pageWidth / 2, yPos);
    
    yPos += boxHeight - 6;
  }
  
  // Note importante
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const note = "En cas d'empêchement, merci de nous contacter au plus vite pour fixer un autre rendez-vous.";
  const noteLines = doc.splitTextToSize(note, pageWidth - 2 * margin);
  doc.text(noteLines, margin, yPos);
  yPos += noteLines.length * 4 + 10;
  
  // Signature
  yPos = doc.internal.pageSize.getHeight() - 50;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(convocation.convener, margin, yPos);
  yPos += 5;
  doc.text(convocation.convenerRole, margin, yPos);
  
  // Coupon réponse
  yPos += 15;
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('COUPON RÉPONSE - À RETOURNER', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Je soussigné(e) ${convocation.parentName}, parent de ${convocation.studentName},`, margin, yPos);
  
  yPos += 6;
  doc.text('☐ Confirme ma présence au rendez-vous', margin, yPos);
  
  yPos += 6;
  doc.text('☐ Suis dans l\'impossibilité de me présenter et souhaite un autre rendez-vous', margin, yPos);
  
  yPos += 10;
  doc.text('Date: ________________', margin, yPos);
  doc.text('Signature:', pageWidth - margin - 40, yPos);
  
  // Télécharger
  const fileName = `Convocation_${convocation.studentName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(fileName);
}
