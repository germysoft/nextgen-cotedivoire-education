import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, Sparkles, MessageSquare, FileText, TrendingUp, Users, Loader2, Send, Bot, Lightbulb, 
  Target, BarChart3, AlertTriangle, GraduationCap, BookOpen, Calendar, CheckCircle2, 
  Download, RefreshCw, Mic, MicOff, Copy, ThumbsUp, ThumbsDown, Zap, PieChart
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "positive" | "negative";
}

interface StudentRisk {
  id: string;
  name: string;
  classe: string;
  riskLevel: number;
  factors: string[];
  recommendation: string;
  trend: "up" | "down" | "stable";
  avgGrade: number;
  absences: number;
}

interface AIReport {
  id: string;
  title: string;
  type: string;
  status: "ready" | "generating" | "scheduled";
  generatedAt?: string;
  downloadUrl?: string;
}

const IntelligenceArtificielle = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant pédagogique IA. Je peux vous aider à analyser les performances des élèves, générer des rapports, identifier les élèves à risque, et répondre à vos questions sur les données scolaires. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedContext, setSelectedContext] = useState("general");
  const scrollRef = useRef<HTMLDivElement>(null);

  const studentsAtRisk: StudentRisk[] = [
    { id: "1", name: "Traoré Sekou", classe: "3ème A", riskLevel: 78, factors: ["Absences répétées", "Chute des notes en maths"], recommendation: "Convocation parents + soutien scolaire", trend: "up", avgGrade: 8.5, absences: 12 },
    { id: "2", name: "Koné Marie", classe: "4ème B", riskLevel: 65, factors: ["Difficultés en français", "Baisse de motivation"], recommendation: "Entretien avec psychologue scolaire", trend: "stable", avgGrade: 9.2, absences: 5 },
    { id: "3", name: "Bamba Paul", classe: "5ème A", riskLevel: 52, factors: ["Problèmes de concentration"], recommendation: "Placement au premier rang", trend: "down", avgGrade: 10.8, absences: 3 },
    { id: "4", name: "Diallo Fatou", classe: "6ème C", riskLevel: 45, factors: ["Difficultés d'adaptation"], recommendation: "Tutorat par élève plus avancé", trend: "down", avgGrade: 11.2, absences: 2 },
    { id: "5", name: "Yao Koffi", classe: "3ème B", riskLevel: 82, factors: ["Absences non justifiées", "Problèmes familiaux"], recommendation: "Signalement assistante sociale", trend: "up", avgGrade: 7.8, absences: 18 },
  ];

  const aiReports: AIReport[] = [
    { id: "1", title: "Synthèse trimestrielle - 6ème", type: "Bilan académique", status: "ready", generatedAt: "2024-01-15 09:30" },
    { id: "2", title: "Analyse comparative inter-classes", type: "Comparaison", status: "ready", generatedAt: "2024-01-14 14:20" },
    { id: "3", title: "Rapport d'assiduité mensuel", type: "Assiduité", status: "generating" },
    { id: "4", title: "Prédictions fin d'année - 3ème", type: "Prédictif", status: "scheduled" },
    { id: "5", title: "Bilan des compétences par matière", type: "Compétences", status: "ready", generatedAt: "2024-01-13 11:00" },
  ];

  const performanceData = [
    { period: "Sep", moyenne: 11.2, objectif: 12 },
    { period: "Oct", moyenne: 11.5, objectif: 12 },
    { period: "Nov", moyenne: 11.8, objectif: 12 },
    { period: "Déc", moyenne: 12.1, objectif: 12 },
    { period: "Jan", moyenne: 12.4, objectif: 12.5 },
  ];

  const radarData = [
    { subject: "Maths", score: 72, fullMark: 100 },
    { subject: "Français", score: 68, fullMark: 100 },
    { subject: "Sciences", score: 75, fullMark: 100 },
    { subject: "Histoire-Géo", score: 80, fullMark: 100 },
    { subject: "Anglais", score: 65, fullMark: 100 },
    { subject: "Sport", score: 85, fullMark: 100 },
  ];

  const aiFeatures = [
    { icon: Target, title: "Prédiction de réussite", desc: "Identifie les élèves à risque", usage: 78, color: "text-red-500" },
    { icon: FileText, title: "Génération de rapports", desc: "Bulletins et synthèses auto", usage: 92, color: "text-blue-500" },
    { icon: MessageSquare, title: "Assistant pédagogique", desc: "Répond aux questions", usage: 65, color: "text-purple-500" },
    { icon: Lightbulb, title: "Recommandations", desc: "Suggestions personnalisées", usage: 84, color: "text-amber-500" },
  ];

  const aiResponses: Record<string, string[]> = {
    general: [
      "D'après l'analyse des données de ce trimestre, la moyenne générale des 6ème est de 12.4/20, en hausse de 0.3 point par rapport au trimestre précédent.",
      "J'ai identifié 15 élèves nécessitant un soutien renforcé en mathématiques, principalement en 3ème A et 4ème B.",
      "Le taux de présence global est de 94.5%. Les classes avec le plus d'absences sont la 3ème B (88%) et la 5ème C (91%).",
      "Voici les recommandations principales : 1) Renforcer le soutien en maths pour la 3ème, 2) Organiser des réunions parents pour les 12 élèves à risque identifiés, 3) Mettre en place des cours de rattrapage en français pour la 4ème B.",
    ],
    mathematiques: [
      "En mathématiques, la moyenne de l'établissement est de 10.8/20. Les points faibles identifiés sont : géométrie (9.2/20), probabilités (9.8/20).",
      "Les 10 meilleurs élèves en maths ont une moyenne de 17.5/20. Je recommande de les inscrire aux olympiades de mathématiques.",
      "Pour améliorer les résultats, je suggère : exercices interactifs sur les fractions, cours de soutien ciblés, utilisation de logiciels de géométrie dynamique.",
    ],
    absences: [
      "Ce mois, 847 heures d'absence ont été enregistrées. 72% sont justifiées (maladie principalement).",
      "Les 5 élèves avec le plus d'absences : Yao Koffi (18 jours), Traoré Sekou (12 jours), Konan Paul (9 jours).",
      "Pattern détecté : augmentation des absences le vendredi après-midi (+35% vs autres jours). Recommandation : enquêter sur les cours programmés.",
    ],
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    setTimeout(() => {
      const contextResponses = aiResponses[selectedContext] || aiResponses.general;
      const randomResponse = contextResponses[Math.floor(Math.random() * contextResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
    toast.success(feedback === "positive" ? "Merci pour votre retour positif !" : "Nous améliorerons cette réponse.");
  };

  const handleGenerateReport = (report: AIReport) => {
    if (report.status === "ready") {
      toast.success(`Téléchargement de "${report.title}"`);
    } else {
      toast.info("Rapport en cours de génération...");
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copié dans le presse-papier");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Intelligence Artificielle</h1>
          <p className="text-muted-foreground">Analyse prédictive et assistance intelligente</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
            <Sparkles className="h-3 w-3 mr-1" />IA Active
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Zap className="h-3 w-3 mr-1" />1,247 analyses ce mois
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {aiFeatures.map((f, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 bg-primary/10 rounded-lg`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
              <Progress value={f.usage} className="h-2" />
              <p className="text-xs text-right mt-1 text-muted-foreground">{f.usage}% utilisé</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="assistant" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assistant">
            <Bot className="h-4 w-4 mr-2" />Assistant IA
          </TabsTrigger>
          <TabsTrigger value="predictions">
            <Target className="h-4 w-4 mr-2" />Prédictions
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />Rapports Auto
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />Analyses
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assistant">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />Assistant Pédagogique IA
                </CardTitle>
                <Select value={selectedContext} onValueChange={setSelectedContext}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Contexte général</SelectItem>
                    <SelectItem value="mathematiques">Mathématiques</SelectItem>
                    <SelectItem value="absences">Absences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>Posez vos questions sur les données scolaires</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea ref={scrollRef} className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {msg.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {msg.role === "assistant" && (
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyMessage(msg.content)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`h-6 w-6 ${msg.feedback === "positive" ? "text-green-500" : ""}`}
                                onClick={() => handleFeedback(msg.id, "positive")}
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`h-6 w-6 ${msg.feedback === "negative" ? "text-red-500" : ""}`}
                                onClick={() => handleFeedback(msg.id, "negative")}
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Analyse en cours...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Textarea 
                  value={inputMessage} 
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Ex: Quels élèves nécessitent un soutien en mathématiques ?" 
                  rows={2}
                  className="resize-none"
                />
                <div className="flex flex-col gap-2">
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsListening(!isListening)}
                    className={isListening ? "bg-red-500/10 text-red-500" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Élèves à Risque Identifiés
                </CardTitle>
                <CardDescription>Analyse prédictive basée sur 12 indicateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentsAtRisk.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.classe}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={student.riskLevel > 70 ? "destructive" : student.riskLevel > 50 ? "secondary" : "outline"}>
                            {student.trend === "up" ? "↗" : student.trend === "down" ? "↘" : "→"} {student.riskLevel}% risque
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Moyenne:</span>
                          <span className="ml-1 font-medium">{student.avgGrade}/20</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Absences:</span>
                          <span className="ml-1 font-medium">{student.absences} jours</span>
                        </div>
                        <div className="col-span-1">
                          <Progress value={100 - student.riskLevel} className="h-2" />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-1">Facteurs:</p>
                        <div className="flex flex-wrap gap-1">
                          {student.factors.map((factor, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{factor}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-blue-500/10 rounded-lg">
                        <p className="text-sm"><strong>Recommandation IA:</strong> {student.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statistiques Prédictives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                    <span className="text-sm">Élèves à risque élevé</span>
                    <Badge variant="destructive">5</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg">
                    <span className="text-sm">Surveillance recommandée</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <span className="text-sm">Progression positive</span>
                    <Badge className="bg-green-500">423</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tendance globale</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                      <YAxis domain={[10, 14]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="moyenne" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="objectif" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rapports Générés par l'IA</CardTitle>
                <CardDescription>Documents automatiques basés sur vos données</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          report.status === "ready" ? "bg-green-500/10" : 
                          report.status === "generating" ? "bg-amber-500/10" : "bg-muted"
                        }`}>
                          {report.status === "ready" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                           report.status === "generating" ? <Loader2 className="h-4 w-4 text-amber-500 animate-spin" /> :
                           <Calendar className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{report.type}</Badge>
                            {report.generatedAt && <span className="text-xs text-muted-foreground">{report.generatedAt}</span>}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={report.status === "ready" ? "default" : "outline"}
                        onClick={() => handleGenerateReport(report)}
                        disabled={report.status === "generating"}
                      >
                        {report.status === "ready" ? <><Download className="h-4 w-4 mr-1" />Télécharger</> :
                         report.status === "generating" ? "En cours..." : "Programmé"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Générer un Nouveau Rapport</CardTitle>
                <CardDescription>Créez un rapport personnalisé avec l'IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: GraduationCap, label: "Bilan académique", desc: "Par classe ou niveau" },
                    { icon: Users, label: "Analyse des élèves", desc: "Performances individuelles" },
                    { icon: TrendingUp, label: "Évolution", desc: "Comparaison périodes" },
                    { icon: BookOpen, label: "Par matière", desc: "Analyse disciplinaire" },
                  ].map((item, i) => (
                    <Button key={i} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => toast.success(`Génération du rapport "${item.label}" lancée`)}>
                      <item.icon className="h-6 w-6" />
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.desc}</span>
                    </Button>
                  ))}
                </div>
                <Button className="w-full" onClick={() => toast.success("Rapport personnalisé en cours de génération...")}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer rapport personnalisé
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Performances</CardTitle>
                <CardDescription>Moyenne générale vs objectif</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[10, 14]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="moyenne" stroke="hsl(var(--primary))" strokeWidth={2} name="Moyenne réelle" />
                    <Line type="monotone" dataKey="objectif" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Objectif" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profil par Matière</CardTitle>
                <CardDescription>Scores moyens de l'établissement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Insights IA</CardTitle>
                <CardDescription>Observations automatiques générées par l'analyse des données</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: TrendingUp, title: "Tendance positive", desc: "La moyenne générale a augmenté de 1.2 points ce trimestre", color: "text-green-500 bg-green-500/10" },
                    { icon: AlertTriangle, title: "Point d'attention", desc: "5 élèves en 3ème nécessitent un suivi renforcé en maths", color: "text-amber-500 bg-amber-500/10" },
                    { icon: Lightbulb, title: "Recommandation", desc: "Organiser des sessions de tutorat entre élèves pourrait améliorer les résultats de 8%", color: "text-blue-500 bg-blue-500/10" },
                  ].map((insight, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className={`inline-flex p-2 rounded-lg ${insight.color} mb-3`}>
                        <insight.icon className="h-5 w-5" />
                      </div>
                      <h4 className="font-medium mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligenceArtificielle;
