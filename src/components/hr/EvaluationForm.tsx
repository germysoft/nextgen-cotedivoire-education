import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ClipboardCheck, Target, Star, Plus, Trash2, Save, Send, 
  CheckCircle2, AlertCircle, Clock, TrendingUp, Award, FileText
} from "lucide-react";
import { Personnel } from "@/types/personnel";
import { 
  Evaluation, ObjectifSMART, CritereEvaluation, 
  categoriesEvaluation, niveauxNotation 
} from "@/types/evaluation";
import { generateEvaluationId, generateObjectifId } from "@/data/mockEvaluations";
import { toast } from "sonner";
import { generateEvaluationPDF } from "./EvaluationPDFGenerator";

interface EvaluationFormProps {
  personnel: Personnel;
  existingEvaluation?: Evaluation;
  onSave?: (evaluation: Evaluation) => void;
}

const currentYear = new Date().getFullYear();
const periodes = [
  `${currentYear - 1}-${currentYear}`,
  `${currentYear}-${currentYear + 1}`,
];

export function EvaluationForm({ personnel, existingEvaluation, onSave }: EvaluationFormProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("criteres");
  
  // État du formulaire
  const [periode, setPeriode] = useState(existingEvaluation?.periode || periodes[0]);
  const [typeEvaluation, setTypeEvaluation] = useState<Evaluation['typeEvaluation']>(
    existingEvaluation?.typeEvaluation || "Annuelle"
  );
  
  // Critères d'évaluation
  const [criteres, setCriteres] = useState<CritereEvaluation[]>(() => {
    if (existingEvaluation?.criteres) return existingEvaluation.criteres;
    
    // Initialiser les critères avec notes par défaut
    const initialCriteres: CritereEvaluation[] = [];
    categoriesEvaluation.forEach(cat => {
      cat.criteres.forEach((critere, idx) => {
        initialCriteres.push({
          id: `${cat.id}-${idx}`,
          categorie: cat.id,
          critere,
          note: 3,
          poids: Math.floor(100 / (categoriesEvaluation.length * 5))
        });
      });
    });
    return initialCriteres;
  });
  
  // Objectifs SMART
  const [objectifsPrecedents, setObjectifsPrecedents] = useState<ObjectifSMART[]>(
    existingEvaluation?.objectifsPrecedents || []
  );
  const [objectifsFuturs, setObjectifsFuturs] = useState<ObjectifSMART[]>(
    existingEvaluation?.objectifsFuturs || []
  );
  const [nouvelObjectif, setNouvelObjectif] = useState<Partial<ObjectifSMART>>({});
  
  // Appréciation globale
  const [appreciationGenerale, setAppreciationGenerale] = useState(
    existingEvaluation?.appreciationGenerale || ""
  );
  const [pointsForts, setPointsForts] = useState<string[]>(
    existingEvaluation?.pointsForts || [""]
  );
  const [axesAmelioration, setAxesAmelioration] = useState<string[]>(
    existingEvaluation?.axesAmelioration || [""]
  );
  const [besoinsFormation, setBesoinsFormation] = useState<string[]>(
    existingEvaluation?.besoinsFormation || [""]
  );

  // Calculer la note globale
  const noteGlobale = criteres.length > 0
    ? criteres.reduce((sum, c) => sum + c.note, 0) / criteres.length
    : 0;

  const handleNoteCritere = (critereId: string, note: number) => {
    setCriteres(prev => prev.map(c => 
      c.id === critereId ? { ...c, note } : c
    ));
  };

  const handleCommentaireCritere = (critereId: string, commentaire: string) => {
    setCriteres(prev => prev.map(c => 
      c.id === critereId ? { ...c, commentaire } : c
    ));
  };

  const ajouterObjectif = (type: 'precedent' | 'futur') => {
    if (!nouvelObjectif.titre) {
      toast.error("Veuillez renseigner le titre de l'objectif");
      return;
    }
    
    const objectif: ObjectifSMART = {
      id: generateObjectifId(),
      titre: nouvelObjectif.titre || "",
      description: nouvelObjectif.description || "",
      specifique: nouvelObjectif.specifique || "",
      mesurable: nouvelObjectif.mesurable || "",
      atteignable: nouvelObjectif.atteignable || "",
      realiste: nouvelObjectif.realiste || "",
      temporel: nouvelObjectif.temporel || "",
      dateEcheance: nouvelObjectif.dateEcheance || "",
      progression: type === 'precedent' ? (nouvelObjectif.progression || 0) : 0,
      statut: type === 'precedent' ? (nouvelObjectif.statut || 'En cours') : 'En cours'
    };
    
    if (type === 'precedent') {
      setObjectifsPrecedents(prev => [...prev, objectif]);
    } else {
      setObjectifsFuturs(prev => [...prev, objectif]);
    }
    setNouvelObjectif({});
    toast.success("Objectif ajouté");
  };

  const supprimerObjectif = (id: string, type: 'precedent' | 'futur') => {
    if (type === 'precedent') {
      setObjectifsPrecedents(prev => prev.filter(o => o.id !== id));
    } else {
      setObjectifsFuturs(prev => prev.filter(o => o.id !== id));
    }
  };

  const handleSave = (statut: 'Brouillon' | 'En cours') => {
    const evaluation: Evaluation = {
      id: existingEvaluation?.id || generateEvaluationId(),
      personnelId: personnel.id,
      evaluateurId: "current-user",
      evaluateurNom: "Utilisateur Actuel",
      periode,
      dateEvaluation: new Date().toISOString().split('T')[0],
      typeEvaluation,
      statut,
      criteres,
      objectifsPrecedents,
      objectifsFuturs,
      noteGlobale,
      appreciationGenerale,
      pointsForts: pointsForts.filter(p => p.trim()),
      axesAmelioration: axesAmelioration.filter(a => a.trim()),
      besoinsFormation: besoinsFormation.filter(b => b.trim()),
      dateCreation: existingEvaluation?.dateCreation || new Date().toISOString(),
      dateModification: new Date().toISOString()
    };
    
    onSave?.(evaluation);
    toast.success(statut === 'Brouillon' ? "Évaluation enregistrée" : "Évaluation envoyée");
    setOpen(false);
  };

  const getStatutIcon = (statut: ObjectifSMART['statut']) => {
    switch (statut) {
      case 'Atteint': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Non atteint': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'En cours': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ClipboardCheck className="mr-2 h-4 w-4" />
          Évaluation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Évaluation Annuelle - {personnel.civilite} {personnel.prenom} {personnel.nom}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <div className="flex-1 space-y-1">
            <Label>Période</Label>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodes.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
            <Label>Type d'évaluation</Label>
            <Select value={typeEvaluation} onValueChange={(v) => setTypeEvaluation(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annuelle">Annuelle</SelectItem>
                <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
                <SelectItem value="Probatoire">Probatoire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Card className="bg-primary/10 border-primary px-4 py-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Note globale</p>
                  <p className="text-xl font-bold text-primary">{noteGlobale.toFixed(1)}/5</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="criteres">Critères d'évaluation</TabsTrigger>
            <TabsTrigger value="objectifs-precedents">Objectifs précédents</TabsTrigger>
            <TabsTrigger value="objectifs-futurs">Nouveaux objectifs</TabsTrigger>
            <TabsTrigger value="appreciation">Appréciation globale</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="criteres" className="mt-0 space-y-4">
              {categoriesEvaluation.map(categorie => (
                <Card key={categorie.id}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">{categorie.nom}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {criteres
                      .filter(c => c.categorie === categorie.id)
                      .map(critere => (
                        <div key={critere.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{critere.critere}</span>
                            <div className="flex gap-1">
                              {niveauxNotation.map(niveau => (
                                <Button
                                  key={niveau.value}
                                  variant={critere.note === niveau.value ? "default" : "outline"}
                                  size="sm"
                                  className={`w-8 h-8 p-0 ${critere.note === niveau.value ? niveau.color : ''}`}
                                  onClick={() => handleNoteCritere(critere.id, niveau.value)}
                                  title={niveau.label}
                                >
                                  {niveau.value}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <Input
                            placeholder="Commentaire (optionnel)"
                            value={critere.commentaire || ""}
                            onChange={(e) => handleCommentaireCritere(critere.id, e.target.value)}
                            className="text-sm h-8"
                          />
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="objectifs-precedents" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Bilan des objectifs de la période précédente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {objectifsPrecedents.map(obj => (
                    <Card key={obj.id} className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatutIcon(obj.statut)}
                            <span className="font-medium">{obj.titre}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={obj.statut === 'Atteint' ? 'default' : 'secondary'}>
                              {obj.statut}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => supprimerObjectif(obj.id, 'precedent')}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{obj.description}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={obj.progression} className="flex-1" />
                          <span className="text-sm font-medium">{obj.progression}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Ajouter un objectif précédent</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Titre de l'objectif"
                        value={nouvelObjectif.titre || ""}
                        onChange={(e) => setNouvelObjectif(prev => ({ ...prev, titre: e.target.value }))}
                      />
                      <Select 
                        value={nouvelObjectif.statut} 
                        onValueChange={(v) => setNouvelObjectif(prev => ({ ...prev, statut: v as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Atteint">Atteint</SelectItem>
                          <SelectItem value="Non atteint">Non atteint</SelectItem>
                          <SelectItem value="En cours">En cours</SelectItem>
                          <SelectItem value="Reporté">Reporté</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Description de l'objectif"
                      value={nouvelObjectif.description || ""}
                      onChange={(e) => setNouvelObjectif(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Progression (%)"
                        min={0}
                        max={100}
                        value={nouvelObjectif.progression || ""}
                        onChange={(e) => setNouvelObjectif(prev => ({ ...prev, progression: parseInt(e.target.value) || 0 }))}
                        className="w-32"
                      />
                      <Button onClick={() => ajouterObjectif('precedent')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="objectifs-futurs" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objectifs SMART pour la prochaine période
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {objectifsFuturs.map(obj => (
                    <Card key={obj.id} className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium">{obj.titre}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => supprimerObjectif(obj.id, 'futur')}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{obj.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><strong>S:</strong> {obj.specifique}</div>
                          <div><strong>M:</strong> {obj.mesurable}</div>
                          <div><strong>A:</strong> {obj.atteignable}</div>
                          <div><strong>R:</strong> {obj.realiste}</div>
                          <div><strong>T:</strong> {obj.temporel}</div>
                          <div><strong>Échéance:</strong> {obj.dateEcheance}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Définir un nouvel objectif SMART</h4>
                    <Input
                      placeholder="Titre de l'objectif"
                      value={nouvelObjectif.titre || ""}
                      onChange={(e) => setNouvelObjectif(prev => ({ ...prev, titre: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Description détaillée"
                      value={nouvelObjectif.description || ""}
                      onChange={(e) => setNouvelObjectif(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-primary">S - Spécifique</Label>
                        <Input
                          placeholder="Quoi précisément ?"
                          value={nouvelObjectif.specifique || ""}
                          onChange={(e) => setNouvelObjectif(prev => ({ ...prev, specifique: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-primary">M - Mesurable</Label>
                        <Input
                          placeholder="Comment mesurer ?"
                          value={nouvelObjectif.mesurable || ""}
                          onChange={(e) => setNouvelObjectif(prev => ({ ...prev, mesurable: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-primary">A - Atteignable</Label>
                        <Input
                          placeholder="Comment y arriver ?"
                          value={nouvelObjectif.atteignable || ""}
                          onChange={(e) => setNouvelObjectif(prev => ({ ...prev, atteignable: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-primary">R - Réaliste</Label>
                        <Input
                          placeholder="Pourquoi réalisable ?"
                          value={nouvelObjectif.realiste || ""}
                          onChange={(e) => setNouvelObjectif(prev => ({ ...prev, realiste: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-primary">T - Temporel</Label>
                        <Input
                          placeholder="Quel délai ?"
                          value={nouvelObjectif.temporel || ""}
                          onChange={(e) => setNouvelObjectif(prev => ({ ...prev, temporel: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Date d'échéance</Label>
                        <Input
                          type="date"
                          value={nouvelObjectif.dateEcheance || ""}
                          onChange={(e) => setNouvelObjectif(prev => ({ ...prev, dateEcheance: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button onClick={() => ajouterObjectif('futur')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter l'objectif
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appreciation" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Appréciation générale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Appréciation générale sur la performance de l'employé..."
                    value={appreciationGenerale}
                    onChange={(e) => setAppreciationGenerale(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Points forts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pointsForts.map((point, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={point}
                        onChange={(e) => {
                          const newPoints = [...pointsForts];
                          newPoints[idx] = e.target.value;
                          setPointsForts(newPoints);
                        }}
                        placeholder={`Point fort ${idx + 1}`}
                      />
                      {idx === pointsForts.length - 1 && (
                        <Button variant="outline" size="icon" onClick={() => setPointsForts([...pointsForts, ""])}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    Axes d'amélioration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {axesAmelioration.map((axe, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={axe}
                        onChange={(e) => {
                          const newAxes = [...axesAmelioration];
                          newAxes[idx] = e.target.value;
                          setAxesAmelioration(newAxes);
                        }}
                        placeholder={`Axe d'amélioration ${idx + 1}`}
                      />
                      {idx === axesAmelioration.length - 1 && (
                        <Button variant="outline" size="icon" onClick={() => setAxesAmelioration([...axesAmelioration, ""])}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Besoins de formation identifiés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {besoinsFormation.map((besoin, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={besoin}
                        onChange={(e) => {
                          const newBesoins = [...besoinsFormation];
                          newBesoins[idx] = e.target.value;
                          setBesoinsFormation(newBesoins);
                        }}
                        placeholder={`Formation ${idx + 1}`}
                      />
                      {idx === besoinsFormation.length - 1 && (
                        <Button variant="outline" size="icon" onClick={() => setBesoinsFormation([...besoinsFormation, ""])}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => {
              const evaluation: Evaluation = {
                id: existingEvaluation?.id || generateEvaluationId(),
                personnelId: personnel.id,
                evaluateurId: "current-user",
                evaluateurNom: "M. Kouamé Jean-Pierre",
                periode,
                dateEvaluation: new Date().toISOString().split('T')[0],
                typeEvaluation,
                statut: 'Brouillon',
                criteres,
                objectifsPrecedents,
                objectifsFuturs,
                noteGlobale,
                appreciationGenerale,
                pointsForts: pointsForts.filter(p => p.trim()),
                axesAmelioration: axesAmelioration.filter(a => a.trim()),
                besoinsFormation: besoinsFormation.filter(b => b.trim()),
                signatureEvaluateur: { date: new Date().toISOString().split('T')[0] },
                dateCreation: existingEvaluation?.dateCreation || new Date().toISOString(),
                dateModification: new Date().toISOString()
              };
              generateEvaluationPDF(evaluation, personnel);
              toast.success("PDF généré avec succès");
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave('Brouillon')}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer brouillon
            </Button>
            <Button onClick={() => handleSave('En cours')}>
              <Send className="mr-2 h-4 w-4" />
              Soumettre l'évaluation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
