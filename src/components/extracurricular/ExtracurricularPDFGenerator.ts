import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Club, SportTeam, Event, BudgetTransaction, mockClubs, mockSportTeams, mockEvents, mockBudgetTransactions, getClubStats, getSportStats, getEventStats } from '@/data/mockExtracurricular';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Header commun pour tous les PDFs
const addHeader = (doc: jsPDF, title: string, subtitle?: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Logo/Nom de l'école
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175); // Bleu primaire
  doc.text('ÉTABLISSEMENT SCOLAIRE', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Année Scolaire 2024-2025', pageWidth / 2, 28, { align: 'center' });
  
  // Ligne de séparation
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.line(20, 32, pageWidth - 20, 32);
  
  // Titre du rapport
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text(title, pageWidth / 2, 45, { align: 'center' });
  
  if (subtitle) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    doc.text(subtitle, pageWidth / 2, 52, { align: 'center' });
  }
  
  // Date de génération
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Généré le ${formatDate(new Date().toISOString().split('T')[0])}`, pageWidth - 20, 45, { align: 'right' });
};

// Footer commun
const addFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`Page ${pageNumber} / ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.text('Document officiel - Activités Parascolaires', 20, pageHeight - 10);
  doc.text(new Date().toLocaleDateString('fr-FR'), pageWidth - 20, pageHeight - 10, { align: 'right' });
};

