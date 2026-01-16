import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  FileSignature, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText,
  Shield,
  Loader2,
  Info,
  Calendar,
  Eye,
  Users,
  MapPin,
  ClipboardList,
  MessageSquare,
  ListChecks
} from 'lucide-react';
import { SignatureCanvas } from '@/components/reunions/SignatureCanvas';
import { ReunionReport } from '@/components/reunions/ReunionPDFGenerator';

interface SigningToken {
  id: string;
  documentId: string;
  documentTitle: string;
  signerName: string;
  signerRole: string;
  signerEmail: string;
  createdAt: string;
  expiresAt: string;
  signed: boolean;
  signedAt?: string;
}

const TOKENS_STORAGE_KEY = 'public_signing_tokens';
const SIGNATURES_STORAGE_KEY = 'document_signatures';
const REPORTS_STORAGE_KEY = 'reunion_reports';

// Generate a secure token
export const generateSigningToken = (
  documentId: string, 
  documentTitle: string, 
  signerName: string, 
  signerRole: string,
  signerEmail: string
): string => {
  const tokenId = `sign-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  const token: SigningToken = {
    id: tokenId,
    documentId,
    documentTitle,
    signerName,
    signerRole,
    signerEmail,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    signed: false,
  };
  
  // Store token
  const storedTokens = localStorage.getItem(TOKENS_STORAGE_KEY);
  const tokens: SigningToken[] = storedTokens ? JSON.parse(storedTokens) : [];
  tokens.push(token);
  localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
  
  return tokenId;
};

// Generate the public signing URL
export const generatePublicSigningUrl = (
  documentId: string, 
  documentTitle: string, 
  signerName: string, 
  signerRole: string,
  signerEmail: string
): string => {
  const token = generateSigningToken(documentId, documentTitle, signerName, signerRole, signerEmail);
  return `${window.location.origin}/signature-publique?token=${token}`;
};

// Document Preview Component
const DocumentPreview: React.FC<{ documentId: string; onClose: () => void }> = ({ documentId, onClose }) => {
  const [report, setReport] = useState<ReunionReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) {
        const reports = JSON.parse(stored);
        const found = reports.find((r: any) => r.id === documentId);
        setReport(found || null);
      }
    } catch (e) {
      console.error('Error loading document:', e);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'conseil_classe': return 'Conseil de Classe';
      case 'reunion_parents': return 'Réunion Parents';
      case 'reunion_pedagogique': return 'Réunion Pédagogique';
      case 'reunion_administrative': return 'Réunion Administrative';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Document non disponible pour la prévisualisation</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="decisions">Décisions</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{report.titre}</p>
                <Badge variant="outline" className="mt-1">{getTypeLabel(report.type)}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(report.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Horaire</p>
                  <p className="font-medium">{report.heureDebut} - {report.heureFin}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Lieu</p>
                <p className="font-medium">{report.lieu || 'Non spécifié'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Président de séance</p>
                <p className="font-medium">{report.president || 'Non spécifié'}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Secrétaire de séance</p>
                <p className="font-medium">{report.secretaire || 'Non spécifié'}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="participants" className="mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{report.participants.length} participant(s)</span>
            </div>
            <ScrollArea className="h-[200px]">
              {report.participants.length > 0 ? (
                <div className="space-y-2">
                  {report.participants.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{p.nom}</p>
                        <p className="text-xs text-muted-foreground">{p.fonction}</p>
                      </div>
                      <Badge variant={p.present ? 'default' : 'secondary'}>
                        {p.present ? 'Présent' : 'Absent'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Aucun participant enregistré</p>
              )}
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="mt-4">
          <div className="space-y-4">
            {/* Ordre du jour */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Ordre du jour</span>
              </div>
              <ScrollArea className="h-[100px]">
                {report.ordreJour.filter(o => o).length > 0 ? (
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {report.ordreJour.filter(o => o).map((item, idx) => (
                      <li key={idx} className="p-2 rounded bg-muted/50">{item}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucun point à l'ordre du jour</p>
                )}
              </ScrollArea>
            </div>

            {/* Discussions */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Points discutés ({report.discussions.length})</span>
              </div>
              <ScrollArea className="h-[120px]">
                {report.discussions.length > 0 ? (
                  <div className="space-y-2">
                    {report.discussions.map((d, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-muted/50 text-sm">
                        <p className="font-medium">{d.sujet}</p>
                        {d.intervenant && (
                          <p className="text-xs text-muted-foreground">Intervenant: {d.intervenant}</p>
                        )}
                        <p className="text-muted-foreground mt-1 line-clamp-2">{d.contenu}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune discussion enregistrée</p>
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{report.decisions.length} décision(s)</span>
          </div>
          <ScrollArea className="h-[220px]">
            {report.decisions.length > 0 ? (
              <div className="space-y-2">
                {report.decisions.map((d, idx) => (
                  <div key={idx} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm">{d.description}</p>
                      <Badge variant="outline">#{d.numero}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Responsable: {d.responsable}</span>
                      {d.echeance && <span>Échéance: {d.echeance}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">Aucune décision enregistrée</p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-2">
        <Button onClick={onClose}>Fermer l'aperçu</Button>
      </div>
    </div>
  );
};

const SignaturePublique: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<SigningToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Load and validate token
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('Lien de signature invalide. Aucun token fourni.');
      setLoading(false);
      return;
    }
    
    // Find token in storage
    const storedTokens = localStorage.getItem(TOKENS_STORAGE_KEY);
    const tokens: SigningToken[] = storedTokens ? JSON.parse(storedTokens) : [];
    const foundToken = tokens.find(t => t.id === token);
    
    if (!foundToken) {
      setError('Ce lien de signature n\'existe pas ou a été supprimé.');
      setLoading(false);
      return;
    }
    
    // Check if expired
    if (new Date(foundToken.expiresAt) < new Date()) {
      setError('Ce lien de signature a expiré. Veuillez demander un nouveau lien.');
      setLoading(false);
      return;
    }
    
    // Check if already signed
    if (foundToken.signed) {
      setSigned(true);
    }
    
    setTokenData(foundToken);
    setLoading(false);
  }, [searchParams]);
  
  // Handle email verification
  const handleSendVerificationCode = () => {
    if (!tokenData) return;
    
    // Generate a simple verification code (in real app, this would be sent via email)
    const code = Math.random().toString().substring(2, 8);
    
    // Store code temporarily (in real app, this would be server-side)
    localStorage.setItem(`verification_${tokenData.id}`, code);
    
    toast.success(`Code de vérification envoyé à ${tokenData.signerEmail}`, {
      description: `Code de démonstration: ${code}`,
    });
    
    setShowVerification(true);
  };
  
  const handleVerifyCode = () => {
    if (!tokenData) return;
    
    const storedCode = localStorage.getItem(`verification_${tokenData.id}`);
    
    if (verificationCode === storedCode) {
      setEmailVerified(true);
      localStorage.removeItem(`verification_${tokenData.id}`);
      toast.success('Vérification réussie!');
    } else {
      toast.error('Code de vérification incorrect');
    }
  };
  
  // Handle signature completion
  const handleSignatureComplete = (signatureData: string) => {
    if (!tokenData) return;
    
    // Save signature
    const signature = {
      id: `sig-${Date.now()}`,
      documentId: tokenData.documentId,
      signerName: tokenData.signerName,
      signerRole: tokenData.signerRole,
      signerEmail: tokenData.signerEmail,
      signatureData,
      signedAt: new Date().toISOString(),
      signedFrom: 'public_link',
      ipAddress: 'client',
      userAgent: navigator.userAgent,
    };
    
    // Store signature
    const storedSignatures = localStorage.getItem(SIGNATURES_STORAGE_KEY);
    const signatures = storedSignatures ? JSON.parse(storedSignatures) : [];
    signatures.push(signature);
    localStorage.setItem(SIGNATURES_STORAGE_KEY, JSON.stringify(signatures));
    
    // Update token as signed
    const storedTokens = localStorage.getItem(TOKENS_STORAGE_KEY);
    const tokens: SigningToken[] = storedTokens ? JSON.parse(storedTokens) : [];
    const updatedTokens = tokens.map(t => 
      t.id === tokenData.id 
        ? { ...t, signed: true, signedAt: new Date().toISOString() }
        : t
    );
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(updatedTokens));
    
    setSigned(true);
    toast.success('Signature enregistrée avec succès!');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Calculate time remaining
  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} jour(s) et ${hours} heure(s)`;
    if (hours > 0) return `${hours} heure(s)`;
    return 'Moins d\'une heure';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Erreur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lien invalide</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (signed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle>Document signé</CardTitle>
            <CardDescription>
              Votre signature a été enregistrée avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Document:</span>
                <span className="font-medium">{tokenData?.documentTitle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Signataire:</span>
                <span className="font-medium">{tokenData?.signerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date de signature:</span>
                <span className="font-medium">{formatDate(new Date().toISOString())}</span>
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Un email de confirmation vous a été envoyé. Vous pouvez fermer cette page.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <FileSignature className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Signature électronique</CardTitle>
              <CardDescription>Signez le document de manière sécurisée</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Document info with preview button */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{tokenData?.documentTitle}</p>
                  <p className="text-sm text-muted-foreground">Document à signer</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-1" />
                Prévisualiser
              </Button>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Signataire</p>
                  <p className="font-medium">{tokenData?.signerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Rôle</p>
                  <p className="font-medium capitalize">{tokenData?.signerRole}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expire dans:</span>
              <Badge variant="secondary">
                {tokenData && getTimeRemaining(tokenData.expiresAt)}
              </Badge>
            </div>
          </div>
          
          {/* Email verification step */}
          {!emailVerified ? (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Vérification d'identité requise</AlertTitle>
                <AlertDescription>
                  Pour des raisons de sécurité, veuillez vérifier votre identité avant de signer.
                </AlertDescription>
              </Alert>
              
              {!showVerification ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Un code de vérification sera envoyé à: <strong>{tokenData?.signerEmail}</strong>
                  </p>
                  <Button onClick={handleSendVerificationCode} className="w-full">
                    Envoyer le code de vérification
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Code de vérification</Label>
                    <Input
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Entrez le code à 6 chiffres"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Vérifiez votre boîte mail ({tokenData?.signerEmail})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSendVerificationCode} className="flex-1">
                      Renvoyer le code
                    </Button>
                    <Button onClick={handleVerifyCode} className="flex-1">
                      Vérifier
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Signature canvas */
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Identité vérifiée</span>
              </div>
              
              <div className="space-y-2">
                <Label>Votre signature</Label>
                <p className="text-sm text-muted-foreground">
                  Dessinez votre signature dans la zone ci-dessous
                </p>
                <SignatureCanvas onSignatureComplete={handleSignatureComplete} />
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  En validant votre signature, vous certifiez avoir lu et approuvé le document mentionné. 
                  Cette signature électronique a valeur légale conformément au règlement eIDAS.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Signature sécurisée</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{tokenData && formatDate(tokenData.createdAt)}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Aperçu du document
            </DialogTitle>
          </DialogHeader>
          {tokenData && (
            <DocumentPreview 
              documentId={tokenData.documentId} 
              onClose={() => setShowPreview(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignaturePublique;
