import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, MapPin, Briefcase, GraduationCap, CreditCard, 
  FileText, Heart, Phone, Mail, Calendar, Award, Clock,
  Edit, Download, Printer, TrendingUp, Star, Building2
} from "lucide-react";
import { Personnel } from "@/types/personnel";

interface PersonnelProfileProps {
  personnel: Personnel;
  open: boolean;
  onClose: () => void;
}

export function PersonnelProfile({ personnel, open, onClose }: PersonnelProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getInitials = () => {
    return `${personnel.prenom?.[0] || ''}${personnel.nom?.[0] || ''}`.toUpperCase();
  };

  const calculateAge = (dateNaissance: string) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const totalSalaire = personnel.salaireBase + (personnel.primes?.reduce((acc, p) => 
    p.frequence === 'Mensuel' ? acc + p.montant : acc, 0) || 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Dossier Personnel</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-1" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          {/* Header Card */}
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-28 w-28">
                  <AvatarImage src={personnel.photo} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {personnel.civilite} {personnel.prenom} {personnel.nom}
                      </h2>
                      <p className="text-lg text-muted-foreground">{personnel.poste}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="gap-1">
                          <Building2 className="h-3 w-3" />
                          {personnel.departement}
                        </Badge>
                        <Badge variant={personnel.statut === 'Permanent' ? 'default' : 'secondary'}>
                          {personnel.statut}
                        </Badge>
                        <Badge variant="outline">{personnel.typeContrat}</Badge>
                        {personnel.actif ? (
                          <Badge className="bg-green-500">Actif</Badge>
                        ) : (
                          <Badge variant="destructive">Inactif</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Matricule</p>
                      <p className="font-mono font-bold text-lg">{personnel.matricule}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{personnel.anciennete}</p>
                      <p className="text-xs text-muted-foreground">Années d'ancienneté</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{calculateAge(personnel.dateNaissance)}</p>
                      <p className="text-xs text-muted-foreground">Ans</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{personnel.soldeCongesAnnuels}</p>
                      <p className="text-xs text-muted-foreground">Jours de congés</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {personnel.noteEvaluation ? `${personnel.noteEvaluation}/20` : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">Dernière évaluation</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="personnel">État civil</TabsTrigger>
              <TabsTrigger value="professionnel">Emploi</TabsTrigger>
              <TabsTrigger value="formation">Formation</TabsTrigger>
              <TabsTrigger value="financier">Financier</TabsTrigger>
              <TabsTrigger value="historique">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{personnel.telephone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{personnel.email}</span>
                    </div>
                    {personnel.emailProfessionnel && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{personnel.emailProfessionnel}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adresse
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>{personnel.adresse}</p>
                    <p>{personnel.ville}, {personnel.pays}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Contact d'urgence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="font-medium">{personnel.contactUrgenceNom}</p>
                    <p className="text-muted-foreground">{personnel.contactUrgenceLien}</p>
                    <p>{personnel.contactUrgenceTelephone}</p>
                  </CardContent>
                </Card>
              </div>

              {personnel.categoriePersonnel === 'Enseignant' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Affectation Enseignant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Matières</p>
                        <div className="flex flex-wrap gap-1">
                          {personnel.matieresPrincipales?.map((m, i) => (
                            <Badge key={i} variant="secondary">{m}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Classes</p>
                        <div className="flex flex-wrap gap-1">
                          {personnel.classesAffectees?.map((c, i) => (
                            <Badge key={i} variant="outline">{c}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Charge horaire</p>
                        <p className="text-2xl font-bold">{personnel.chargeHoraire}h<span className="text-sm font-normal text-muted-foreground">/semaine</span></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Diplômes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {personnel.diplomes?.slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{d.intitule}</p>
                          <p className="text-xs text-muted-foreground">{d.etablissement}</p>
                        </div>
                        <Badge variant="outline">{d.anneeObtention}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Compétences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {personnel.competences?.map((c, i) => (
                        <Badge key={i} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Langues</p>
                      <div className="space-y-1">
                        {personnel.languesParles?.map((l, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span>{l.langue}</span>
                            <Badge variant="outline" className="text-xs">{l.niveau}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {personnel.observations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Observations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{personnel.observations}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="personnel" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date de naissance</p>
                        <p className="font-medium">{new Date(personnel.dateNaissance).toLocaleDateString('fr-FR')} ({calculateAge(personnel.dateNaissance)} ans)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lieu de naissance</p>
                        <p className="font-medium">{personnel.lieuNaissance}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Nationalité</p>
                        <p className="font-medium">{personnel.nationalite}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sexe</p>
                        <p className="font-medium">{personnel.sexe}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Situation matrimoniale</p>
                        <p className="font-medium">{personnel.situationMatrimoniale}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Nombre d'enfants</p>
                        <p className="font-medium">{personnel.nombreEnfants}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Groupe sanguin</p>
                        <p className="font-medium">{personnel.groupeSanguin || '-'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pièces d'identité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-medium mb-2">Carte Nationale d'Identité</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-muted-foreground text-xs">Numéro</p>
                            <p className="font-mono">{personnel.numeroCNI}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Délivrée le</p>
                            <p>{new Date(personnel.dateDelivranceCNI).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Lieu</p>
                            <p>{personnel.lieuDelivranceCNI}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Expire le</p>
                            <p>{personnel.dateExpirationCNI ? new Date(personnel.dateExpirationCNI).toLocaleDateString('fr-FR') : '-'}</p>
                          </div>
                        </div>
                      </div>
                      {personnel.numeroPasseport && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="font-medium mb-2">Passeport</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-muted-foreground text-xs">Numéro</p>
                              <p className="font-mono">{personnel.numeroPasseport}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Expire le</p>
                              <p>{personnel.dateExpirationPasseport ? new Date(personnel.dateExpirationPasseport).toLocaleDateString('fr-FR') : '-'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="professionnel" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contrat actuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Poste</p>
                        <p className="font-medium">{personnel.poste}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Département</p>
                        <p className="font-medium">{personnel.departement}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Catégorie</p>
                        <p className="font-medium">{personnel.categoriePersonnel}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Statut</p>
                        <Badge variant={personnel.statut === 'Permanent' ? 'default' : 'secondary'}>
                          {personnel.statut}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Type de contrat</p>
                        <p className="font-medium">{personnel.typeContrat}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Heures/semaine</p>
                        <p className="font-medium">{personnel.heuresHebdo}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date d'embauche</p>
                        <p className="font-medium">{new Date(personnel.dateEmbauche).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ancienneté</p>
                        <p className="font-medium">{personnel.anciennete} ans</p>
                      </div>
                      {personnel.dateFinContrat && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Fin de contrat</p>
                          <p className="font-medium text-orange-600">{new Date(personnel.dateFinContrat).toLocaleDateString('fr-FR')}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Congés</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Congés annuels</span>
                        <span className="font-medium">{personnel.soldeCongesAnnuels} jours</span>
                      </div>
                      <Progress value={(personnel.soldeCongesAnnuels / 30) * 100} />
                    </div>
                    {personnel.soldeRTT !== undefined && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">RTT</span>
                          <span className="font-medium">{personnel.soldeRTT} jours</span>
                        </div>
                        <Progress value={(personnel.soldeRTT / 12) * 100} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {personnel.derniereEvaluation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Dernière évaluation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{personnel.noteEvaluation}/20</p>
                        <p className="text-sm text-muted-foreground">Note globale</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(personnel.derniereEvaluation).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="formation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Diplômes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Intitulé</TableHead>
                        <TableHead>Établissement</TableHead>
                        <TableHead>Année</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Mention</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {personnel.diplomes?.map((d, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{d.intitule}</TableCell>
                          <TableCell>{d.etablissement}</TableCell>
                          <TableCell>{d.anneeObtention}</TableCell>
                          <TableCell><Badge variant="outline">{d.niveau}</Badge></TableCell>
                          <TableCell>{d.mention || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {personnel.certifications && personnel.certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Certification</TableHead>
                          <TableHead>Organisme</TableHead>
                          <TableHead>Date d'obtention</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {personnel.certifications.map((c, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{c.nom}</TableCell>
                            <TableCell>{c.organisme}</TableCell>
                            <TableCell>{new Date(c.dateObtention).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>
                              <Badge variant={c.valide ? 'default' : 'destructive'}>
                                {c.valide ? 'Valide' : 'Expirée'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {personnel.historiqueFormations && personnel.historiqueFormations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Formations suivies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Formation</TableHead>
                          <TableHead>Organisme</TableHead>
                          <TableHead>Période</TableHead>
                          <TableHead>Durée</TableHead>
                          <TableHead>Certifiante</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {personnel.historiqueFormations.map((f, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{f.intitule}</TableCell>
                            <TableCell>{f.organisme}</TableCell>
                            <TableCell>
                              {new Date(f.dateDebut).toLocaleDateString('fr-FR')} - {new Date(f.dateFin).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>{f.dureeHeures}h</TableCell>
                            <TableCell>
                              <Badge variant={f.certifiante ? 'default' : 'secondary'}>
                                {f.certifiante ? 'Oui' : 'Non'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="financier" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Salaire de base</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{personnel.salaireBase.toLocaleString()} <span className="text-sm font-normal">FCFA</span></p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Primes mensuelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {(personnel.primes?.filter(p => p.frequence === 'Mensuel').reduce((acc, p) => acc + p.montant, 0) || 0).toLocaleString()}
                      <span className="text-sm font-normal"> FCFA</span>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Total mensuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">
                      {totalSalaire.toLocaleString()} <span className="text-sm font-normal">FCFA</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {personnel.primes && personnel.primes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Détail des primes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type de prime</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Fréquence</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {personnel.primes.map((p, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{p.type}</TableCell>
                            <TableCell>{p.montant.toLocaleString()} FCFA</TableCell>
                            <TableCell><Badge variant="outline">{p.frequence}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Coordonnées bancaires</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mode de paiement</span>
                      <span className="font-medium">{personnel.modePaiement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Banque</span>
                      <span className="font-medium">{personnel.banque || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">N° de compte</span>
                      <span className="font-mono">{personnel.numeroCompte || '-'}</span>
                    </div>
                    {personnel.ribIban && (
                      <div>
                        <span className="text-muted-foreground">RIB/IBAN</span>
                        <p className="font-mono text-xs mt-1">{personnel.ribIban}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informations sociales & fiscales</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">N° Sécurité sociale</span>
                      <span className="font-mono">{personnel.numeroSecuriteSociale || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">N° CNPS</span>
                      <span className="font-mono">{personnel.numeroCNPS || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Situation fiscale</span>
                      <span className="font-medium">{personnel.situationFiscale || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre de parts</span>
                      <span className="font-medium">{personnel.nombrePartsImpots || '-'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="historique" className="space-y-4">
              {personnel.historiquePostes && personnel.historiquePostes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Historique des postes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6 border-l-2 border-muted space-y-4">
                      {personnel.historiquePostes.map((h, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary" />
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{h.poste}</p>
                              <Badge variant="outline">{h.departement}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(h.dateDebut).toLocaleDateString('fr-FR')} - {new Date(h.dateFin).toLocaleDateString('fr-FR')}
                            </p>
                            {h.motifChangement && (
                              <p className="text-sm text-primary mt-1">{h.motifChangement}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="relative">
                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-500" />
                        <div className="p-3 bg-green-50 rounded-lg dark:bg-green-950">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-green-700 dark:text-green-300">{personnel.poste}</p>
                            <Badge>Actuel</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Depuis le {new Date(personnel.dateEmbauche).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {personnel.documents?.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{d.nom}</p>
                            <p className="text-xs text-muted-foreground">{d.type} - {new Date(d.dateAjout).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Métadonnées</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dossier créé le</span>
                    <span>{new Date(personnel.dateCreation).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créé par</span>
                    <span>{personnel.creePar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dernière modification</span>
                    <span>{new Date(personnel.dateModification).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modifié par</span>
                    <span>{personnel.modifiePar}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
