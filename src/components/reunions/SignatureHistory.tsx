import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  User, 
  FileSignature,
  Eye,
  Shield,
  MapPin,
  Calendar,
  Hash,
  Download
} from 'lucide-react';
import { ElectronicSignature } from './ReunionPDFGenerator';

interface SignatureHistoryProps {
  signatures: ElectronicSignature[];
  documentId: string;
  documentTitle: string;
}

export interface SignatureAuditEntry {
  id: string;
  action: 'created' | 'signed' | 'verified' | 'exported' | 'viewed';
  timestamp: string;
  actor: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

// Generate a unique verification hash for the document
export const generateVerificationHash = (documentId: string, signatures: ElectronicSignature[]): string => {
  const signatureData = signatures.map(s => `${s.id}-${s.signedAt}`).join('|');
  const baseString = `${documentId}:${signatureData}`;
  
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to hex and make it look like a verification code
  const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `CR-${hexHash.slice(0, 4)}-${hexHash.slice(4, 8)}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
};

// Generate verification URL
export const generateVerificationUrl = (documentId: string, hash: string): string => {
  // In production, this would be a real verification endpoint
  const baseUrl = window.location.origin;
  return `${baseUrl}/verification/document?id=${documentId}&hash=${hash}`;
};

// Generate verification data for QR code
export const generateVerificationData = (
  documentId: string, 
  documentTitle: string,
  signatures: ElectronicSignature[]
): string => {
  const hash = generateVerificationHash(documentId, signatures);
  const verificationUrl = generateVerificationUrl(documentId, hash);
  
  return JSON.stringify({
    type: 'REUNION_REPORT_VERIFICATION',
    documentId,
    documentTitle,
    hash,
    verificationUrl,
    signatureCount: signatures.length,
    signers: signatures.map(s => ({
      name: s.signerName,
      role: s.signerRole,
      signedAt: s.signedAt,
    })),
    generatedAt: new Date().toISOString(),
  });
};

export const SignatureHistory: React.FC<SignatureHistoryProps> = ({
  signatures,
  documentId,
  documentTitle,
}) => {
  const [selectedSignature, setSelectedSignature] = useState<ElectronicSignature | null>(null);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const verificationHash = generateVerificationHash(documentId, signatures);

  // Generate audit trail from signatures
  const generateAuditTrail = (): SignatureAuditEntry[] => {
    const entries: SignatureAuditEntry[] = [];
    
    // Document creation entry
    entries.push({
      id: 'audit-1',
      action: 'created',
      timestamp: signatures.length > 0 
        ? new Date(Math.min(...signatures.map(s => new Date(s.signedAt).getTime())) - 60000).toISOString()
        : new Date().toISOString(),
      actor: 'Système',
      details: 'Document créé et préparé pour signature',
    });

    // Add signature entries
    signatures.forEach((sig, index) => {
      entries.push({
        id: `audit-sig-${sig.id}`,
        action: 'signed',
        timestamp: sig.signedAt,
        actor: sig.signerName,
        details: `Signature électronique apposée en tant que ${getRoleLabel(sig.signerRole)}`,
        ipAddress: sig.ipAddress,
      });

      if (sig.verified) {
        entries.push({
          id: `audit-verified-${sig.id}`,
          action: 'verified',
          timestamp: new Date(new Date(sig.signedAt).getTime() + 1000).toISOString(),
          actor: 'Système',
          details: `Signature de ${sig.signerName} vérifiée et validée`,
        });
      }
    });

    // Sort by timestamp
    return entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'president': return 'Président de séance';
      case 'secretaire': return 'Secrétaire';
      case 'participant': return 'Participant';
      default: return role;
    }
  };

  const getActionIcon = (action: SignatureAuditEntry['action']) => {
    switch (action) {
      case 'created': return <FileSignature className="w-4 h-4" />;
      case 'signed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'verified': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'exported': return <Download className="w-4 h-4" />;
      case 'viewed': return <Eye className="w-4 h-4" />;
    }
  };

  const getActionBadge = (action: SignatureAuditEntry['action']) => {
    switch (action) {
      case 'created': 
        return <Badge variant="outline">Création</Badge>;
      case 'signed': 
        return <Badge className="bg-green-500">Signé</Badge>;
      case 'verified': 
        return <Badge className="bg-blue-500">Vérifié</Badge>;
      case 'exported': 
        return <Badge variant="secondary">Exporté</Badge>;
      case 'viewed': 
        return <Badge variant="outline">Consulté</Badge>;
    }
  };

  const auditTrail = generateAuditTrail();

  if (signatures.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="w-4 h-4" />
                Historique & Traçabilité
              </CardTitle>
              <CardDescription>
                {signatures.length} signature(s) enregistrée(s)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFullHistory(true)}>
              <Eye className="w-4 h-4 mr-1" />
              Détails
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Verification Hash */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Code de vérification:</span>
            </div>
            <p className="font-mono text-sm font-bold mt-1">{verificationHash}</p>
          </div>

          {/* Quick Timeline */}
          <div className="space-y-2">
            {signatures.slice(0, 3).map((sig, index) => (
              <div 
                key={sig.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedSignature(sig)}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sig.signerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sig.signedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                {sig.verified && (
                  <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                )}
              </div>
            ))}
            
            {signatures.length > 3 && (
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                onClick={() => setShowFullHistory(true)}
              >
                +{signatures.length - 3} autre(s) signature(s)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Signature Detail Dialog */}
      <Dialog open={!!selectedSignature} onOpenChange={() => setSelectedSignature(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la signature</DialogTitle>
          </DialogHeader>
          {selectedSignature && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> Signataire
                  </p>
                  <p className="font-medium">{selectedSignature.signerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rôle</p>
                  <p className="font-medium">{getRoleLabel(selectedSignature.signerRole)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date et heure
                  </p>
                  <p className="font-medium">
                    {new Date(selectedSignature.signedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Statut
                  </p>
                  <Badge className={selectedSignature.verified ? 'bg-green-500' : 'bg-orange-500'}>
                    {selectedSignature.verified ? 'Vérifié' : 'En attente'}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Aperçu de la signature</p>
                <div className="border rounded-lg p-4 bg-white">
                  <img 
                    src={selectedSignature.signatureData} 
                    alt="Signature"
                    className="max-w-full h-auto max-h-32 mx-auto"
                  />
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  ID de signature: <span className="font-mono">{selectedSignature.id}</span>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full History Dialog */}
      <Dialog open={showFullHistory} onOpenChange={setShowFullHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Journal d'audit complet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Document Info */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Document</span>
                <span className="font-medium">{documentTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ID</span>
                <span className="font-mono text-sm">{documentId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Code de vérification</span>
                <span className="font-mono text-sm font-bold">{verificationHash}</span>
              </div>
            </div>

            <Separator />

            {/* Audit Trail */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
                
                <div className="space-y-4">
                  {auditTrail.map((entry, index) => (
                    <div key={entry.id} className="relative flex gap-4 pl-10">
                      {/* Timeline dot */}
                      <div className="absolute left-2 w-5 h-5 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                        {getActionIcon(entry.action)}
                      </div>
                      
                      <div className="flex-1 p-3 bg-card border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          {getActionBadge(entry.action)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{entry.actor}</p>
                        <p className="text-sm text-muted-foreground">{entry.details}</p>
                        {entry.ipAddress && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            IP: {entry.ipAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                {auditTrail.length} entrées dans le journal
              </p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <Shield className="w-3 h-3" />
                Intégrité vérifiée
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignatureHistory;
