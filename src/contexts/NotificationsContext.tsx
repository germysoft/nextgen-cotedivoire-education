import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification, NotificationEvent } from "@/types/notifications";
import { toast } from "sonner";
import { 
  DollarSign, 
  UserX, 
  MessageSquare, 
  GraduationCap, 
  AlertTriangle,
  Info
} from "lucide-react";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (event: NotificationEvent) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const STORAGE_KEY = "app_notifications";

// Simulation d'événements en temps réel (à remplacer par Supabase Realtime)
const simulateRealtimeEvents = (addNotification: (event: NotificationEvent) => void) => {
  const events: NotificationEvent[] = [
    {
      type: "payment",
      title: "Nouveau paiement reçu",
      message: "KOUASSI Jean - 150,000 FCFA",
      link: "/scolarite/paiements",
      priority: "medium"
    },
    {
      type: "absence",
      title: "Absence signalée",
      message: "DIALLO Fatoumata absente aujourd'hui",
      link: "/students",
      priority: "high"
    },
    {
      type: "message",
      title: "Nouveau message",
      message: "Parent de TOURÉ Mohamed a envoyé un message",
      link: "/messaging",
      priority: "medium"
    },
    {
      type: "grade",
      title: "Notes publiées",
      message: "Notes de mathématiques disponibles pour 3ème A",
      link: "/grades",
      priority: "low"
    },
    {
      type: "alert",
      title: "Impayé critique",
      message: "SANOGO Aminata - 4 mois de retard",
      link: "/dashboard/alertes",
      priority: "high"
    }
  ];

  let index = 0;
  const interval = setInterval(() => {
    if (index < events.length) {
      addNotification(events[index]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 15000); // Nouvelle notification toutes les 15 secondes

  return () => clearInterval(interval);
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      })) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const getIcon = (type: NotificationEvent["type"]) => {
    switch (type) {
      case "payment":
        return DollarSign;
      case "absence":
        return UserX;
      case "message":
        return MessageSquare;
      case "grade":
        return GraduationCap;
      case "alert":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const addNotification = (event: NotificationEvent) => {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      type: event.type,
      title: event.title,
      message: event.message,
      timestamp: new Date(),
      read: false,
      link: event.link,
      priority: event.priority || "medium"
    };

    setNotifications((prev) => [notification, ...prev]);

    // Afficher un toast
    const Icon = getIcon(event.type);
    toast(event.title, {
      description: event.message,
      icon: <Icon className="h-4 w-4" />,
      action: event.link ? {
        label: "Voir",
        onClick: () => window.location.href = event.link
      } : undefined,
      duration: event.priority === "high" ? 10000 : 5000,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Simuler des événements en temps réel
  useEffect(() => {
    const cleanup = simulateRealtimeEvents(addNotification);
    return cleanup;
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
}
