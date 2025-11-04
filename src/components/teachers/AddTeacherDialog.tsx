import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddTeacherDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    phone: "",
    email: "",
    status: "",
    diplome: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual teacher creation with Lovable Cloud
    toast({
      title: "Enseignant ajouté",
      description: `${formData.firstName} ${formData.lastName} a été ajouté avec succès.`,
    });
    setOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      subject: "",
      phone: "",
      email: "",
      status: "",
      diplome: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Enseignant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel enseignant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Matière enseignée *</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathématiques</SelectItem>
                  <SelectItem value="french">Français</SelectItem>
                  <SelectItem value="english">Anglais</SelectItem>
                  <SelectItem value="svt">SVT</SelectItem>
                  <SelectItem value="physics">Physique-Chimie</SelectItem>
                  <SelectItem value="history">Histoire-Géographie</SelectItem>
                  <SelectItem value="spanish">Espagnol</SelectItem>
                  <SelectItem value="philosophy">Philosophie</SelectItem>
                  <SelectItem value="pe">EPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="vacataire">Vacataire</SelectItem>
                  <SelectItem value="stagiaire">Stagiaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diplome">Diplôme</Label>
            <Input
              id="diplome"
              placeholder="Ex: Master en Mathématiques"
              value={formData.diplome}
              onChange={(e) => setFormData({ ...formData, diplome: e.target.value })}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Coordonnées</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+225 07 00 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="enseignant@ecole.ci"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter l'enseignant</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
