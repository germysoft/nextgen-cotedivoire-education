import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PayslipData } from './PayslipGenerator';

export function generatePayslipPDF(data: PayslipData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // En-tête entreprise
  doc.setFillColor(41, 65, 114);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GROUPE SCOLAIRE EXCELLENCE', 15, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Abidjan, Cocody - Côte d\'Ivoire', 15, 22);
  doc.text('Tél: +225 27 22 XX XX XX | Email: rh@gsexcellence.ci', 15, 28);
  
  // Titre
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`BULLETIN DE PAIE - ${data.mois.toUpperCase()} ${data.annee}`, pageWidth / 2, 45, { align: 'center' });
  
  // Informations employé
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS EMPLOYÉ', 15, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const employeInfo = [
    ['Nom & Prénoms:', `${data.personnel.civilite} ${data.personnel.prenom} ${data.personnel.nom}`],
    ['Matricule:', data.personnel.matricule],
    ['N° CNPS:', data.personnel.numeroCNPS || 'Non renseigné'],
    ['Poste:', data.personnel.poste],
    ['Département:', data.personnel.departement],
    ['Type de contrat:', data.personnel.typeContrat],
    ['Date d\'embauche:', new Date(data.personnel.dateEmbauche).toLocaleDateString('fr-FR')],
  ];
  
  let yPos = 60;
  employeInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 55, yPos);
    yPos += 5;
  });
  
  // Mode de paiement
  doc.setFont('helvetica', 'bold');
  doc.text('Mode de paiement:', 120, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(data.personnel.modePaiement, 165, 60);
  if (data.personnel.banque) {
    doc.setFont('helvetica', 'bold');
    doc.text('Banque:', 120, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(data.personnel.banque, 165, 65);
  }
  
  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPos + 3, pageWidth - 15, yPos + 3);
  
  // Table des gains
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(34, 139, 34);
  doc.text('GAINS', 15, yPos);
  
  const gainsData: (string | number)[][] = [
    ['Salaire de base', data.salaireBase.toLocaleString(), '-', data.salaireBase.toLocaleString()],
  ];
  
  data.primes.forEach(prime => {
    gainsData.push([prime.libelle, '-', '-', prime.montant.toLocaleString()]);
  });
  
  data.indemnites.forEach(ind => {
    gainsData.push([ind.libelle, '-', '-', ind.montant.toLocaleString()]);
  });
  
  gainsData.push(['TOTAL BRUT', '', '', data.brutTotal.toLocaleString() + ' FCFA']);
  
  autoTable(doc, {
    startY: yPos + 3,
    head: [['Libellé', 'Base', 'Taux', 'Montant']],
    body: gainsData,
    theme: 'striped',
    headStyles: { fillColor: [34, 139, 34], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    didParseCell: function(data) {
      if (data.row.index === gainsData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [220, 255, 220];
      }
    },
  });
  
  // Table des cotisations
  yPos = (doc as any).lastAutoTable.finalY + 8;
  doc.setTextColor(178, 34, 34);
  doc.text('COTISATIONS & RETENUES', 15, yPos);
  
  const retentionsData: (string | number)[][] = [
    ['CNPS - Retraite (6.35%)', Math.min(data.brutTotal, 2700000).toLocaleString(), `-${data.cnpsRetraiteEmploye.toLocaleString()}`, data.cnpsRetraiteEmployeur.toLocaleString()],
    ['CNPS - Prestations Familiales (5.5%)', data.brutTotal.toLocaleString(), '-', data.cnpsPFEmployeur.toLocaleString()],
    ['CNPS - Accidents du Travail (2%)', data.brutTotal.toLocaleString(), '-', data.cnpsATEmployeur.toLocaleString()],
    ['ITS (Impôt sur Traitements et Salaires)', data.netImposable.toLocaleString(), `-${data.its.toLocaleString()}`, '-'],
    ['CN (Contribution Nationale 1.5%)', data.netImposable.toLocaleString(), `-${data.cn.toLocaleString()}`, '-'],
  ];
  
  data.retenues.forEach(ret => {
    retentionsData.push([ret.libelle, '-', `-${ret.montant.toLocaleString()}`, '-']);
  });
  
  const totalRetenueSalarie = data.cnpsEmploye + data.its + data.cn;
  retentionsData.push(['TOTAL', '', `-${totalRetenueSalarie.toLocaleString()} FCFA`, `${data.cnpsEmployeur.toLocaleString()} FCFA`]);
  
  autoTable(doc, {
    startY: yPos + 3,
    head: [['Libellé', 'Base', 'Part Salarié', 'Part Employeur']],
    body: retentionsData,
    theme: 'striped',
    headStyles: { fillColor: [178, 34, 34], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    didParseCell: function(data) {
      if (data.row.index === retentionsData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [255, 220, 220];
      }
    },
  });
  
  // Résumé
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Encadré Net à Payer
  doc.setFillColor(41, 65, 114);
  doc.rect(pageWidth / 2 - 40, yPos, 80, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('NET À PAYER', pageWidth / 2, yPos + 7, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.netAPayer.toLocaleString()} FCFA`, pageWidth / 2, yPos + 16, { align: 'center' });
  
  // Récapitulatif
  yPos += 30;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const recap = [
    `Salaire Brut: ${data.brutTotal.toLocaleString()} FCFA`,
    `Total Cotisations Salarié: -${totalRetenueSalarie.toLocaleString()} FCFA`,
    `Total Charges Patronales: ${data.cnpsEmployeur.toLocaleString()} FCFA`,
    `Coût Total Employeur: ${(data.brutTotal + data.cnpsEmployeur).toLocaleString()} FCFA`,
  ];
  
  doc.text(recap.join('    |    '), pageWidth / 2, yPos, { align: 'center' });
  
  // Cumuls annuels
  yPos += 10;
  doc.setFillColor(245, 245, 245);
  doc.rect(15, yPos, pageWidth - 30, 15, 'F');
  doc.setFontSize(8);
  doc.text('CUMULS ANNUELS (estimés)', 20, yPos + 5);
  doc.text(`Brut: ${(data.brutTotal * 12).toLocaleString()} FCFA`, 20, yPos + 11);
  doc.text(`Net imposable: ${(data.netImposable * 12).toLocaleString()} FCFA`, 80, yPos + 11);
  doc.text(`ITS: ${(data.its * 12).toLocaleString()} FCFA`, 140, yPos + 11);
  
  // Informations légales
  yPos += 22;
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  const legalInfo = [
    'Taux CNPS 2024 : Retraite (Salarié: 6.35%, Employeur: 7.75%), Prestations Familiales (Employeur: 5.5%), AT/MP (Employeur: 2%)',
    'Plafond CNPS Retraite : 2 700 000 FCFA/mois | Abattement ITS : 20% | Contribution Nationale : 1.5%',
    'Ce bulletin de paie doit être conservé sans limitation de durée (Article L.32.5 du Code du Travail)',
  ];
  
  legalInfo.forEach((line, idx) => {
    doc.text(line, 15, yPos + (idx * 4));
  });
  
  // Pied de page
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(41, 65, 114);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 15, footerY);
  doc.text('Groupe Scolaire Excellence - Système de Gestion RH', pageWidth - 15, footerY, { align: 'right' });
  
  // Télécharger
  const fileName = `Fiche_Paie_${data.personnel.matricule}_${data.mois}_${data.annee}.pdf`;
  doc.save(fileName);
}
