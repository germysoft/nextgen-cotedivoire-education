import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StudentBulletin } from '@/types/bulletin';

export function generateBulletinPDF(bulletin: StudentBulletin, template: string = 'classic') {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // En-tête
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BULLETIN SCOLAIRE', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const trimesterText = bulletin.trimester === 1 ? '1er' : bulletin.trimester === 2 ? '2ème' : '3ème';
  doc.text(`${trimesterText} Trimestre - Année ${bulletin.academicYear}`, pageWidth / 2, 28, { align: 'center' });
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(20, 32, pageWidth - 20, 32);
  
  // Informations de l'élève
  let yPos = 40;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'élève', 20, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom et Prénom: ${bulletin.studentName}`, 20, yPos);
  doc.text(`Matricule: ${bulletin.studentNumber}`, 120, yPos);
  
  yPos += 6;
  doc.text(`Classe: ${bulletin.className}`, 20, yPos);
  doc.text(`Classement: ${bulletin.rank}e / ${bulletin.totalStudents}`, 120, yPos);
  
  // Résultats par matière
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Résultats par matière', 20, yPos);
  
  yPos += 5;
  
  // Tableau des notes
  const tableData = bulletin.subjects.map(subject => [
    subject.subjectName,
    subject.coefficient.toString(),
    subject.average.toFixed(2),
    subject.classAverage.toFixed(2),
    subject.teacherName,
    subject.comment || ''
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Matière', 'Coef.', 'Note', 'Moy. Classe', 'Enseignant', 'Appréciation']],
    body: tableData,
    foot: [['MOYENNE GÉNÉRALE', '', bulletin.generalAverage.toFixed(2), bulletin.classGeneralAverage.toFixed(2), '', '']],
    theme: 'striped',
    headStyles: { 
      fillColor: [41, 128, 185],
      fontStyle: 'bold',
      fontSize: 9
    },
    footStyles: {
      fillColor: [52, 73, 94],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30 },
      5: { cellWidth: 'auto' }
    },
    didParseCell: function(data) {
      // Colorer les notes selon la moyenne
      if (data.column.index === 2 && data.section === 'body') {
        const note = parseFloat(data.cell.text[0]);
        if (note >= 16) {
          data.cell.styles.textColor = [39, 174, 96]; // Vert
        } else if (note >= 14) {
          data.cell.styles.textColor = [41, 128, 185]; // Bleu
        } else if (note >= 10) {
          data.cell.styles.textColor = [243, 156, 18]; // Orange
        } else {
          data.cell.styles.textColor = [231, 76, 60]; // Rouge
        }
      }
    }
  });
  
  // Position après le tableau
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Vérifier s'il faut une nouvelle page
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }
  
  // Assiduité et comportement
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Assiduité et Comportement', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Absences: ${bulletin.absences} jour(s)`, 20, yPos);
  doc.text(`Retards: ${bulletin.tardiness}`, 80, yPos);
  doc.text(`Points discipline: ${bulletin.disciplinePoints}/100`, 130, yPos);
  
  yPos += 8;
  const appreciationLabels = {
    excellent: 'Excellent',
    good: 'Bien',
    average: 'Moyen',
    insufficient: 'Insuffisant'
  };
  
  doc.text(`Travail: ${appreciationLabels[bulletin.appreciations.work]}`, 20, yPos);
  doc.text(`Comportement: ${appreciationLabels[bulletin.appreciations.behavior]}`, 80, yPos);
  doc.text(`Participation: ${appreciationLabels[bulletin.appreciations.participation]}`, 130, yPos);
  
  // Commentaires
  if (bulletin.generalComment || bulletin.directorComment) {
    yPos += 12;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Commentaires', 20, yPos);
    
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    
    if (bulletin.generalComment) {
      const commentLines = doc.splitTextToSize(`Appréciation générale: "${bulletin.generalComment}"`, pageWidth - 40);
      doc.text(commentLines, 20, yPos);
      yPos += commentLines.length * 5 + 4;
    }
    
    if (bulletin.directorComment) {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
      const directorLines = doc.splitTextToSize(`Mot du directeur: "${bulletin.directorComment}"`, pageWidth - 40);
      doc.text(directorLines, 20, yPos);
      yPos += directorLines.length * 5;
    }
  }
  
  // Signatures
  yPos = pageHeight - 40;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Signature du parent', 40, yPos, { align: 'center' });
  doc.text('Le Directeur', pageWidth - 40, yPos, { align: 'center' });
  
  doc.line(15, yPos + 15, 65, yPos + 15);
  doc.line(pageWidth - 65, yPos + 15, pageWidth - 15, yPos + 15);
  
  doc.setFontSize(8);
  doc.text('Date et signature', 40, yPos + 18, { align: 'center' });
  doc.text('Cachet et signature', pageWidth - 40, yPos + 18, { align: 'center' });
  
  // Télécharger le PDF
  const fileName = `Bulletin_${bulletin.studentName.replace(/\s+/g, '_')}_T${bulletin.trimester}_${bulletin.academicYear.replace('/', '-')}.pdf`;
  doc.save(fileName);
}

