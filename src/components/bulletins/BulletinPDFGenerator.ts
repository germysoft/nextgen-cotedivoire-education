import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StudentBulletin } from '@/types/bulletin';
import { ConfigurationEtablissement } from '@/types/etablissement';

interface BulletinPDFOptions {
  bulletin: StudentBulletin;
  template?: string;
  config?: ConfigurationEtablissement | null;
  moyenneConduite?: number;
  includeConduite?: boolean;
}

export function generateBulletinPDF(
  bulletin: StudentBulletin, 
  template: string = 'classic',
  config?: ConfigurationEtablissement | null,
  moyenneConduite?: number
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // En-tête avec informations de l'établissement
  let yPos = 12;
  
  // Logo de l'établissement (à gauche)
  if (config?.identite?.logo) {
    try {
      doc.addImage(config.identite.logo, 'JPEG', 15, 8, 25, 25);
    } catch (e) {
      console.warn('Impossible de charger le logo:', e);
    }
  }
  
  // Ministère de tutelle (depuis config ou valeur par défaut)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const ministereTutelle = config?.signataire?.ministereTutelleDocuments || 
    'MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION';
  doc.text(ministereTutelle.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  
  // Nom de l'établissement
  if (config?.identite?.nom) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(config.identite.nom.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
    yPos += 4;
    
    // Sigle si présent
    if (config.identite.sigle) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`(${config.identite.sigle})`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 4;
    }
    
    // Devise si présente
    if (config.identite.devise) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`"${config.identite.devise}"`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 3;
    }
  }
  
  yPos = Math.max(yPos, 35); // S'assurer qu'on est sous le logo
  
  yPos += 2;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BULLETIN SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const trimesterText = bulletin.trimester === 1 ? '1er' : bulletin.trimester === 2 ? '2ème' : '3ème';
  doc.text(`${trimesterText} Trimestre - Année ${bulletin.academicYear}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 4;
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  // Informations de l'élève
  yPos += 8;
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
  
  // Ajouter la moyenne de conduite si configurée
  const includeConduite = config?.parametresPedagogiques?.moyenneConduitePriseEnCompte && moyenneConduite !== undefined;
  let generalAverageDisplay = bulletin.generalAverage;
  
  if (includeConduite && moyenneConduite !== undefined) {
    // Recalculer la moyenne avec la conduite (coefficient 1)
    const totalPoints = bulletin.subjects.reduce((acc, s) => acc + s.average * s.coefficient, 0);
    const totalCoef = bulletin.subjects.reduce((acc, s) => acc + s.coefficient, 0);
    generalAverageDisplay = (totalPoints + moyenneConduite) / (totalCoef + 1);
    
    // Ajouter la conduite aux données du tableau
    tableData.push([
      'Conduite',
      '1',
      moyenneConduite.toFixed(2),
      '-',
      '-',
      moyenneConduite >= 15 ? 'Excellent' : moyenneConduite >= 12 ? 'Bien' : moyenneConduite >= 10 ? 'Passable' : 'À améliorer'
    ]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [['Matière', 'Coef.', 'Note', 'Moy. Classe', 'Enseignant', 'Appréciation']],
    body: tableData,
    foot: [['MOYENNE GÉNÉRALE', '', generalAverageDisplay.toFixed(2), bulletin.classGeneralAverage.toFixed(2), '', '']],
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
  
  // Pied de page officiel si configuré
  if (config?.parametresVisuels?.piedDePage) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text(config.parametresVisuels.piedDePage, pageWidth / 2, pageHeight - 50, { align: 'center' });
  }
  
  // Cachet scanné si disponible (en bas à droite avant la signature)
  if (config?.parametresVisuels?.cachetScane) {
    try {
      doc.addImage(config.parametresVisuels.cachetScane, 'PNG', pageWidth - 55, pageHeight - 60, 30, 30);
    } catch (e) {
      console.warn('Impossible de charger le cachet:', e);
    }
  }
  
  // Signatures
  yPos = pageHeight - 40;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Signature du parent', 40, yPos, { align: 'center' });
  
  // Nom et fonction du signataire depuis config
  const nomSignataire = config?.signataire?.nomSignataire || 'Le Directeur';
  const fonctionSignataire = config?.signataire?.fonctionSignataire || '';
  
  // Fonction mappée vers un label lisible
  const fonctionLabels: Record<string, string> = {
    'fondateur': 'Le Fondateur',
    'directeur': 'Le Directeur',
    'proviseur': 'Le Proviseur',
    'directeur_etudes': 'Le Directeur des Études',
    'principal': 'Le Principal',
    'censeur': 'Le Censeur',
    'surveillant_general': 'Le Surveillant Général'
  };
  
  const fonctionLabel = fonctionLabels[fonctionSignataire] || fonctionSignataire || 'Le Directeur';
  
  doc.setFontSize(9);
  doc.text(fonctionLabel, pageWidth - 40, yPos - 4, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(nomSignataire, pageWidth - 40, yPos + 2, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.line(15, yPos + 15, 65, yPos + 15);
  doc.line(pageWidth - 65, yPos + 15, pageWidth - 15, yPos + 15);
  
  doc.setFontSize(8);
  doc.text('Date et signature', 40, yPos + 18, { align: 'center' });
  doc.text('Cachet et signature', pageWidth - 40, yPos + 18, { align: 'center' });
  
  // Télécharger le PDF
  const fileName = `Bulletin_${bulletin.studentName.replace(/\s+/g, '_')}_T${bulletin.trimester}_${bulletin.academicYear.replace('/', '-')}.pdf`;
  doc.save(fileName);
}

export function generateMultipleBulletinsPDF(
  bulletins: StudentBulletin[], 
  template: string = 'classic',
  config?: ConfigurationEtablissement | null,
  moyennesConduite?: Map<string, number>
) {
  const doc = new jsPDF();
  
  bulletins.forEach((bulletin, index) => {
    if (index > 0) {
      doc.addPage();
    }
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Logo en haut à gauche
    if (config?.identite?.logo) {
      try {
        doc.addImage(config.identite.logo, 'JPEG', 15, 8, 20, 20);
      } catch (e) {
        console.warn('Impossible de charger le logo:', e);
      }
    }
    
    // En-tête avec ministère de tutelle
    let yPos = 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const ministereTutelle = config?.signataire?.ministereTutelleDocuments || 
      'MINISTÈRE DE L\'ÉDUCATION NATIONALE ET DE L\'ALPHABÉTISATION';
    doc.text(ministereTutelle.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 5;
    
    // Nom de l'établissement
    if (config?.identite?.nom) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(config.identite.nom.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
      yPos += 4;
    }
    
    yPos = Math.max(yPos, 30);
    
    yPos += 2;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BULLETIN SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const trimesterText = bulletin.trimester === 1 ? '1er' : bulletin.trimester === 2 ? '2ème' : '3ème';
    doc.text(`${trimesterText} Trimestre - Année ${bulletin.academicYear}`, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 3;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    // Informations de l'élève
    yPos += 8;
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
    
    // Ajouter la moyenne de conduite si configurée
    const moyenneConduite = moyennesConduite?.get(bulletin.studentId);
    const includeConduite = config?.parametresPedagogiques?.moyenneConduitePriseEnCompte && moyenneConduite !== undefined;
    let generalAverageDisplay = bulletin.generalAverage;
    
    if (includeConduite && moyenneConduite !== undefined) {
      const totalPoints = bulletin.subjects.reduce((acc, s) => acc + s.average * s.coefficient, 0);
      const totalCoef = bulletin.subjects.reduce((acc, s) => acc + s.coefficient, 0);
      generalAverageDisplay = (totalPoints + moyenneConduite) / (totalCoef + 1);
      
      tableData.push([
        'Conduite',
        '1',
        moyenneConduite.toFixed(2),
        '-',
        moyenneConduite >= 15 ? 'Excellent' : moyenneConduite >= 12 ? 'Bien' : 'À améliorer'
      ]);
    }
    
    autoTable(doc, {
      startY: yPos,
      head: [['Matière', 'Coef.', 'Note', 'Moy. Classe', 'Appréciation']],
      body: tableData,
      foot: [['MOYENNE GÉNÉRALE', '', generalAverageDisplay.toFixed(2), bulletin.classGeneralAverage.toFixed(2), '']],
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
    
    // Pied de page officiel
    if (config?.parametresVisuels?.piedDePage) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.text(config.parametresVisuels.piedDePage, pageWidth / 2, pageHeight - 38, { align: 'center' });
    }
    
    // Cachet scanné
    if (config?.parametresVisuels?.cachetScane) {
      try {
        doc.addImage(config.parametresVisuels.cachetScane, 'PNG', pageWidth - 50, pageHeight - 50, 25, 25);
      } catch (e) {
        console.warn('Impossible de charger le cachet:', e);
      }
    }
    
    // Signatures avec nom du signataire
    yPos = pageHeight - 30;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature du parent', 40, yPos, { align: 'center' });
    
    const nomSignataire = config?.signataire?.nomSignataire || 'Le Directeur';
    const fonctionSignataire = config?.signataire?.fonctionSignataire || '';
    
    const fonctionLabels: Record<string, string> = {
      'fondateur': 'Le Fondateur',
      'directeur': 'Le Directeur',
      'proviseur': 'Le Proviseur',
      'directeur_etudes': 'Le Directeur des Études',
      'principal': 'Le Principal',
      'censeur': 'Le Censeur',
      'surveillant_general': 'Le Surveillant Général'
    };
    
    const fonctionLabel = fonctionLabels[fonctionSignataire] || 'Le Directeur';
    
    doc.setFontSize(8);
    doc.text(fonctionLabel, pageWidth - 40, yPos - 3, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(nomSignataire, pageWidth - 40, yPos + 3, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.line(15, yPos + 10, 65, yPos + 10);
    doc.line(pageWidth - 65, yPos + 10, pageWidth - 15, yPos + 10);
  });
  
  const fileName = `Bulletins_Classe_T${bulletins[0]?.trimester || 1}_${bulletins[0]?.academicYear.replace('/', '-') || 'NA'}.pdf`;
  doc.save(fileName);
}
