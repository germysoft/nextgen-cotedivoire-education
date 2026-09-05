import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const motDePasse = process.env.SEED_DEFAULT_PASSWORD || 'ChangeMoi123!';
  const passwordHash = await bcrypt.hash(motDePasse, 12);

  const etablissement = await prisma.etablissement.create({
    data: {
      nom: "Groupe Scolaire NextGen Côte d'Ivoire",
      typeEtablissement: 'Privé laïc',
      cycle: 'Collège-Lycée',
      adresse: 'Cocody, Abidjan',
      ville: 'Abidjan',
      region: 'Abidjan Autonome',
      telephone: '+225 27 22 00 00 00',
      email: 'contact@nextgen-education.ci',
      anneeScolaireActive: '2025-2026',
    },
  });

  const anneeScolaire = await prisma.anneeScolaire.create({
    data: {
      etablissementId: etablissement.id,
      libelle: '2025-2026',
      dateDebut: new Date('2025-09-01'),
      dateFin: new Date('2026-06-30'),
      active: true,
    },
  });

  await prisma.periodeScolaire.createMany({
    data: [
      { anneeScolaireId: anneeScolaire.id, type: 'Trimestre1', numero: 1, dateDebut: new Date('2025-09-01'), dateFin: new Date('2025-12-15') },
      { anneeScolaireId: anneeScolaire.id, type: 'Trimestre2', numero: 2, dateDebut: new Date('2026-01-05'), dateFin: new Date('2026-03-20') },
      { anneeScolaireId: anneeScolaire.id, type: 'Trimestre3', numero: 3, dateDebut: new Date('2026-04-01'), dateFin: new Date('2026-06-30') },
    ],
  });

  const classe = await prisma.classe.create({
    data: { nom: '6ème A', niveau: '6ème', cycle: 'Collège', anneeScolaireId: anneeScolaire.id },
  });

  // Un compte de démonstration par rôle, comme le sélecteur de rôle du frontend.
  const comptesDemo: Array<{ email: string; role: any; nom: string }> = [
    { email: 'admin@demo.ci', role: 'admin', nom: 'Administrateur Démo' },
    { email: 'directeur@demo.ci', role: 'directeur', nom: 'Directeur Démo' },
    { email: 'enseignant@demo.ci', role: 'enseignant', nom: 'Enseignant Démo' },
    { email: 'comptable@demo.ci', role: 'comptable', nom: 'Comptable Démo' },
    { email: 'secretaire@demo.ci', role: 'secretaire', nom: 'Secrétaire Démo' },
    { email: 'surveillant@demo.ci', role: 'surveillant', nom: 'Surveillant Démo' },
    { email: 'infirmier@demo.ci', role: 'infirmier', nom: 'Infirmier Démo' },
    { email: 'bibliothecaire@demo.ci', role: 'bibliothecaire', nom: 'Bibliothécaire Démo' },
  ];

  for (const compte of comptesDemo) {
    const [prenom, ...reste] = compte.nom.split(' ');
    const personnel = await prisma.personnel.create({
      data: {
        matricule: `PE2025-${compte.role.toUpperCase().slice(0, 4)}`,
        civilite: 'M.',
        nom: reste.join(' ') || 'Démo',
        prenom,
        dateNaissance: new Date('1985-01-01'),
        sexe: 'Masculin',
        telephone: '+225 00 00 00 00',
        email: compte.email,
        poste: compte.role,
        categoriePersonnel: compte.role === 'enseignant' ? 'Enseignant' : 'Administratif',
        statut: 'Permanent',
        dateEmbauche: new Date('2020-09-01'),
      },
    });

    await prisma.user.create({
      data: {
        email: compte.email,
        passwordHash,
        role: compte.role,
        personnelId: personnel.id,
        doitChangerMdp: true,
      },
    });
  }

  const eleve = await prisma.eleve.create({
    data: {
      matricule: 'EL2025-00001',
      nom: 'Kouassi',
      prenom: 'Awa',
      dateNaissance: new Date('2013-04-12'),
      sexe: 'Féminin',
      nationalite: 'Ivoirienne',
      inscriptions: { create: { classeId: classe.id, anneeScolaireId: anneeScolaire.id } },
    },
  });

  const parent = await prisma.parentProfil.create({
    data: { nom: 'Kouassi', prenom: 'Jean', telephone: '+225 07 00 00 00', email: 'parent@demo.ci' },
  });
  await prisma.elevePar.create({ data: { eleveId: eleve.id, parentId: parent.id, lien: 'Père' } });
  await prisma.user.create({
    data: { email: 'parent@demo.ci', passwordHash, role: 'parent', parentId: parent.id, doitChangerMdp: true },
  });

  // eslint-disable-next-line no-console
  console.log('\n✅ Seed terminé. Comptes de démonstration (mot de passe : ' + motDePasse + ') :');
  for (const c of comptesDemo) console.log(`   - ${c.email} (${c.role})`);
  console.log('   - parent@demo.ci (parent)');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
