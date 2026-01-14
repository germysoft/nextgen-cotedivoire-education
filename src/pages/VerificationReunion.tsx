import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  XCircle, 
  Shield, 
  FileText, 
  User, 
  Calendar,
  Hash,
  Search,
  AlertTriangle,
  Building2,
  Clock,
  Fingerprint
} from 'lucide-react';

interface VerificationResult {
  isValid: boolean;
  documentId: string;
  documentTitle: string;
  hash: string;
  signers: {
    name: string;
    role: string;
    signedAt: string;
  }[];
  generatedAt: string;
  verificationTimestamp: string;
}

const VerificationReunion: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [manualCode, setManualCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-verify if URL contains parameters
  useEffect(() => {
    const documentId = searchParams.get('id');
    const hash = searchParams.get('hash');
    
    if (documentId && hash) {
      verifyDocument(documentId, hash);
    }
  }, [searchParams]);

  const verifyDocument = async (documentId: string, hash: string) => {
    setIsVerifying(true);
    setError(null);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Try to find the document in localStorage
      const storedReports = localStorage.getItem('reunion_reports');
      if (storedReports) {
        const reports = JSON.parse(storedReports);
        const report = reports.find((r: any) => r.id === documentId);
        
        if (report && report.electronicSignatures?.length > 0) {
          // Verify hash matches
          const signatureData = report.electronicSignatures.map((s: any) => `${s.id}-${s.signedAt}`).join('|');
          const baseString = `${documentId}:${signatureData}`;
          
          let computedHash = 0;
          for (let i = 0; i < baseString.length; i++) {
            const char = baseString.charCodeAt(i);
            computedHash = ((computedHash << 5) - computedHash) + char;
            computedHash = computedHash & computedHash;
          }
          
          const hexHash = Math.abs(computedHash).toString(16).toUpperCase().padStart(8, '0');
          const expectedHashPrefix = `CR-${hexHash.slice(0, 4)}-${hexHash.slice(4, 8)}-`;
          
          if (hash.startsWith(expectedHashPrefix.slice(0, -1).slice(0, 12))) {
            setVerificationResult({
              isValid: true,
              documentId,
              documentTitle: report.title || 'Compte-rendu de réunion',
              hash,
              signers: report.electronicSignatures.map((s: any) => ({
                name: s.signerName,
                role: s.signerRole,
                signedAt: s.signedAt,
              })),
              generatedAt: report.updatedAt || report.createdAt,
              verificationTimestamp: new Date().toISOString(),
            });
            return;
          }
        }
      }
      
      // If not found or hash doesn't match
      setError('Document non trouvé ou code de vérification invalide');
      setVerificationResult(null);
    } catch (e) {
      setError('Erreur lors de la vérification');
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerification = () => {
    // Parse manual code format: CR-XXXX-XXXX-YYYY or full URL
    const code = manualCode.trim();
    
    // Try to extract from URL if pasted
    const urlMatch = code.match(/[?&]id=([^&]+).*[?&]hash=([^&]+)/);
    if (urlMatch) {
      verifyDocument(urlMatch[1], urlMatch[2]);
      return;
    }
    
    // Check if it's just a hash code
    if (code.match(/^CR-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]+$/)) {
      // Try to find by hash in stored reports
      const storedReports = localStorage.getItem('reunion_reports');
      if (storedReports) {
        const reports = JSON.parse(storedReports);
        for (const report of reports) {
          if (report.electronicSignatures?.length > 0) {
            verifyDocument(report.id, code);
            return;
          }
        }
      }
      setError('Document non trouvé pour ce code de vérification');
    } else {
      setError('Format de code invalide');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'president': return 'Président de séance';
      case 'secretaire': return 'Secrétaire';
      case 'participant': return 'Participant';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Vérification de document</h1>
              <p className="text-sm text-muted-foreground">Portail de vérification des comptes-rendus signés</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Manual Verification Form */}
        {!verificationResult && !isVerifying && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Vérifier un document
              </CardTitle>
              <CardDescription>
                Entrez le code de vérification ou scannez le QR code du document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code de vérification</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    placeholder="CR-XXXX-XXXX-XXXX ou URL complète"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="font-mono"
                  />
                  <Button onClick={handleManualVerification} disabled={!manualCode.trim()}>
                    Vérifier
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Vous pouvez également scanner le QR code présent sur le document PDF signé</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isVerifying && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium">Vérification en cours...</p>
                <p className="text-sm text-muted-foreground">Validation de l'authenticité du document</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className={verificationResult.isValid 
              ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' 
              : 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
            }>
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-4">
                  {verificationResult.isValid ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                          Document authentique
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          Ce document a été vérifié avec succès
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-600" />
                      </div>
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
                          Document non valide
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          Ce document n'a pas pu être vérifié
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {verificationResult.isValid && (
              <>
                {/* Document Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="w-4 h-4" />
                      Informations du document
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Titre</p>
                        <p className="font-medium">{verificationResult.documentTitle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID Document</p>
                        <p className="font-mono text-sm">{verificationResult.documentId}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Code de vérification</span>
                      </div>
                      <p className="font-mono font-bold">{verificationResult.hash}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Signatures */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Fingerprint className="w-4 h-4" />
                      Signatures électroniques ({verificationResult.signers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {verificationResult.signers.map((signer, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{signer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {getRoleLabel(signer.role)}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground">
                              {new Date(signer.signedAt).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(signer.signedAt).toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Metadata */}
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Vérifié le {new Date(verificationResult.verificationTimestamp).toLocaleString('fr-FR')}</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        <Shield className="w-3 h-3 mr-1" />
                        Intégrité confirmée
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* New Verification */}
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setVerificationResult(null);
                      setManualCode('');
                    }}
                  >
                    Vérifier un autre document
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Ce service permet de vérifier l'authenticité des comptes-rendus de réunion</p>
          <p>signés électroniquement via notre plateforme.</p>
        </div>
      </main>
    </div>
  );
};

export default VerificationReunion;
