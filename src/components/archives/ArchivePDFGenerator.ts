import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface ArchiveEleve {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  classe: string;
  annee: string;
  dateNaissance?: string;
  lieuNaissance?: string;
}

export interface ArchiveBulletinData {
  eleve: ArchiveEleve;
  trimestre: number;
  matieres: Array<{
    nom: string;
    coefficient: number;
    note: number;
    moyenneClasse: number;
    appreciation: string;
  }>;
  moyenneGenerale: number;
  rang: number;
  effectif: number;
  absences: number;
  retards: number;
  appreciationGenerale: string;
}

// Ajouter le filigrane "ARCHIVE" sur le document
function addArchiveWatermark(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.saveGraphicsState();
  
  // Configuration du filigrane
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  
  // Rotation et positionnement du filigrane en diagonale
  const text = 'ARCHIVE';
  const textWidth = doc.getTextWidth(text);
  
  // Calculer le centre de la page
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Appliquer la rotation (45 degrés)
  doc.text(text, centerX, centerY, {
    align: 'center',
    angle: 45
  });
  
  doc.restoreGraphicsState();
}

// Ajouter le bandeau "DOCUMENT ARCHIVE" en haut
function addArchiveBanner(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Bandeau rouge en haut
  doc.setFillColor(220, 53, 69);
  doc.rect(0, 0, pageWidth, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DOCUMENT D\'ARCHIVE - VALEUR HISTORIQUE UNIQUEMENT', pageWidth / 2, 8, { align: 'center' });
  
  // Réinitialiser la couleur du texte
  doc.setTextColor(0, 0, 0);
}

