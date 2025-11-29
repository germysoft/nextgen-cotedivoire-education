# Système de Gestion des Rôles et Permissions

⚠️ **AVERTISSEMENT SÉCURITÉ CRITIQUE** ⚠️

Ce système de rôles est **UNIQUEMENT pour démonstration frontend**. Il utilise localStorage et peut être facilement manipulé côté client. **NE JAMAIS** utiliser ce système en production.

## Mode Démonstration vs Production

### Mode Actuel: Démonstration
- Les rôles sont stockés dans localStorage
- Aucune authentification réelle
- Peut être manipulé via les outils de développement
- Parfait pour prototypes et démonstrations

### Pour la Production
Pour un système sécurisé en production, vous devez:
1. Activer Lovable Cloud
2. Implémenter l'authentification avec Supabase
3. Créer une table `user_roles` dans Supabase
4. Utiliser Row Level Security (RLS)
5. Valider les permissions côté serveur

## Rôles Disponibles

| Rôle | Description | Niveau d'accès |
|------|-------------|----------------|
| **Admin** | Administrateur système | Accès complet à tous les modules |
| **Directeur** | Directeur d'établissement | Accès quasi-complet (sauf paramétrage) |
| **Enseignant** | Professeur | Pédagogie, notes, suivi des cours |
| **Comptable** | Responsable financier | Finance, comptabilité, paiements |
| **Secrétaire** | Secrétariat | Scolarité, documents, MENA |
| **Surveillant** | Vie scolaire | Discipline, présence, parascolaire |
| **Infirmier** | Personnel médical | Infirmerie uniquement |
| **Bibliothécaire** | Gestion bibliothèque | Bibliothèque et stocks livres |

## Architecture

### Types et Permissions (`src/types/roles.ts`)
- Définition des 8 rôles utilisateur
- Matrice de permissions pour 21 sections du menu
- Mapping des titres de menu avec les clés de permissions

### Context (`src/contexts/RoleContext.tsx`)
- Gestion de l'état du rôle actuel
- Persistance dans localStorage
- Hook `useRole()` pour accéder au contexte

### Hook de permissions (`src/hooks/usePermissions.ts`)
- Helper `hasPermission()` pour vérifier les droits
- Simplifie les vérifications dans les composants

### Sélecteur de rôle (`src/components/layout/RoleSelector.tsx`)
- Dropdown dans le header pour changer de rôle
- Badge indiquant le rôle actuel
- Avertissement "Mode démonstration"

## Utilisation

### Dans les composants

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MonComposant() {
  const { hasPermission } = usePermissions();

  if (!hasPermission('comptabilite')) {
    return <div>Accès refusé</div>;
  }

  return <div>Contenu financier...</div>;
}
```

### Vérifier le rôle actuel

```tsx
import { useRole } from '@/contexts/RoleContext';

function MonComposant() {
  const { currentRole } = useRole();

  return <div>Vous êtes connecté en tant que: {currentRole}</div>;
}
```

### Changer de rôle programmatiquement

```tsx
import { useRole } from '@/contexts/RoleContext';

function MonComposant() {
  const { setRole } = useRole();

  const passerEnModeEnseignant = () => {
    setRole('enseignant');
  };

  return <button onClick={passerEnModeEnseignant}>Mode Enseignant</button>;
}
```

## Filtrage du Menu

Le composant `AppSidebar` filtre automatiquement les sections du menu selon les permissions du rôle actuel. Les sections non autorisées sont complètement masquées.

## Migration vers Production

Quand vous serez prêt à passer en production:

1. **Activer Lovable Cloud**
   ```bash
   # Via l'interface Lovable
   ```

2. **Créer la table des rôles**
   ```sql
   create type public.app_role as enum (
     'admin', 'directeur', 'enseignant', 'comptable',
     'secretaire', 'surveillant', 'infirmier', 'bibliothecaire'
   );

   create table public.user_roles (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) on delete cascade not null,
     role app_role not null,
     unique (user_id, role)
   );

   alter table public.user_roles enable row level security;
   ```

3. **Créer une fonction security definer**
   ```sql
   create or replace function public.has_role(_user_id uuid, _role app_role)
   returns boolean
   language sql
   stable
   security definer
   set search_path = public
   as $$
     select exists (
       select 1
       from public.user_roles
       where user_id = _user_id
         and role = _role
     )
   $$;
   ```

4. **Modifier RoleContext pour utiliser Supabase**
   - Récupérer le rôle depuis la base de données
   - Écouter les changements avec `realtime`
   - Ne plus utiliser localStorage

## Personnalisation des Permissions

Pour modifier les permissions d'un rôle, éditez `src/types/roles.ts`:

```typescript
export const rolePermissions: Record<UserRole, RolePermissions> = {
  enseignant: {
    dashboards: true,
    rh: false,
    pedagogie: true,  // ✅ Peut accéder
    notes: true,      // ✅ Peut accéder
    comptabilite: false, // ❌ Pas d'accès
    // ...
  },
};
```

## Ajouter un Nouveau Rôle

1. Ajouter le type dans `UserRole`
2. Ajouter l'entrée dans `rolePermissions`
3. Ajouter le label dans `roleLabels`
4. Le rôle apparaîtra automatiquement dans le sélecteur

## Tester les Rôles

1. Cliquer sur le bouton "Rôle" dans le header
2. Sélectionner un rôle différent
3. Observer les sections du menu qui apparaissent/disparaissent
4. Naviguer dans l'application avec les permissions du rôle

## Limitations Actuelles

- ❌ Pas d'authentification réelle
- ❌ Pas de validation côté serveur
- ❌ Peut être contourné via localStorage
- ❌ Pas de gestion des sessions
- ❌ Pas d'audit trail

✅ Parfait pour démonstration et développement frontend
❌ **Dangereux en production sans authentification réelle**
