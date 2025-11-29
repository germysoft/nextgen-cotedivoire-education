# Tableau de Bord Personnalisable

Système de dashboard personnalisable avec widgets drag-and-drop, sauvegarde de disposition et configuration persistante.

## Architecture

### Types de Widgets

Le système supporte plusieurs types de widgets organisés en catégories :

#### Statistiques (stats)
- **stats-students** : Total des élèves inscrits
- **stats-payments** : Paiements du mois
- **stats-teachers** : Nombre d'enseignants
- **stats-absences** : Absences du jour

#### Graphiques (charts)
- **payment-chart** : Graphique en barres des paiements
- **attendance-chart** : Courbe du taux de présence
- **class-distribution** : Camembert de répartition par classe

#### Listes (lists)
- **recent-payments** : Derniers paiements enregistrés
- **recent-absences** : Absences récentes
- **upcoming-events** : Événements à venir
- **alerts-summary** : Résumé des alertes importantes

#### Actions (actions)
- **quick-actions** : Raccourcis vers fonctions principales

## Composants

### CustomDashboard

Composant principal qui gère la grille drag-and-drop et la configuration.

```tsx
import { CustomDashboard } from "@/components/dashboard/CustomDashboard";

function Page() {
  return <CustomDashboard />;
}
```

### WidgetContainer

Conteneur réutilisable pour tous les widgets avec header et bouton de suppression.

```tsx
<WidgetContainer title="Mon Widget" onRemove={() => removeWidget(id)}>
  {/* Contenu du widget */}
</WidgetContainer>
```

### WidgetRenderer

Rendu conditionnel des widgets selon leur type.

```tsx
<WidgetRenderer type="stats-students" onRemove={handleRemove} />
```

### WidgetSelector

Modal de configuration pour ajouter/retirer des widgets.

```tsx
<WidgetSelector
  activeWidgets={activeWidgets}
  onAddWidget={addWidget}
  onRemoveWidget={removeWidget}
  onReset={resetToDefault}
/>
```

## Widgets Disponibles

### StatsWidget

Affichage de statistiques avec icône, valeur et tendance optionnelle.

```tsx
<StatsWidget
  value="465"
  label="Élèves inscrits"
  icon={Users}
  trend={{ value: 5.2, isPositive: true }}
  color="text-blue-600"
/>
```

### ChartWidget

Graphiques avec support bar, line et pie.

```tsx
<ChartWidget
  type="bar"
  data={paymentData}
  dataKey="montant"
  xAxisKey="name"
/>
```

### ListWidget

Liste d'éléments avec icônes et badges.

```tsx
<ListWidget items={recentPayments} emptyMessage="Aucun paiement" />
```

### QuickActionsWidget

Grille de boutons pour actions rapides.

```tsx
<QuickActionsWidget />
```

## Hook useDashboardConfig

Gestion de la configuration du dashboard avec persistance localStorage.

```tsx
const {
  config,           // Configuration actuelle
  updateLayout,     // Mettre à jour la disposition
  addWidget,        // Ajouter un widget
  removeWidget,     // Retirer un widget
  resetToDefault    // Réinitialiser
} = useDashboardConfig();
```

## Configuration par Défaut

La configuration par défaut inclut 9 widgets :
- 4 statistiques en haut
- 2 graphiques au centre
- 3 listes en bas

La disposition est sauvegardée automatiquement dans `localStorage` sous la clé `dashboard_config`.

## Grille Responsive

La grille s'adapte automatiquement aux différentes tailles d'écran :

- **lg** (≥1200px) : 12 colonnes
- **md** (≥996px) : 10 colonnes
- **sm** (≥768px) : 6 colonnes
- **xs** (≥480px) : 4 colonnes
- **xxs** (<480px) : 2 colonnes

## Fonctionnalités

✅ Drag-and-drop des widgets
✅ Redimensionnement des widgets
✅ Ajout/suppression de widgets
✅ Verrouillage de la disposition
✅ Réinitialisation à la config par défaut
✅ Persistance dans localStorage
✅ Grille responsive
✅ Animations smooth (fade-in)
✅ Modal de configuration avancée
✅ Recherche et filtres par catégorie
✅ Contraintes de taille min/max

## Dépendances

- `react-grid-layout` : Système de grille drag-and-drop
- `@types/react-grid-layout` : Types TypeScript
- `recharts` : Bibliothèque de graphiques
- `react-resizable` : Redimensionnement des widgets

## Personnalisation

### Ajouter un Nouveau Widget

1. Ajouter le type dans `src/types/dashboard.ts`
2. Créer le widget dans `src/data/availableWidgets.ts`
3. Implémenter le rendu dans `WidgetRenderer.tsx`
4. (Optionnel) Créer un composant dédié dans `widgets/`

### Modifier la Disposition par Défaut

Éditer `DEFAULT_CONFIG` dans `src/hooks/useDashboardConfig.ts` :

```tsx
const DEFAULT_CONFIG: DashboardConfig = {
  layout: [
    { i: "widget-id", x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    // ...
  ],
  activeWidgets: ["widget-id", /* ... */],
};
```

## Route

Le dashboard personnalisé est accessible via `/dashboard/custom` et visible dans le menu sous "Tableaux de Bord" > "Dashboard Personnalisé".

## Exemples d'Usage

### Mode Lecture Seule

```tsx
const [isLocked, setIsLocked] = useState(true);
```

### Export de Configuration

```tsx
const exportConfig = () => {
  const json = JSON.stringify(config, null, 2);
  // Télécharger ou envoyer au serveur
};
```

### Import de Configuration

```tsx
const importConfig = (newConfig: DashboardConfig) => {
  localStorage.setItem("dashboard_config", JSON.stringify(newConfig));
  window.location.reload();
};
```
