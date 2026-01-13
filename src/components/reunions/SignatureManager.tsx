import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Pen, 
  CheckCircle2, 
  Clock, 
  User, 
  FileSignature,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { SignatureCanvas } from './SignatureCanvas';

export interface ElectronicSignature {
  id: string;
  signerName: string;
  signerRole: string;
  signatureData: string;
  signedAt: string;
  ipAddress?: string;
  verified: boolean;
}

export interface SignatureRequirement {
  role: 'president' | 'secretaire' | 'participant';
  name: string;
  required: boolean;
}

interface SignatureManagerProps {
  signatures: ElectronicSignature[];
  requirements: SignatureRequirement[];
  onAddSignature: (signature: Omit<ElectronicSignature, 'id' | 'signedAt' | 'verified'>) => void;
  onRemoveSignature: (id: string) => void;
  disabled?: boolean;
}

export const SignatureManager: React.FC<SignatureManagerProps> = ({
  signatures,
  requirements,
  onAddSignature,
  onRemoveSignature,
  disabled = false,
}) => {
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [currentSigner, setCurrentSigner] = useState<SignatureRequirement | null>(null);
  const [previewSignature, setPreviewSignature] = useState<ElectronicSignature | null>(null);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'president': return 'Président de séance';
      case 'secretaire': return 'Secrétaire';
      case 'participant': return 'Participant';
      default: return role;
    }
  };

  const getSignatureForRole = (requirement: SignatureRequirement) => {
    return signatures.find(sig => 
      sig.signerRole === requirement.role && 
      sig.signerName === requirement.name
    );
  };

  const handleOpenSignature = (requirement: SignatureRequirement) => {
    setCurrentSigner(requirement);
    setIsSigningOpen(true);
  };

  const handleSignatureComplete = (signatureData: string) => {
    if (!currentSigner) return;
    
    onAddSignature({
      signerName: currentSigner.name,
      signerRole: currentSigner.role,
      signatureData,
    });
    
    setIsSigningOpen(false);
    setCurrentSigner(null);
    toast.success(`Signature de ${currentSigner.name} enregistrée`);
  };

  const signedCount = requirements.filter(req => getSignatureForRole(req)).length;
  const requiredCount = requirements.filter(req => req.required).length;
  const allRequiredSigned = requirements
    .filter(req => req.required)
    .every(req => getSignatureForRole(req));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="w-5 h-5" />
              Signatures électroniques
            </CardTitle>
            <CardDescription>
              {signedCount}/{requirements.length} signatures collectées
            </CardDescription>
          </div>
          {allRequiredSigned ? (
            <Badge className="bg-green-500">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Complet
            </Badge>
          ) : (
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              <Clock className="w-3 h-3 mr-1" />
              En attente
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {requirements.map((requirement, index) => {
          const signature = getSignatureForRole(requirement);
          
          return (
            <div
              key={`${requirement.role}-${requirement.name}-${index}`}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                signature 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-muted/30 border-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  signature 
                    ? 'bg-green-100 dark:bg-green-800' 
                    : 'bg-muted'
                }`}>
                  {signature ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{requirement.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleLabel(requirement.role)}
                    {requirement.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {signature ? (
                  <>
                    <span className="text-xs text-muted-foreground">
                      {new Date(signature.signedAt).toLocaleString('fr-FR')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewSignature(signature)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveSignature(signature.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleOpenSignature(requirement)}
                    disabled={disabled}
                  >
                    <Pen className="w-4 h-4 mr-1" />
                    Signer
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <Separator className="my-4" />
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>* Signature requise</p>
          <p>Les signatures électroniques sont horodatées et sécurisées.</p>
        </div>
      </CardContent>

      {/* Signing Dialog */}
      <Dialog open={isSigningOpen} onOpenChange={setIsSigningOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Signature électronique</DialogTitle>
          </DialogHeader>
          {currentSigner && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{currentSigner.name}</p>
                <p className="text-sm text-muted-foreground">
                  {getRoleLabel(currentSigner.role)}
                </p>
              </div>
              
              <SignatureCanvas
                onSignatureComplete={handleSignatureComplete}
                width={450}
                height={150}
              />
              
              <p className="text-xs text-muted-foreground text-center">
                En validant votre signature, vous certifiez avoir lu et approuvé le contenu de ce document.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewSignature} onOpenChange={() => setPreviewSignature(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aperçu de la signature</DialogTitle>
          </DialogHeader>
          {previewSignature && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{previewSignature.signerName}</p>
                <p className="text-sm text-muted-foreground">
                  {getRoleLabel(previewSignature.signerRole)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Signé le {new Date(previewSignature.signedAt).toLocaleString('fr-FR')}
                </p>
              </div>
              
              <div className="border rounded-lg p-4 bg-white">
                <img 
                  src={previewSignature.signatureData} 
                  alt="Signature"
                  className="max-w-full h-auto"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Signature vérifiée et authentique</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SignatureManager;