// Ajouter la mention d'archive en pied de page
function addArchiveFooter(doc: jsPDF, annee: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  
  const date = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  doc.text(
    `Document extrait des archives de l'année scolaire ${annee} - Imprimé le ${date}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );
  
  doc.setTextColor(0, 0, 0);
}

// Générer un bulletin archivé avec filigrane
export function generateArchiveBulletinPDF(data: ArchiveBulletinData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Ajouter le filigrane en arrière-plan
  addArchiveWatermark(doc);
  
  // Ajouter le bandeau d'archive en haut
  addArchiveBanner(doc);
  
  let yPos = 20;
  
  // En-tête
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BULLETIN SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const trimestreText = data.trimestre === 1 ? '1er' : data.trimestre === 2 ? '2ème' : '3ème';
  doc.text(`${trimestreText} Trimestre - Année ${data.eleve.annee}`, pageWidth / 2, yPos, { align: 'center' });
  
  // Badge ARCHIVE visible
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth - 45, 15, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ARCHIVE', pageWidth - 27.5, 22, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  // Informations élève
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'élève', 20, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nom et Prénom: ${data.eleve.nom} ${data.eleve.prenom}`, 20, yPos);
  doc.text(`Matricule: ${data.eleve.matricule}`, 120, yPos);
  
  yPos += 6;
  doc.text(`Classe: ${data.eleve.classe}`, 20, yPos);
  doc.text(`Rang: ${data.rang}e / ${data.effectif}`, 120, yPos);
  
  if (data.eleve.dateNaissance) {
    yPos += 6;
    doc.text(`Né(e) le: ${data.eleve.dateNaissance}`, 20, yPos);
    if (data.eleve.lieuNaissance) {
      doc.text(`à ${data.eleve.lieuNaissance}`, 70, yPos);
    }
  }
  
  // Tableau des notes
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Résultats par matière', 20, yPos);
  yPos += 5;
  
  const tableData = data.matieres.map(m => [
    m.nom,
    m.coefficient.toString(),
    m.note.toFixed(2),
    m.moyenneClasse.toFixed(2),
    m.appreciation
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Matière', 'Coef.', 'Note', 'Moy. Classe', 'Appréciation']],
    body: tableData,
    foot: [['MOYENNE GÉNÉRALE', '', data.moyenneGenerale.toFixed(2), '', '']],
    theme: 'striped',
    headStyles: {
      fillColor: [100, 100, 100],
      fontStyle: 'bold',
      fontSize: 9
    },
    footStyles: {
      fillColor: [60, 60, 60],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 'auto' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Assiduité
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Absences: ${data.absences} jour(s) | Retards: ${data.retards}`, 20, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'italic');
  const appreciationLines = doc.splitTextToSize(`Appréciation: ${data.appreciationGenerale}`, pageWidth - 40);
  doc.text(appreciationLines, 20, yPos);
  
  // Pied de page archive
  addArchiveFooter(doc, data.eleve.annee);
  
  const fileName = `Archive_Bulletin_${data.eleve.nom}_${data.eleve.prenom}_T${data.trimestre}_${data.eleve.annee.replace('/', '-')}.pdf`;
  doc.save(fileName);
}

// Générer un certificat de scolarité archivé
export function generateArchiveCertificatPDF(eleve: ArchiveEleve) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Ajouter le filigrane en arrière-plan
  addArchiveWatermark(doc);
  
  // Ajouter le bandeau d'archive en haut
  addArchiveBanner(doc);
  
  let yPos = 25;
  
  // En-tête
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  
  // Badge ARCHIVE
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth - 45, 15, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ARCHIVE', pageWidth - 27.5, 22, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 25;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICAT DE SCOLARITÉ', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.text(`Année Scolaire ${eleve.annee}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(50, yPos, pageWidth - 50, yPos);
  
  yPos += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const textContent = [
    'Le Directeur de l\'établissement certifie que :',
    '',
    `L'élève ${eleve.nom} ${eleve.prenom}`,
    `Matricule : ${eleve.matricule}`,
    eleve.dateNaissance ? `Né(e) le ${eleve.dateNaissance}${eleve.lieuNaissance ? ` à ${eleve.lieuNaissance}` : ''}` : '',
    '',
    `A été régulièrement inscrit(e) et a suivi les cours en classe de ${eleve.classe}`,
    `au cours de l'année scolaire ${eleve.annee}.`,
    '',
    'Ce certificat est délivré à l\'intéressé(e) pour servir et valoir ce que de droit.'
  ].filter(line => line !== '');
  
  textContent.forEach((line, index) => {
    if (line.startsWith('L\'élève') || line.startsWith('A été')) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.text(line, pageWidth / 2, yPos + (index * 8), { align: 'center' });
  });
  
  // Date et signature
  yPos = pageHeight - 60;
  const date = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Fait à __________________, le ${date}`, pageWidth - 60, yPos, { align: 'center' });
  
  yPos += 15;
  doc.text('Le Directeur', pageWidth - 60, yPos, { align: 'center' });
  
  // Pied de page archive
  addArchiveFooter(doc, eleve.annee);
  
  const fileName = `Archive_Certificat_${eleve.nom}_${eleve.prenom}_${eleve.annee.replace('/', '-')}.pdf`;
  doc.save(fileName);
}

// Générer une attestation de scolarité archivée
export function generateArchiveAttestationPDF(eleve: ArchiveEleve) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Ajouter le filigrane en arrière-plan
  addArchiveWatermark(doc);
  
  // Ajouter le bandeau d'archive en haut
  addArchiveBanner(doc);
  
  let yPos = 25;
  
  // En-tête
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  
  // Badge ARCHIVE
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth - 45, 15, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ARCHIVE', pageWidth - 27.5, 22, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 25;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTESTATION DE SCOLARITÉ', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.text(`Année Scolaire ${eleve.annee}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(50, yPos, pageWidth - 50, yPos);
  
  yPos += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const textContent = [
    'Je soussigné(e), Directeur de l\'établissement, atteste que :',
    '',
    `L'élève ${eleve.nom} ${eleve.prenom}`,
    `Matricule : ${eleve.matricule}`,
    eleve.dateNaissance ? `Né(e) le ${eleve.dateNaissance}${eleve.lieuNaissance ? ` à ${eleve.lieuNaissance}` : ''}` : '',
    '',
    `A été scolarisé(e) dans notre établissement en classe de ${eleve.classe}`,
    `durant l'année scolaire ${eleve.annee}.`,
    '',
    'En foi de quoi, la présente attestation lui est délivrée',
    'pour servir et valoir ce que de droit.'
  ].filter(line => line !== '');
  
  textContent.forEach((line, index) => {
    if (line.startsWith('L\'élève') || line.startsWith('A été')) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.text(line, pageWidth / 2, yPos + (index * 8), { align: 'center' });
  });
  
  // Date et signature
  yPos = pageHeight - 60;
  const date = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Fait à __________________, le ${date}`, pageWidth - 60, yPos, { align: 'center' });
  
  yPos += 15;
  doc.text('Le Directeur', pageWidth - 60, yPos, { align: 'center' });
  
  // Pied de page archive
  addArchiveFooter(doc, eleve.annee);
  
  const fileName = `Archive_Attestation_${eleve.nom}_${eleve.prenom}_${eleve.annee.replace('/', '-')}.pdf`;
  doc.save(fileName);
}

// Générer un relevé de notes archivé
export function generateArchiveRelevePDF(data: ArchiveBulletinData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Ajouter le filigrane en arrière-plan
  addArchiveWatermark(doc);
  
  // Ajouter le bandeau d'archive en haut
  addArchiveBanner(doc);
  
  let yPos = 20;
  
  // En-tête
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  
  // Badge ARCHIVE
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth - 45, 15, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ARCHIVE', pageWidth - 27.5, 22, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RELEVÉ DE NOTES', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const trimestreText = data.trimestre === 1 ? '1er' : data.trimestre === 2 ? '2ème' : '3ème';
  doc.text(`${trimestreText} Trimestre - Année Scolaire ${data.eleve.annee}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 4;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  // Informations élève
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Élève: ${data.eleve.nom} ${data.eleve.prenom}`, 20, yPos);
  doc.text(`Matricule: ${data.eleve.matricule}`, pageWidth - 60, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Classe: ${data.eleve.classe}`, 20, yPos);
  doc.text(`Rang: ${data.rang}/${data.effectif}`, pageWidth - 60, yPos);
  
  // Tableau des notes
  yPos += 10;
  
  const tableData = data.matieres.map(m => [
    m.nom,
    m.coefficient.toString(),
    m.note.toFixed(2),
    (m.note * m.coefficient).toFixed(2)
  ]);
  
  const totalPoints = data.matieres.reduce((acc, m) => acc + m.note * m.coefficient, 0);
  const totalCoef = data.matieres.reduce((acc, m) => acc + m.coefficient, 0);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Matière', 'Coefficient', 'Note /20', 'Points']],
    body: tableData,
    foot: [[
      'TOTAL',
      totalCoef.toString(),
      data.moyenneGenerale.toFixed(2),
      totalPoints.toFixed(2)
    ]],
    theme: 'grid',
    headStyles: {
      fillColor: [100, 100, 100],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    footStyles: {
      fillColor: [60, 60, 60],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 9,
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 60 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 }
    }
  });
  
  // Pied de page archive
  addArchiveFooter(doc, data.eleve.annee);
  
  const fileName = `Archive_Releve_${data.eleve.nom}_${data.eleve.prenom}_T${data.trimestre}_${data.eleve.annee.replace('/', '-')}.pdf`;
  doc.save(fileName);
}

