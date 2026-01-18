import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SignerInfo {
  name: string;
  role: string;
  status: 'signed' | 'pending';
  signedAt?: string;
}

interface SignatureStatus {
  documentId: string;
  documentTitle: string;
  documentType: string;
  documentDate: string;
  totalSignatures: number;
  completedSignatures: number;
  pendingSignatures: number;
  status: 'completed' | 'partial' | 'pending' | 'overdue';
  lastSignatureDate?: string;
  signers: SignerInfo[];
}

interface DashboardStats {
  totalDocuments: number;
  totalSignatures: number;
  completedSignatures: number;
  pendingSignatures: number;
  fullySignedDocs: number;
  partialDocs: number;
  pendingDocs: number;
  overdueDocs: number;
  completionRate: number;
  recentSignatures: number;
}

interface PDFExportData {
  stats: DashboardStats;
  signatureData: SignatureStatus[];
  etablissement?: string;
}

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'conseil_classe': return 'Conseil de Classe';
    case 'reunion_parents': return 'Réunion Parents';
    case 'reunion_pedagogique': return 'Réunion Pédagogique';
    case 'reunion_administrative': return 'Réunion Administrative';
    default: return type;
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'completed': return 'Complété';
    case 'partial': return 'Partiel';
    case 'pending': return 'En attente';
    case 'overdue': return 'En retard';
    default: return status;
  }
};

// Draw a pie chart
const drawPieChart = (
  doc: jsPDF, 
  x: number, 
  y: number, 
  radius: number, 
  data: { value: number; color: string; label: string }[]
) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return;
  
  let startAngle = -Math.PI / 2; // Start at top
  
  data.forEach((segment) => {
    if (segment.value === 0) return;
    
    const sliceAngle = (segment.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    
    // Draw pie slice
    doc.setFillColor(segment.color);
    
    // Create path for pie slice
    const centerX = x;
    const centerY = y;
    
    // Draw arc using lines (approximation)
    const steps = Math.ceil(sliceAngle * 20);
    const points: { x: number; y: number }[] = [{ x: centerX, y: centerY }];
    
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (sliceAngle * i) / steps;
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    
    // Draw filled polygon
    if (points.length > 2) {
      doc.setFillColor(segment.color);
      const xCoords = points.map(p => p.x);
      const yCoords = points.map(p => p.y);
      
      doc.moveTo(points[0].x, points[0].y);
      doc.lines(
        points.slice(1).map((p, i) => [p.x - points[i].x, p.y - points[i].y]),
        points[0].x,
        points[0].y,
        [1, 1],
        'F'
      );
    }
    
    startAngle = endAngle;
  });
};

// Draw a bar chart
const drawBarChart = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  data: { label: string; signed: number; pending: number }[]
) => {
  if (data.length === 0) return;
  
  const maxValue = Math.max(...data.flatMap(d => [d.signed, d.pending]));
  if (maxValue === 0) return;
  
  const barGroupWidth = width / data.length;
  const barWidth = barGroupWidth * 0.35;
  const gap = barGroupWidth * 0.1;
  
  // Draw axes
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(x, y, x, y + height);
  doc.line(x, y + height, x + width, y + height);
  
  // Draw bars
  data.forEach((item, index) => {
    const groupX = x + index * barGroupWidth + gap;
    
    // Signed bar (green)
    const signedHeight = (item.signed / maxValue) * height;
    doc.setFillColor(34, 197, 94); // Green
    doc.rect(groupX, y + height - signedHeight, barWidth, signedHeight, 'F');
    
    // Pending bar (amber)
    const pendingHeight = (item.pending / maxValue) * height;
    doc.setFillColor(245, 158, 11); // Amber
    doc.rect(groupX + barWidth + 2, y + height - pendingHeight, barWidth, pendingHeight, 'F');
    
    // Label
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    const labelX = groupX + barWidth;
    doc.text(item.label.substring(0, 12), labelX, y + height + 8, { align: 'center' });
  });
  
  // Legend
  const legendY = y - 5;
  doc.setFillColor(34, 197, 94);
  doc.rect(x + width - 60, legendY, 6, 6, 'F');
  doc.setFontSize(7);
  doc.setTextColor(60, 60, 60);
  doc.text('Signées', x + width - 52, legendY + 5);
  
  doc.setFillColor(245, 158, 11);
  doc.rect(x + width - 25, legendY, 6, 6, 'F');
  doc.text('En attente', x + width - 17, legendY + 5);
};

// Draw a progress bar
const drawProgressBar = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  percentage: number,
  color: string
) => {
  // Background
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');
  
  // Progress
  if (percentage > 0) {
    doc.setFillColor(color);
    doc.roundedRect(x, y, width * (percentage / 100), height, 2, 2, 'F');
  }
};

