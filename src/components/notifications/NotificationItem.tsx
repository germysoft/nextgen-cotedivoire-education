import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Notification } from "@/types/notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink } from "lucide-react";
import { 
  DollarSign, 
  UserX, 
  MessageSquare, 
  GraduationCap, 
  AlertTriangle,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClear: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onClear,
}: NotificationItemProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    const iconClass = "h-5 w-5";
    switch (notification.type) {
      case "payment":
        return <DollarSign className={`${iconClass} text-green-500`} />;
      case "absence":
        return <UserX className={`${iconClass} text-orange-500`} />;
      case "message":
        return <MessageSquare className={`${iconClass} text-blue-500`} />;
      case "grade":
        return <GraduationCap className={`${iconClass} text-purple-500`} />;
      case "alert":
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      default:
        return <Info className={`${iconClass} text-gray-500`} />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div
      className={`p-4 border-b hover:bg-muted/50 transition-colors ${
        !notification.read ? "bg-primary/5" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold">{notification.title}</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onClear(notification.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.timestamp, {
                addSuffix: true,
                locale: fr,
              })}
            </span>
            
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor()} className="text-xs">
                {notification.priority === "high" ? "Urgent" : 
                 notification.priority === "medium" ? "Important" : "Info"}
              </Badge>
              
              {notification.link && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={handleClick}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Voir
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
