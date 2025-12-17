import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkles, MessageSquare, FileText, TrendingUp, Users, Loader2, Send, Bot, Lightbulb, Target, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const IntelligenceArtificielle = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleAIRequest = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setResponse("Basé sur l'analyse des données de performance, je recommande:\n\n1. **Renforcement en Mathématiques** pour les élèves de 3ème A - moyenne de 11.2/20\n2. **Soutien personnalisé** pour 12 élèves identifiés à risque\n3. **Programme d'excellence** pour les 15 meilleurs élèves\n\nCes recommandations sont basées sur l'analyse de 1,247 bulletins et 3,891 notes du trimestre.");
      setIsLoading(false);
      toast.success("Analyse IA terminée");
    }, 2000);
  };

  const aiFeatures = [
    { icon: Target, title: "Prédiction de réussite", desc: "Identifie les élèves à risque", usage: 78 },
    { icon: FileText, title: "Génération de rapports", desc: "Bulletins et synthèses auto", usage: 92 },
    { icon: MessageSquare, title: "Assistant pédagogique", desc: "Répond aux questions", usage: 65 },
    { icon: Lightbulb, title: "Recommandations", desc: "Suggestions personnalisées", usage: 84 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intelligence Artificielle</h1>
          <p className="text-muted-foreground">Analyse prédictive et assistance intelligente</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500"><Sparkles className="h-3 w-3 mr-1" />IA Active</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {aiFeatures.map((f, i) => (
          <Card key={i}><CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg"><f.icon className="h-5 w-5 text-primary" /></div>
              <div><p className="font-medium">{f.title}</p><p className="text-xs text-muted-foreground">{f.desc}</p></div>
            </div>
            <Progress value={f.usage} className="h-2" />
            <p className="text-xs text-right mt-1 text-muted-foreground">{f.usage}% utilisé</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="assistant">
        <TabsList><TabsTrigger value="assistant">Assistant IA</TabsTrigger><TabsTrigger value="predictions">Prédictions</TabsTrigger><TabsTrigger value="reports">Rapports auto</TabsTrigger></TabsList>
        
        <TabsContent value="assistant">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" />Assistant Pédagogique</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Posez votre question... Ex: Quels élèves nécessitent un soutien en mathématiques?" rows={3} />
              <div className="flex gap-2">
                <Button onClick={handleAIRequest} disabled={isLoading} className="flex-1">
                  {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyse...</> : <><Send className="h-4 w-4 mr-2" />Analyser</>}
                </Button>
              </div>
              {response && <div className="p-4 bg-muted rounded-lg whitespace-pre-line">{response}</div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card><CardHeader><CardTitle>Élèves à risque identifiés</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Traoré Sekou - 3ème A - Risque: 78%", "Koné Marie - 4ème B - Risque: 65%", "Bamba Paul - 5ème A - Risque: 52%"].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{s.split(" - Risque")[0]}</span>
                    <Badge variant="destructive">{s.split("Risque: ")[1]}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card><CardHeader><CardTitle>Génération automatique de rapports</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Synthèse trimestrielle - 6ème", "Analyse comparative inter-classes", "Rapport d'assiduité mensuel"].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{r}</span>
                  <Button size="sm" onClick={() => toast.success("Rapport généré")}><Sparkles className="h-4 w-4 mr-2" />Générer</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligenceArtificielle;
