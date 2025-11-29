import { WidgetType } from "@/types/dashboard";
import { WidgetContainer } from "./WidgetContainer";
import { StatsWidget } from "./widgets/StatsWidget";
import { ChartWidget } from "./widgets/ChartWidget";
import { ListWidget } from "./widgets/ListWidget";
import { QuickActionsWidget } from "./widgets/QuickActionsWidget";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  GraduationCap,
  UserX,
  AlertTriangle,
  Calendar,
} from "lucide-react";

interface WidgetRendererProps {
  type: WidgetType;
  onRemove: () => void;
}

// Mock data
const paymentData = [
  { name: "Sep", montant: 25000000 },
  { name: "Oct", montant: 32000000 },
  { name: "Nov", montant: 28000000 },
  { name: "Déc", montant: 35000000 },
  { name: "Jan", montant: 30000000 },
  { name: "Fév", montant: 26000000 },
];

const attendanceData = [
  { name: "Sep", taux: 92 },
  { name: "Oct", taux: 89 },
  { name: "Nov", taux: 94 },
  { name: "Déc", taux: 91 },
  { name: "Jan", taux: 93 },
  { name: "Fév", taux: 95 },
];

const classDistribution = [
  { name: "6ème", value: 120 },
  { name: "5ème", value: 110 },
  { name: "4ème", value: 95 },
  { name: "3ème", value: 88 },
  { name: "2nde", value: 75 },
  { name: "1ère", value: 62 },
  { name: "Tle", value: 55 },
];

const recentPayments = [
  {
    id: "1",
    title: "KOUASSI Jean",
    subtitle: "150,000 FCFA - Il y a 2h",
    icon: <DollarSign className="h-4 w-4 text-green-600" />,
    badge: <Badge variant="default">Soldé</Badge>,
  },
  {
    id: "2",
    title: "DIALLO Fatoumata",
    subtitle: "200,000 FCFA - Il y a 5h",
    icon: <DollarSign className="h-4 w-4 text-green-600" />,
    badge: <Badge variant="secondary">Partiel</Badge>,
  },
  {
    id: "3",
    title: "TOURÉ Mohamed",
    subtitle: "180,000 FCFA - Hier",
    icon: <DollarSign className="h-4 w-4 text-green-600" />,
    badge: <Badge variant="default">Soldé</Badge>,
  },
];

const recentAbsences = [
  {
    id: "1",
    title: "SANOGO Aminata",
    subtitle: "3ème C - Aujourd'hui",
    icon: <UserX className="h-4 w-4 text-orange-600" />,
    badge: <Badge variant="destructive">Non justifiée</Badge>,
  },
  {
    id: "2",
    title: "KONE Ibrahim",
    subtitle: "4ème A - Aujourd'hui",
    icon: <UserX className="h-4 w-4 text-orange-600" />,
    badge: <Badge variant="secondary">Justifiée</Badge>,
  },
];

const upcomingEvents = [
  {
    id: "1",
    title: "Conseil de Classe 3ème",
    subtitle: "Demain 14h00",
    icon: <Calendar className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "2",
    title: "Réunion APEL",
    subtitle: "Vendredi 15h30",
    icon: <Calendar className="h-4 w-4 text-blue-600" />,
  },
];

const alerts = [
  {
    id: "1",
    title: "KOUASSI Jean - Impayé",
    subtitle: "450,000 FCFA - 3 mois de retard",
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    badge: <Badge variant="destructive">Critique</Badge>,
  },
  {
    id: "2",
    title: "DIALLO Fatoumata - Impayé",
    subtitle: "300,000 FCFA - 2 mois de retard",
    icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
    badge: <Badge className="bg-orange-500">Important</Badge>,
  },
];

export function WidgetRenderer({ type, onRemove }: WidgetRendererProps) {
  const renderContent = () => {
    switch (type) {
      case "stats-students":
        return (
          <StatsWidget
            value="465"
            label="Élèves inscrits"
            icon={Users}
            trend={{ value: 5.2, isPositive: true }}
            color="text-blue-600"
          />
        );

      case "stats-payments":
        return (
          <StatsWidget
            value="35M"
            label="Paiements ce mois"
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
            color="text-green-600"
          />
        );

      case "stats-teachers":
        return (
          <StatsWidget
            value="45"
            label="Enseignants actifs"
            icon={GraduationCap}
            color="text-purple-600"
          />
        );

      case "stats-absences":
        return (
          <StatsWidget
            value="8"
            label="Absences aujourd'hui"
            icon={UserX}
            trend={{ value: 2.1, isPositive: false }}
            color="text-orange-600"
          />
        );

      case "payment-chart":
        return (
          <ChartWidget
            type="bar"
            data={paymentData}
            dataKey="montant"
            xAxisKey="name"
          />
        );

      case "attendance-chart":
        return (
          <ChartWidget
            type="line"
            data={attendanceData}
            dataKey="taux"
            xAxisKey="name"
            color="hsl(var(--chart-2))"
          />
        );

      case "class-distribution":
        return (
          <ChartWidget
            type="pie"
            data={classDistribution}
            dataKey="value"
          />
        );

      case "recent-payments":
        return <ListWidget items={recentPayments} />;

      case "recent-absences":
        return <ListWidget items={recentAbsences} />;

      case "upcoming-events":
        return <ListWidget items={upcomingEvents} />;

      case "alerts-summary":
        return <ListWidget items={alerts} />;

      case "quick-actions":
        return <QuickActionsWidget />;

      default:
        return <div>Widget non implémenté</div>;
    }
  };

  const getTitle = () => {
    const titles: Record<WidgetType, string> = {
      "stats-students": "Total Élèves",
      "stats-payments": "Paiements du Mois",
      "stats-teachers": "Enseignants",
      "stats-absences": "Absences Aujourd'hui",
      "payment-chart": "Évolution des Paiements",
      "attendance-chart": "Taux de Présence",
      "class-distribution": "Répartition par Classe",
      "recent-payments": "Paiements Récents",
      "recent-absences": "Absences Récentes",
      "upcoming-events": "Événements à Venir",
      "alerts-summary": "Alertes Importantes",
      "quick-actions": "Actions Rapides",
    };
    return titles[type] || "Widget";
  };

  return (
    <WidgetContainer title={getTitle()} onRemove={onRemove}>
      {renderContent()}
    </WidgetContainer>
  );
}
