import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Clock, DollarSign, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface Notification {
  id: string;
  type: "absence" | "retard" | "note" | "paiement";
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "absence",
    title: "Absence non justifiée",
    message: "Votre enfant était absent le 05/11/2024 au cours d'Anglais",
    date: "2024-11-05T10:30:00",
    read: false,
    priority: "high",
  },
  {
    id: "2",
    type: "note",
    title: "Nouvelle note disponible",
    message: "Note de Mathématiques: 14.5/20 - 1er Trimestre",
    date: "2024-11-04T15:20:00",
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "paiement",
    title: "Paiement en attente",
    message: "Scolarité T2: 150,000 FCFA à régler avant le 01/12/2024",
    date: "2024-11-03T09:00:00",
    read: false,
    priority: "high",
  },
  {
    id: "4",
    type: "retard",
    title: "Retard signalé",
    message: "Retard de 15 minutes le 02/11/2024 - Histoire-Géo",
    date: "2024-11-02T08:15:00",
    read: true,
    priority: "low",
  },
  {
    id: "5",
    type: "note",
    title: "Excellent résultat!",
    message: "Note de SVT: 16/20 - Félicitations!",
    date: "2024-11-01T14:30:00",
    read: true,
    priority: "low",
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "absence":
      return <AlertCircle className="h-4 w-4" />;
    case "retard":
      return <Clock className="h-4 w-4" />;
    case "note":
      return <BookOpen className="h-4 w-4" />;
    case "paiement":
      return <DollarSign className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: Notification["type"], priority: Notification["priority"]) => {
  if (priority === "high") return "text-destructive";
  if (priority === "medium") return "text-warning";
  
  switch (type) {
    case "absence":
      return "text-destructive";
    case "retard":
      return "text-warning";
    case "note":
      return "text-primary";
    case "paiement":
      return "text-destructive";
  }
};

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationCenter({ onNotificationClick }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly show a new notification (10% chance every 30 seconds)
      if (Math.random() > 0.9) {
        const newNotification: Notification = {
          id: `new-${Date.now()}`,
          type: ["absence", "retard", "note", "paiement"][Math.floor(Math.random() * 4)] as Notification["type"],
          title: "Nouvelle notification",
          message: "Une nouvelle activité a été détectée",
          date: new Date().toISOString(),
          read: false,
          priority: "medium",
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        toast.info(newNotification.title, {
          description: newNotification.message,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Toutes les notifications marquées comme lues");
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification supprimée");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type, notification.priority);
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => {
                      markAsRead(notification.id);
                      onNotificationClick?.(notification);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className={cn("mt-1 flex-shrink-0", iconColor)}>
                        <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center">
                          {icon}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(notification.date)}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        onClick={(e) => deleteNotification(notification.id, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
