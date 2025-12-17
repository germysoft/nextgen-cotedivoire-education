import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, AlertTriangle, Download, Plus, Users, BookOpen, MapPin, Search, Eye, Trash2, Edit, Check, X, Wand2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AutoScheduleGenerator } from "@/components/schedule/AutoScheduleGenerator";

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

interface Conflict {
  id: string;
  type: "teacher" | "room" | "class";
  description: string;
  slots: TimeSlot[];
  severity: "high" | "medium";
}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const subjectColors: Record<string, string> = {
  "Mathématiques": "bg-blue-500",
  "Français": "bg-green-500",
  "Anglais": "bg-purple-500",
  "Physique-Chimie": "bg-orange-500",
  "SVT": "bg-emerald-500",
  "Histoire-Géo": "bg-amber-500",
  "EPS": "bg-red-500",
  "Philosophie": "bg-indigo-500",
  "Informatique": "bg-cyan-500",
};

const mockClasses = [
  { id: "1", name: "6ème A", level: "6ème" },
  { id: "2", name: "6ème B", level: "6ème" },
  { id: "3", name: "5ème A", level: "5ème" },
  { id: "4", name: "4ème A", level: "4ème" },
  { id: "5", name: "3ème A", level: "3ème" },
  { id: "6", name: "2nde A", level: "2nde" },
  { id: "7", name: "1ère S", level: "1ère" },
  { id: "8", name: "Tle D", level: "Tle" },
];

const mockTeachers = [
  { id: "1", name: "M. Kouassi Jean", subjects: ["Mathématiques"] },
  { id: "2", name: "Mme Bamba Awa", subjects: ["Français"] },
  { id: "3", name: "M. Traoré Ibrahim", subjects: ["Anglais"] },
  { id: "4", name: "Mme Koné Fatou", subjects: ["Physique-Chimie"] },
  { id: "5", name: "M. Diallo Moussa", subjects: ["SVT"] },
  { id: "6", name: "Mme Ouattara Marie", subjects: ["Histoire-Géo"] },
  { id: "7", name: "M. Sanogo Paul", subjects: ["EPS"] },
  { id: "8", name: "Mme Coulibaly Aïcha", subjects: ["Philosophie"] },
];

const mockRooms = [
  { id: "1", name: "Salle 101", capacity: 40, type: "Classe" },
  { id: "2", name: "Salle 102", capacity: 40, type: "Classe" },
  { id: "3", name: "Salle 103", capacity: 35, type: "Classe" },
  { id: "4", name: "Labo Physique", capacity: 25, type: "Laboratoire" },
  { id: "5", name: "Labo SVT", capacity: 25, type: "Laboratoire" },
  { id: "6", name: "Salle Info", capacity: 30, type: "Informatique" },
  { id: "7", name: "Gymnase", capacity: 100, type: "Sport" },
  { id: "8", name: "Salle 201", capacity: 40, type: "Classe" },
];

