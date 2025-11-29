import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CommentManagerProps {
  studentName: string;
  onSave: (comments: {
    generalComment: string;
    directorComment: string;
  }) => void;
}

const suggestionsByPerformance = {
  excellent: [
    "Excellente élève, très attentive en classe. Bon travail, continuez ainsi !",
    "Travail remarquable. Félicitations pour votre sérieux et votre investissement.",
    "Résultats exceptionnels. Un exemple à suivre pour vos camarades.",
    "Performance excellente dans toutes les matières. Continuez sur cette lancée !",
  ],
  good: [
    "Bon travail dans l'ensemble. Continuez vos efforts pour encore progresser.",
    "Résultats satisfaisants. Quelques efforts supplémentaires permettraient d'atteindre l'excellence.",
    "Élève sérieux(se) et appliqué(e). Bon trimestre, maintenez le cap !",
    "Travail régulier et de qualité. Félicitations pour votre constance.",
  ],
  average: [
    "Résultats moyens. Plus de régularité dans le travail serait bénéfique.",
    "Peut mieux faire. Un effort constant est nécessaire pour progresser.",
    "Travail irrégulier. Concentrez-vous davantage pour améliorer vos résultats.",
    "Des progrès sont possibles avec plus d'investissement personnel.",
  ],
  weak: [
    "Résultats insuffisants. Un travail sérieux et régulier est impératif.",
    "Difficultés persistantes. Un soutien personnalisé est recommandé.",
    "Travail très insuffisant. Une remise en question s'impose rapidement.",
    "Résultats préoccupants. Rencontrons-nous pour trouver des solutions.",
  ],
};

export function CommentManager({ studentName, onSave }: CommentManagerProps) {
  const [generalComment, setGeneralComment] = useState("");
  const [directorComment, setDirectorComment] = useState("");

  const handleSuggestion = (comment: string, type: 'general' | 'director') => {
    if (type === 'general') {
      setGeneralComment(comment);
    } else {
      setDirectorComment(comment);
    }
    toast.success("Suggestion appliquée");
  };

  const handleSave = () => {
    onSave({ generalComment, directorComment });
    toast.success("Commentaires enregistrés");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Commentaires pour {studentName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appréciation générale */}
          <div className="space-y-3">
            <Label htmlFor="general-comment">Appréciation générale</Label>
            <Textarea
              id="general-comment"
              value={generalComment}
              onChange={(e) => setGeneralComment(e.target.value)}
              placeholder="Saisir l'appréciation générale du trimestre..."
              rows={4}
              className="resize-none"
            />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Suggestions IA</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(suggestionsByPerformance).map(([level, suggestions]) => (
                  <div key={level} className="w-full">
                    <p className="text-xs text-muted-foreground mb-1 capitalize">{level === 'excellent' ? 'Excellent' : level === 'good' ? 'Bien' : level === 'average' ? 'Moyen' : 'Insuffisant'}:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.slice(0, 2).map((suggestion, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                          onClick={() => handleSuggestion(suggestion, 'general')}
                        >
                          {suggestion.substring(0, 40)}...
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mot du directeur */}
          <div className="space-y-3">
            <Label htmlFor="director-comment">Mot du directeur (optionnel)</Label>
            <Textarea
              id="director-comment"
              value={directorComment}
              onChange={(e) => setDirectorComment(e.target.value)}
              placeholder="Message du directeur pour ce bulletin..."
              rows={3}
              className="resize-none"
            />
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSuggestion("Félicitations pour ces résultats encourageants.", 'director')}
              >
                Félicitations
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSuggestion("Bon travail. Continuez ainsi pour le prochain trimestre.", 'director')}
              >
                Encouragement
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSuggestion("Des efforts supplémentaires sont nécessaires. Nous restons à votre disposition.", 'director')}
              >
                Mise en garde
              </Badge>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les commentaires
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