export function generateMultipleBulletinsPDF(bulletins: StudentBulletin[], template: string = 'classic') {
  const doc = new jsPDF();
  
  bulletins.forEach((bulletin, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // En-tête
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('BULLETIN SCOLAIRE', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const trimesterText = bulletin.trimester === 1 ? '1er' : bulletin.trimester === 2 ? '2ème' : '3ème';
    doc.text(`${trimesterText} Trimestre - Année ${bulletin.academicYear}`, pageWidth / 2, 28, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 32, pageWidth - 20, 32);
    
    // Informations de l'élève
    let yPos = 40;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations de l\'élève', 20, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom et Prénom: ${bulletin.studentName}`, 20, yPos);
    doc.text(`Matricule: ${bulletin.studentNumber}`, 120, yPos);
    
    yPos += 6;
    doc.text(`Classe: ${bulletin.className}`, 20, yPos);
    doc.text(`Classement: ${bulletin.rank}e / ${bulletin.totalStudents}`, 120, yPos);
    
    yPos += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Résultats par matière', 20, yPos);
    yPos += 5;
    
    // Tableau des notes
    const tableData = bulletin.subjects.map(subject => [
      subject.subjectName,
      subject.coefficient.toString(),
      subject.average.toFixed(2),
      subject.classAverage.toFixed(2),
      subject.comment || ''
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Matière', 'Coef.', 'Note', 'Moy. Classe', 'Appréciation']],
      body: tableData,
      foot: [['MOYENNE GÉNÉRALE', '', bulletin.generalAverage.toFixed(2), bulletin.classGeneralAverage.toFixed(2), '']],
      theme: 'striped',
      headStyles: { 
        fillColor: [41, 128, 185],
        fontStyle: 'bold',
        fontSize: 9
      },
      footStyles: {
        fillColor: [52, 73, 94],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 15, halign: 'center' },
        2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 'auto' }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Assiduité
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Absences: ${bulletin.absences} | Retards: ${bulletin.tardiness} | Discipline: ${bulletin.disciplinePoints}/100`, 20, yPos);
    
    // Signatures
    yPos = pageHeight - 30;
    doc.setFontSize(10);
    doc.text('Signature du parent', 40, yPos, { align: 'center' });
    doc.text('Le Directeur', pageWidth - 40, yPos, { align: 'center' });
    doc.line(15, yPos + 10, 65, yPos + 10);
    doc.line(pageWidth - 65, yPos + 10, pageWidth - 15, yPos + 10);
  });
  
  const fileName = `Bulletins_Classe_T${bulletins[0]?.trimester || 1}_${bulletins[0]?.academicYear.replace('/', '-') || 'NA'}.pdf`;
  doc.save(fileName);
}
