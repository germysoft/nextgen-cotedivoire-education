import jsPDF from 'jspdf';
import { Club, ClubMember, SportTeam, TeamPlayer } from '@/data/mockExtracurricular';

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Dessiner la bordure décorative du certificat
const drawCertificateBorder = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Bordure extérieure dorée
  doc.setDrawColor(180, 140, 60);
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  // Bordure intérieure
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(1);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
  
  // Coins décoratifs
  const cornerSize = 20;
  doc.setFillColor(180, 140, 60);
  
  // Coin supérieur gauche
  doc.triangle(10, 10, 10 + cornerSize, 10, 10, 10 + cornerSize, 'F');
  // Coin supérieur droit
  doc.triangle(pageWidth - 10, 10, pageWidth - 10 - cornerSize, 10, pageWidth - 10, 10 + cornerSize, 'F');
  // Coin inférieur gauche
  doc.triangle(10, pageHeight - 10, 10 + cornerSize, pageHeight - 10, 10, pageHeight - 10 - cornerSize, 'F');
  // Coin inférieur droit
  doc.triangle(pageWidth - 10, pageHeight - 10, pageWidth - 10 - cornerSize, pageHeight - 10, pageWidth - 10, pageHeight - 10 - cornerSize, 'F');
};

// Ajouter le filigrane
const addWatermark = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(60);
  doc.setTextColor(240, 240, 240);
  doc.setFont('helvetica', 'bold');
  
  // Rotation pour le filigrane diagonal
  doc.text('CERTIFICAT', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45
  });
};

