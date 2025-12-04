import { ExamCandidate, JuryMember } from '@/data/mockExamConvocations';

// Génère un code de vérification unique pour une convocation
export function generateVerificationCode(type: 'candidate' | 'jury', id: string): string {
  const prefix = type === 'candidate' ? 'CAND' : 'JURY';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${id.split('-')[1]}-${timestamp}-${random}`;
}

// Génère l'URL de vérification
export function generateVerificationURL(verificationCode: string): string {
  const baseURL = window.location.origin;
  return `${baseURL}/verification-convocation?code=${verificationCode}`;
}

// Données de vérification stockées (simulation - en production ce serait en BDD)
export interface VerificationData {
  code: string;
  type: 'candidate' | 'jury';
  entityId: string;
  generatedAt: string;
  expiresAt: string;
  documentHash: string;
  metadata: {
    name: string;
    examType: string;
    session: string;
    center: string;
    generatedBy: string;
  };
}

// Stockage local des codes de vérification (simulation)
const verificationStore = new Map<string, VerificationData>();

export function storeVerificationData(data: VerificationData): void {
  verificationStore.set(data.code, data);
  // Persist to localStorage for demo
  const stored = JSON.parse(localStorage.getItem('convocation_verifications') || '{}');
  stored[data.code] = data;
  localStorage.setItem('convocation_verifications', JSON.stringify(stored));
}

export function getVerificationData(code: string): VerificationData | null {
  // Check memory first
  if (verificationStore.has(code)) {
    return verificationStore.get(code)!;
  }
  // Check localStorage
  const stored = JSON.parse(localStorage.getItem('convocation_verifications') || '{}');
  return stored[code] || null;
}

export function createCandidateVerification(candidate: ExamCandidate): VerificationData {
  const code = generateVerificationCode('candidate', candidate.id);
  const now = new Date();
  const expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year validity
  
  const data: VerificationData = {
    code,
    type: 'candidate',
    entityId: candidate.id,
    generatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    documentHash: generateDocumentHash(candidate),
    metadata: {
      name: `${candidate.lastName} ${candidate.firstName}`,
      examType: candidate.examType,
      session: candidate.session,
      center: candidate.centerName,
      generatedBy: 'Direction des Examens et Concours'
    }
  };
  
  storeVerificationData(data);
  return data;
}

export function createJuryVerification(member: JuryMember): VerificationData {
  const code = generateVerificationCode('jury', member.id);
  const now = new Date();
  const expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  
  const data: VerificationData = {
    code,
    type: 'jury',
    entityId: member.id,
    generatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    documentHash: generateDocumentHash(member),
    metadata: {
      name: `${member.lastName} ${member.firstName}`,
      examType: member.examType,
      session: member.session,
      center: member.centerName,
      generatedBy: 'Direction des Examens et Concours'
    }
  };
  
  storeVerificationData(data);
  return data;
}

// Génère un hash simple du document (en production, utiliser un vrai algorithme de hachage)
function generateDocumentHash(data: object): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(16, '0');
}

// Vérifie l'authenticité d'une convocation
export interface VerificationResult {
  isValid: boolean;
  isExpired: boolean;
  data: VerificationData | null;
  message: string;
}

export function verifyConvocation(code: string): VerificationResult {
  const data = getVerificationData(code);
  
  if (!data) {
    return {
      isValid: false,
      isExpired: false,
      data: null,
      message: 'Code de vérification non trouvé. Ce document n\'est pas authentique ou n\'a pas été enregistré dans notre système.'
    };
  }
  
  const now = new Date();
  const expiresAt = new Date(data.expiresAt);
  
  if (now > expiresAt) {
    return {
      isValid: false,
      isExpired: true,
      data,
      message: 'Ce document a expiré. Veuillez contacter la DECO pour obtenir une nouvelle convocation.'
    };
  }
  
  return {
    isValid: true,
    isExpired: false,
    data,
    message: 'Document authentique et valide.'
  };
}
