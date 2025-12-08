import { Personnel } from '@/types/personnel';

export const mockPersonnel: Personnel[] = [
  {
    id: "P001",
    matricule: "EMP-2015-001",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    civilite: "M.",
    nom: "KOUASSI",
    prenom: "Jean-Baptiste",
    dateNaissance: "1978-05-15",
    lieuNaissance: "Abidjan",
    nationalite: "Ivoirienne",
    sexe: "Masculin",
    situationMatrimoniale: "Marié(e)",
    nombreEnfants: 3,
    groupeSanguin: "O+",
    numeroCNI: "CI-2345678901",
    dateDelivranceCNI: "2020-03-15",
    lieuDelivranceCNI: "Abidjan",
    dateExpirationCNI: "2030-03-15",
    adresse: "Cocody Riviera 3, Rue des Jardins",
    ville: "Abidjan",
    codePostal: "01 BP 1234",
    pays: "Côte d'Ivoire",
    telephone: "+225 07 08 09 10 11",
    telephoneSecondaire: "+225 05 06 07 08 09",
    email: "jb.kouassi@email.ci",
    emailProfessionnel: "j.kouassi@ecole.ci",
    contactUrgenceNom: "KOUASSI Marie",
    contactUrgenceLien: "Épouse",
    contactUrgenceTelephone: "+225 07 12 13 14 15",
    poste: "Professeur Principal",
    departement: "Mathématiques",
    categoriePersonnel: "Enseignant",
    statut: "Permanent",
    typeContrat: "CDI",
    dateEmbauche: "2015-09-01",
    anciennete: 9,
    heuresHebdo: 22,
    matieresPrincipales: ["Mathématiques"],
    classesAffectees: ["3ème A", "3ème B", "2nde C"],
    chargeHoraire: 22,
    diplomes: [
      { id: "D1", intitule: "Master en Mathématiques", etablissement: "Université Félix Houphouët-Boigny", anneeObtention: "2005", mention: "Bien", niveau: "Master" },
      { id: "D2", intitule: "CAPES Mathématiques", etablissement: "ENS Abidjan", anneeObtention: "2007", niveau: "Autre" }
    ],
    certifications: [
      { id: "C1", nom: "Certification Pédagogie Numérique", organisme: "UNESCO", dateObtention: "2022-06-15", valide: true }
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif", ecrit: true, oral: true },
      { langue: "Anglais", niveau: "Intermédiaire", ecrit: true, oral: true },
      { langue: "Baoulé", niveau: "Natif", ecrit: false, oral: true }
    ],
    competences: ["Pédagogie différenciée", "Utilisation TBI", "Gestion de classe", "Tutorat"],
    salaireBase: 450000,
    primes: [
      { type: "Prime de responsabilité", montant: 50000, frequence: "Mensuel" },
      { type: "Prime de rentrée", montant: 100000, frequence: "Annuel" }
    ],
    modePaiement: "Virement",
    banque: "BICICI",
    numeroCompte: "012345678901",
    ribIban: "CI93 CI00 0123 4567 8901 2345 6789",
    numeroSecuriteSociale: "178055012345678",
    numeroCNPS: "CNPS-2015-123456",
    situationFiscale: "Marié 4 parts",
    nombrePartsImpots: 4,
    documents: [
      { id: "DOC1", type: "CV", nom: "CV_KOUASSI_2024.pdf", dateAjout: "2024-01-15" },
      { id: "DOC2", type: "Diplôme", nom: "Master_Maths.pdf", dateAjout: "2015-09-01" },
      { id: "DOC3", type: "Contrat", nom: "Contrat_CDI.pdf", dateAjout: "2015-09-01" }
    ],
    derniereEvaluation: "2024-06-15",
    noteEvaluation: 18,
    soldeCongesAnnuels: 16,
    soldeRTT: 5,
    historiquePostes: [
      { poste: "Professeur", departement: "Mathématiques", dateDebut: "2015-09-01", dateFin: "2020-08-31", motifChangement: "Promotion" }
    ],
    historiqueFormations: [
      { id: "F1", intitule: "Formation aux TICE", organisme: "Académie d'Abidjan", dateDebut: "2023-07-01", dateFin: "2023-07-05", dureeHeures: 30, certifiante: true }
    ],
    observations: "Excellent enseignant, très apprécié des élèves et des parents. Coordonnateur du département de mathématiques.",
    dateCreation: "2015-09-01",
    dateModification: "2024-12-01",
    creePar: "admin",
    modifiePar: "admin",
    actif: true
  },
  {
    id: "P002",
    matricule: "EMP-2018-015",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    civilite: "Mme",
    nom: "DIALLO",
    prenom: "Fatoumata",
    nomJeuneFille: "SANOGO",
    dateNaissance: "1985-11-20",
    lieuNaissance: "Bouaké",
    nationalite: "Ivoirienne",
    sexe: "Féminin",
    situationMatrimoniale: "Marié(e)",
    nombreEnfants: 2,
    groupeSanguin: "A+",
    numeroCNI: "CI-9876543210",
    dateDelivranceCNI: "2021-06-20",
    lieuDelivranceCNI: "Bouaké",
    dateExpirationCNI: "2031-06-20",
    adresse: "Yopougon Niangon, Rue 12",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    telephone: "+225 07 20 30 40 50",
    email: "f.diallo@email.ci",
    emailProfessionnel: "f.diallo@ecole.ci",
    contactUrgenceNom: "DIALLO Ibrahim",
    contactUrgenceLien: "Époux",
    contactUrgenceTelephone: "+225 07 60 70 80 90",
    poste: "Professeur",
    departement: "Français",
    categoriePersonnel: "Enseignant",
    statut: "Permanent",
    typeContrat: "CDI",
    dateEmbauche: "2018-09-01",
    anciennete: 6,
    heuresHebdo: 20,
    matieresPrincipales: ["Français", "Latin"],
    classesAffectees: ["4ème A", "5ème B", "5ème C"],
    chargeHoraire: 20,
    diplomes: [
      { id: "D1", intitule: "Maîtrise de Lettres Modernes", etablissement: "Université de Bouaké", anneeObtention: "2008", mention: "Assez Bien", niveau: "Master" }
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif", ecrit: true, oral: true },
      { langue: "Anglais", niveau: "Courant", ecrit: true, oral: true }
    ],
    competences: ["Littérature francophone", "Atelier d'écriture", "Théâtre"],
    salaireBase: 420000,
    primes: [
      { type: "Prime de rentrée", montant: 100000, frequence: "Annuel" }
    ],
    modePaiement: "Virement",
    banque: "Société Générale CI",
    numeroCompte: "098765432101",
    ribIban: "CI93 CI00 0987 6543 2101 2345 6789",
    numeroSecuriteSociale: "285115012345678",
    numeroCNPS: "CNPS-2018-234567",
    documents: [
      { id: "DOC1", type: "CV", nom: "CV_DIALLO_2024.pdf", dateAjout: "2024-02-10" },
      { id: "DOC2", type: "Contrat", nom: "Contrat_CDI.pdf", dateAjout: "2018-09-01" }
    ],
    derniereEvaluation: "2024-06-15",
    noteEvaluation: 16,
    soldeCongesAnnuels: 22,
    observations: "Très impliquée dans les activités culturelles. Responsable du club de lecture.",
    dateCreation: "2018-09-01",
    dateModification: "2024-11-20",
    creePar: "admin",
    modifiePar: "admin",
    actif: true
  },
  {
    id: "P003",
    matricule: "EMP-2020-032",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    civilite: "M.",
    nom: "TRAORE",
    prenom: "Mamadou",
    dateNaissance: "1990-03-08",
    lieuNaissance: "Korhogo",
    nationalite: "Ivoirienne",
    sexe: "Masculin",
    situationMatrimoniale: "Célibataire",
    nombreEnfants: 0,
    groupeSanguin: "B+",
    numeroCNI: "CI-5678901234",
    dateDelivranceCNI: "2022-01-10",
    lieuDelivranceCNI: "Korhogo",
    adresse: "Plateau, Avenue Chardy",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    telephone: "+225 07 11 22 33 44",
    email: "m.traore@email.ci",
    emailProfessionnel: "m.traore@ecole.ci",
    contactUrgenceNom: "TRAORE Kadiatou",
    contactUrgenceLien: "Mère",
    contactUrgenceTelephone: "+225 07 55 66 77 88",
    poste: "Professeur Vacataire",
    departement: "Sciences Physiques",
    categoriePersonnel: "Enseignant",
    statut: "Vacataire",
    typeContrat: "CDD",
    dateEmbauche: "2020-09-01",
    dateFinContrat: "2025-08-31",
    anciennete: 4,
    heuresHebdo: 12,
    matieresPrincipales: ["Physique-Chimie"],
    classesAffectees: ["Terminale S", "1ère S"],
    chargeHoraire: 12,
    diplomes: [
      { id: "D1", intitule: "Licence de Physique", etablissement: "Université de Korhogo", anneeObtention: "2014", niveau: "Licence" }
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif", ecrit: true, oral: true },
      { langue: "Sénoufo", niveau: "Natif", ecrit: false, oral: true }
    ],
    salaireBase: 180000,
    modePaiement: "Virement",
    banque: "Ecobank",
    numeroCompte: "567890123456",
    documents: [
      { id: "DOC1", type: "CV", nom: "CV_TRAORE.pdf", dateAjout: "2020-08-15" },
      { id: "DOC2", type: "Contrat", nom: "Contrat_CDD.pdf", dateAjout: "2020-09-01" }
    ],
    soldeCongesAnnuels: 5,
    observations: "En cours de préparation du CAPES. Très motivé.",
    dateCreation: "2020-09-01",
    dateModification: "2024-10-15",
    creePar: "admin",
    modifiePar: "rh",
    actif: true
  },
  {
    id: "P004",
    matricule: "EMP-2019-022",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
    civilite: "Mme",
    nom: "BAMBA",
    prenom: "Sarah",
    dateNaissance: "1988-07-25",
    lieuNaissance: "Man",
    nationalite: "Ivoirienne",
    sexe: "Féminin",
    situationMatrimoniale: "Marié(e)",
    nombreEnfants: 1,
    groupeSanguin: "AB+",
    numeroCNI: "CI-1122334455",
    dateDelivranceCNI: "2019-09-05",
    lieuDelivranceCNI: "Abidjan",
    adresse: "Marcory Zone 4, Immeuble Les Palmiers",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    telephone: "+225 07 99 88 77 66",
    telephoneSecondaire: "+225 01 23 45 67 89",
    email: "s.bamba@email.ci",
    emailProfessionnel: "s.bamba@ecole.ci",
    contactUrgenceNom: "BAMBA Oumar",
    contactUrgenceLien: "Époux",
    contactUrgenceTelephone: "+225 07 11 00 99 88",
    poste: "Comptable",
    departement: "Administration",
    categoriePersonnel: "Administratif",
    statut: "Permanent",
    typeContrat: "CDI",
    dateEmbauche: "2019-01-15",
    anciennete: 5,
    heuresHebdo: 40,
    diplomes: [
      { id: "D1", intitule: "BTS Comptabilité-Gestion", etablissement: "HETEC Abidjan", anneeObtention: "2010", niveau: "BTS/DUT" },
      { id: "D2", intitule: "Licence Professionnelle Comptabilité", etablissement: "Université d'Abidjan", anneeObtention: "2012", niveau: "Licence" }
    ],
    certifications: [
      { id: "C1", nom: "Certification SAGE Comptabilité", organisme: "SAGE", dateObtention: "2021-03-20", valide: true }
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif", ecrit: true, oral: true },
      { langue: "Anglais", niveau: "Notions", ecrit: true, oral: false }
    ],
    competences: ["SAGE Comptabilité", "Excel avancé", "Gestion de trésorerie", "Déclarations fiscales"],
    salaireBase: 350000,
    primes: [
      { type: "Prime de transport", montant: 30000, frequence: "Mensuel" },
      { type: "Prime de fin d'année", montant: 200000, frequence: "Annuel" }
    ],
    modePaiement: "Virement",
    banque: "BOA",
    numeroCompte: "112233445566",
    ribIban: "CI93 CI00 1122 3344 5566 7788 9900",
    numeroSecuriteSociale: "288075012345678",
    numeroCNPS: "CNPS-2019-345678",
    documents: [
      { id: "DOC1", type: "CV", nom: "CV_BAMBA.pdf", dateAjout: "2018-12-20" },
      { id: "DOC2", type: "Diplôme", nom: "Licence_Compta.pdf", dateAjout: "2019-01-15" },
      { id: "DOC3", type: "Contrat", nom: "Contrat_CDI.pdf", dateAjout: "2019-01-15" }
    ],
    derniereEvaluation: "2024-06-15",
    noteEvaluation: 17,
    soldeCongesAnnuels: 18,
    historiqueFormations: [
      { id: "F1", intitule: "Formation SAGE Paie", organisme: "SAGE CI", dateDebut: "2023-02-15", dateFin: "2023-02-17", dureeHeures: 21, certifiante: true }
    ],
    observations: "Très rigoureuse et organisée. Gère également la paie.",
    dateCreation: "2019-01-15",
    dateModification: "2024-12-01",
    creePar: "admin",
    modifiePar: "admin",
    actif: true
  },
  {
    id: "P005",
    matricule: "EMP-2010-005",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    civilite: "M.",
    nom: "KONE",
    prenom: "Ibrahim",
    dateNaissance: "1975-12-03",
    lieuNaissance: "Daloa",
    nationalite: "Ivoirienne",
    sexe: "Masculin",
    situationMatrimoniale: "Marié(e)",
    nombreEnfants: 4,
    groupeSanguin: "O-",
    numeroCNI: "CI-6677889900",
    dateDelivranceCNI: "2018-11-30",
    lieuDelivranceCNI: "Daloa",
    adresse: "Deux Plateaux Vallon, Villa 123",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    telephone: "+225 07 44 55 66 77",
    email: "i.kone@email.ci",
    emailProfessionnel: "i.kone@ecole.ci",
    contactUrgenceNom: "KONE Adama",
    contactUrgenceLien: "Frère",
    contactUrgenceTelephone: "+225 07 88 99 00 11",
    poste: "Censeur",
    departement: "Direction",
    categoriePersonnel: "Direction",
    statut: "Permanent",
    typeContrat: "CDI",
    dateEmbauche: "2010-09-01",
    anciennete: 14,
    heuresHebdo: 44,
    matieresPrincipales: ["SVT"],
    diplomes: [
      { id: "D1", intitule: "Doctorat en Biologie", etablissement: "Université de Cocody", anneeObtention: "2003", mention: "Très Bien", niveau: "Doctorat" },
      { id: "D2", intitule: "Agrégation SVT", etablissement: "ENS Abidjan", anneeObtention: "2005", niveau: "Autre" }
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif", ecrit: true, oral: true },
      { langue: "Anglais", niveau: "Courant", ecrit: true, oral: true },
      { langue: "Bété", niveau: "Natif", ecrit: false, oral: true }
    ],
    competences: ["Management d'équipe", "Gestion administrative", "Pédagogie", "Supervision"],
    salaireBase: 650000,
    primes: [
      { type: "Prime de fonction", montant: 150000, frequence: "Mensuel" },
      { type: "Prime de responsabilité", montant: 100000, frequence: "Mensuel" },
      { type: "Prime annuelle", montant: 500000, frequence: "Annuel" }
    ],
    modePaiement: "Virement",
    banque: "SIB",
    numeroCompte: "998877665544",
    ribIban: "CI93 CI00 9988 7766 5544 3322 1100",
    numeroSecuriteSociale: "175125012345678",
    numeroCNPS: "CNPS-2010-456789",
    nombrePartsImpots: 5,
    documents: [
      { id: "DOC1", type: "CV", nom: "CV_KONE.pdf", dateAjout: "2010-08-15" },
      { id: "DOC2", type: "Diplôme", nom: "Doctorat_Biologie.pdf", dateAjout: "2010-08-15" },
      { id: "DOC3", type: "Contrat", nom: "Contrat_CDI.pdf", dateAjout: "2010-09-01" }
    ],
    derniereEvaluation: "2024-06-15",
    noteEvaluation: 19,
    soldeCongesAnnuels: 12,
    historiquePostes: [
      { poste: "Professeur SVT", departement: "SVT", dateDebut: "2010-09-01", dateFin: "2015-08-31", motifChangement: "Promotion" },
      { poste: "Surveillant Général", departement: "Direction", dateDebut: "2015-09-01", dateFin: "2020-08-31", motifChangement: "Promotion" }
    ],
    observations: "Membre fondateur de l'établissement. Excellent gestionnaire.",
    dateCreation: "2010-09-01",
    dateModification: "2024-12-05",
    creePar: "admin",
    modifiePar: "directeur",
    actif: true
  },
  {
    id: "P006",
    matricule: "EMP-2022-048",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    civilite: "Mlle",
    nom: "SANOGO",
    prenom: "Aminata",
    dateNaissance: "1995-02-14",
    lieuNaissance: "Abidjan",
    nationalite: "Ivoirienne",
    sexe: "Féminin",
    situationMatrimoniale: "Célibataire",
    nombreEnfants: 0,
    groupeSanguin: "A-",
    numeroCNI: "CI-3344556677",
    dateDelivranceCNI: "2023-04-12",
    lieuDelivranceCNI: "Abidjan",
    adresse: "Abobo Baoulé, Rue 15",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    telephone: "+225 07 33 22 11 00",
    email: "a.sanogo@email.ci",
    emailProfessionnel: "a.sanogo@ecole.ci",
    contactUrgenceNom: "SANOGO Drissa",
    contactUrgenceLien: "Père",
    contactUrgenceTelephone: "+225 07 66 55 44 33",
    poste: "Secrétaire",
    departement: "Administration",
    categoriePersonnel: "Administratif",
    statut: "Contractuel",
    typeContrat: "CDD",
    dateEmbauche: "2022-10-01",
    dateFinContrat: "2025-09-30",
    anciennete: 2,
    heuresHebdo: 40,
    diplomes: [
      { id: "D1", intitule: "BTS Secrétariat de Direction", etablissement: "PIGIER Abidjan", anneeObtention: "2018", niveau: "BTS/DUT" }
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif", ecrit: true, oral: true },
      { langue: "Anglais", niveau: "Intermédiaire", ecrit: true, oral: true }
    ],
    competences: ["Pack Office", "Accueil", "Gestion agenda", "Rédaction courrier"],
    salaireBase: 220000,
    primes: [
      { type: "Prime de transport", montant: 25000, frequence: "Mensuel" }
    ],
    modePaiement: "Virement",
    banque: "UBA",
    numeroCompte: "334455667788",
    documents: [
      { id: "DOC1", type: "CV", nom: "CV_SANOGO.pdf", dateAjout: "2022-09-15" },
      { id: "DOC2", type: "Contrat", nom: "Contrat_CDD.pdf", dateAjout: "2022-10-01" }
    ],
    soldeCongesAnnuels: 10,
    observations: "Très dynamique. Souhaite évoluer vers un poste d'assistante de direction.",
    dateCreation: "2022-10-01",
    dateModification: "2024-11-10",
    creePar: "rh",
    modifiePar: "rh",
    actif: true
  },
  {
    id: "P007",
    matricule: "EMP-2016-012",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    civilite: "M.",
    nom: "YAO",
    prenom: "Marcel",
    dateNaissance: "1982-09-18",
    lieuNaissance: "Gagnoa",
    nationalite: "Ivoirienne",
    sexe: "Masculin",
    situationMatrimoniale: "Marié(e)",
    nombreEnfants: 2,
    groupeSanguin: "B-",
    numeroCNI: "CI-7788990011",
    dateDelivranceCNI: "2020-07-22",
    lieuDelivranceCNI: "Gagnoa",
    adresse: "Treichville, Avenue 12",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    telephone: "+225 07 77 88 99 00",
    email: "m.yao@email.ci",
    emailProfessionnel: "m.yao@ecole.ci",
    contactUrgenceNom: "YAO Christine",
    contactUrgenceLien: "Épouse",
    contactUrgenceTelephone: "+225 07 22 33 44 55",
    poste: "Surveillant Général",
    departement: "Surveillance",
    categoriePersonnel: "Surveillance",
    statut: "Permanent",
    typeContrat: "CDI",
    dateEmbauche: "2016-09-01",
    anciennete: 8,
    heuresHebdo: 44,
    diplomes: [
      { id: "D1", intitule: "Licence en Sociologie", etablissement: "Université de Cocody", anneeObtention: "2006", niveau: "Licence" }
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif", ecrit: true, oral: true },
      { langue: "Bété", niveau: "Natif", ecrit: false, oral: true }
    ],
    competences: ["Gestion disciplinaire", "Médiation", "Surveillance", "Communication"],
    salaireBase: 380000,
    primes: [
      { type: "Prime de fonction", montant: 70000, frequence: "Mensuel" }
    ],
    modePaiement: "Virement",
    banque: "NSIA Banque",
    numeroCompte: "778899001122",
    numeroSecuriteSociale: "182095012345678",
    numeroCNPS: "CNPS-2016-567890",
    documents: [
      { id: "DOC1", type: "CV", nom: "CV_YAO.pdf", dateAjout: "2016-08-20" },
      { id: "DOC2", type: "Contrat", nom: "Contrat_CDI.pdf", dateAjout: "2016-09-01" }
    ],
    derniereEvaluation: "2024-06-15",
    noteEvaluation: 16,
    soldeCongesAnnuels: 20,
    historiquePostes: [
      { poste: "Surveillant", departement: "Surveillance", dateDebut: "2016-09-01", dateFin: "2021-08-31", motifChangement: "Promotion" }
    ],
    observations: "Très respecté des élèves. Excellent médiateur.",
    dateCreation: "2016-09-01",
    dateModification: "2024-12-02",
    creePar: "admin",
    modifiePar: "admin",
    actif: true
  },
  {
    id: "P008",
    matricule: "EMP-2021-038",
    photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    civilite: "Mme",
    nom: "OUATTARA",
    prenom: "Prisca",
    dateNaissance: "1992-06-30",
    lieuNaissance: "Bondoukou",
    nationalite: "Ivoirienne",
    sexe: "Féminin",
    situationMatrimoniale: "Célibataire",
    nombreEnfants: 1,
    groupeSanguin: "O+",
    numeroCNI: "CI-4455667788",
    dateDelivranceCNI: "2021-02-15",
    lieuDelivranceCNI: "Bondoukou",
    adresse: "Adjamé 220 Logements",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    telephone: "+225 07 55 44 33 22",
    email: "p.ouattara@email.ci",
    emailProfessionnel: "p.ouattara@ecole.ci",
    contactUrgenceNom: "OUATTARA Mariam",
    contactUrgenceLien: "Sœur",
    contactUrgenceTelephone: "+225 07 99 88 77 66",
    poste: "Infirmier(ère)",
    departement: "Infirmerie",
    categoriePersonnel: "Médical",
    statut: "Permanent",
    typeContrat: "CDI",
    dateEmbauche: "2021-03-01",
    anciennete: 3,
    heuresHebdo: 35,
    diplomes: [
      { id: "D1", intitule: "Diplôme d'État d'Infirmier", etablissement: "INFAS Abidjan", anneeObtention: "2015", niveau: "Licence" }
    ],
    certifications: [
      { id: "C1", nom: "Certification Premiers Secours", organisme: "Croix-Rouge CI", dateObtention: "2023-05-10", valide: true }
    ],
    languesParles: [
      { langue: "Français", niveau: "Natif", ecrit: true, oral: true },
      { langue: "Koulango", niveau: "Courant", ecrit: false, oral: true }
    ],
    competences: ["Soins infirmiers", "Premiers secours", "Éducation à la santé", "Gestion pharmacie"],
    salaireBase: 320000,
    primes: [
      { type: "Prime de risque", montant: 40000, frequence: "Mensuel" }
    ],
    modePaiement: "Virement",
    banque: "Coris Bank",
    numeroCompte: "445566778899",
    numeroSecuriteSociale: "292065012345678",
    numeroCNPS: "CNPS-2021-678901",
    documents: [
      { id: "DOC1", type: "CV", nom: "CV_OUATTARA.pdf", dateAjout: "2021-02-20" },
      { id: "DOC2", type: "Diplôme", nom: "DEI.pdf", dateAjout: "2021-03-01" },
      { id: "DOC3", type: "Contrat", nom: "Contrat_CDI.pdf", dateAjout: "2021-03-01" }
    ],
    derniereEvaluation: "2024-06-15",
    noteEvaluation: 17,
    soldeCongesAnnuels: 15,
    observations: "Très appréciée des élèves et du personnel. Organise régulièrement des campagnes de sensibilisation santé.",
    dateCreation: "2021-03-01",
    dateModification: "2024-11-25",
    creePar: "admin",
    modifiePar: "admin",
    actif: true
  }
];

export const getPersonnelById = (id: string): Personnel | undefined => {
  return mockPersonnel.find(p => p.id === id);
};

export const getPersonnelByMatricule = (matricule: string): Personnel | undefined => {
  return mockPersonnel.find(p => p.matricule === matricule);
};

export const getPersonnelByDepartement = (departement: string): Personnel[] => {
  return mockPersonnel.filter(p => p.departement === departement);
};

export const getPersonnelByCategorie = (categorie: string): Personnel[] => {
  return mockPersonnel.filter(p => p.categoriePersonnel === categorie);
};

export const getActivePersonnel = (): Personnel[] => {
  return mockPersonnel.filter(p => p.actif);
};

export const generateMatricule = (): string => {
  const year = new Date().getFullYear();
  const count = mockPersonnel.length + 1;
  return `EMP-${year}-${count.toString().padStart(3, '0')}`;
};
