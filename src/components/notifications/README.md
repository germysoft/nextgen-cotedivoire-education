# Système de Notifications en Temps Réel

Ce système permet d'afficher des notifications en temps réel pour les événements importants de l'application.

## Architecture

### Types de Notifications

- **payment** : Nouveaux paiements reçus
- **absence** : Absences signalées
- **message** : Nouveaux messages
- **grade** : Notes publiées
- **alert** : Alertes critiques (impayés, etc.)
- **info** : Informations générales

### Niveaux de Priorité

- **high** : Urgent (toast affiché pendant 10 secondes)
- **medium** : Important (toast affiché pendant 5 secondes)
- **low** : Informatif (toast affiché pendant 5 secondes)

## Utilisation

### 1. Accès au Contexte

```tsx
import { useNotifications } from "@/contexts/NotificationsContext";

function MyComponent() {
  const { 
    notifications, 
    unreadCount, 
    addNotification,
    markAsRead,
    clearNotification 
  } = useNotifications();
  
  // Votre code...
}
```

### 2. Ajouter une Notification

```tsx
addNotification({
  type: "payment",
  title: "Nouveau paiement",
  message: "KOUASSI Jean - 150,000 FCFA",
  link: "/scolarite/paiements",
  priority: "medium"
});
```

### 3. Marquer comme Lue

```tsx
markAsRead(notification.id);
```

### 4. Supprimer une Notification

```tsx
clearNotification(notification.id);
```

## Composants

### NotificationPanel

Panneau latéral affichant toutes les notifications avec onglets "Non lues" et "Toutes".

```tsx
<NotificationPanel />
```

### NotificationItem

Affichage individuel d'une notification avec icône, badge de priorité et actions.

## Intégration avec Supabase Realtime

Pour connecter le système à Supabase Realtime, remplacer la fonction `simulateRealtimeEvents` dans `NotificationsContext.tsx` :

```tsx
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      },
      (payload) => {
        addNotification({
          type: payload.new.type,
          title: payload.new.title,
          message: payload.new.message,
          link: payload.new.link,
          priority: payload.new.priority
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

## Personnalisation

### Modifier les Intervalles de Simulation

Dans `NotificationsContext.tsx`, ligne ~95 :

```tsx
const interval = setInterval(() => {
  // ...
}, 15000); // Modifier cette valeur (en millisecondes)
```

### Ajouter de Nouveaux Types

1. Ajouter le type dans `src/types/notifications.ts`
2. Ajouter l'icône dans les fonctions `getIcon()` de `NotificationsContext.tsx` et `NotificationItem.tsx`

## Stockage

Les notifications sont stockées dans `localStorage` sous la clé `app_notifications` pour persister entre les sessions.

## Features

✅ Notifications en temps réel simulées
✅ Toast automatiques avec Sonner
✅ Panel latéral avec filtres
✅ Compteur de notifications non lues
✅ Liens directs vers les pages concernées
✅ Badges de priorité
✅ Persistance dans localStorage
✅ Formatage de dates relatif (avec date-fns)
✅ Actions : marquer comme lu, effacer
✅ Responsive design

## Prochaines Étapes

- [ ] Intégration avec Supabase Realtime
- [ ] Ajout de sons pour notifications urgentes
- [ ] Notifications push (avec service worker)
- [ ] Filtres par type de notification
- [ ] Paramètres de notification par utilisateur
