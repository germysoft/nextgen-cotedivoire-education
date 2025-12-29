import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface BackupRecord {
  id: string;
  date: string;
  size: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed';
  duration?: string;
  filesCount?: number;
}

export interface StorageStats {
  totalSpace: number; // in GB
  usedSpace: number; // in GB
  backupsCount: number;
  manualBackupsCount: number;
  autoBackupsCount: number;
  successRate: number; // percentage
  averageSize: string;
  lastBackupDate: string;
  retentionDays: number;
}

export interface BackupReportData {
  etablissement: string;
  dateGeneration: string;
  periode: {
    debut: string;
    fin: string;
  };
  backups: BackupRecord[];
  stats: StorageStats;
  parametresSauvegarde: {
    frequence: string;
    heureExecution: string;
    retentionJours: number;
    notificationEmail: boolean;
    emailsNotification: string[];
  };
}

function addHeader(doc: jsPDF, etablissement: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Bandeau de titre
  doc.setFillColor(30, 64, 175); // Bleu primaire
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT DE SAUVEGARDE', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(etablissement || 'Établissement Scolaire', pageWidth / 2, 25, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
}

function addFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  
  doc.text(
    `Page ${pageNumber} / ${totalPages}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
  
  doc.text(
    `Rapport généré le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    pageWidth / 2,
    pageHeight - 5,
    { align: 'center' }
  );
}

function drawProgressBar(doc: jsPDF, x: number, y: number, width: number, height: number, percentage: number) {
  // Fond
  doc.setFillColor(229, 231, 235);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');
  
  // Progression
  const fillWidth = (width * percentage) / 100;
  if (percentage < 70) {
    doc.setFillColor(34, 197, 94); // Vert
  } else if (percentage < 90) {
    doc.setFillColor(245, 158, 11); // Orange
  } else {
    doc.setFillColor(239, 68, 68); // Rouge
  }
  doc.roundedRect(x, y, fillWidth, height, 2, 2, 'F');
}

export function generateBackupReportPDF(data: BackupReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  addHeader(doc, data.etablissement);
  
  let yPos = 45;
  
  // Période du rapport
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Période: ${data.periode.debut} - ${data.periode.fin}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // ============ Section Statistiques Générales ============
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('📊 Statistiques Générales', 15, yPos);
  
  yPos += 10;
  
  // Boîtes de stats
  const boxWidth = 42;
  const boxHeight = 25;
  const boxGap = 5;
  const startX = 15;
  
  const statsBoxes = [
    { label: 'Total Sauvegardes', value: data.stats.backupsCount.toString(), color: [59, 130, 246] },
    { label: 'Taux de Réussite', value: `${data.stats.successRate}%`, color: [34, 197, 94] },
    { label: 'Automatiques', value: data.stats.autoBackupsCount.toString(), color: [168, 85, 247] },
    { label: 'Manuelles', value: data.stats.manualBackupsCount.toString(), color: [245, 158, 11] },
  ];
  
  statsBoxes.forEach((box, index) => {
    const x = startX + (boxWidth + boxGap) * index;
    
    // Fond de la boîte
    doc.setFillColor(box.color[0], box.color[1], box.color[2]);
    doc.roundedRect(x, yPos, boxWidth, boxHeight, 3, 3, 'F');
    
    // Valeur
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(box.value, x + boxWidth / 2, yPos + 12, { align: 'center' });
    
    // Label
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(box.label, x + boxWidth / 2, yPos + 20, { align: 'center' });
  });
  
  yPos += boxHeight + 15;
  
  // ============ Section Espace Disque ============
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('💾 Espace de Stockage', 15, yPos);
  
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  
  const usedPercentage = (data.stats.usedSpace / data.stats.totalSpace) * 100;
  
  // Barre de progression
  drawProgressBar(doc, 15, yPos, 120, 8, usedPercentage);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${usedPercentage.toFixed(1)}%`, 140, yPos + 6);
  
  yPos += 15;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Espace utilisé: ${data.stats.usedSpace} GB / ${data.stats.totalSpace} GB`, 15, yPos);
  doc.text(`Espace disponible: ${(data.stats.totalSpace - data.stats.usedSpace).toFixed(1)} GB`, 100, yPos);
  
  yPos += 8;
  doc.text(`Taille moyenne par sauvegarde: ${data.stats.averageSize}`, 15, yPos);
  doc.text(`Dernière sauvegarde: ${data.stats.lastBackupDate}`, 100, yPos);
  
  yPos += 15;
  
  // ============ Section Configuration ============
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('⚙️ Configuration Active', 15, yPos);
  
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const configItems = [
    `Fréquence: ${data.parametresSauvegarde.frequence}`,
    `Heure d'exécution: ${data.parametresSauvegarde.heureExecution}`,
    `Rétention: ${data.parametresSauvegarde.retentionJours} jours`,
    `Notifications: ${data.parametresSauvegarde.notificationEmail ? 'Activées' : 'Désactivées'}`,
  ];
  
  configItems.forEach((item, index) => {
    const x = 15 + (index % 2) * 90;
    const y = yPos + Math.floor(index / 2) * 6;
    doc.text(`• ${item}`, x, y);
  });
  
  yPos += 20;
  
  // ============ Tableau des Sauvegardes ============
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('📋 Historique des Sauvegardes', 15, yPos);
  
  yPos += 5;
  
  const tableData = data.backups.map(backup => [
    backup.date,
    backup.size,
    backup.type === 'auto' ? 'Automatique' : 'Manuelle',
    backup.status === 'completed' ? '✓ Réussie' : '✗ Échouée',
    backup.duration || '-',
    backup.filesCount?.toString() || '-',
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Date & Heure', 'Taille', 'Type', 'Statut', 'Durée', 'Fichiers']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 64, 175],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === 'body') {
        const value = data.cell.text[0];
        if (value.includes('Réussie')) {
          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = 'bold';
        } else if (value.includes('Échouée')) {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });
  
  // Ajouter le pied de page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
  
  const fileName = `Rapport_Sauvegarde_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  return fileName;
}
