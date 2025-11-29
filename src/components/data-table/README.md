# Composants de Gestion de Tableaux de Données

Ce dossier contient des composants réutilisables pour améliorer les tableaux de données avec filtres avancés et exports multi-format.

## Composants

### DataTableFilters

Composant de filtres avancés avec recherche et filtres personnalisables.

#### Utilisation

```tsx
import { DataTableFilters, FilterConfig } from "@/components/data-table/DataTableFilters";
import { useState } from "react";

const filterConfigs: FilterConfig[] = [
  {
    key: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "active", label: "Actif" },
      { value: "inactive", label: "Inactif" },
    ],
  },
  {
    key: "date",
    label: "Date",
    type: "date",
  },
  {
    key: "amount",
    label: "Montant minimum",
    type: "number",
  },
];

function MyComponent() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const filteredData = data.filter((item) => {
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    // Ajoutez d'autres conditions de filtre
    return true;
  });

  return (
    <DataTableFilters
      filters={filterConfigs}
      onFilterChange={setFilters}
      searchPlaceholder="Rechercher..."
    />
  );
}
```

#### Props

- `filters`: Array de `FilterConfig` définissant les filtres disponibles
- `onFilterChange`: Callback appelé quand les filtres changent
- `searchPlaceholder`: Texte du placeholder pour la barre de recherche

#### Types de Filtres

- `text`: Champ de texte libre
- `select`: Liste déroulante avec options prédéfinies
- `date`: Sélecteur de date
- `number`: Champ numérique

### DataTableExport

Composant d'export de données en CSV, Excel et PDF.

#### Utilisation

```tsx
import { DataTableExport } from "@/components/data-table/DataTableExport";

const exportColumns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nom" },
  { key: "email", label: "Email" },
];

function MyComponent() {
  return (
    <DataTableExport
      data={myData}
      columns={exportColumns}
      filename="export-data"
    />
  );
}
```

#### Props

- `data`: Array d'objets à exporter
- `columns`: Array définissant quelles colonnes exporter et leurs labels
- `filename`: Nom de base du fichier exporté (sans extension)

#### Formats supportés

- **CSV**: Export simple en valeurs séparées par virgules
- **Excel**: Export avec formatage et largeurs de colonnes automatiques
- **PDF**: Export avec mise en page professionnelle et en-têtes de tableau

## Exemple Complet

Voir les pages suivantes pour des exemples d'implémentation complète :
- `src/pages/scolarite/Alertes.tsx`
- `src/pages/Students.tsx`
- `src/pages/scolarite/Paiements.tsx`

## Installation des dépendances

Ces composants nécessitent les packages suivants (déjà installés) :
- `xlsx` - Pour les exports Excel
- `jspdf` - Pour les exports PDF
- `jspdf-autotable` - Pour les tableaux dans les PDF
