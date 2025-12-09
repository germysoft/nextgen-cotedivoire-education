import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Printer, Calculator, Building2, User, Calendar } from "lucide-react";
import { Personnel } from "@/types/personnel";
import { generatePayslipPDF } from "./PayslipPDFGenerator";
import { toast } from "sonner";

interface PayslipGeneratorProps {
  personnel: Personnel;
}

// Taux CNPS Côte d'Ivoire 2024
const CNPS_RATES = {
  retraite: {
    employeur: 0.0775, // 7.75%
    employe: 0.0635, // 6.35%
    plafond: 2700000, // Plafond mensuel
  },
  prestationsFamiliales: {
    employeur: 0.055, // 5.5%
    employe: 0,
    plafond: 70000 * 12, // Plafond annuel
  },
  accidentsTravail: {
    employeur: 0.02, // 2% à 5% selon risque - on prend 2% pour établissement scolaire
    employe: 0,
    plafond: null,
  },
};

// Barème ITS (Impôt sur Traitements et Salaires) Côte d'Ivoire
const ITS_BRACKETS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 548000, rate: 0.10 },
  { min: 548001, max: 979000, rate: 0.15 },
  { min: 979001, max: 1519000, rate: 0.20 },
  { min: 1519001, max: 2644000, rate: 0.25 },
  { min: 2644001, max: 4669000, rate: 0.30 },
  { min: 4669001, max: 10106000, rate: 0.35 },
  { min: 10106001, max: Infinity, rate: 0.40 },
];

// Contribution Nationale (CN) - 1.5% du salaire net imposable
const CN_RATE = 0.015;

// IGR (Impôt Général sur le Revenu) - abattement forfaitaire
const IGR_ABATTEMENT = 0.20; // 20% d'abattement

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export interface PayslipData {
  personnel: Personnel;
  mois: string;
  annee: number;
  salaireBase: number;
  primes: { libelle: string; montant: number }[];
  indemnites: { libelle: string; montant: number }[];
  heuresSupp: { heures: number; taux: number; montant: number };
  retenues: { libelle: string; montant: number }[];
  // Calculs
  brutTotal: number;
  cnpsEmploye: number;
  cnpsEmployeur: number;
  its: number;
  cn: number;
  netImposable: number;
  netAPayer: number;
  // Détails CNPS
  cnpsRetraiteEmploye: number;
  cnpsRetraiteEmployeur: number;
  cnpsPFEmployeur: number;
  cnpsATEmployeur: number;
}

