import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

// Generate a unique verification hash for the document
export const generateVerificationHash = (documentId: string, signatures: ElectronicSignature[]): string => {
  const signatureData = signatures.map(s => `${s.id}-${s.signedAt}`).join('|');
  const baseString = `${documentId}:${signatureData}`;
  
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `CR-${hexHash.slice(0, 4)}-${hexHash.slice(4, 8)}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
};

// Generate QR code data URL
const generateQRCodeDataUrl = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: 80,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

export interface ElectronicSignature {
  id: string;
  signerName: string;
  signerRole: string;
  signatureData: string;
  signedAt: string;
  ipAddress?: string;
  verified: boolean;
}

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
  electronicSignatures?: ElectronicSignature[];
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

export const generateReunionPDF = async (
  report: ReunionReport,
  schoolInfo: SchoolInfo
): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;
  
  // Check if document has electronic signatures for QR code
  const hasElectronicSignatures = report.electronicSignatures && report.electronicSignatures.length > 0;
  let qrCodeDataUrl = '';
  let verificationHash = '';
  
  if (hasElectronicSignatures && report.electronicSignatures) {
    verificationHash = generateVerificationHash(report.id, report.electronicSignatures);
    const verificationData = JSON.stringify({
      type: 'REUNION_REPORT',
      id: report.id,
      title: report.titre,
      hash: verificationHash,
      signatures: report.electronicSignatures.length,
      date: report.date,
      generatedAt: new Date().toISOString(),
    });
    qrCodeDataUrl = await generateQRCodeDataUrl(verificationData);
  }

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

  // Section Signatures
  yPos += 20;
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURES', margin, yPos);
  
  yPos += 2;
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, margin + 35, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Colonnes de signature
  const colWidth = (pageWidth - margin * 2) / 2;
  
  if (hasElectronicSignatures && report.electronicSignatures) {
    // Add electronic signatures section
    doc.setFillColor(240, 253, 244); // Light green background
    doc.rect(margin, yPos - 5, pageWidth - margin * 2, 15, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 163, 74); // Green text
    doc.text('✓ Document signé électroniquement', margin + 5, yPos + 3);
    doc.setTextColor(0, 0, 0);
    
    yPos += 20;
    
    // Display each electronic signature
    const presidentSig = report.electronicSignatures.find(s => s.signerRole === 'president');
    const secretaireSig = report.electronicSignatures.find(s => s.signerRole === 'secretaire');
    
    // President signature column
    doc.setFont('helvetica', 'bold');
    doc.text('Le Président de séance', margin, yPos);
    doc.text('Le Secrétaire', margin + colWidth, yPos);
    
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(report.president, margin, yPos);
    doc.text(report.secretaire, margin + colWidth, yPos);
    
    yPos += 8;
    
    // Add signature images if available
    if (presidentSig) {
      try {
        doc.addImage(presidentSig.signatureData, 'PNG', margin, yPos, 60, 25);
        yPos += 28;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Signé le ${new Date(presidentSig.signedAt).toLocaleString('fr-FR')}`, margin, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      } catch (e) {
        doc.text('[Signature électronique]', margin, yPos);
        yPos += 10;
      }
    } else {
      doc.text('[Signature en attente]', margin, yPos);
      yPos += 10;
    }
    
    // Reset yPos for secretary column
    const secretaireYPos = yPos - (presidentSig ? 38 : 10);
    
    if (secretaireSig) {
      try {
        doc.addImage(secretaireSig.signatureData, 'PNG', margin + colWidth, secretaireYPos, 60, 25);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Signé le ${new Date(secretaireSig.signedAt).toLocaleString('fr-FR')}`, margin + colWidth, secretaireYPos + 28);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      } catch (e) {
        doc.text('[Signature électronique]', margin + colWidth, secretaireYPos);
      }
    } else {
      doc.text('[Signature en attente]', margin + colWidth, secretaireYPos);
    }
    
    // Add other participant signatures if any
    const otherSignatures = report.electronicSignatures.filter(
      s => s.signerRole !== 'president' && s.signerRole !== 'secretaire'
    );
    
    if (otherSignatures.length > 0) {
      yPos += 15;
      doc.setFont('helvetica', 'bold');
      doc.text('Autres signataires:', margin, yPos);
      yPos += 8;
      
      otherSignatures.forEach((sig, index) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont('helvetica', 'normal');
        doc.text(`${sig.signerName}:`, margin, yPos);
        
        try {
          doc.addImage(sig.signatureData, 'PNG', margin + 50, yPos - 5, 50, 20);
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(`(${new Date(sig.signedAt).toLocaleString('fr-FR')})`, margin + 105, yPos + 5);
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
        } catch (e) {
          doc.text('[Signature]', margin + 50, yPos);
        }
        
        yPos += 25;
      });
    }
    
    // Add QR code and verification section
    yPos += 15;
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }
    
    // Draw verification box
    doc.setFillColor(249, 250, 251); // Light gray background
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin, yPos - 5, pageWidth - margin * 2, 50, 3, 3, 'FD');
    
    // Add QR code if available
    if (qrCodeDataUrl) {
      try {
        doc.addImage(qrCodeDataUrl, 'PNG', margin + 5, yPos, 40, 40);
      } catch (e) {
        console.error('Error adding QR code to PDF:', e);
      }
    }
    
    // Verification info
    const textX = margin + 50;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Vérification du document', textX, yPos + 5);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`Code de vérification: ${verificationHash}`, textX, yPos + 13);
    doc.text(`Nombre de signatures: ${report.electronicSignatures?.length || 0}`, textX, yPos + 20);
    doc.text(`Document ID: ${report.id.slice(0, 20)}...`, textX, yPos + 27);
    
    doc.setFontSize(7);
    doc.text('Scannez le QR code pour vérifier l\'authenticité de ce document', textX, yPos + 35);
    
    doc.setTextColor(0, 0, 0);
    yPos += 55;
    
    // Security notice
    doc.setFillColor(239, 246, 255); // Light blue background
    doc.rect(margin, yPos - 3, pageWidth - margin * 2, 12, 'F');
    doc.setFontSize(8);
    doc.setTextColor(59, 130, 246); // Blue text
    doc.text('🔒 Ce document a été signé électroniquement. Les signatures sont horodatées et vérifiables.', margin + 5, yPos + 4);
    doc.setTextColor(0, 0, 0);
    
  } else {
    // Traditional signature placeholders
    doc.text('Le Président de séance', margin, yPos);
    doc.text('Le Secrétaire', margin + colWidth, yPos);
    
    yPos += 5;
    doc.setFont('helvetica', 'italic');
    doc.text(report.president, margin, yPos);
    doc.text(report.secretaire, margin + colWidth, yPos);
    
    yPos += 15;
    doc.text('Signature:', margin, yPos);
    doc.text('Signature:', margin + colWidth, yPos);
    
    // Draw signature lines
    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos + 20, margin + 60, yPos + 20);
    doc.line(margin + colWidth, yPos + 20, margin + colWidth + 60, yPos + 20);
  }

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

export const downloadReunionPDF = async (report: ReunionReport, schoolInfo: SchoolInfo): Promise<void> => {
  const doc = await generateReunionPDF(report, schoolInfo);
  const fileName = `CR_${getTypeLabel(report.type).replace(/ /g, '_')}_${report.date}.pdf`;
  doc.save(fileName);
};

export const downloadEmptyTemplate = (type: ReunionReport['type'], schoolInfo: SchoolInfo): void => {
  const doc = generateEmptyReunionTemplate(type, schoolInfo);
  const fileName = `Template_${getTypeLabel(type).replace(/ /g, '_')}.pdf`;
  doc.save(fileName);
};
