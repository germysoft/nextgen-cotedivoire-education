import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Download, FileText, Palette, Eye } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  teacherId: string;
  class: string;
  classId: string;
  room: string;
  roomId: string;
  color: string;
}

interface ClassItem {
  id: string;
  name: string;
  level: string;
}

interface PrintConfig {
  classId: string;
  orientation: "portrait" | "landscape";
  includeHeader: boolean;
  includeFooter: boolean;
  showTeacher: boolean;
  showRoom: boolean;
  colorMode: "color" | "grayscale" | "outline";
  schoolName: string;
  schoolYear: string;
  headerLogo: boolean;
  trimester: string;
}

interface SchedulePrintGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: TimeSlot[];
  classes: ClassItem[];
  subjectColors: Record<string, string>;
}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const colorMap: Record<string, [number, number, number]> = {
  "bg-blue-500": [59, 130, 246],
  "bg-green-500": [34, 197, 94],
  "bg-purple-500": [168, 85, 247],
  "bg-orange-500": [249, 115, 22],
  "bg-emerald-500": [16, 185, 129],
  "bg-amber-500": [245, 158, 11],
  "bg-red-500": [239, 68, 68],
  "bg-indigo-500": [99, 102, 241],
  "bg-cyan-500": [6, 182, 212],
  "bg-gray-500": [107, 114, 128],
};

