import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BulletinTemplate } from "@/types/bulletin";
import { FileText, Layout, List, Minimize2, Palette } from "lucide-react";

interface BulletinTemplateSelectorProps {
  selectedTemplate: BulletinTemplate;
  onTemplateChange: (template: BulletinTemplate) => void;
}

const templates = [
  {
    id: 'classic' as BulletinTemplate,
    name: 'Classique',
    description: 'Bulletin traditionnel simple et épuré',
    icon: FileText,
  },
  {
    id: 'modern' as BulletinTemplate,
    name: 'Moderne',
    description: 'Design contemporain avec sections organisées',
    icon: Layout,
  },
  {
    id: 'detailed' as BulletinTemplate,
    name: 'Détaillé',
    description: 'Bulletin complet avec graphiques de performance',
    icon: List,
  },
  {
    id: 'compact' as BulletinTemplate,
    name: 'Compact',
    description: 'Format condensé pour économiser le papier',
    icon: Minimize2,
  },
  {
    id: 'colorful' as BulletinTemplate,
    name: 'Coloré',
    description: 'Bulletin avec code couleur par performance',
    icon: Palette,
  },
];

export function BulletinTemplateSelector({
  selectedTemplate,
  onTemplateChange,
}: BulletinTemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <Label>Modèle de bulletin</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border"
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      selectedTemplate === template.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
