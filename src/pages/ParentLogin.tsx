import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function ParentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "parent" && user.role !== "eleve") {
        toast.error("Ce compte n'est pas un compte parent/élève.");
        return;
      }
      toast.success("Connexion réussie !");
      navigate("/parent-portal");
    } catch {
      toast.error("Email ou code d'accès incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Portail Parents & Élèves</h1>
          <p className="text-muted-foreground mt-2">
            NextGen Éducation - Accès sécurisé au suivi scolaire
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous avec votre identifiant et code d'accès
            </CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="parent@demo.ci"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code d'accès</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  type="password"
                  placeholder="Code reçu par SMS"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <Button variant="link" size="sm" type="button">
                Code oublié?
              </Button>
              <p className="text-xs text-muted-foreground">
                Contactez l'administration pour obtenir votre code d'accès
              </p>
            </div>

            {/* Identifiants de démonstration (créés par le seed du backend) */}
            <div className="bg-muted/30 border border-dashed border-border rounded-lg p-4">
              <p className="text-xs font-medium mb-2 text-foreground">Accès de démonstration:</p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Email:</span> parent@demo.ci
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Code:</span> ChangeMoi123!
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