export const SchedulePrintGenerator = ({
  open,
  onOpenChange,
  schedule,
  classes,
  subjectColors,
}: SchedulePrintGeneratorProps) => {
  const [config, setConfig] = useState<PrintConfig>({
    classId: classes[0]?.id || "",
    orientation: "landscape",
    includeHeader: true,
    includeFooter: true,
    showTeacher: true,
    showRoom: true,
    colorMode: "color",
    schoolName: "NextGen Éducation",
    schoolYear: "2024-2025",
    headerLogo: true,
    trimester: "1er Trimestre",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const getClassSchedule = () => {
    return schedule.filter(s => s.classId === config.classId);
  };

  const getSlotForCell = (classSchedule: TimeSlot[], day: string, time: string) => {
    return classSchedule.find(slot => {
      const slotStart = parseInt(slot.startTime.replace(":", ""));
      const slotEnd = parseInt(slot.endTime.replace(":", ""));
      const cellTime = parseInt(time.replace(":", ""));
      return slot.day === day && cellTime >= slotStart && cellTime < slotEnd;
    });
  };

  const generatePDF = () => {
    setIsGenerating(true);
    
    const selectedClass = classes.find(c => c.id === config.classId);
    if (!selectedClass) {
      toast.error("Veuillez sélectionner une classe");
      setIsGenerating(false);
      return;
    }

    const classSchedule = getClassSchedule();
    const isLandscape = config.orientation === "landscape";
    
    const doc = new jsPDF({
      orientation: config.orientation,
      unit: "mm",
      format: "a4",
    });

    const pageWidth = isLandscape ? 297 : 210;
    const pageHeight = isLandscape ? 210 : 297;
    const margin = 10;
    const contentWidth = pageWidth - (margin * 2);

    // Header
    if (config.includeHeader) {
      // School name
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text(config.schoolName, pageWidth / 2, 15, { align: "center" });

      // Title
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`EMPLOI DU TEMPS - ${selectedClass.name}`, pageWidth / 2, 24, { align: "center" });

      // Subtitle
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Année scolaire ${config.schoolYear} - ${config.trimester}`, pageWidth / 2, 30, { align: "center" });

      // Decorative line
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.5);
      doc.line(margin, 34, pageWidth - margin, 34);
    }

    const startY = config.includeHeader ? 40 : 15;

    // Build table data
    const tableHead = [["Heure", ...days]];
    const tableBody: any[][] = [];

    // Track which cells have been merged (for rowspan simulation)
    const processedCells = new Set<string>();

    timeSlots.forEach((time, timeIndex) => {
      const row: any[] = [time];
      
      days.forEach((day, dayIndex) => {
        const cellKey = `${day}-${time}`;
        
        if (processedCells.has(cellKey)) {
          row.push({ content: "", styles: { fillColor: [255, 255, 255] } });
          return;
        }

        const slot = getSlotForCell(classSchedule, day, time);
        
        if (slot && slot.startTime === time) {
          const startHour = parseInt(slot.startTime.split(":")[0]);
          const endHour = parseInt(slot.endTime.split(":")[0]);
          const duration = endHour - startHour;

          // Mark cells as processed for multi-hour slots
          for (let i = 1; i < duration; i++) {
            const nextTime = timeSlots[timeIndex + i];
            if (nextTime) {
              processedCells.add(`${day}-${nextTime}`);
            }
          }

          let content = slot.subject;
          if (config.showTeacher) {
            content += `\n${slot.teacher}`;
          }
          if (config.showRoom) {
            content += `\n${slot.room}`;
          }

          let fillColor: [number, number, number] = [255, 255, 255];
          let textColor: [number, number, number] = [0, 0, 0];

          if (config.colorMode === "color") {
            fillColor = colorMap[slot.color] || [200, 200, 200];
            textColor = [255, 255, 255];
          } else if (config.colorMode === "grayscale") {
            const rgb = colorMap[slot.color] || [128, 128, 128];
            const gray = Math.round(0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
            fillColor = [gray, gray, gray];
            textColor = gray < 128 ? [255, 255, 255] : [0, 0, 0];
          } else {
            fillColor = [255, 255, 255];
            textColor = [0, 0, 0];
          }

          row.push({
            content,
            rowSpan: duration,
            styles: {
              fillColor,
              textColor,
              fontStyle: "bold",
              halign: "center",
              valign: "middle",
              fontSize: 7,
              cellPadding: 1,
            },
          });
        } else if (!slot) {
          row.push({
            content: "",
            styles: { fillColor: [250, 250, 250] },
          });
        } else {
          row.push({ content: "", styles: { fillColor: [255, 255, 255] } });
        }
      });

      tableBody.push(row);
    });

    // Generate table
    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center", fontStyle: "bold" },
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didParseCell: (data) => {
        // Pause row (12:00-14:00)
        if (data.row.index === 5 || data.row.index === 6) {
          if (data.cell.raw === "") {
            data.cell.styles.fillColor = [241, 245, 249];
          }
        }
      },
    });

    // Footer
    if (config.includeFooter) {
      const finalY = (doc as any).lastAutoTable.finalY + 5;
      
      // Legend
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      
      const subjects = [...new Set(classSchedule.map(s => s.subject))];
      let legendX = margin;
      const legendY = Math.min(finalY + 5, pageHeight - 20);

      if (config.colorMode === "color") {
        doc.text("Légende:", legendX, legendY);
        legendX += 18;
        
        subjects.forEach((subject, index) => {
          const color = colorMap[subjectColors[subject]] || [128, 128, 128];
          doc.setFillColor(color[0], color[1], color[2]);
          doc.rect(legendX, legendY - 3, 4, 4, "F");
          doc.setTextColor(60, 60, 60);
          doc.text(subject, legendX + 6, legendY);
          legendX += doc.getTextWidth(subject) + 12;
          
          if (legendX > pageWidth - 50 && index < subjects.length - 1) {
            legendX = margin + 18;
          }
        });
      }

      // Print info
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      const now = new Date();
      doc.text(
        `Imprimé le ${now.toLocaleDateString("fr-FR")} à ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: "right" }
      );
      
      doc.text(
        `${config.schoolName} - ${config.schoolYear}`,
        margin,
        pageHeight - 8
      );
    }

    // Save
    const filename = `emploi-du-temps-${selectedClass.name.replace(/\s+/g, "-")}-${config.schoolYear}.pdf`;
    doc.save(filename);
    
    toast.success(`PDF généré: ${filename}`);
    setIsGenerating(false);
  };

  const generateAllClassesPDF = () => {
    setIsGenerating(true);
    
    const isLandscape = config.orientation === "landscape";
    const doc = new jsPDF({
      orientation: config.orientation,
      unit: "mm",
      format: "a4",
    });

    const pageWidth = isLandscape ? 297 : 210;
    const pageHeight = isLandscape ? 210 : 297;
    const margin = 10;

    classes.forEach((classItem, classIndex) => {
      if (classIndex > 0) {
        doc.addPage();
      }

      const classSchedule = schedule.filter(s => s.classId === classItem.id);

      // Header
      if (config.includeHeader) {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 64, 175);
        doc.text(config.schoolName, pageWidth / 2, 12, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`EMPLOI DU TEMPS - ${classItem.name}`, pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`${config.schoolYear} - ${config.trimester}`, pageWidth / 2, 26, { align: "center" });

        doc.setDrawColor(30, 64, 175);
        doc.setLineWidth(0.3);
        doc.line(margin, 30, pageWidth - margin, 30);
      }

      const startY = config.includeHeader ? 35 : 12;

      // Build table
      const tableHead = [["", ...days]];
      const tableBody: any[][] = [];
      const processedCells = new Set<string>();

      timeSlots.forEach((time, timeIndex) => {
        const row: any[] = [time];
        
        days.forEach((day) => {
          const cellKey = `${day}-${time}`;
          
          if (processedCells.has(cellKey)) {
            row.push({ content: "", styles: { fillColor: [255, 255, 255] } });
            return;
          }

          const slot = classSchedule.find(s => {
            const slotStart = parseInt(s.startTime.replace(":", ""));
            const slotEnd = parseInt(s.endTime.replace(":", ""));
            const cellTime = parseInt(time.replace(":", ""));
            return s.day === day && cellTime >= slotStart && cellTime < slotEnd;
          });
          
          if (slot && slot.startTime === time) {
            const startHour = parseInt(slot.startTime.split(":")[0]);
            const endHour = parseInt(slot.endTime.split(":")[0]);
            const duration = endHour - startHour;

            for (let i = 1; i < duration; i++) {
              const nextTime = timeSlots[timeIndex + i];
              if (nextTime) processedCells.add(`${day}-${nextTime}`);
            }

            let content = slot.subject;
            if (config.showTeacher) content += `\n${slot.teacher}`;
            if (config.showRoom) content += `\n${slot.room}`;

            let fillColor: [number, number, number] = [255, 255, 255];
            let textColor: [number, number, number] = [0, 0, 0];

            if (config.colorMode === "color") {
              fillColor = colorMap[slot.color] || [200, 200, 200];
              textColor = [255, 255, 255];
            }

            row.push({
              content,
              rowSpan: duration,
              styles: { fillColor, textColor, fontStyle: "bold", halign: "center", valign: "middle", fontSize: 6 },
            });
          } else if (!slot) {
            row.push({ content: "", styles: { fillColor: [250, 250, 250] } });
          } else {
            row.push({ content: "", styles: { fillColor: [255, 255, 255] } });
          }
        });

        tableBody.push(row);
      });

      autoTable(doc, {
        head: tableHead,
        body: tableBody,
        startY,
        margin: { left: margin, right: margin },
        styles: { fontSize: 6, cellPadding: 1, lineColor: [200, 200, 200], lineWidth: 0.1 },
        headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontStyle: "bold", halign: "center", fontSize: 7 },
        columnStyles: { 0: { cellWidth: 12, halign: "center", fontStyle: "bold" } },
      });

      // Page number
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${classIndex + 1}/${classes.length}`, pageWidth - margin, pageHeight - 5, { align: "right" });
    });

    doc.save(`emplois-du-temps-complet-${config.schoolYear}.pdf`);
    toast.success(`PDF généré avec ${classes.length} emplois du temps`);
    setIsGenerating(false);
  };

  const selectedClass = classes.find(c => c.id === config.classId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Impression des Emplois du Temps
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Classe à imprimer</Label>
              <Select value={config.classId} onValueChange={(v) => setConfig({ ...config, classId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Orientation</Label>
              <Select 
                value={config.orientation} 
                onValueChange={(v: "portrait" | "landscape") => setConfig({ ...config, orientation: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Paysage (recommandé)</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mode couleur</Label>
              <Select 
                value={config.colorMode} 
                onValueChange={(v: "color" | "grayscale" | "outline") => setConfig({ ...config, colorMode: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Couleur</SelectItem>
                  <SelectItem value="grayscale">Niveaux de gris</SelectItem>
                  <SelectItem value="outline">Contours uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom de l'établissement</Label>
                <Input 
                  value={config.schoolName} 
                  onChange={(e) => setConfig({ ...config, schoolName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Année scolaire</Label>
                <Input 
                  value={config.schoolYear} 
                  onChange={(e) => setConfig({ ...config, schoolYear: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Période</Label>
              <Select value={config.trimester} onValueChange={(v) => setConfig({ ...config, trimester: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1er Trimestre">1er Trimestre</SelectItem>
                  <SelectItem value="2ème Trimestre">2ème Trimestre</SelectItem>
                  <SelectItem value="3ème Trimestre">3ème Trimestre</SelectItem>
                  <SelectItem value="Année complète">Année complète</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4 space-y-3">
                <Label className="text-base font-semibold">Options d'affichage</Label>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="header"
                      checked={config.includeHeader}
                      onCheckedChange={(checked) => setConfig({ ...config, includeHeader: !!checked })}
                    />
                    <label htmlFor="header" className="text-sm cursor-pointer">
                      Inclure l'en-tête (nom école, titre)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="footer"
                      checked={config.includeFooter}
                      onCheckedChange={(checked) => setConfig({ ...config, includeFooter: !!checked })}
                    />
                    <label htmlFor="footer" className="text-sm cursor-pointer">
                      Inclure le pied de page (légende, date)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="teacher"
                      checked={config.showTeacher}
                      onCheckedChange={(checked) => setConfig({ ...config, showTeacher: !!checked })}
                    />
                    <label htmlFor="teacher" className="text-sm cursor-pointer">
                      Afficher le nom de l'enseignant
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="room"
                      checked={config.showRoom}
                      onCheckedChange={(checked) => setConfig({ ...config, showRoom: !!checked })}
                    />
                    <label htmlFor="room" className="text-sm cursor-pointer">
                      Afficher la salle
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedClass && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Aperçu</Label>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><strong>Classe:</strong> {selectedClass.name}</p>
                    <p><strong>Créneaux:</strong> {schedule.filter(s => s.classId === config.classId).length}</p>
                    <p><strong>Format:</strong> A4 {config.orientation === "landscape" ? "Paysage" : "Portrait"}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={generateAllClassesPDF} disabled={isGenerating}>
            <FileText className="h-4 w-4 mr-2" />
            Toutes les classes ({classes.length})
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={generatePDF} disabled={isGenerating || !config.classId}>
              <Download className="h-4 w-4 mr-2" />
              Générer PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePrintGenerator;
