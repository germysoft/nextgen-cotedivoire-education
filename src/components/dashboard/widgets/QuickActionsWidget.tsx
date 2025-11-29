import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  DollarSign, 
  FileText, 
  Calendar,
  MessageSquare,
  BookOpen
} from "lucide-react";

const quickActions = [
  {
    label: "Nouvel Élève",
    icon: UserPlus,
    link: "/students",
    color: "text-blue-600",
  },
  {
    label: "Paiement",
    icon: DollarSign,
    link: "/scolarite/paiements",
    color: "text-green-600",
  },
  {
    label: "Notes",
    icon: FileText,
    link: "/grades",
    color: "text-purple-600",
  },
  {
    label: "Planning",
    icon: Calendar,
    link: "/teachers",
    color: "text-orange-600",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    link: "/messaging",
    color: "text-pink-600",
  },
  {
    label: "Bibliothèque",
    icon: BookOpen,
    link: "/library",
    color: "text-indigo-600",
  },
];

export function QuickActionsWidget() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.link}
            variant="outline"
            className="h-full flex flex-col items-center justify-center gap-2 hover:bg-muted"
            onClick={() => navigate(action.link)}
          >
            <Icon className={`h-6 w-6 ${action.color}`} />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
