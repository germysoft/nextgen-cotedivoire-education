import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, BarChart3, MessageSquare, Settings, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des Élèves",
    description: "Inscriptions, dossiers complets, suivi personnalisé et historique scolaire",
  },
  {
    icon: GraduationCap,
    title: "Gestion des Enseignants",
    description: "Personnel, pointage, planning et évaluations",
  },
  {
    icon: BookOpen,
    title: "Notes et Bulletins",
    description: "Saisie des notes, calculs automatiques, bulletins conformes MENA",
  },
  {
    icon: BarChart3,
    title: "Comptabilité",
    description: "Suivi financier complet, paiements, quittances et rapports",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description: "Messagerie interne, SMS professionnels, notifications automatiques",
  },
  {
    icon: Settings,
    title: "Administration",
    description: "Gestion multi-rôles, sécurité, audit trail et paramètres",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">NextGen Éducation</h1>
              <p className="text-xs text-muted-foreground">Gestion Scolaire</p>
            </div>
          </div>
          <Button onClick={() => navigate("/auth")}>
            Se connecter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Plateforme de Gestion Intégrale
            <br />
            <span className="text-primary">pour Établissements Scolaires</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Solution moderne et complète conforme aux standards du Ministère de l'Éducation Nationale
            de Côte d'Ivoire (MENA)
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Accéder à la plateforme
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/parent-login")}>
              Portail Parents & Élèves
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Modules Fonctionnels</h3>
          <p className="text-muted-foreground">
            Une suite complète d'outils pour digitaliser votre établissement
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/80">Conforme MENA</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-primary-foreground/80">Langues (FR/EN/ES)</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">Accès Sécurisé</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-primary-foreground/80">Utilisateurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 NextGen Éducation - Tous droits réservés</p>
          <p className="mt-2">Conforme aux standards du MENA - Côte d'Ivoire</p>
        </div>
      </footer>
    </div>
  );
}
