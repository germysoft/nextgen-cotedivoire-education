import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  verifyConvocation, 
  VerificationResult,
  VerificationData 
} from "@/utils/convocationVerification";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Shield, 
  Calendar, 
  Building, 
  User, 
  FileText,
  QrCode,
  Clock,
  Hash
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function VerificationConvocation() {
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState(searchParams.get('code') || '');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto-verify if code is in URL
  useEffect(() => {
    const codeFromURL = searchParams.get('code');
    if (codeFromURL) {
      setVerificationCode(codeFromURL);
      handleVerify(codeFromURL);
    }
  }, [searchParams]);

  const handleVerify = (code?: string) => {
    const codeToVerify = code || verificationCode;
    if (!codeToVerify.trim()) return;
    
    setIsVerifying(true);
    
    // Simulate network delay
    setTimeout(() => {
      const verificationResult = verifyConvocation(codeToVerify.trim());
      setResult(verificationResult);
      setIsVerifying(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold">Vérification de Convocation</h1>
          </div>
          <p className="text-center text-primary-foreground/80">
            Direction des Examens et Concours (DECO) - Côte d'Ivoire
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Search Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Vérifier l'authenticité d'une convocation
            </CardTitle>
            <CardDescription>
              Entrez le code de vérification ou scannez le QR code présent sur la convocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: CAND-1-M5X7K9-ABC123"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="font-mono"
              />
              <Button onClick={() => handleVerify()} disabled={isVerifying || !verificationCode.trim()}>
                {isVerifying ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Vérifier
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Card */}
        {result && (
          <Card className={`border-2 ${
            result.isValid 
              ? 'border-green-500' 
              : result.isExpired 
                ? 'border-amber-500' 
                : 'border-destructive'
          }`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {result.isValid ? (
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                ) : result.isExpired ? (
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                    <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                ) : (
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                )}
                <div>
                  <CardTitle className={
                    result.isValid 
                      ? 'text-green-600 dark:text-green-400' 
                      : result.isExpired 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-destructive'
                  }>
                    {result.isValid 
                      ? 'Document Authentique' 
                      : result.isExpired 
                        ? 'Document Expiré' 
                        : 'Document Non Valide'}
                  </CardTitle>
                  <CardDescription>{result.message}</CardDescription>
                </div>
              </div>
            </CardHeader>

            {result.data && (
              <CardContent className="space-y-6">
                <Separator />
                
                {/* Document Info */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Informations du Document
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Type de document</p>
                      <p className="font-medium">
                        Convocation {result.data.type === 'candidate' ? 'Candidat' : 'Jury'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Examen</p>
                      <Badge>{result.data.metadata.examType} - {result.data.metadata.session}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Beneficiary Info */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Bénéficiaire
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Nom complet</p>
                      <p className="font-medium">{result.data.metadata.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Centre d'examen</p>
                      <p className="font-medium flex items-center gap-1">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {result.data.metadata.center}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Technical Info */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Informations de Sécurité
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Date de génération</span>
                      </div>
                      <span className="font-mono text-sm">
                        {format(new Date(result.data.generatedAt), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Date d'expiration</span>
                      </div>
                      <span className="font-mono text-sm">
                        {format(new Date(result.data.expiresAt), "dd/MM/yyyy", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Hash du document</span>
                      </div>
                      <span className="font-mono text-xs">{result.data.documentHash}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Code de vérification</span>
                      </div>
                      <span className="font-mono text-sm">{result.data.code}</span>
                    </div>
                  </div>
                </div>

                {/* Issuer */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Document émis par: <strong>{result.data.metadata.generatedBy}</strong>
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Info Alert */}
        {!result && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Comment vérifier une convocation?</AlertTitle>
            <AlertDescription className="mt-2">
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Scannez le QR code présent en bas de la convocation</li>
                <li>Ou entrez manuellement le code de vérification</li>
                <li>Le système vérifiera l'authenticité et la validité du document</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Direction des Examens et Concours (DECO)</p>
          <p>Ministère de l'Éducation Nationale et de l'Alphabétisation</p>
          <p>République de Côte d'Ivoire</p>
        </div>
      </div>
    </div>
  );
}