const initialSchedule: TimeSlot[] = [
  { id: "1", day: "Lundi", startTime: "07:00", endTime: "09:00", subject: "Mathématiques", teacher: "M. Kouassi Jean", teacherId: "1", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-blue-500" },
  { id: "2", day: "Lundi", startTime: "09:00", endTime: "11:00", subject: "Français", teacher: "Mme Bamba Awa", teacherId: "2", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-green-500" },
  { id: "3", day: "Lundi", startTime: "11:00", endTime: "12:00", subject: "Anglais", teacher: "M. Traoré Ibrahim", teacherId: "3", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-purple-500" },
  { id: "4", day: "Lundi", startTime: "14:00", endTime: "16:00", subject: "EPS", teacher: "M. Sanogo Paul", teacherId: "7", class: "6ème A", classId: "1", room: "Gymnase", roomId: "7", color: "bg-red-500" },
  { id: "5", day: "Mardi", startTime: "07:00", endTime: "09:00", subject: "Physique-Chimie", teacher: "Mme Koné Fatou", teacherId: "4", class: "6ème A", classId: "1", room: "Labo Physique", roomId: "4", color: "bg-orange-500" },
  { id: "6", day: "Mardi", startTime: "09:00", endTime: "11:00", subject: "Histoire-Géo", teacher: "Mme Ouattara Marie", teacherId: "6", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-amber-500" },
  { id: "7", day: "Mardi", startTime: "14:00", endTime: "16:00", subject: "SVT", teacher: "M. Diallo Moussa", teacherId: "5", class: "6ème A", classId: "1", room: "Labo SVT", roomId: "5", color: "bg-emerald-500" },
  { id: "8", day: "Mercredi", startTime: "07:00", endTime: "09:00", subject: "Mathématiques", teacher: "M. Kouassi Jean", teacherId: "1", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-blue-500" },
  { id: "9", day: "Mercredi", startTime: "09:00", endTime: "11:00", subject: "Français", teacher: "Mme Bamba Awa", teacherId: "2", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-green-500" },
  { id: "10", day: "Jeudi", startTime: "07:00", endTime: "09:00", subject: "Anglais", teacher: "M. Traoré Ibrahim", teacherId: "3", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-purple-500" },
  { id: "11", day: "Jeudi", startTime: "09:00", endTime: "11:00", subject: "Mathématiques", teacher: "M. Kouassi Jean", teacherId: "1", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-blue-500" },
  { id: "12", day: "Jeudi", startTime: "14:00", endTime: "16:00", subject: "Physique-Chimie", teacher: "Mme Koné Fatou", teacherId: "4", class: "6ème A", classId: "1", room: "Labo Physique", roomId: "4", color: "bg-orange-500" },
  { id: "13", day: "Vendredi", startTime: "07:00", endTime: "09:00", subject: "SVT", teacher: "M. Diallo Moussa", teacherId: "5", class: "6ème A", classId: "1", room: "Labo SVT", roomId: "5", color: "bg-emerald-500" },
  { id: "14", day: "Vendredi", startTime: "09:00", endTime: "11:00", subject: "Histoire-Géo", teacher: "Mme Ouattara Marie", teacherId: "6", class: "6ème A", classId: "1", room: "Salle 101", roomId: "1", color: "bg-amber-500" },
  { id: "15", day: "Vendredi", startTime: "14:00", endTime: "16:00", subject: "EPS", teacher: "M. Sanogo Paul", teacherId: "7", class: "6ème A", classId: "1", room: "Gymnase", roomId: "7", color: "bg-red-500" },
  // Conflits intentionnels pour démo
  { id: "16", day: "Lundi", startTime: "07:00", endTime: "09:00", subject: "Mathématiques", teacher: "M. Kouassi Jean", teacherId: "1", class: "5ème A", classId: "3", room: "Salle 102", roomId: "2", color: "bg-blue-500" },
  { id: "17", day: "Mardi", startTime: "09:00", endTime: "11:00", subject: "Français", teacher: "Mme Bamba Awa", teacherId: "2", class: "5ème A", classId: "3", room: "Salle 101", roomId: "1", color: "bg-green-500" },
];

const EmploisDuTemps = () => {
  const [schedule, setSchedule] = useState<TimeSlot[]>(initialSchedule);
  const [selectedClass, setSelectedClass] = useState<string>("1");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"class" | "teacher" | "room">("class");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAutoGenerateOpen, setIsAutoGenerateOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newSlot, setNewSlot] = useState({
    day: "Lundi",
    startTime: "07:00",
    endTime: "09:00",
    subject: "Mathématiques",
    teacherId: "1",
    classId: "1",
    roomId: "1",
  });

  // Détection des conflits
  const conflicts = useMemo(() => {
    const detectedConflicts: Conflict[] = [];
    
    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        const slot1 = schedule[i];
        const slot2 = schedule[j];
        
        if (slot1.day !== slot2.day) continue;
        
        const start1 = parseInt(slot1.startTime.replace(":", ""));
        const end1 = parseInt(slot1.endTime.replace(":", ""));
        const start2 = parseInt(slot2.startTime.replace(":", ""));
        const end2 = parseInt(slot2.endTime.replace(":", ""));
        
        const overlap = start1 < end2 && start2 < end1;
        
        if (overlap) {
          // Conflit enseignant
          if (slot1.teacherId === slot2.teacherId) {
            const existing = detectedConflicts.find(c => 
              c.type === "teacher" && 
              c.slots.some(s => s.id === slot1.id || s.id === slot2.id)
            );
            if (!existing) {
              detectedConflicts.push({
                id: `teacher-${slot1.id}-${slot2.id}`,
                type: "teacher",
                description: `${slot1.teacher} est assigné à deux cours en même temps (${slot1.day} ${slot1.startTime}-${slot1.endTime})`,
                slots: [slot1, slot2],
                severity: "high",
              });
            }
          }
          
          // Conflit salle
          if (slot1.roomId === slot2.roomId) {
            const existing = detectedConflicts.find(c => 
              c.type === "room" && 
              c.slots.some(s => s.id === slot1.id || s.id === slot2.id)
            );
            if (!existing) {
              detectedConflicts.push({
                id: `room-${slot1.id}-${slot2.id}`,
                type: "room",
                description: `${slot1.room} est utilisée par deux classes en même temps (${slot1.day} ${slot1.startTime}-${slot1.endTime})`,
                slots: [slot1, slot2],
                severity: "high",
              });
            }
          }
          
          // Conflit classe
          if (slot1.classId === slot2.classId) {
            const existing = detectedConflicts.find(c => 
              c.type === "class" && 
              c.slots.some(s => s.id === slot1.id || s.id === slot2.id)
            );
            if (!existing) {
              detectedConflicts.push({
                id: `class-${slot1.id}-${slot2.id}`,
                type: "class",
                description: `${slot1.class} a deux cours en même temps (${slot1.day} ${slot1.startTime}-${slot1.endTime})`,
                slots: [slot1, slot2],
                severity: "high",
              });
            }
          }
        }
      }
    }
    
    return detectedConflicts;
  }, [schedule]);

  // Filtrage de l'emploi du temps
  const filteredSchedule = useMemo(() => {
    let filtered = schedule;
    
    if (viewMode === "class" && selectedClass !== "all") {
      filtered = filtered.filter(s => s.classId === selectedClass);
    } else if (viewMode === "teacher" && selectedTeacher !== "all") {
      filtered = filtered.filter(s => s.teacherId === selectedTeacher);
    } else if (viewMode === "room" && selectedRoom !== "all") {
      filtered = filtered.filter(s => s.roomId === selectedRoom);
    }
    
    return filtered;
  }, [schedule, viewMode, selectedClass, selectedTeacher, selectedRoom]);

  // Statistiques
  const stats = useMemo(() => {
    const totalHours = schedule.reduce((acc, slot) => {
      const start = parseInt(slot.startTime.split(":")[0]);
      const end = parseInt(slot.endTime.split(":")[0]);
      return acc + (end - start);
    }, 0);
    
    const uniqueClasses = new Set(schedule.map(s => s.classId)).size;
    const uniqueTeachers = new Set(schedule.map(s => s.teacherId)).size;
    
    return {
      totalSlots: schedule.length,
      totalHours,
      uniqueClasses,
      uniqueTeachers,
      conflicts: conflicts.length,
    };
  }, [schedule, conflicts]);

  const getSlotForCell = (day: string, time: string) => {
    return filteredSchedule.find(slot => {
      const slotStart = parseInt(slot.startTime.replace(":", ""));
      const slotEnd = parseInt(slot.endTime.replace(":", ""));
      const cellTime = parseInt(time.replace(":", ""));
      return slot.day === day && cellTime >= slotStart && cellTime < slotEnd;
    });
  };

  const getSlotSpan = (slot: TimeSlot) => {
    const start = parseInt(slot.startTime.split(":")[0]);
    const end = parseInt(slot.endTime.split(":")[0]);
    return end - start;
  };

  const isSlotStart = (slot: TimeSlot, time: string) => {
    return slot.startTime === time;
  };

  const handleAddSlot = () => {
    const teacher = mockTeachers.find(t => t.id === newSlot.teacherId);
    const classItem = mockClasses.find(c => c.id === newSlot.classId);
    const room = mockRooms.find(r => r.id === newSlot.roomId);
    
    if (!teacher || !classItem || !room) return;
    
    const slot: TimeSlot = {
      id: Date.now().toString(),
      day: newSlot.day,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      subject: newSlot.subject,
      teacher: teacher.name,
      teacherId: teacher.id,
      class: classItem.name,
      classId: classItem.id,
      room: room.name,
      roomId: room.id,
      color: subjectColors[newSlot.subject] || "bg-gray-500",
    };
    
    setSchedule([...schedule, slot]);
    setIsAddDialogOpen(false);
    toast.success("Créneau ajouté avec succès");
  };

  const handleDeleteSlot = (id: string) => {
    setSchedule(schedule.filter(s => s.id !== id));
    toast.success("Créneau supprimé");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = viewMode === "class" 
      ? `Emploi du temps - ${mockClasses.find(c => c.id === selectedClass)?.name || "Toutes les classes"}`
      : viewMode === "teacher"
      ? `Emploi du temps - ${mockTeachers.find(t => t.id === selectedTeacher)?.name || "Tous les enseignants"}`
      : `Emploi du temps - ${mockRooms.find(r => r.id === selectedRoom)?.name || "Toutes les salles"}`;
    
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 14, 28);
    
    // Tableau de l'emploi du temps
    const tableData: string[][] = [];
    
    timeSlots.forEach(time => {
      const row = [time];
      days.forEach(day => {
        const slot = filteredSchedule.find(s => s.day === day && s.startTime === time);
        if (slot) {
          row.push(`${slot.subject}\n${slot.teacher}\n${slot.room}`);
        } else {
          row.push("");
        }
      });
      tableData.push(row);
    });
    
    autoTable(doc, {
      head: [["Heure", ...days]],
      body: tableData,
      startY: 35,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: {
        0: { cellWidth: 15 },
      },
    });
    
    // Liste des conflits
    if (conflicts.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 35;
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text("Conflits détectés", 14, finalY + 15);
      
      const conflictData = conflicts.map(c => [
        c.type === "teacher" ? "Enseignant" : c.type === "room" ? "Salle" : "Classe",
        c.description,
      ]);
      
      autoTable(doc, {
        head: [["Type", "Description"]],
        body: conflictData,
        startY: finalY + 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [220, 38, 38] },
      });
    }
    
    doc.save(`emploi-du-temps-${Date.now()}.pdf`);
    toast.success("PDF exporté avec succès");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Emplois du Temps</h1>
          <p className="text-muted-foreground">Planification, détection des conflits et export</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => setIsAutoGenerateOpen(true)}>
            <Wand2 className="h-4 w-4 mr-2" />
            Génération Auto
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un créneau
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un créneau</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Jour</Label>
                    <Select value={newSlot.day} onValueChange={(v) => setNewSlot({...newSlot, day: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Matière</Label>
                    <Select value={newSlot.subject} onValueChange={(v) => setNewSlot({...newSlot, subject: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(subjectColors).map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heure début</Label>
                    <Select value={newSlot.startTime} onValueChange={(v) => setNewSlot({...newSlot, startTime: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Heure fin</Label>
                    <Select value={newSlot.endTime} onValueChange={(v) => setNewSlot({...newSlot, endTime: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Enseignant</Label>
                  <Select value={newSlot.teacherId} onValueChange={(v) => setNewSlot({...newSlot, teacherId: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Classe</Label>
                  <Select value={newSlot.classId} onValueChange={(v) => setNewSlot({...newSlot, classId: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClasses.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Salle</Label>
                  <Select value={newSlot.roomId} onValueChange={(v) => setNewSlot({...newSlot, roomId: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>{room.name} ({room.capacity} places)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSlot} className="w-full">
                  Ajouter le créneau
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Créneaux</p>
                <p className="text-2xl font-bold">{stats.totalSlots}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Heures totales</p>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Classes</p>
                <p className="text-2xl font-bold">{stats.uniqueClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enseignants</p>
                <p className="text-2xl font-bold">{stats.uniqueTeachers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={conflicts.length > 0 ? "border-destructive" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${conflicts.length > 0 ? "bg-destructive/10" : "bg-muted"}`}>
                <AlertTriangle className={`h-5 w-5 ${conflicts.length > 0 ? "text-destructive" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conflits</p>
                <p className={`text-2xl font-bold ${conflicts.length > 0 ? "text-destructive" : ""}`}>{stats.conflicts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflits détectés */}
      {conflicts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Conflits détectés ({conflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map(conflict => (
                <div key={conflict.id} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="flex items-center gap-3">
                    <Badge variant={conflict.type === "teacher" ? "default" : conflict.type === "room" ? "secondary" : "outline"}>
                      {conflict.type === "teacher" ? "Enseignant" : conflict.type === "room" ? "Salle" : "Classe"}
                    </Badge>
                    <span className="text-sm">{conflict.description}</span>
                  </div>
                  <div className="flex gap-2">
                    {conflict.slots.map(slot => (
                      <Button key={slot.id} variant="ghost" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="weekly" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="weekly">Vue hebdomadaire</TabsTrigger>
            <TabsTrigger value="list">Liste des créneaux</TabsTrigger>
            <TabsTrigger value="rooms">Occupation des salles</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-4">
            <Select value={viewMode} onValueChange={(v: "class" | "teacher" | "room") => setViewMode(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vue par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class">Par classe</SelectItem>
                <SelectItem value="teacher">Par enseignant</SelectItem>
                <SelectItem value="room">Par salle</SelectItem>
              </SelectContent>
            </Select>
            
            {viewMode === "class" && (
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {mockClasses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {viewMode === "teacher" && (
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Enseignant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {mockTeachers.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {viewMode === "room" && (
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Salle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {mockRooms.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <TabsContent value="weekly">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-3 border text-left w-20">Heure</th>
                    {days.map(day => (
                      <th key={day} className="p-3 border text-center">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time, timeIndex) => (
                    <tr key={time}>
                      <td className="p-2 border text-sm font-medium bg-muted/50">{time}</td>
                      {days.map(day => {
                        const slot = getSlotForCell(day, time);
                        
                        if (slot && isSlotStart(slot, time)) {
                          const span = getSlotSpan(slot);
                          const hasConflict = conflicts.some(c => c.slots.some(s => s.id === slot.id));
                          
                          return (
                            <td 
                              key={`${day}-${time}`} 
                              className={`border p-1 ${hasConflict ? "bg-destructive/10" : ""}`}
                              rowSpan={span}
                            >
                              <div className={`${slot.color} text-white p-2 rounded-md h-full min-h-[60px] relative group`}>
                                <div className="font-medium text-xs">{slot.subject}</div>
                                <div className="text-xs opacity-90">{slot.teacher}</div>
                                <div className="text-xs opacity-75 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {slot.room}
                                </div>
                                {viewMode !== "class" && (
                                  <div className="text-xs opacity-75 mt-1">{slot.class}</div>
                                )}
                                {hasConflict && (
                                  <AlertTriangle className="absolute top-1 right-1 h-4 w-4 text-yellow-300" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/40"
                                  onClick={() => handleDeleteSlot(slot.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          );
                        } else if (slot && !isSlotStart(slot, time)) {
                          return null;
                        }
                        
                        return <td key={`${day}-${time}`} className="border p-1 h-16 bg-background"></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jour</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Salle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedule
                    .filter(slot => 
                      slot.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      slot.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      slot.class.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => {
                      const dayOrder = days.indexOf(a.day) - days.indexOf(b.day);
                      if (dayOrder !== 0) return dayOrder;
                      return a.startTime.localeCompare(b.startTime);
                    })
                    .map(slot => {
                      const hasConflict = conflicts.some(c => c.slots.some(s => s.id === slot.id));
                      return (
                        <TableRow key={slot.id} className={hasConflict ? "bg-destructive/5" : ""}>
                          <TableCell>{slot.day}</TableCell>
                          <TableCell>{slot.startTime} - {slot.endTime}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${slot.color}`}></div>
                              {slot.subject}
                            </div>
                          </TableCell>
                          <TableCell>{slot.teacher}</TableCell>
                          <TableCell>{slot.class}</TableCell>
                          <TableCell>{slot.room}</TableCell>
                          <TableCell>
                            {hasConflict ? (
                              <Badge variant="destructive">Conflit</Badge>
                            ) : (
                              <Badge variant="secondary">OK</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockRooms.map(room => {
              const roomSlots = schedule.filter(s => s.roomId === room.id);
              const totalHours = roomSlots.reduce((acc, slot) => {
                const start = parseInt(slot.startTime.split(":")[0]);
                const end = parseInt(slot.endTime.split(":")[0]);
                return acc + (end - start);
              }, 0);
              const occupancyRate = Math.round((totalHours / (timeSlots.length * days.length)) * 100);
              
              return (
                <Card key={room.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{room.name}</span>
                      <Badge variant="outline">{room.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Capacité</span>
                        <span className="font-medium">{room.capacity} places</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Heures/semaine</span>
                        <span className="font-medium">{totalHours}h</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Taux d'occupation</span>
                        <span className="font-medium">{occupancyRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${occupancyRate > 80 ? "bg-destructive" : occupancyRate > 50 ? "bg-amber-500" : "bg-green-500"}`}
                          style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                        ></div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setViewMode("room");
                          setSelectedRoom(room.id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir l'emploi du temps
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <AutoScheduleGenerator
        open={isAutoGenerateOpen}
        onOpenChange={setIsAutoGenerateOpen}
        classes={mockClasses}
        teachers={mockTeachers}
        rooms={mockRooms}
        subjectColors={subjectColors}
        existingSchedule={schedule}
        onScheduleGenerated={setSchedule}
      />
    </div>
  );
};

export default EmploisDuTemps;
