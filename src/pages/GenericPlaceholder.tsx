import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GenericPlaceholderProps {
  title: string;
  description: string;
}

export default function GenericPlaceholder({ title, description }: GenericPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <Alert>
        <Construction className="h-4 w-4" />
        <AlertTitle>Module en développement</AlertTitle>
        <AlertDescription>
          Cette fonctionnalité est en cours de développement et sera bientôt disponible.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Construction className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">Module en cours de développement</p>
            <p className="text-sm">Cette page sera bientôt fonctionnelle avec toutes ses fonctionnalités.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
