import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Book, Borrowing, ReaderCard, InventoryItem } from '@/data/mockLibrary';

export const generateBorrowingReceipt = (borrowing: Borrowing, book: Book): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHE D\'EMPRUNT', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Bibliothèque - NextGen Éducation', pageWidth / 2, 32, { align: 'center' });
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  
  // Borrowing info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informations de l\'emprunt', 20, 55);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const info = [
    ['N° Emprunt:', borrowing.id],
    ['Date d\'emprunt:', new Date(borrowing.borrowDate).toLocaleDateString('fr-FR')],
    ['Date de retour prévue:', new Date(borrowing.dueDate).toLocaleDateString('fr-FR')],
    ['Statut:', borrowing.status]
  ];
  
  let y = 65;
  info.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, y);
    y += 8;
  });
  
  // Book info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Livre emprunté', 20, y + 10);
  
  y += 20;
  doc.setFontSize(11);
  const bookInfo = [
    ['Code:', book.code],
    ['Titre:', book.title],
    ['Auteur:', book.author],
    ['ISBN:', book.isbn],
    ['Emplacement:', `${book.location} - ${book.shelf}`]
  ];
  
  bookInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, y);
    y += 8;
  });
  
  // Borrower info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Emprunteur', 20, y + 10);
  
  y += 20;
  doc.setFontSize(11);
  const borrowerInfo = [
    ['Nom:', borrowing.borrowerName],
    ['Type:', borrowing.borrowerType],
    ['Classe:', borrowing.borrowerClass || '-']
  ];
  
  borrowerInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, y);
    y += 8;
  });
  
  // Rules box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(20, y + 10, pageWidth - 40, 50, 3, 3, 'FD');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Règles de la bibliothèque:', 25, y + 22);
  
  doc.setFont('helvetica', 'normal');
  doc.text('• Durée maximale d\'emprunt: 14 jours', 25, y + 32);
  doc.text('• Renouvellement possible 1 fois si pas de réservation', 25, y + 40);
  doc.text('• Pénalité de retard: 50 FCFA par jour', 25, y + 48);
  doc.text('• En cas de perte: remboursement du livre', 25, y + 56);
  
  // Signature
  y += 75;
  doc.setDrawColor(0, 0, 0);
  doc.line(20, y, 90, y);
  doc.text('Signature du bibliothécaire', 20, y + 8);
  
  doc.line(pageWidth - 90, y, pageWidth - 20, y);
  doc.text('Signature de l\'emprunteur', pageWidth - 90, y + 8);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth / 2, 285, { align: 'center' });
  
  return doc;
};

export const generateReaderCard = (reader: ReaderCard): jsPDF => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98] // Credit card size
  });
  
  // Background
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 85.6, 20, 'F');
  
  // Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CARTE DE LECTEUR', 42.8, 8, { align: 'center' });
  
  doc.setFontSize(7);
  doc.text('Bibliothèque NextGen Éducation', 42.8, 14, { align: 'center' });
  
  // Photo placeholder
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(200, 200, 200);
  doc.rect(5, 23, 20, 25, 'FD');
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(6);
  doc.text('PHOTO', 15, 37, { align: 'center' });
  
  // Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(reader.userName, 30, 28);
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${reader.number}`, 30, 33);
  doc.text(`Type: ${reader.userType}`, 30, 38);
  if (reader.userClass) {
    doc.text(`Classe: ${reader.userClass}`, 30, 43);
  }
  doc.text(`Valide jusqu'au: ${new Date(reader.expirationDate).toLocaleDateString('fr-FR')}`, 30, 48);
  
  // Barcode placeholder
  doc.setFillColor(0, 0, 0);
  for (let i = 0; i < 25; i++) {
    const width = Math.random() > 0.5 ? 1 : 0.5;
    doc.rect(60 + i, 25, width, 15, 'F');
  }
  doc.setFontSize(5);
  doc.text(reader.number, 72.5, 43, { align: 'center' });
  
  return doc;
};

export const generateInventoryReport = (items: InventoryItem[], date: string): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT D\'INVENTAIRE', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Bibliothèque - ${new Date(date).toLocaleDateString('fr-FR')}`, pageWidth / 2, 28, { align: 'center' });
  
  // Stats summary
  doc.setTextColor(0, 0, 0);
  const totalExpected = items.reduce((sum, i) => sum + i.expectedQuantity, 0);
  const totalFound = items.reduce((sum, i) => sum + i.foundQuantity, 0);
  const totalDiff = items.reduce((sum, i) => sum + i.difference, 0);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Résumé', 20, 50);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total attendu: ${totalExpected} ouvrages`, 20, 60);
  doc.text(`Total trouvé: ${totalFound} ouvrages`, 20, 68);
  doc.text(`Différence: ${totalDiff} ouvrages`, 20, 76);
  
  // Table
  autoTable(doc, {
    startY: 90,
    head: [['Code', 'Titre', 'Attendu', 'Trouvé', 'Diff.', 'État', 'Notes']],
    body: items.map(item => [
      item.bookCode,
      item.bookTitle.substring(0, 25) + (item.bookTitle.length > 25 ? '...' : ''),
      item.expectedQuantity.toString(),
      item.foundQuantity.toString(),
      item.difference.toString(),
      item.condition,
      item.notes || '-'
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255
    },
    styles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 45 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 22 },
      6: { cellWidth: 35 }
    }
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 285, { align: 'center' });
  
  return doc;
};

export const generateLateAlertReport = (borrowings: Borrowing[]): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const lateBorrowings = borrowings.filter(b => b.status === 'En retard');
  
  // Header
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ALERTES RETARD - BIBLIOTHÈQUE', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`${lateBorrowings.length} emprunts en retard`, pageWidth / 2, 28, { align: 'center' });
  
  // Stats
  doc.setTextColor(0, 0, 0);
  const totalPenalties = lateBorrowings.reduce((sum, b) => sum + (b.penaltyAmount || 0), 0);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total pénalités dues: ${totalPenalties.toLocaleString()} FCFA`, 20, 50);
  
  // Table
  autoTable(doc, {
    startY: 60,
    head: [['Emprunteur', 'Classe', 'Livre', 'Date Retour', 'Jours Retard', 'Pénalité']],
    body: lateBorrowings.map(b => {
      const dueDate = new Date(b.dueDate);
      const today = new Date();
      const daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return [
        b.borrowerName,
        b.borrowerClass || '-',
        b.bookTitle.substring(0, 30) + (b.bookTitle.length > 30 ? '...' : ''),
        new Date(b.dueDate).toLocaleDateString('fr-FR'),
        `${daysLate} jours`,
        `${b.penaltyAmount || 0} FCFA`
      ];
    }),
    theme: 'striped',
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: 255
    },
    styles: {
      fontSize: 9
    }
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 285, { align: 'center' });
  
  return doc;
};

export const generateCatalogPDF = (books: Book[]): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CATALOGUE DE LA BIBLIOTHÈQUE', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`${books.length} ouvrages référencés`, pageWidth / 2, 28, { align: 'center' });
  
  // Table
  autoTable(doc, {
    startY: 45,
    head: [['Code', 'Titre', 'Auteur', 'Catégorie', 'Dispo.', 'Emplacement']],
    body: books.map(book => [
      book.code,
      book.title.substring(0, 35) + (book.title.length > 35 ? '...' : ''),
      book.author,
      book.category,
      `${book.available}/${book.quantity}`,
      `${book.location} - ${book.shelf}`
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255
    },
    styles: {
      fontSize: 8
    }
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Catalogue généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 285, { align: 'center' });
  
  return doc;
};