function calculatePayslip(personnel: Personnel, mois: string, annee: number): PayslipData {
  const salaireBase = personnel.salaireBase;
  
  // Primes du personnel
  const primes = personnel.primes?.map(p => ({
    libelle: p.type,
    montant: p.frequence === 'Mensuel' ? p.montant : 
             p.frequence === 'Trimestriel' ? p.montant / 3 :
             p.frequence === 'Annuel' ? p.montant / 12 : 0
  })) || [];

  // Indemnités fixes selon le poste
  const indemnites: { libelle: string; montant: number }[] = [];
  if (personnel.categoriePersonnel === 'Direction') {
    indemnites.push({ libelle: "Indemnité de fonction", montant: 150000 });
    indemnites.push({ libelle: "Indemnité de logement", montant: 100000 });
  } else if (personnel.categoriePersonnel === 'Enseignant') {
    indemnites.push({ libelle: "Indemnité pédagogique", montant: 50000 });
    if (personnel.chargeHoraire && personnel.chargeHoraire > 18) {
      indemnites.push({ libelle: "Indemnité surcharge horaire", montant: (personnel.chargeHoraire - 18) * 5000 });
    }
  }
  indemnites.push({ libelle: "Indemnité de transport", montant: 30000 });

  // Heures supplémentaires (simulé)
  const heuresSupp = { heures: 0, taux: 0, montant: 0 };

  // Calcul du brut total
  const totalPrimes = primes.reduce((sum, p) => sum + p.montant, 0);
  const totalIndemnites = indemnites.reduce((sum, i) => sum + i.montant, 0);
  const brutTotal = salaireBase + totalPrimes + totalIndemnites + heuresSupp.montant;

  // Calcul CNPS Employé
  const baseRetraite = Math.min(brutTotal, CNPS_RATES.retraite.plafond);
  const cnpsRetraiteEmploye = Math.round(baseRetraite * CNPS_RATES.retraite.employe);
  const cnpsEmploye = cnpsRetraiteEmploye;

  // Calcul CNPS Employeur
  const cnpsRetraiteEmployeur = Math.round(baseRetraite * CNPS_RATES.retraite.employeur);
  const cnpsPFEmployeur = Math.round(brutTotal * CNPS_RATES.prestationsFamiliales.employeur);
  const cnpsATEmployeur = Math.round(brutTotal * CNPS_RATES.accidentsTravail.employeur);
  const cnpsEmployeur = cnpsRetraiteEmployeur + cnpsPFEmployeur + cnpsATEmployeur;

  // Calcul du net imposable (après abattement)
  const netImposableAvantAbattement = brutTotal - cnpsEmploye;
  const abattement = Math.round(netImposableAvantAbattement * IGR_ABATTEMENT);
  const netImposable = netImposableAvantAbattement - abattement;

  // Calcul ITS (sur base annuelle puis mensuel)
  const netImposableAnnuel = netImposable * 12;
  let itsAnnuel = 0;
  for (const bracket of ITS_BRACKETS) {
    if (netImposableAnnuel > bracket.min) {
      const taxableInBracket = Math.min(netImposableAnnuel, bracket.max) - bracket.min;
      itsAnnuel += taxableInBracket * bracket.rate;
    }
  }
  const its = Math.round(itsAnnuel / 12);

  // Contribution Nationale
  const cn = Math.round(netImposable * CN_RATE);

  // Retenues diverses
  const retenues: { libelle: string; montant: number }[] = [];
  
  // Net à payer
  const totalRetenues = cnpsEmploye + its + cn + retenues.reduce((sum, r) => sum + r.montant, 0);
  const netAPayer = brutTotal - totalRetenues;

  return {
    personnel,
    mois,
    annee,
    salaireBase,
    primes,
    indemnites,
    heuresSupp,
    retenues,
    brutTotal,
    cnpsEmploye,
    cnpsEmployeur,
    its,
    cn,
    netImposable,
    netAPayer,
    cnpsRetraiteEmploye,
    cnpsRetraiteEmployeur,
    cnpsPFEmployeur,
    cnpsATEmployeur,
  };
}