// Rapport global des activités parascolaires
export const generateGlobalReport = (): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const clubStats = getClubStats();
  const sportStats = getSportStats();
  const eventStats = getEventStats();
  
  const totalParticipants = clubStats.totalMembers + sportStats.totalPlayers;
  const totalBudget = clubStats.totalBudget + sportStats.totalBudget + eventStats.totalBudget;
  const usedBudget = clubStats.usedBudget + sportStats.usedBudget + eventStats.usedBudget;
  
  addHeader(doc, 'RAPPORT GLOBAL DES ACTIVITÉS PARASCOLAIRES', 'Bilan Annuel de Participation et Budget');
  
  let yPos = 65;
  
  // Section Statistiques Générales
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('1. STATISTIQUES GÉNÉRALES', 20, yPos);
  yPos += 10;
  
  // Tableau des statistiques générales
  autoTable(doc, {
    startY: yPos,
    head: [['Indicateur', 'Valeur', 'Détails']],
    body: [
      ['Participants Totaux', totalParticipants.toString(), `${clubStats.totalMembers} en clubs, ${sportStats.totalPlayers} en sports`],
      ['Clubs Actifs', clubStats.activeClubs.toString(), `${mockClubs.length} clubs au total`],
      ['Équipes Sportives', mockSportTeams.length.toString(), `${sportStats.upcomingCompetitions} compétitions à venir`],
      ['Événements Organisés', eventStats.totalEvents.toString(), `${eventStats.upcomingEvents} à venir, ${eventStats.completedEvents} terminés`],
      ['Budget Total Alloué', formatCurrency(totalBudget), ''],
      ['Budget Utilisé', formatCurrency(usedBudget), `${Math.round((usedBudget / totalBudget) * 100)}% consommé`],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Section Clubs
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('2. DÉTAIL DES CLUBS', 20, yPos);
  yPos += 10;
  
  const clubsData = mockClubs.map(club => [
    club.name,
    club.category,
    club.members.length.toString(),
    club.supervisor,
    formatCurrency(club.budget),
    formatCurrency(club.budgetUsed),
    `${Math.round((club.budgetUsed / club.budget) * 100)}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Club', 'Catégorie', 'Membres', 'Responsable', 'Budget', 'Utilisé', '%']],
    body: clubsData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 30 },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Nouvelle page si nécessaire
  if (yPos > 220) {
    doc.addPage();
    yPos = 30;
  }
  
  // Section Sports
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('3. ÉQUIPES SPORTIVES', 20, yPos);
  yPos += 10;
  
  const sportsData = mockSportTeams.map(team => [
    team.sport,
    team.level,
    team.players.length.toString(),
    team.coach,
    team.competitions.filter(c => c.status === 'completed').length.toString(),
    formatCurrency(team.budget),
    `${Math.round((team.budgetUsed / team.budget) * 100)}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Sport', 'Niveau', 'Joueurs', 'Coach', 'Compét.', 'Budget', 'Utilisé %']],
    body: sportsData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [234, 179, 8], textColor: 0 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      5: { halign: 'right' },
      6: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Nouvelle page pour les événements
  doc.addPage();
  yPos = 30;
  
  // Section Événements
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('4. ÉVÉNEMENTS', 20, yPos);
  yPos += 10;
  
  const eventsData = mockEvents.map(event => [
    event.name,
    event.type,
    formatDate(event.date),
    event.registrations.length.toString(),
    event.organizer.substring(0, 20) + (event.organizer.length > 20 ? '...' : ''),
    formatCurrency(event.budget),
    event.status === 'completed' ? 'Terminé' : event.status === 'open' ? 'Ouvert' : 'Planifié'
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Événement', 'Type', 'Date', 'Inscrits', 'Organisateur', 'Budget', 'Statut']],
    body: eventsData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [147, 51, 234], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      5: { halign: 'right' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 20;
  
  // Résumé budgétaire
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('5. SYNTHÈSE BUDGÉTAIRE', 20, yPos);
  yPos += 10;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Catégorie', 'Budget Alloué', 'Budget Utilisé', 'Reste', 'Taux']],
    body: [
      ['Clubs', formatCurrency(clubStats.totalBudget), formatCurrency(clubStats.usedBudget), formatCurrency(clubStats.totalBudget - clubStats.usedBudget), `${Math.round((clubStats.usedBudget / clubStats.totalBudget) * 100)}%`],
      ['Sports', formatCurrency(sportStats.totalBudget), formatCurrency(sportStats.usedBudget), formatCurrency(sportStats.totalBudget - sportStats.usedBudget), `${Math.round((sportStats.usedBudget / sportStats.totalBudget) * 100)}%`],
      ['Événements', formatCurrency(eventStats.totalBudget), formatCurrency(eventStats.usedBudget), formatCurrency(eventStats.totalBudget - eventStats.usedBudget), `${Math.round((eventStats.usedBudget / eventStats.totalBudget) * 100)}%`],
      ['TOTAL', formatCurrency(totalBudget), formatCurrency(usedBudget), formatCurrency(totalBudget - usedBudget), `${Math.round((usedBudget / totalBudget) * 100)}%`]
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' }
    },
    didParseCell: (data) => {
      if (data.row.index === 3) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [220, 230, 250];
      }
    }
  });
  
  // Numérotation des pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i, pageCount);
  }
  
  doc.save(`Rapport_Global_Activites_Parascolaires_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Rapport détaillé d'un club
export const generateClubReport = (club: Club): void => {
  const doc = new jsPDF();
  
  addHeader(doc, `FICHE CLUB - ${club.name.toUpperCase()}`, `Catégorie: ${club.category}`);
  
  let yPos = 65;
  
  // Informations générales
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Informations Générales', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  
  const infoLines = [
    `Description: ${club.description}`,
    `Responsable: ${club.supervisor} (${club.supervisorEmail})`,
    `Horaire: ${club.schedule}`,
    `Salle: ${club.room}`,
    `Date de création: ${formatDate(club.createdDate)}`,
    `Statut: ${club.status === 'active' ? 'Actif' : 'Inactif'}`
  ];
  
  infoLines.forEach(line => {
    const splitText = doc.splitTextToSize(line, 170);
    doc.text(splitText, 20, yPos);
    yPos += splitText.length * 5;
  });
  
  yPos += 10;
  
  // Statistiques
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Statistiques', 20, yPos);
  yPos += 8;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Indicateur', 'Valeur']],
    body: [
      ['Nombre de membres', `${club.members.length} / ${club.maxMembers}`],
      ['Taux de remplissage', `${Math.round((club.members.length / club.maxMembers) * 100)}%`],
      ['Activités réalisées', club.activities.length.toString()],
      ['Budget alloué', formatCurrency(club.budget)],
      ['Budget utilisé', formatCurrency(club.budgetUsed)],
      ['Budget restant', formatCurrency(club.budget - club.budgetUsed)],
      ['Taux de consommation', `${Math.round((club.budgetUsed / club.budget) * 100)}%`]
    ],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 100 },
    tableWidth: 80
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Liste des membres
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Liste des Membres', 20, yPos);
  yPos += 8;
  
  const membersData = club.members.map(member => [
    member.studentName,
    member.class,
    member.role === 'leader' ? 'Président' : member.role === 'secretary' ? 'Secrétaire' : member.role === 'treasurer' ? 'Trésorier' : 'Membre',
    formatDate(member.joinDate),
    `${member.attendance}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Nom', 'Classe', 'Rôle', 'Date inscription', 'Assiduité']],
    body: membersData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 }
  });
  
  // Nouvelle page pour les activités
  doc.addPage();
  yPos = 30;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Historique des Activités', 20, yPos);
  yPos += 8;
  
  const activitiesData = club.activities.map(activity => [
    activity.title,
    formatDate(activity.date),
    activity.description,
    activity.participantsCount.toString()
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Activité', 'Date', 'Description', 'Participants']],
    body: activitiesData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 }
  });
  
  // Numérotation des pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i, pageCount);
  }
  
  doc.save(`Fiche_Club_${club.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Rapport détaillé d'une équipe sportive
export const generateSportTeamReport = (team: SportTeam): void => {
  const doc = new jsPDF();
  
  addHeader(doc, `FICHE ÉQUIPE - ${team.sport.toUpperCase()}`, `Niveau: ${team.level}`);
  
  let yPos = 65;
  
  // Informations générales
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Informations Générales', 20, yPos);
  yPos += 8;
  
  autoTable(doc, {
    startY: yPos,
    body: [
      ['Entraîneur', team.coach],
      ['Téléphone', team.coachPhone],
      ['Niveau', team.level],
      ['Effectif', `${team.players.length} / ${team.maxPlayers}`],
      ['Budget', formatCurrency(team.budget)],
      ['Budget utilisé', `${formatCurrency(team.budgetUsed)} (${Math.round((team.budgetUsed / team.budget) * 100)}%)`]
    ],
    styles: { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
    margin: { left: 20, right: 100 },
    tableWidth: 100
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Planning d'entraînement
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Planning d\'Entraînement', 20, yPos);
  yPos += 8;
  
  const scheduleData = team.trainingSchedule.map(session => [
    session.day,
    `${session.startTime} - ${session.endTime}`,
    session.location
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Jour', 'Horaire', 'Lieu']],
    body: scheduleData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [234, 179, 8], textColor: 0 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 100 },
    tableWidth: 100
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Liste des joueurs
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Liste des Joueurs', 20, yPos);
  yPos += 8;
  
  const boysCount = team.players.filter(p => p.gender === 'M').length;
  const girlsCount = team.players.filter(p => p.gender === 'F').length;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(`Répartition: ${boysCount} garçons, ${girlsCount} filles`, 20, yPos);
  yPos += 6;
  
  const playersData = team.players.map(player => [
    player.jerseyNumber?.toString() || '-',
    player.studentName,
    player.class,
    player.position,
    player.gender,
    player.performance
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['N°', 'Nom', 'Classe', 'Position', 'Genre', 'Performance']],
    body: playersData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 15, halign: 'center' }
    }
  });
  
  // Nouvelle page pour les compétitions
  doc.addPage();
  yPos = 30;
  
  // Compétitions
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Historique des Compétitions', 20, yPos);
  yPos += 8;
  
  const competitionsData = team.competitions.map(comp => [
    comp.name,
    formatDate(comp.date),
    comp.location,
    comp.opponent || '-',
    comp.result || 'À venir',
    comp.status === 'completed' ? 'Terminé' : comp.status === 'upcoming' ? 'À venir' : 'Annulé'
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Compétition', 'Date', 'Lieu', 'Adversaire', 'Résultat', 'Statut']],
    body: competitionsData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [234, 179, 8], textColor: 0 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Équipements
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Équipements', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  team.equipment.forEach((equip, index) => {
    doc.text(`• ${equip}`, 25, yPos);
    yPos += 5;
  });
  
  // Numérotation des pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i, pageCount);
  }
  
  doc.save(`Fiche_Equipe_${team.sport.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Rapport budgétaire détaillé
export const generateBudgetReport = (): void => {
  const doc = new jsPDF();
  
  const clubStats = getClubStats();
  const sportStats = getSportStats();
  const eventStats = getEventStats();
  
  const totalBudget = clubStats.totalBudget + sportStats.totalBudget + eventStats.totalBudget;
  const usedBudget = clubStats.usedBudget + sportStats.usedBudget + eventStats.usedBudget;
  
  addHeader(doc, 'BILAN BUDGÉTAIRE - ACTIVITÉS PARASCOLAIRES', `Période: Année Scolaire 2024-2025`);
  
  let yPos = 65;
  
  // Résumé exécutif
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('1. RÉSUMÉ EXÉCUTIF', 20, yPos);
  yPos += 10;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Indicateur', 'Montant', 'Pourcentage']],
    body: [
      ['Budget Total Alloué', formatCurrency(totalBudget), '100%'],
      ['Budget Consommé', formatCurrency(usedBudget), `${Math.round((usedBudget / totalBudget) * 100)}%`],
      ['Budget Disponible', formatCurrency(totalBudget - usedBudget), `${Math.round(((totalBudget - usedBudget) / totalBudget) * 100)}%`]
    ],
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 60 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Budget par catégorie
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('2. RÉPARTITION PAR CATÉGORIE', 20, yPos);
  yPos += 10;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Catégorie', 'Budget Alloué', 'Consommé', 'Disponible', 'Taux']],
    body: [
      ['Clubs', formatCurrency(clubStats.totalBudget), formatCurrency(clubStats.usedBudget), formatCurrency(clubStats.totalBudget - clubStats.usedBudget), `${Math.round((clubStats.usedBudget / clubStats.totalBudget) * 100)}%`],
      ['Sports', formatCurrency(sportStats.totalBudget), formatCurrency(sportStats.usedBudget), formatCurrency(sportStats.totalBudget - sportStats.usedBudget), `${Math.round((sportStats.usedBudget / sportStats.totalBudget) * 100)}%`],
      ['Événements', formatCurrency(eventStats.totalBudget), formatCurrency(eventStats.usedBudget), formatCurrency(eventStats.totalBudget - eventStats.usedBudget), `${Math.round((eventStats.usedBudget / eventStats.totalBudget) * 100)}%`],
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Détail Clubs
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('3. DÉTAIL BUDGETS CLUBS', 20, yPos);
  yPos += 10;
  
  const clubBudgetData = mockClubs.map(club => [
    club.name,
    formatCurrency(club.budget),
    formatCurrency(club.budgetUsed),
    formatCurrency(club.budget - club.budgetUsed),
    `${Math.round((club.budgetUsed / club.budget) * 100)}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Club', 'Alloué', 'Utilisé', 'Reste', 'Taux']],
    body: clubBudgetData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [147, 51, 234], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' }
    }
  });
  
  // Nouvelle page
  doc.addPage();
  yPos = 30;
  
  // Détail Sports
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('4. DÉTAIL BUDGETS SPORTS', 20, yPos);
  yPos += 10;
  
  const sportBudgetData = mockSportTeams.map(team => [
    team.sport,
    formatCurrency(team.budget),
    formatCurrency(team.budgetUsed),
    formatCurrency(team.budget - team.budgetUsed),
    `${Math.round((team.budgetUsed / team.budget) * 100)}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Sport', 'Alloué', 'Utilisé', 'Reste', 'Taux']],
    body: sportBudgetData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [234, 179, 8], textColor: 0 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Détail Événements
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('5. DÉTAIL BUDGETS ÉVÉNEMENTS', 20, yPos);
  yPos += 10;
  
  const eventBudgetData = mockEvents.map(event => [
    event.name,
    formatCurrency(event.budget),
    formatCurrency(event.budgetUsed),
    formatCurrency(event.budget - event.budgetUsed),
    `${Math.round((event.budgetUsed / event.budget) * 100)}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Événement', 'Alloué', 'Utilisé', 'Reste', 'Taux']],
    body: eventBudgetData,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Historique des transactions récentes
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('6. TRANSACTIONS RÉCENTES', 20, yPos);
  yPos += 10;
  
  const transactionsData = mockBudgetTransactions.slice(0, 15).map(tx => [
    formatDate(tx.date),
    tx.activityName,
    tx.description,
    tx.category,
    tx.type === 'expense' ? `-${formatCurrency(tx.amount)}` : `+${formatCurrency(tx.amount)}`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Activité', 'Description', 'Catégorie', 'Montant']],
    body: transactionsData,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      4: { halign: 'right' }
    },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === 'body') {
        const value = data.cell.raw as string;
        if (value.startsWith('-')) {
          data.cell.styles.textColor = [220, 38, 38];
        } else {
          data.cell.styles.textColor = [34, 197, 94];
        }
      }
    }
  });
  
  // Numérotation des pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i, pageCount);
  }
  
  doc.save(`Bilan_Budgetaire_Parascolaires_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Rapport de participation
export const generateParticipationReport = (): void => {
  const doc = new jsPDF();
  
  const clubStats = getClubStats();
  const sportStats = getSportStats();
  const eventStats = getEventStats();
  
  addHeader(doc, 'RAPPORT DE PARTICIPATION', 'Statistiques des Activités Parascolaires');
  
  let yPos = 65;
  
  // Vue d'ensemble
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('1. VUE D\'ENSEMBLE', 20, yPos);
  yPos += 10;
  
  const totalParticipants = clubStats.totalMembers + sportStats.totalPlayers;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Indicateur', 'Valeur', 'Évolution']],
    body: [
      ['Total participants', totalParticipants.toString(), '+12% vs année précédente'],
      ['Membres de clubs', clubStats.totalMembers.toString(), '+8 ce trimestre'],
      ['Sportifs licenciés', sportStats.totalPlayers.toString(), '+5 ce trimestre'],
      ['Inscriptions événements', eventStats.totalRegistrations.toString(), 'Tous événements confondus'],
      ['Taux de participation', '68%', 'Sur effectif total école']
    ],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 40 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Répartition par catégorie de club
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('2. RÉPARTITION PAR CATÉGORIE DE CLUB', 20, yPos);
  yPos += 10;
  
  const categoryStats: Record<string, number> = {};
  mockClubs.forEach(club => {
    categoryStats[club.category] = (categoryStats[club.category] || 0) + club.members.length;
  });
  
  const categoryData = Object.entries(categoryStats).map(([cat, count]) => [
    cat,
    count.toString(),
    `${Math.round((count / clubStats.totalMembers) * 100)}%`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Catégorie', 'Participants', 'Part']],
    body: categoryData,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 100 },
    tableWidth: 90,
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Top 5 clubs par participation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('3. TOP 5 CLUBS (PARTICIPATION)', 20, yPos);
  yPos += 10;
  
  const topClubs = [...mockClubs]
    .sort((a, b) => b.members.length - a.members.length)
    .slice(0, 5)
    .map((club, index) => [
      `${index + 1}`,
      club.name,
      club.members.length.toString(),
      `${Math.round((club.members.length / club.maxMembers) * 100)}%`
    ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Rang', 'Club', 'Membres', 'Remplissage']],
    body: topClubs,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [234, 179, 8], textColor: 0 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 60 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      2: { halign: 'center' },
      3: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Répartition sportive par genre
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('4. RÉPARTITION SPORTIVE PAR GENRE', 20, yPos);
  yPos += 10;
  
  const sportGenderData = mockSportTeams.map(team => {
    const boys = team.players.filter(p => p.gender === 'M').length;
    const girls = team.players.filter(p => p.gender === 'F').length;
    return [
      team.sport,
      boys.toString(),
      girls.toString(),
      team.players.length.toString(),
      `${Math.round((girls / team.players.length) * 100)}%`
    ];
  });
  
  autoTable(doc, {
    startY: yPos,
    head: [['Sport', 'Garçons', 'Filles', 'Total', '% Filles']],
    body: sportGenderData,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [147, 51, 234], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 40 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' }
    }
  });
  
  // Nouvelle page
  doc.addPage();
  yPos = 30;
  
  // Événements par participation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('5. ÉVÉNEMENTS PAR PARTICIPATION', 20, yPos);
  yPos += 10;
  
  const eventParticipation = [...mockEvents]
    .sort((a, b) => b.registrations.length - a.registrations.length)
    .map(event => [
      event.name,
      event.type,
      event.registrations.length.toString(),
      event.maxParticipants.toString(),
      `${Math.round((event.registrations.length / event.maxParticipants) * 100)}%`
    ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Événement', 'Type', 'Inscrits', 'Capacité', 'Taux']],
    body: eventParticipation,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 20;
  
  // Signatures
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text('Visa du Coordinateur des Activités', 30, yPos);
  doc.text('Visa du Directeur', 140, yPos);
  
  yPos += 25;
  doc.line(20, yPos, 80, yPos);
  doc.line(130, yPos, 190, yPos);
  
  // Numérotation des pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooter(doc, i, pageCount);
  }
  
  doc.save(`Rapport_Participation_Parascolaires_${new Date().toISOString().split('T')[0]}.pdf`);
};