// Certificat de participation pour un membre de club
export const generateClubCertificate = (club: Club, member: ClubMember): void => {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Filigrane en arrière-plan
  addWatermark(doc);
  
  // Bordure décorative
  drawCertificateBorder(doc);
  
  let yPos = 35;
  
  // En-tête de l'école
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('ÉTABLISSEMENT SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Année Scolaire 2024-2025', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;
  
  // Titre du certificat
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 140, 60);
  doc.text('CERTIFICAT DE PARTICIPATION', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Sous-titre
  doc.setFontSize(16);
  doc.setTextColor(30, 64, 175);
  doc.text('Activités Parascolaires', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 25;
  
  // Corps du certificat
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text('Nous certifions que', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Nom de l'élève
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(member.studentName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Classe
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(`Élève en classe de ${member.class}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Description de la participation
  doc.setFontSize(14);
  doc.setTextColor(0);
  const roleText = member.role === 'leader' ? 'en qualité de Président(e)' : 
                   member.role === 'secretary' ? 'en qualité de Secrétaire' :
                   member.role === 'treasurer' ? 'en qualité de Trésorier(ère)' : 
                   'en qualité de Membre actif';
  
  doc.text(`a participé avec assiduité aux activités du`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  
  // Nom du club
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 140, 60);
  doc.text(club.name.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Rôle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80);
  doc.text(roleText, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Période et assiduité
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`depuis le ${formatDate(member.joinDate)} avec un taux d'assiduité de ${member.attendance}%`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 25;
  
  // Cadre avec informations sur le club
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth / 2 - 80, yPos - 5, 160, 25, 3, 3, 'S');
  
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Catégorie: ${club.category} | Responsable: ${club.supervisor}`, pageWidth / 2, yPos + 5, { align: 'center' });
  doc.text(`Horaire: ${club.schedule} | Salle: ${club.room}`, pageWidth / 2, yPos + 13, { align: 'center' });
  
  yPos += 35;
  
  // Signatures
  const signatureY = pageHeight - 45;
  
  // Signature du responsable du club
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text('Le Responsable du Club', 60, signatureY);
  doc.line(35, signatureY + 15, 110, signatureY + 15);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(club.supervisor, 72, signatureY + 22, { align: 'center' });
  
  // Cachet de l'école (cercle)
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(1);
  doc.circle(pageWidth / 2, signatureY + 8, 18, 'S');
  doc.setFontSize(7);
  doc.setTextColor(30, 64, 175);
  doc.text('CACHET', pageWidth / 2, signatureY + 5, { align: 'center' });
  doc.text('DE L\'ÉCOLE', pageWidth / 2, signatureY + 10, { align: 'center' });
  
  // Signature du directeur
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('Le Directeur', pageWidth - 70, signatureY);
  doc.line(pageWidth - 95, signatureY + 15, pageWidth - 30, signatureY + 15);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text('M. KOUASSI Koffi', pageWidth - 62, signatureY + 22, { align: 'center' });
  
  // Date et lieu
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80);
  doc.text(`Fait à Abidjan, le ${formatDate(new Date().toISOString().split('T')[0])}`, pageWidth / 2, pageHeight - 25, { align: 'center' });
  
  // Numéro de certificat
  doc.setFontSize(8);
  doc.setTextColor(150);
  const certNumber = `CERT-CLUB-${club.id.toUpperCase()}-${member.id.toUpperCase()}-${new Date().getFullYear()}`;
  doc.text(`N° ${certNumber}`, pageWidth / 2, pageHeight - 18, { align: 'center' });
  
  doc.save(`Certificat_${club.name.replace(/\s+/g, '_')}_${member.studentName.replace(/\s+/g, '_')}.pdf`);
};

// Certificat de participation pour un joueur d'équipe sportive
export const generateSportCertificate = (team: SportTeam, player: TeamPlayer): void => {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Filigrane en arrière-plan
  addWatermark(doc);
  
  // Bordure décorative
  drawCertificateBorder(doc);
  
  let yPos = 35;
  
  // En-tête de l'école
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('ÉTABLISSEMENT SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Année Scolaire 2024-2025', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;
  
  // Titre du certificat
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 140, 60);
  doc.text('CERTIFICAT SPORTIF', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Sous-titre
  doc.setFontSize(16);
  doc.setTextColor(30, 64, 175);
  doc.text('Association Sportive Scolaire', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 25;
  
  // Corps du certificat
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text('Nous certifions que', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Nom du joueur
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(player.studentName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Classe
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);
  doc.text(`Élève en classe de ${player.class}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Description de la participation
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`est membre licencié(e) de l'équipe de`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  
  // Nom du sport
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 140, 60);
  doc.text(team.sport.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  
  // Niveau
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.text(`Niveau ${team.level}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  
  // Position et numéro
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80);
  const positionText = player.jerseyNumber 
    ? `Position: ${player.position} | N° de maillot: ${player.jerseyNumber}`
    : `Spécialité: ${player.position}`;
  doc.text(positionText, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  
  // Performance
  const performanceColors: Record<string, number[]> = {
    'Excellent': [34, 197, 94],
    'Bon': [59, 130, 246],
    'Moyen': [234, 179, 8],
    'À améliorer': [239, 68, 68]
  };
  const perfColor = performanceColors[player.performance] || [100, 100, 100];
  doc.setTextColor(perfColor[0], perfColor[1], perfColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`Performance: ${player.performance}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  
  // Période
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text(`Licencié(e) depuis le ${formatDate(player.joinDate)}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;
  
  // Compétitions
  const completedCompetitions = team.competitions.filter(c => c.status === 'completed').length;
  if (completedCompetitions > 0) {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(pageWidth / 2 - 100, yPos - 5, 200, 20, 3, 3, 'S');
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`A participé à ${completedCompetitions} compétition(s) officielle(s)`, pageWidth / 2, yPos + 8, { align: 'center' });
    yPos += 5;
  }
  
  // Signatures
  const signatureY = pageHeight - 45;
  
  // Signature de l'entraîneur
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text('L\'Entraîneur', 60, signatureY);
  doc.line(35, signatureY + 15, 110, signatureY + 15);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(team.coach, 72, signatureY + 22, { align: 'center' });
  
  // Cachet de l'école (cercle)
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(1);
  doc.circle(pageWidth / 2, signatureY + 8, 18, 'S');
  doc.setFontSize(7);
  doc.setTextColor(30, 64, 175);
  doc.text('A.S.S.', pageWidth / 2, signatureY + 5, { align: 'center' });
  doc.text('CACHET', pageWidth / 2, signatureY + 10, { align: 'center' });
  
  // Signature du directeur
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('Le Directeur', pageWidth - 70, signatureY);
  doc.line(pageWidth - 95, signatureY + 15, pageWidth - 30, signatureY + 15);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text('M. KOUASSI Koffi', pageWidth - 62, signatureY + 22, { align: 'center' });
  
  // Date et lieu
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80);
  doc.text(`Fait à Abidjan, le ${formatDate(new Date().toISOString().split('T')[0])}`, pageWidth / 2, pageHeight - 25, { align: 'center' });
  
  // Numéro de certificat
  doc.setFontSize(8);
  doc.setTextColor(150);
  const certNumber = `CERT-SPORT-${team.sport.toUpperCase().substring(0, 3)}-${player.id.toUpperCase()}-${new Date().getFullYear()}`;
  doc.text(`N° ${certNumber}`, pageWidth / 2, pageHeight - 18, { align: 'center' });
  
  doc.save(`Certificat_${team.sport.replace(/\s+/g, '_')}_${player.studentName.replace(/\s+/g, '_')}.pdf`);
};

// Génération en lot pour tous les membres d'un club
export const generateAllClubCertificates = (club: Club): void => {
  club.members.forEach((member, index) => {
    setTimeout(() => {
      generateClubCertificate(club, member);
    }, index * 500); // Délai pour éviter le blocage du navigateur
  });
};

// Génération en lot pour tous les joueurs d'une équipe
export const generateAllTeamCertificates = (team: SportTeam): void => {
  team.players.forEach((player, index) => {
    setTimeout(() => {
      generateSportCertificate(team, player);
    }, index * 500);
  });
};

// Certificat d'excellence (meilleure assiduité)
export const generateExcellenceCertificate = (club: Club, member: ClubMember): void => {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Bordure spéciale dorée
  doc.setDrawColor(180, 140, 60);
  doc.setLineWidth(4);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  doc.setLineWidth(2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
  doc.setLineWidth(1);
  doc.rect(16, 16, pageWidth - 32, pageHeight - 32);
  
  let yPos = 40;
  
  // Médaille/Badge d'excellence
  doc.setFillColor(180, 140, 60);
  doc.circle(pageWidth / 2, yPos, 15, 'F');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('★', pageWidth / 2, yPos + 6, { align: 'center' });
  
  yPos += 30;
  
  // En-tête
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.text('ÉTABLISSEMENT SCOLAIRE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 20;
  
  // Titre
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 140, 60);
  doc.text('CERTIFICAT D\'EXCELLENCE', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  
  // Sous-titre
  doc.setFontSize(14);
  doc.setTextColor(30, 64, 175);
  doc.text('Mention Assiduité Exemplaire', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 25;
  
  // Corps
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text('Ce certificat est décerné à', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Nom
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 140, 60);
  doc.text(member.studentName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text(`en reconnaissance de son engagement exceptionnel au sein du`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(club.name, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text(`avec un taux d'assiduité remarquable de ${member.attendance}%`, pageWidth / 2, yPos, { align: 'center' });
  
  // Signatures
  const signatureY = pageHeight - 45;
  
  doc.setFontSize(10);
  doc.text('Le Responsable', 60, signatureY);
  doc.line(35, signatureY + 15, 110, signatureY + 15);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(club.supervisor, 72, signatureY + 22, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('Le Directeur', pageWidth - 70, signatureY);
  doc.line(pageWidth - 95, signatureY + 15, pageWidth - 30, signatureY + 15);
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text('M. KOUASSI Koffi', pageWidth - 62, signatureY + 22, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80);
  doc.text(`Fait à Abidjan, le ${formatDate(new Date().toISOString().split('T')[0])}`, pageWidth / 2, pageHeight - 22, { align: 'center' });
  
  doc.save(`Certificat_Excellence_${member.studentName.replace(/\s+/g, '_')}.pdf`);
};
