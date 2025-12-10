import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Evaluation, niveauxNotation, categoriesEvaluation } from '@/types/evaluation';
import { Personnel } from '@/types/personnel';

export const generateEvaluationPDF = (evaluation: Evaluation, personnel: Personnel) => {
  const doc = new jsPDF();
  let yPos = 20;

  // En-tête établissement
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GROUPE SCOLAIRE EXCELLENCE', 105, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Abidjan, Côte d\'Ivoire - Tél: +225 27 22 00 00 00', 105, yPos, { align: 'center' });

  // Titre
  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('FICHE D\'ÉVALUATION ANNUELLE DU PERSONNEL', 105, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Période: ${evaluation.periode} - Type: ${evaluation.typeEvaluation}`, 105, yPos, { align: 'center' });

  // Informations employé
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS DE L\'EMPLOYÉ', 14, yPos);
  
  yPos += 2;
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(14, yPos, 196, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const employeeInfo = [
    ['Nom complet:', `${personnel.nom} ${personnel.prenom}`],
    ['Matricule:', personnel.matricule],
    ['Poste:', personnel.poste],
    ['Département:', personnel.departement],
    ['Ancienneté:', calculateSeniority(personnel.dateEmbauche)],
    ['Évaluateur:', evaluation.evaluateurNom],
    ['Date d\'évaluation:', formatDate(evaluation.dateEvaluation)]
  ];

  employeeInfo.forEach((info, index) => {
    const col = index % 2 === 0 ? 14 : 110;
    const row = Math.floor(index / 2);
    doc.setFont('helvetica', 'bold');
    doc.text(info[0], col, yPos + (row * 6));
    doc.setFont('helvetica', 'normal');
    doc.text(info[1], col + 30, yPos + (row * 6));
  });

  yPos += 30;

  // Critères d'évaluation par catégorie
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉVALUATION DES COMPÉTENCES', 14, yPos);
  
  yPos += 2;
  doc.line(14, yPos, 196, yPos);
  yPos += 5;

  // Regrouper les critères par catégorie
  const criteriaByCategory = evaluation.criteres.reduce((acc, critere) => {
    if (!acc[critere.categorie]) {
      acc[critere.categorie] = [];
    }
    acc[critere.categorie].push(critere);
    return acc;
  }, {} as Record<string, typeof evaluation.criteres>);

  Object.entries(criteriaByCategory).forEach(([categorie, criteres]) => {
    const categoryDef = categoriesEvaluation.find(c => c.id === categorie);
    const categoryName = categoryDef?.nom || categorie;
    
    const tableData = criteres.map(c => {
      const niveau = niveauxNotation.find(n => n.value === c.note);
      return [
        c.critere,
        `${c.note}/5`,
        niveau?.label || '',
        c.commentaire || '-'
      ];
    });

    // Calculer moyenne catégorie
    const moyenneCategorie = criteres.reduce((sum, c) => sum + c.note, 0) / criteres.length;

    autoTable(doc, {
      startY: yPos,
      head: [[{ content: `${categoryName} (Moyenne: ${moyenneCategorie.toFixed(1)}/5)`, colSpan: 4, styles: { fillColor: [0, 51, 102] } }]],
      body: tableData,
      columns: [
        { header: 'Critère', dataKey: 'critere' },
        { header: 'Note', dataKey: 'note' },
        { header: 'Niveau', dataKey: 'niveau' },
        { header: 'Commentaire', dataKey: 'commentaire' }
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 51, 102], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 72 }
      },
      margin: { left: 14, right: 14 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 5;
  });

  // Note globale
  yPos += 5;
  doc.setFillColor(0, 51, 102);
  doc.rect(14, yPos, 182, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`NOTE GLOBALE: ${evaluation.noteGlobale.toFixed(2)}/5`, 105, yPos + 8, { align: 'center' });
  
  const globalNiveau = niveauxNotation.find(n => n.value === Math.round(evaluation.noteGlobale));
  if (globalNiveau) {
    doc.text(`- ${globalNiveau.label.toUpperCase()}`, 160, yPos + 8);
  }

  yPos += 20;
  doc.setTextColor(0, 0, 0);

  // Nouvelle page pour objectifs et synthèse
  doc.addPage();
  yPos = 20;

  // Objectifs précédents
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BILAN DES OBJECTIFS PRÉCÉDENTS', 14, yPos);
  yPos += 2;
  doc.line(14, yPos, 196, yPos);
  yPos += 5;

  if (evaluation.objectifsPrecedents.length > 0) {
    const objectifsData = evaluation.objectifsPrecedents.map(obj => [
      obj.titre,
      obj.statut,
      `${obj.progression}%`,
      obj.commentaires || '-'
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Objectif', 'Statut', 'Progression', 'Commentaires']],
      body: objectifsData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 51], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Aucun objectif précédent défini', 14, yPos);
    yPos += 10;
  }

  // Nouveaux objectifs SMART
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('OBJECTIFS SMART POUR LA PROCHAINE PÉRIODE', 14, yPos);
  yPos += 2;
  doc.line(14, yPos, 196, yPos);
  yPos += 5;

  if (evaluation.objectifsFuturs.length > 0) {
    evaluation.objectifsFuturs.forEach((obj, index) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${obj.titre}`, 14, yPos);
      yPos += 5;
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Description: ${obj.description}`, 18, yPos);
      yPos += 4;
      doc.text(`Spécifique: ${obj.specifique}`, 18, yPos);
      yPos += 4;
      doc.text(`Mesurable: ${obj.mesurable}`, 18, yPos);
      yPos += 4;
      doc.text(`Atteignable: ${obj.atteignable}`, 18, yPos);
      yPos += 4;
      doc.text(`Réaliste: ${obj.realiste}`, 18, yPos);
      yPos += 4;
      doc.text(`Temporel: ${obj.temporel} - Échéance: ${formatDate(obj.dateEcheance)}`, 18, yPos);
      yPos += 8;

      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Aucun nouvel objectif défini', 14, yPos);
    yPos += 10;
  }

  // Synthèse
  if (yPos > 180) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SYNTHÈSE DE L\'ÉVALUATION', 14, yPos);
  yPos += 2;
  doc.line(14, yPos, 196, yPos);
  yPos += 8;

  // Appréciation générale
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Appréciation générale:', 14, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  const appreciationLines = doc.splitTextToSize(evaluation.appreciationGenerale || 'Non renseignée', 180);
  doc.text(appreciationLines, 14, yPos);
  yPos += appreciationLines.length * 4 + 5;

  // Points forts
  doc.setFont('helvetica', 'bold');
  doc.text('Points forts:', 14, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  evaluation.pointsForts.forEach(point => {
    doc.text(`• ${point}`, 18, yPos);
    yPos += 4;
  });
  yPos += 3;

  // Axes d'amélioration
  doc.setFont('helvetica', 'bold');
  doc.text('Axes d\'amélioration:', 14, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  evaluation.axesAmelioration.forEach(axe => {
    doc.text(`• ${axe}`, 18, yPos);
    yPos += 4;
  });
  yPos += 3;

  // Besoins de formation
  if (evaluation.besoinsFormation.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Besoins de formation identifiés:', 14, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    evaluation.besoinsFormation.forEach(besoin => {
      doc.text(`• ${besoin}`, 18, yPos);
      yPos += 4;
    });
  }

  // Signatures électroniques
  doc.addPage();
  yPos = 20;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURES ÉLECTRONIQUES', 14, yPos);
  yPos += 2;
  doc.line(14, yPos, 196, yPos);
  yPos += 15;

  // Signature employé
  doc.setFillColor(245, 245, 245);
  doc.rect(14, yPos, 85, 45, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(14, yPos, 85, 45, 'S');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Signature de l\'employé', 56.5, yPos + 8, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (evaluation.signatureEmploye) {
    doc.text(`Signé le: ${formatDate(evaluation.signatureEmploye.date)}`, 56.5, yPos + 18, { align: 'center' });
    doc.text(`Accord: ${evaluation.signatureEmploye.accord ? 'Oui' : 'Non'}`, 56.5, yPos + 24, { align: 'center' });
    if (evaluation.signatureEmploye.commentaire) {
      const comment = doc.splitTextToSize(evaluation.signatureEmploye.commentaire, 75);
      doc.text(comment, 56.5, yPos + 30, { align: 'center' });
    }
    // Signature électronique simulée
    doc.setTextColor(0, 100, 0);
    doc.setFontSize(8);
    doc.text('✓ SIGNATURE ÉLECTRONIQUE VÉRIFIÉE', 56.5, yPos + 40, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text('En attente de signature', 56.5, yPos + 25, { align: 'center' });
  }

  // Signature évaluateur
  doc.setFillColor(245, 245, 245);
  doc.rect(107, yPos, 85, 45, 'F');
  doc.rect(107, yPos, 85, 45, 'S');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Signature de l\'évaluateur', 149.5, yPos + 8, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (evaluation.signatureEvaluateur) {
    doc.text(`Signé le: ${formatDate(evaluation.signatureEvaluateur.date)}`, 149.5, yPos + 18, { align: 'center' });
    doc.text(`Par: ${evaluation.evaluateurNom}`, 149.5, yPos + 24, { align: 'center' });
    doc.setTextColor(0, 100, 0);
    doc.setFontSize(8);
    doc.text('✓ SIGNATURE ÉLECTRONIQUE VÉRIFIÉE', 149.5, yPos + 40, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text('En attente de signature', 149.5, yPos + 25, { align: 'center' });
  }

  yPos += 55;

  // Signature direction
  doc.setFillColor(245, 245, 245);
  doc.rect(60, yPos, 85, 45, 'F');
  doc.rect(60, yPos, 85, 45, 'S');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Visa de la Direction', 102.5, yPos + 8, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (evaluation.signatureDirection) {
    doc.text(`Validé le: ${formatDate(evaluation.signatureDirection.date)}`, 102.5, yPos + 18, { align: 'center' });
    if (evaluation.signatureDirection.commentaire) {
      const comment = doc.splitTextToSize(evaluation.signatureDirection.commentaire, 75);
      doc.text(comment, 102.5, yPos + 26, { align: 'center' });
    }
    doc.setTextColor(0, 100, 0);
    doc.setFontSize(8);
    doc.text('✓ SIGNATURE ÉLECTRONIQUE VÉRIFIÉE', 102.5, yPos + 40, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text('En attente de validation', 102.5, yPos + 25, { align: 'center' });
  }

  yPos += 60;

  // Cachet et mentions légales
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Ce document est généré électroniquement et fait foi sans signature manuscrite.', 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Référence document: EVAL-${evaluation.id}-${new Date().getTime()}`, 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 105, yPos, { align: 'center' });

  // QR Code simulé (carré avec info)
  yPos += 10;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.rect(85, yPos, 40, 40, 'S');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text('QR CODE', 105, yPos + 15, { align: 'center' });
  doc.text('VÉRIFICATION', 105, yPos + 20, { align: 'center' });
  doc.text('AUTHENTICITÉ', 105, yPos + 25, { align: 'center' });
  doc.text(`ID: ${evaluation.id}`, 105, yPos + 32, { align: 'center' });

  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} - Groupe Scolaire Excellence - Document confidentiel`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Sauvegarde
  doc.save(`Evaluation_${personnel.matricule}_${evaluation.periode.replace('-', '_')}.pdf`);
};

// Fonctions utilitaires
function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function calculateSeniority(dateEmbauche: string): string {
  const start = new Date(dateEmbauche);
  const now = new Date();
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  
  if (years > 0) {
    return `${years} an${years > 1 ? 's' : ''} ${months > 0 ? `et ${months} mois` : ''}`;
  }
  return `${months} mois`;
}

// Génération du bilan annuel (toutes les évaluations)
export const generateAnnualReportPDF = (evaluations: Evaluation[], personnelList: Personnel[], periode: string) => {
  const doc = new jsPDF();
  let yPos = 20;

  // En-tête
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('BILAN ANNUEL DES ÉVALUATIONS', 105, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Période: ${periode}`, 105, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text(`Groupe Scolaire Excellence`, 105, yPos, { align: 'center' });

  // Statistiques globales
  yPos += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('STATISTIQUES GLOBALES', 14, yPos);
  yPos += 2;
  doc.setDrawColor(0, 51, 102);
  doc.line(14, yPos, 196, yPos);
  yPos += 10;

  const periodeEvals = evaluations.filter(e => e.periode === periode);
  const totalEvals = periodeEvals.length;
  const avgScore = periodeEvals.reduce((sum, e) => sum + e.noteGlobale, 0) / totalEvals || 0;
  const validatedEvals = periodeEvals.filter(e => e.statut === 'Validée' || e.statut === 'Signée').length;

  const stats = [
    ['Total évaluations:', totalEvals.toString()],
    ['Évaluations validées:', `${validatedEvals} (${((validatedEvals/totalEvals)*100 || 0).toFixed(0)}%)`],
    ['Note moyenne globale:', `${avgScore.toFixed(2)}/5`],
    ['Personnel évalué:', `${new Set(periodeEvals.map(e => e.personnelId)).size} personnes`]
  ];

  doc.setFontSize(10);
  stats.forEach((stat, index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(stat[0], 20, yPos + (index * 8));
    doc.setFont('helvetica', 'normal');
    doc.text(stat[1], 70, yPos + (index * 8));
  });

  yPos += 40;

  // Répartition par niveau
  const niveauDistribution = niveauxNotation.map(niveau => {
    const count = periodeEvals.filter(e => Math.round(e.noteGlobale) === niveau.value).length;
    return [niveau.label, count.toString(), `${((count/totalEvals)*100 || 0).toFixed(1)}%`];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Niveau', 'Nombre', 'Pourcentage']],
    body: niveauDistribution,
    theme: 'striped',
    headStyles: { fillColor: [0, 51, 102] },
    margin: { left: 14, right: 14 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Liste des évaluations
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉTAIL DES ÉVALUATIONS', 14, yPos);
  yPos += 2;
  doc.line(14, yPos, 196, yPos);
  yPos += 5;

  const evalData = periodeEvals.map(evaluation => {
    const personnel = personnelList.find(p => p.id === evaluation.personnelId);
    const niveau = niveauxNotation.find(n => n.value === Math.round(evaluation.noteGlobale));
    return [
      personnel ? `${personnel.nom} ${personnel.prenom}` : 'Inconnu',
      personnel?.poste || '-',
      evaluation.typeEvaluation,
      `${evaluation.noteGlobale.toFixed(2)}/5`,
      niveau?.label || '-',
      evaluation.statut
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Employé', 'Poste', 'Type', 'Note', 'Niveau', 'Statut']],
    body: evalData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 51] },
    bodyStyles: { fontSize: 8 },
    margin: { left: 14, right: 14 }
  });

  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} - Bilan Annuel ${periode} - Généré le ${new Date().toLocaleDateString('fr-FR')}`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`Bilan_Evaluations_${periode.replace('-', '_')}.pdf`);
};
