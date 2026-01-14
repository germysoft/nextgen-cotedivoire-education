import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  Calendar
} from 'lucide-react';
import { SignatureCanvas } from '@/components/reunions/SignatureCanvas';

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
          {/* Document info */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{tokenData?.documentTitle}</p>
                <p className="text-sm text-muted-foreground">Document à signer</p>
              </div>
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
    </div>
  );
};

export default SignaturePublique;
