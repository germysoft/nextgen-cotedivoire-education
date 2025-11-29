import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, AlertCircle } from "lucide-react";

export default function JurysExamens() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Jurys & Examinateurs
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des jurys et attribution par épreuve
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Jury
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Jurys Constitués</CardTitle>
          <CardDescription>BEPC 2025 - Session 1</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Configuration des jurys en cours de développement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}