import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReunionReport {
  id: string;
  titre: string;
  type: 'conseil_classe' | 'reunion_parents' | 'reunion_pedagogique' | 'reunion_administrative';
  date: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  president: string;
  secretaire: string;
  participants: {
    nom: string;
    fonction: string;
    present: boolean;
    signature?: boolean;
  }[];
  ordreJour: string[];
  discussions: {
    sujet: string;
    intervenant: string;
    contenu: string;
  }[];
  decisions: {
    numero: number;
    description: string;
    responsable: string;
    echeance: string;
  }[];
  pointsDivers?: string[];
  prochaineMeeting?: {
    date: string;
    lieu: string;
  };
}

export interface SchoolInfo {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  logo?: string;
  anneeScolaire: string;
}

const getTypeLabel = (type: ReunionReport['type']): string => {
  switch (type) {
    case 'conseil_classe': return 'Conseil de Classe';
    case 'reunion_parents': return 'Réunion Parents-Professeurs';
    case 'reunion_pedagogique': return 'Réunion Pédagogique';
    case 'reunion_administrative': return 'Réunion Administrative';
    default: return 'Réunion';
  }
};

export const generateReunionPDF = (
  report: ReunionReport,
  schoolInfo: SchoolInfo
): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // En-tête de l'établissement
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(schoolInfo.nom, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(schoolInfo.adresse, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text(`Tél: ${schoolInfo.telephone} | Email: ${schoolInfo.email}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text(`Année Scolaire: ${schoolInfo.anneeScolaire}`, pageWidth / 2, yPos, { align: 'center' });

  // Ligne de séparation
  yPos += 8;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Titre du document
  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPTE-RENDU DE RÉUNION', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(12);
  doc.text(getTypeLabel(report.type), pageWidth / 2, yPos, { align: 'center' });

  // Informations générales
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS GÉNÉRALES', margin, yPos);
  
  yPos += 2;
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, margin + 60, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const infoData = [
    ['Titre:', report.titre],
    ['Date:', new Date(report.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
    ['Horaires:', `${report.heureDebut} - ${report.heureFin}`],
    ['Lieu:', report.lieu],
    ['Président de séance:', report.president],
    ['Secrétaire:', report.secretaire],
  ];

  infoData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 45, yPos);
    yPos += 6;
  });

  // Liste des participants
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTICIPANTS', margin, yPos);
  
  yPos += 2;
  doc.line(margin, yPos, margin + 40, yPos);

  yPos += 5;
  const participantsData = report.participants.map(p => [
    p.nom,
    p.fonction,
    p.present ? 'Présent' : 'Absent',
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Nom', 'Fonction', 'Présence']],
    body: participantsData,
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Ordre du jour
  if (report.ordreJour.length > 0) {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDRE DU JOUR', margin, yPos);
    
    yPos += 2;
    doc.line(margin, yPos, margin + 40, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    report.ordreJour.forEach((point, index) => {
      const text = `${index + 1}. ${point}`;
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 5 + 2;
    });
  }

  // Discussions
  if (report.discussions.length > 0) {
    yPos += 5;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DISCUSSIONS ET INTERVENTIONS', margin, yPos);
    
    yPos += 2;
    doc.line(margin, yPos, margin + 70, yPos);

    yPos += 8;
    
    report.discussions.forEach((disc, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${disc.sujet}`, margin, yPos);
      
      yPos += 5;
      doc.setFont('helvetica', 'italic');
      doc.text(`Intervenant: ${disc.intervenant}`, margin + 5, yPos);
      
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const contentLines = doc.splitTextToSize(disc.contenu, pageWidth - margin * 2 - 5);
      doc.text(contentLines, margin + 5, yPos);
      yPos += contentLines.length * 5 + 5;
    });
  }

  // Décisions prises
  if (report.decisions.length > 0) {
    yPos += 5;
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉCISIONS PRISES', margin, yPos);
    
    yPos += 2;
    doc.line(margin, yPos, margin + 50, yPos);

    yPos += 5;
    const decisionsData = report.decisions.map(d => [
      `D${d.numero}`,
      d.description,
      d.responsable,
      d.echeance,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['N°', 'Description', 'Responsable', 'Échéance']],
      body: decisionsData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [92, 184, 92], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Points divers
  if (report.pointsDivers && report.pointsDivers.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('POINTS DIVERS', margin, yPos);
    
    yPos += 2;
    doc.line(margin, yPos, margin + 40, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    report.pointsDivers.forEach((point, index) => {
      const text = `• ${point}`;
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 5 + 2;
    });
  }

  // Prochaine réunion
  if (report.prochaineMeeting) {
    yPos += 8;
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Prochaine réunion prévue:', margin, yPos);
    
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${report.prochaineMeeting.date} | Lieu: ${report.prochaineMeeting.lieu}`, margin, yPos);
  }

  // Signature
  yPos += 20;
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Colonnes de signature
  const colWidth = (pageWidth - margin * 2) / 2;
  
  doc.text('Le Président de séance', margin, yPos);
  doc.text('Le Secrétaire', margin + colWidth, yPos);
  
  yPos += 5;
  doc.setFont('helvetica', 'italic');
  doc.text(report.president, margin, yPos);
  doc.text(report.secretaire, margin + colWidth, yPos);
  
  yPos += 15;
  doc.text('Signature:', margin, yPos);
  doc.text('Signature:', margin + colWidth, yPos);

  // Pied de page sur toutes les pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    
    doc.text(
      `Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
      margin,
      pageHeight - 10
    );
    doc.text(
      `Page ${i} / ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
    
    doc.setTextColor(0, 0, 0);
  }

  return doc;
};

export const generateEmptyReunionTemplate = (
  type: ReunionReport['type'],
  schoolInfo: SchoolInfo
): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // En-tête
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(schoolInfo.nom, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(schoolInfo.adresse, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text(`Année Scolaire: ${schoolInfo.anneeScolaire}`, pageWidth / 2, yPos, { align: 'center' });

  yPos += 10;
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`FICHE DE RÉUNION - ${getTypeLabel(type).toUpperCase()}`, pageWidth / 2, yPos, { align: 'center' });

  // Champs à remplir
  yPos += 20;
  const fields = [
    'Date: ____________________',
    'Horaires: ________ - ________',
    'Lieu: ____________________',
    'Président de séance: ____________________',
    'Secrétaire: ____________________',
  ];

  doc.setFontSize(11);
  fields.forEach(field => {
    doc.text(field, margin, yPos);
    yPos += 10;
  });

  // Section participants
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('LISTE DES PARTICIPANTS', margin, yPos);
  yPos += 5;
  doc.line(margin, yPos, margin + 60, yPos);

  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['N°', 'Nom et Prénom', 'Fonction', 'Signature']],
    body: Array(10).fill(['', '', '', '']),
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 4, minCellHeight: 10 },
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Ordre du jour
  doc.setFont('helvetica', 'bold');
  doc.text('ORDRE DU JOUR', margin, yPos);
  yPos += 5;
  doc.line(margin, yPos, margin + 40, yPos);
  
  yPos += 10;
  for (let i = 1; i <= 5; i++) {
    doc.setFont('helvetica', 'normal');
    doc.text(`${i}. ________________________________________________________________`, margin, yPos);
    yPos += 10;
  }

  // Nouvelle page pour les notes
  doc.addPage();
  yPos = 20;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTES ET DISCUSSIONS', margin, yPos);
  yPos += 5;
  doc.line(margin, yPos, margin + 50, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Lignes pour notes
  for (let i = 0; i < 25; i++) {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
  }

  // Nouvelle page pour décisions
  doc.addPage();
  yPos = 20;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉCISIONS PRISES', margin, yPos);
  yPos += 5;
  doc.line(margin, yPos, margin + 50, yPos);

  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['N°', 'Décision', 'Responsable', 'Échéance']],
    body: Array(8).fill(['', '', '', '']),
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 4, minCellHeight: 15 },
    headStyles: { fillColor: [92, 184, 92], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 80 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Prochaine réunion
  doc.setFont('helvetica', 'bold');
  doc.text('PROCHAINE RÉUNION', margin, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Date prévue: ____________________ Lieu: ____________________', margin, yPos);

  // Signatures
  yPos += 25;
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;
  
  const colWidth = (pageWidth - margin * 2) / 2;
  doc.text('Le Président de séance', margin, yPos);
  doc.text('Le Secrétaire', margin + colWidth, yPos);
  yPos += 20;
  doc.text('Signature:', margin, yPos);
  doc.text('Signature:', margin + colWidth, yPos);

  return doc;
};

export const downloadReunionPDF = (report: ReunionReport, schoolInfo: SchoolInfo): void => {
  const doc = generateReunionPDF(report, schoolInfo);
  const fileName = `CR_${getTypeLabel(report.type).replace(/ /g, '_')}_${report.date}.pdf`;
  doc.save(fileName);
};

export const downloadEmptyTemplate = (type: ReunionReport['type'], schoolInfo: SchoolInfo): void => {
  const doc = generateEmptyReunionTemplate(type, schoolInfo);
  const fileName = `Template_${getTypeLabel(type).replace(/ /g, '_')}.pdf`;
  doc.save(fileName);
};