export function PayslipGenerator({ personnel }: PayslipGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [mois, setMois] = useState<string>(MONTHS[new Date().getMonth()]);
  const [annee, setAnnee] = useState<number>(new Date().getFullYear());
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);

  const handleGenerate = () => {
    const data = calculatePayslip(personnel, mois, annee);
    setPayslipData(data);
  };

  const handleDownloadPDF = () => {
    if (payslipData) {
      generatePayslipPDF(payslipData);
      toast.success("Fiche de paie téléchargée avec succès");
    }
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Fiche de paie
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Génération de Fiche de Paie
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection période */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Période de paie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Employé</Label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{personnel.civilite} {personnel.prenom} {personnel.nom}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Mois</Label>
                  <Select value={mois} onValueChange={setMois}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Année</Label>
                  <Select value={annee.toString()} onValueChange={(v) => setAnnee(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(y => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleGenerate} className="mt-4 w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Calculer la fiche de paie
              </Button>
            </CardContent>
          </Card>

          {/* Aperçu fiche de paie */}
          {payslipData && (
            <>
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Aperçu de la Fiche de Paie - {mois} {annee}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* En-tête employé */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Employé</p>
                      <p className="font-semibold">{personnel.civilite} {personnel.prenom} {personnel.nom}</p>
                      <p className="text-sm">Matricule: {personnel.matricule}</p>
                      <p className="text-sm">N° CNPS: {personnel.numeroCNPS || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Poste</p>
                      <p className="font-semibold">{personnel.poste}</p>
                      <p className="text-sm">{personnel.departement}</p>
                      <p className="text-sm">Contrat: {personnel.typeContrat}</p>
                    </div>
                  </div>

                  {/* Gains */}
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">GAINS</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Libellé</TableHead>
                          <TableHead className="text-right">Base</TableHead>
                          <TableHead className="text-right">Taux</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Salaire de base</TableCell>
                          <TableCell className="text-right">{payslipData.salaireBase.toLocaleString()}</TableCell>
                          <TableCell className="text-right">-</TableCell>
                          <TableCell className="text-right font-medium">{payslipData.salaireBase.toLocaleString()}</TableCell>
                        </TableRow>
                        {payslipData.primes.map((prime, idx) => (
                          <TableRow key={`prime-${idx}`}>
                            <TableCell>{prime.libelle}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right font-medium">{prime.montant.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        {payslipData.indemnites.map((ind, idx) => (
                          <TableRow key={`ind-${idx}`}>
                            <TableCell>{ind.libelle}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right font-medium">{ind.montant.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-green-50 dark:bg-green-950">
                          <TableCell colSpan={3} className="font-bold">TOTAL BRUT</TableCell>
                          <TableCell className="text-right font-bold text-green-600">{payslipData.brutTotal.toLocaleString()} FCFA</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <Separator />

                  {/* Cotisations et Retenues */}
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">COTISATIONS & RETENUES</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Libellé</TableHead>
                          <TableHead className="text-right">Base</TableHead>
                          <TableHead className="text-right">Part Salarié</TableHead>
                          <TableHead className="text-right">Part Employeur</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>CNPS - Retraite</TableCell>
                          <TableCell className="text-right">{Math.min(payslipData.brutTotal, 2700000).toLocaleString()}</TableCell>
                          <TableCell className="text-right text-red-600">-{payslipData.cnpsRetraiteEmploye.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{payslipData.cnpsRetraiteEmployeur.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>CNPS - Prestations Familiales</TableCell>
                          <TableCell className="text-right">{payslipData.brutTotal.toLocaleString()}</TableCell>
                          <TableCell className="text-right">-</TableCell>
                          <TableCell className="text-right text-muted-foreground">{payslipData.cnpsPFEmployeur.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>CNPS - Accidents du Travail</TableCell>
                          <TableCell className="text-right">{payslipData.brutTotal.toLocaleString()}</TableCell>
                          <TableCell className="text-right">-</TableCell>
                          <TableCell className="text-right text-muted-foreground">{payslipData.cnpsATEmployeur.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>ITS (Impôt sur Traitements et Salaires)</TableCell>
                          <TableCell className="text-right">{payslipData.netImposable.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-red-600">-{payslipData.its.toLocaleString()}</TableCell>
                          <TableCell className="text-right">-</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>CN (Contribution Nationale)</TableCell>
                          <TableCell className="text-right">{payslipData.netImposable.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-red-600">-{payslipData.cn.toLocaleString()}</TableCell>
                          <TableCell className="text-right">-</TableCell>
                        </TableRow>
                        {payslipData.retenues.map((ret, idx) => (
                          <TableRow key={`ret-${idx}`}>
                            <TableCell>{ret.libelle}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right text-red-600">-{ret.montant.toLocaleString()}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-red-50 dark:bg-red-950">
                          <TableCell colSpan={2} className="font-bold">TOTAL RETENUES</TableCell>
                          <TableCell className="text-right font-bold text-red-600">-{(payslipData.cnpsEmploye + payslipData.its + payslipData.cn).toLocaleString()} FCFA</TableCell>
                          <TableCell className="text-right font-bold text-muted-foreground">{payslipData.cnpsEmployeur.toLocaleString()} FCFA</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <Separator />

                  {/* Résumé */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Salaire Brut</p>
                        <p className="text-xl font-bold">{payslipData.brutTotal.toLocaleString()} FCFA</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Total Charges Patronales</p>
                        <p className="text-xl font-bold text-muted-foreground">{payslipData.cnpsEmployeur.toLocaleString()} FCFA</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-primary/10 border-primary">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Net à Payer</p>
                        <p className="text-2xl font-bold text-primary">{payslipData.netAPayer.toLocaleString()} FCFA</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Informations complémentaires */}
                  <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
                    <p><strong>Taux CNPS appliqués :</strong> Retraite (Salarié: 6.35%, Employeur: 7.75%), Prestations Familiales (Employeur: 5.5%), Accidents du Travail (Employeur: 2%)</p>
                    <p><strong>Plafond CNPS Retraite :</strong> 2 700 000 FCFA/mois</p>
                    <p><strong>Abattement ITS :</strong> 20% du net imposable</p>
                    <p><strong>Contribution Nationale :</strong> 1.5% du net imposable</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
