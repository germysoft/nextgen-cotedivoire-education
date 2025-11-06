import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function ParentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login (mock)
    setTimeout(() => {
      if (email && code) {
        toast.success("Connexion réussie!");
        navigate("/parent-portal");
      } else {
        toast.error("Veuillez remplir tous les champs");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Portail Parents & Élèves</CardTitle>
            <CardDescription className="mt-2">
              NextGen Éducation - Accès sécurisé au suivi scolaire
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Matricule</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="exemple@email.ci ou 66800001A"
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
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
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

            {/* Demo credentials */}
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-4 pb-3">
                <p className="text-xs font-medium mb-2">Accès de démonstration:</p>
                <p className="text-xs text-muted-foreground">Email: parent@demo.ci</p>
                <p className="text-xs text-muted-foreground">Code: 123456</p>
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
