import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    class: "",
    gender: "",
    parentPhone: "",
    parentEmail: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual student creation with Lovable Cloud
    toast({
      title: "Élève ajouté",
      description: `${formData.firstName} ${formData.lastName} a été inscrit avec succès.`,
    });
    setOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      class: "",
      gender: "",
      parentPhone: "",
      parentEmail: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Élève
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inscription d'un nouvel élève</DialogTitle>
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
              <Label htmlFor="dateOfBirth">Date de naissance *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Sexe *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Classe *</Label>
            <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6A">6ème A</SelectItem>
                <SelectItem value="6B">6ème B</SelectItem>
                <SelectItem value="5A">5ème A</SelectItem>
                <SelectItem value="5B">5ème B</SelectItem>
                <SelectItem value="4A">4ème A</SelectItem>
                <SelectItem value="3A">3ème A</SelectItem>
                <SelectItem value="2C">2nde C</SelectItem>
                <SelectItem value="1D">1ère D</SelectItem>
                <SelectItem value="TD">Tle D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Informations du Parent/Tuteur</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Téléphone *</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  placeholder="+225 07 00 00 00"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="parent@email.com"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Inscrire l'élève</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
