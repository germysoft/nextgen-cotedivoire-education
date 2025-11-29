export type NotificationType = 
  | "payment" 
  | "absence" 
  | "message" 
  | "grade" 
  | "alert" 
  | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  priority: "low" | "medium" | "high";
}

export interface NotificationEvent {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  priority?: "low" | "medium" | "high";
}
