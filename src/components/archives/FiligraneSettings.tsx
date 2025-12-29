import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Type, RotateCcw, Eye, Save, Palette } from "lucide-react";
import { toast } from "sonner";
import { useEtablissement } from "@/contexts/EtablissementContext";
import { FiligraneArchive } from "@/types/etablissement";

interface FiligranePreviewProps {
  config: FiligraneArchive;
}

function FiligranePreview({ config }: FiligranePreviewProps) {
  return (
    <div className="relative w-full h-48 border rounded-lg bg-white overflow-hidden">
      {/* Bandeau */}
      {config.afficherBandeau && (
        <div 
          className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: config.couleurBandeau }}
        >
          DOCUMENT D'ARCHIVE - VALEUR HISTORIQUE UNIQUEMENT
        </div>
      )}
      
      {/* Filigrane */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `rotate(-${config.angle}deg)`,
        }}
      >
        <span
          style={{
            fontSize: `${config.taille / 2}px`,
            color: config.couleur,
            opacity: config.opacite / 100,
            fontWeight: 'bold',
          }}
        >
          {config.texte}
        </span>
      </div>
      
      {/* Contenu factice */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 text-sm">
        <div className="w-3/4 h-2 bg-muted rounded mb-2" />
        <div className="w-1/2 h-2 bg-muted rounded mb-4" />
        <div className="w-2/3 h-1 bg-muted/50 rounded mb-1" />
        <div className="w-2/3 h-1 bg-muted/50 rounded mb-1" />
        <div className="w-1/2 h-1 bg-muted/50 rounded" />
      </div>
      
      {/* Badge aperçu */}
      <Badge className="absolute top-2 right-2" variant="secondary">
        <Eye className="h-3 w-3 mr-1" />
        Aperçu
      </Badge>
    </div>
  );
}

export default function FiligraneSettings() {
  const { configuration, updateSection, isLocked } = useEtablissement();
  const [localConfig, setLocalConfig] = useState<FiligraneArchive>(
    configuration.parametresVisuels.filigraneArchive
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalConfig(configuration.parametresVisuels.filigraneArchive);
  }, [configuration.parametresVisuels.filigraneArchive]);

  const handleChange = (updates: Partial<FiligraneArchive>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSection('parametresVisuels', {
      filigraneArchive: localConfig,
    });
    setHasChanges(false);
    toast.success("Paramètres du filigrane sauvegardés");
  };

  const handleReset = () => {
    const defaultConfig: FiligraneArchive = {
      texte: 'ARCHIVE',
      couleur: '#c8c8c8',
      opacite: 30,
      taille: 60,
      angle: 45,
      afficherBandeau: true,
      couleurBandeau: '#dc3545',
    };
    setLocalConfig(defaultConfig);
    setHasChanges(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Personnalisation du Filigrane Archives
            </CardTitle>
            <CardDescription>
              Configurez l'apparence du filigrane sur les documents archivés
            </CardDescription>
          </div>
          {hasChanges && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Modifications non sauvegardées
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paramètres */}
          <div className="space-y-5">
            {/* Texte du filigrane */}
            <div className="space-y-2">
              <Label htmlFor="texte" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Texte du filigrane
              </Label>
              <Input
                id="texte"
                value={localConfig.texte}
                onChange={(e) => handleChange({ texte: e.target.value })}
                placeholder="ARCHIVE"
                disabled={isLocked}
                maxLength={20}
              />
            </div>

            {/* Couleur du filigrane */}
            <div className="space-y-2">
              <Label htmlFor="couleur" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Couleur du filigrane
              </Label>
              <div className="flex gap-2">
                <Input
                  id="couleur"
                  type="color"
                  value={localConfig.couleur}
                  onChange={(e) => handleChange({ couleur: e.target.value })}
                  disabled={isLocked}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={localConfig.couleur}
                  onChange={(e) => handleChange({ couleur: e.target.value })}
                  disabled={isLocked}
                  className="flex-1"
                  placeholder="#c8c8c8"
                />
              </div>
            </div>

            {/* Opacité */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                <span>Opacité</span>
                <span className="text-muted-foreground">{localConfig.opacite}%</span>
              </Label>
              <Slider
                value={[localConfig.opacite]}
                onValueChange={(value) => handleChange({ opacite: value[0] })}
                min={5}
                max={80}
                step={5}
                disabled={isLocked}
              />
            </div>

            {/* Taille */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                <span>Taille de police</span>
                <span className="text-muted-foreground">{localConfig.taille}px</span>
              </Label>
              <Slider
                value={[localConfig.taille]}
                onValueChange={(value) => handleChange({ taille: value[0] })}
                min={30}
                max={100}
                step={5}
                disabled={isLocked}
              />
            </div>

            {/* Angle */}
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                <span>Angle de rotation</span>
                <span className="text-muted-foreground">{localConfig.angle}°</span>
              </Label>
              <Slider
                value={[localConfig.angle]}
                onValueChange={(value) => handleChange({ angle: value[0] })}
                min={0}
                max={90}
                step={5}
                disabled={isLocked}
              />
            </div>

            {/* Bandeau */}
            <div className="space-y-4 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="afficherBandeau">Afficher le bandeau d'archive</Label>
                <Switch
                  id="afficherBandeau"
                  checked={localConfig.afficherBandeau}
                  onCheckedChange={(checked) => handleChange({ afficherBandeau: checked })}
                  disabled={isLocked}
                />
              </div>

              {localConfig.afficherBandeau && (
                <div className="space-y-2">
                  <Label htmlFor="couleurBandeau">Couleur du bandeau</Label>
                  <div className="flex gap-2">
                    <Input
                      id="couleurBandeau"
                      type="color"
                      value={localConfig.couleurBandeau}
                      onChange={(e) => handleChange({ couleurBandeau: e.target.value })}
                      disabled={isLocked}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={localConfig.couleurBandeau}
                      onChange={(e) => handleChange({ couleurBandeau: e.target.value })}
                      disabled={isLocked}
                      className="flex-1"
                      placeholder="#dc3545"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Aperçu */}
          <div className="space-y-4">
            <Label>Aperçu du document</Label>
            <FiligranePreview config={localConfig} />
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLocked}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLocked || !hasChanges}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