export const generateSignaturesDashboardPDF = (data: PDFExportData): void => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = margin;
  
  // Header
  doc.setFillColor(37, 99, 235); // Primary blue
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Tableau de Bord des Signatures', margin, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.etablissement || 'Établissement Scolaire', margin, 26);
  
  doc.setFontSize(9);
  doc.text(`Généré le ${format(new Date(), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}`, pageWidth - margin, 26, { align: 'right' });
  
  currentY = 45;
  
  // Statistics Cards Row
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Statistiques Générales', margin, currentY);
  currentY += 8;
  
  const cardWidth = (pageWidth - margin * 2 - 15) / 4;
  const cardHeight = 25;
  const cardSpacing = 5;
  
  // Card 1: Documents
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Documents', margin + 5, currentY + 7);
  doc.setFontSize(16);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text(data.stats.totalDocuments.toString(), margin + 5, currentY + 17);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.stats.fullySignedDocs} complétés`, margin + 5, currentY + 22);
  
  // Card 2: Signatures
  const card2X = margin + cardWidth + cardSpacing;
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Signatures', card2X + 5, currentY + 7);
  doc.setFontSize(16);
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.stats.completedSignatures}/${data.stats.totalSignatures}`, card2X + 5, currentY + 17);
  
  // Progress bar
  drawProgressBar(doc, card2X + 5, currentY + 19, cardWidth - 10, 3, data.stats.completionRate, '#22c55e');
  
  // Card 3: En attente
  const card3X = margin + (cardWidth + cardSpacing) * 2;
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('En attente', card3X + 5, currentY + 7);
  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.text(data.stats.pendingSignatures.toString(), card3X + 5, currentY + 17);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`sur ${data.stats.pendingDocs + data.stats.partialDocs} docs`, card3X + 5, currentY + 22);
  
  // Card 4: Taux
  const card4X = margin + (cardWidth + cardSpacing) * 3;
  doc.setFillColor(250, 245, 255);
  doc.roundedRect(card4X, currentY, cardWidth, cardHeight, 3, 3, 'F');
  doc.setDrawColor(168, 85, 247);
  doc.roundedRect(card4X, currentY, cardWidth, cardHeight, 3, 3, 'S');
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Taux complétion', card4X + 5, currentY + 7);
  doc.setFontSize(16);
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.stats.completionRate}%`, card4X + 5, currentY + 17);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.stats.recentSignatures} récentes`, card4X + 5, currentY + 22);
  
  currentY += cardHeight + 15;
  
  // Status Summary Row
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Répartition par Statut', margin, currentY);
  currentY += 8;
  
  const statusCardWidth = (pageWidth - margin * 2 - 15) / 4;
  const statusCardHeight = 18;
  
  // Completed
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(margin, currentY, statusCardWidth, statusCardHeight, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.stats.fullySignedDocs}`, margin + 8, currentY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Complétés', margin + 20, currentY + 11);
  
  // Partial
  const status2X = margin + statusCardWidth + cardSpacing;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(status2X, currentY, statusCardWidth, statusCardHeight, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.stats.partialDocs}`, status2X + 8, currentY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Partiels', status2X + 20, currentY + 11);
  
  // Pending
  const status3X = margin + (statusCardWidth + cardSpacing) * 2;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(status3X, currentY, statusCardWidth, statusCardHeight, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.stats.pendingDocs}`, status3X + 8, currentY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('En attente', status3X + 20, currentY + 11);
  
  // Overdue
  const status4X = margin + (statusCardWidth + cardSpacing) * 3;
  doc.setFillColor(254, 226, 226);
  doc.roundedRect(status4X, currentY, statusCardWidth, statusCardHeight, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.stats.overdueDocs}`, status4X + 8, currentY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('En retard', status4X + 20, currentY + 11);
  
  currentY += statusCardHeight + 15;
  
  // Charts Section
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Signatures par Type de Réunion', margin, currentY);
  currentY += 10;
  
  // Calculate bar chart data
  const byType: { [key: string]: { signed: number; pending: number } } = {};
  data.signatureData.forEach(d => {
    const typeLabel = getTypeLabel(d.documentType);
    if (!byType[typeLabel]) {
      byType[typeLabel] = { signed: 0, pending: 0 };
    }
    byType[typeLabel].signed += d.completedSignatures;
    byType[typeLabel].pending += d.pendingSignatures;
  });
  
  const barData = Object.entries(byType).map(([label, values]) => ({
    label: label.replace('Réunion ', ''),
    signed: values.signed,
    pending: values.pending,
  }));
  
  // Draw bar chart
  if (barData.length > 0) {
    drawBarChart(doc, margin + 10, currentY, pageWidth - margin * 2 - 20, 40, barData);
  }
  
  currentY += 55;
  
  // Documents Table
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Détail des Documents', margin, currentY);
  currentY += 5;
  
  const tableData = data.signatureData.map(doc => [
    doc.documentTitle.length > 35 ? doc.documentTitle.substring(0, 35) + '...' : doc.documentTitle,
    getTypeLabel(doc.documentType).replace('Réunion ', ''),
    format(new Date(doc.documentDate), 'dd/MM/yyyy'),
    `${doc.completedSignatures}/${doc.totalSignatures}`,
    getStatusLabel(doc.status),
  ]);
  
  autoTable(doc, {
    startY: currentY,
    head: [['Document', 'Type', 'Date', 'Progression', 'Statut']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [60, 60, 60],
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
    didDrawCell: (hookData) => {
      // Add color coding for status column
      if (hookData.column.index === 4 && hookData.section === 'body') {
        const status = hookData.cell.text[0];
        let bgColor: [number, number, number] = [248, 250, 252];
        let textColor: [number, number, number] = [60, 60, 60];
        
        switch (status) {
          case 'Complété':
            bgColor = [220, 252, 231];
            textColor = [22, 101, 52];
            break;
          case 'Partiel':
            bgColor = [254, 243, 199];
            textColor = [180, 83, 9];
            break;
          case 'En retard':
            bgColor = [254, 226, 226];
            textColor = [185, 28, 28];
            break;
        }
        
        doc.setFillColor(...bgColor);
        doc.setTextColor(...textColor);
      }
    },
  });
  
  // Get final Y position after table
  const finalY = (doc as any).lastAutoTable?.finalY || currentY + 50;
  
  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Document généré automatiquement - NextGen Éducation', margin, footerY);
  doc.text(`Page 1/1`, pageWidth - margin, footerY, { align: 'right' });
  
  // Save the PDF
  const fileName = `tableau-bord-signatures-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
  doc.save(fileName);
};

export default generateSignaturesDashboardPDF;
