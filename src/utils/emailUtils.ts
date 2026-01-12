import { ReunionReport, SchoolInfo } from '@/components/reunions/ReunionPDFGenerator';

export interface EmailRecipient {
  email: string;
  name: string;
}

export const generateEmailSubject = (report: ReunionReport): string => {
  const typeLabels: Record<ReunionReport['type'], string> = {
    conseil_classe: 'Conseil de Classe',
    reunion_parents: 'Réunion Parents-Professeurs',
    reunion_pedagogique: 'Réunion Pédagogique',
    reunion_administrative: 'Réunion Administrative',
  };

  const dateFormatted = new Date(report.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `Compte-rendu : ${report.titre} - ${dateFormatted}`;
};

export const generateEmailBody = (report: ReunionReport, schoolInfo: SchoolInfo): string => {
  const typeLabels: Record<ReunionReport['type'], string> = {
    conseil_classe: 'Conseil de Classe',
    reunion_parents: 'Réunion Parents-Professeurs',
    reunion_pedagogique: 'Réunion Pédagogique',
    reunion_administrative: 'Réunion Administrative',
  };

  const dateFormatted = new Date(report.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let body = `Bonjour,

Veuillez trouver ci-joint le compte-rendu de la réunion suivante :

═══════════════════════════════════════
${report.titre}
═══════════════════════════════════════

📋 INFORMATIONS GÉNÉRALES
─────────────────────────────────────────
• Type : ${typeLabels[report.type]}
• Date : ${dateFormatted}
• Horaires : ${report.heureDebut} - ${report.heureFin}
• Lieu : ${report.lieu}
• Président : ${report.president}
• Secrétaire : ${report.secretaire}

`;

  // Participants
  if (report.participants.length > 0) {
    body += `👥 PARTICIPANTS (${report.participants.length})
─────────────────────────────────────────
`;
    const presents = report.participants.filter(p => p.present);
    const absents = report.participants.filter(p => !p.present);
    
    if (presents.length > 0) {
      body += `Présents :\n`;
      presents.forEach(p => {
        body += `  • ${p.nom} (${p.fonction})\n`;
      });
    }
    if (absents.length > 0) {
      body += `Excusés/Absents :\n`;
      absents.forEach(p => {
        body += `  • ${p.nom} (${p.fonction})\n`;
      });
    }
    body += '\n';
  }

  // Ordre du jour
  if (report.ordreJour.length > 0 && report.ordreJour.some(p => p)) {
    body += `📝 ORDRE DU JOUR
─────────────────────────────────────────
`;
    report.ordreJour.filter(p => p).forEach((point, index) => {
      body += `  ${index + 1}. ${point}\n`;
    });
    body += '\n';
  }

  // Décisions
  if (report.decisions.length > 0) {
    body += `✅ DÉCISIONS PRISES
─────────────────────────────────────────
`;
    report.decisions.forEach(dec => {
      body += `  D${dec.numero}. ${dec.description}
      → Responsable : ${dec.responsable}
      → Échéance : ${dec.echeance ? new Date(dec.echeance).toLocaleDateString('fr-FR') : 'Non définie'}
`;
    });
    body += '\n';
  }

  body += `─────────────────────────────────────────
📎 Le document PDF complet est à télécharger depuis l'application.

Cordialement,

${schoolInfo.nom}
${schoolInfo.adresse}
📞 ${schoolInfo.telephone}
📧 ${schoolInfo.email}
Année scolaire ${schoolInfo.anneeScolaire}
`;

  return body;
};

export const openMailtoLink = (
  recipients: EmailRecipient[],
  subject: string,
  body: string,
  cc?: EmailRecipient[],
  bcc?: EmailRecipient[]
): void => {
  const to = recipients.map(r => r.email).join(',');
  const ccEmails = cc ? cc.map(r => r.email).join(',') : '';
  const bccEmails = bcc ? bcc.map(r => r.email).join(',') : '';
  
  // Encode the subject and body for URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  let mailtoUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
  
  if (ccEmails) {
    mailtoUrl += `&cc=${ccEmails}`;
  }
  if (bccEmails) {
    mailtoUrl += `&bcc=${bccEmails}`;
  }
  
  // Open the mailto link
  window.location.href = mailtoUrl;
};

export const copyEmailContent = async (subject: string, body: string): Promise<boolean> => {
  try {
    const content = `Objet : ${subject}\n\n${body}`;
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const extractEmailsFromParticipants = (
  participants: ReunionReport['participants']
): EmailRecipient[] => {
  // This would need actual email data - for now returns empty
  // In a real app, participants would have email addresses
  return participants
    .filter(p => p.present)
    .map(p => ({
      email: '', // Would be populated from actual data
      name: p.nom,
    }));
};