// ============ Fonctions pour génération en blob (pour ZIP) ============

function createBulletinPDFBlob(data: ArchiveBulletinData): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  addArchiveWatermark(doc);
  addArchiveBanner(doc);
  
  let yPos = 20;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BULLETIN SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const trimestreText = data.trimestre === 1 ? '1er' : data.trimestre === 2 ? '2ème' : '3ème';
  doc.text(`${trimestreText} Trimestre - Année ${data.eleve.annee}`, pageWidth / 2, yPos, { align: 'center' });
  
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth - 45, 15, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ARCHIVE', pageWidth - 27.5, 22, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'élève', 20, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Nom et Prénom: ${data.eleve.nom} ${data.eleve.prenom}`, 20, yPos);
  doc.text(`Matricule: ${data.eleve.matricule}`, 120, yPos);
  
  yPos += 6;
  doc.text(`Classe: ${data.eleve.classe}`, 20, yPos);
  doc.text(`Rang: ${data.rang}e / ${data.effectif}`, 120, yPos);
  
  if (data.eleve.dateNaissance) {
    yPos += 6;
    doc.text(`Né(e) le: ${data.eleve.dateNaissance}`, 20, yPos);
    if (data.eleve.lieuNaissance) {
      doc.text(`à ${data.eleve.lieuNaissance}`, 70, yPos);
    }
  }
  
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Résultats par matière', 20, yPos);
  yPos += 5;
  
  const tableData = data.matieres.map(m => [
    m.nom,
    m.coefficient.toString(),
    m.note.toFixed(2),
    m.moyenneClasse.toFixed(2),
    m.appreciation
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Matière', 'Coef.', 'Note', 'Moy. Classe', 'Appréciation']],
    body: tableData,
    foot: [['MOYENNE GÉNÉRALE', '', data.moyenneGenerale.toFixed(2), '', '']],
    theme: 'striped',
    headStyles: { fillColor: [100, 100, 100], fontStyle: 'bold', fontSize: 9 },
    footStyles: { fillColor: [60, 60, 60], fontStyle: 'bold', fontSize: 10 },
    bodyStyles: { fontSize: 8 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Absences: ${data.absences} jour(s) | Retards: ${data.retards}`, 20, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'italic');
  const appreciationLines = doc.splitTextToSize(`Appréciation: ${data.appreciationGenerale}`, pageWidth - 40);
  doc.text(appreciationLines, 20, yPos);
  
  addArchiveFooter(doc, data.eleve.annee);
  
  return doc.output('blob');
}

function createCertificatPDFBlob(eleve: ArchiveEleve): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  addArchiveWatermark(doc);
  addArchiveBanner(doc);
  
  let yPos = 25;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth - 45, 15, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ARCHIVE', pageWidth - 27.5, 22, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 25;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICAT DE SCOLARITÉ', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.text(`Année Scolaire ${eleve.annee}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(50, yPos, pageWidth - 50, yPos);
  
  yPos += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const textContent = [
    'Le Directeur de l\'établissement certifie que :',
    `L'élève ${eleve.nom} ${eleve.prenom}`,
    `Matricule : ${eleve.matricule}`,
    eleve.dateNaissance ? `Né(e) le ${eleve.dateNaissance}${eleve.lieuNaissance ? ` à ${eleve.lieuNaissance}` : ''}` : '',
    `A été régulièrement inscrit(e) et a suivi les cours en classe de ${eleve.classe}`,
    `au cours de l'année scolaire ${eleve.annee}.`,
    'Ce certificat est délivré à l\'intéressé(e) pour servir et valoir ce que de droit.'
  ].filter(line => line !== '');
  
  textContent.forEach((line, index) => {
    if (line.startsWith('L\'élève') || line.startsWith('A été')) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.text(line, pageWidth / 2, yPos + (index * 8), { align: 'center' });
  });
  
  yPos = pageHeight - 60;
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Fait à __________________, le ${date}`, pageWidth - 60, yPos, { align: 'center' });
  yPos += 15;
  doc.text('Le Directeur', pageWidth - 60, yPos, { align: 'center' });
  
  addArchiveFooter(doc, eleve.annee);
  
  return doc.output('blob');
}

function createAttestationPDFBlob(eleve: ArchiveEleve): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  addArchiveWatermark(doc);
  addArchiveBanner(doc);
  
  let yPos = 25;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth - 45, 15, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ARCHIVE', pageWidth - 27.5, 22, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 25;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTESTATION DE SCOLARITÉ', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.text(`Année Scolaire ${eleve.annee}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(50, yPos, pageWidth - 50, yPos);
  
  yPos += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const textContent = [
    'Je soussigné(e), Directeur de l\'établissement, atteste que :',
    `L'élève ${eleve.nom} ${eleve.prenom}`,
    `Matricule : ${eleve.matricule}`,
    eleve.dateNaissance ? `Né(e) le ${eleve.dateNaissance}${eleve.lieuNaissance ? ` à ${eleve.lieuNaissance}` : ''}` : '',
    `A été scolarisé(e) dans notre établissement en classe de ${eleve.classe}`,
    `durant l'année scolaire ${eleve.annee}.`,
    'En foi de quoi, la présente attestation lui est délivrée',
    'pour servir et valoir ce que de droit.'
  ].filter(line => line !== '');
  
  textContent.forEach((line, index) => {
    if (line.startsWith('L\'élève') || line.startsWith('A été')) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.text(line, pageWidth / 2, yPos + (index * 8), { align: 'center' });
  });
  
  yPos = pageHeight - 60;
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Fait à __________________, le ${date}`, pageWidth - 60, yPos, { align: 'center' });
  yPos += 15;
  doc.text('Le Directeur', pageWidth - 60, yPos, { align: 'center' });
  
  addArchiveFooter(doc, eleve.annee);
  
  return doc.output('blob');
}

function createRelevePDFBlob(data: ArchiveBulletinData): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  addArchiveWatermark(doc);
  addArchiveBanner(doc);
  
  let yPos = 20;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION', pageWidth / 2, yPos, { align: 'center' });
  
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth - 45, 15, 35, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ARCHIVE', pageWidth - 27.5, 22, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RELEVÉ DE NOTES', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const trimestreText = data.trimestre === 1 ? '1er' : data.trimestre === 2 ? '2ème' : '3ème';
  doc.text(`${trimestreText} Trimestre - Année Scolaire ${data.eleve.annee}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 4;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Élève: ${data.eleve.nom} ${data.eleve.prenom}`, 20, yPos);
  doc.text(`Matricule: ${data.eleve.matricule}`, pageWidth - 60, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Classe: ${data.eleve.classe}`, 20, yPos);
  doc.text(`Rang: ${data.rang}/${data.effectif}`, pageWidth - 60, yPos);
  
  yPos += 10;
  
  const tableData = data.matieres.map(m => [
    m.nom,
    m.coefficient.toString(),
    m.note.toFixed(2),
    (m.note * m.coefficient).toFixed(2)
  ]);
  
  const totalPoints = data.matieres.reduce((acc, m) => acc + m.note * m.coefficient, 0);
  const totalCoef = data.matieres.reduce((acc, m) => acc + m.coefficient, 0);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Matière', 'Coefficient', 'Note /20', 'Points']],
    body: tableData,
    foot: [['TOTAL', totalCoef.toString(), data.moyenneGenerale.toFixed(2), totalPoints.toFixed(2)]],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], fontStyle: 'bold', fontSize: 9, halign: 'center' },
    footStyles: { fillColor: [60, 60, 60], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, halign: 'center' },
    columnStyles: { 0: { halign: 'left', cellWidth: 60 } }
  });
  
  addArchiveFooter(doc, data.eleve.annee);
  
  return doc.output('blob');
}

// ============ Export groupé en ZIP ============

export async function generateArchiveZIP(eleve: ArchiveEleve, bulletinData: ArchiveBulletinData): Promise<void> {
  const zip = new JSZip();
  
  const folderName = `Archives_${eleve.nom}_${eleve.prenom}_${eleve.annee.replace('/', '-')}`;
  const folder = zip.folder(folderName);
  
  if (!folder) return;
  
  // Générer les 4 documents
  const bulletinBlob = createBulletinPDFBlob(bulletinData);
  const certificatBlob = createCertificatPDFBlob(eleve);
  const attestationBlob = createAttestationPDFBlob(eleve);
  const releveBlob = createRelevePDFBlob(bulletinData);
  
  // Ajouter au ZIP
  folder.file(`Bulletin_T${bulletinData.trimestre}_${eleve.annee.replace('/', '-')}.pdf`, bulletinBlob);
  folder.file(`Certificat_Scolarite_${eleve.annee.replace('/', '-')}.pdf`, certificatBlob);
  folder.file(`Attestation_Scolarite_${eleve.annee.replace('/', '-')}.pdf`, attestationBlob);
  folder.file(`Releve_Notes_T${bulletinData.trimestre}_${eleve.annee.replace('/', '-')}.pdf`, releveBlob);
  
  // Ajouter un fichier README
  const readmeContent = `DOSSIER SCOLAIRE ARCHIVÉ
========================

Élève: ${eleve.nom} ${eleve.prenom}
Matricule: ${eleve.matricule}
Classe: ${eleve.classe}
Année scolaire: ${eleve.annee}

Documents inclus:
- Bulletin scolaire (Trimestre ${bulletinData.trimestre})
- Certificat de scolarité
- Attestation de scolarité
- Relevé de notes

⚠️ ATTENTION: Ces documents sont des extraits d'archives.
Ils portent la mention "ARCHIVE" et ont une valeur historique uniquement.

Date d'extraction: ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
`;
  
  folder.file('README.txt', readmeContent);
  
  // Générer et télécharger le ZIP
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${folderName}.zip`);
}
