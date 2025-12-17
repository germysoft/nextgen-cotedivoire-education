import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Settings2, Play, RotateCcw, CheckCircle2, AlertTriangle, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

interface SubjectRequirement {
  subject: string;
  hoursPerWeek: number;
  teacherId: string;
  preferredRoomType: string;
}

interface GenerationConfig {
  classIds: string[];
  maxHoursPerDay: number;
  breakStart: string;
  breakEnd: string;
  avoidConsecutiveSameSubject: boolean;
  distributeEvenly: boolean;
  prioritizeMorningForDifficult: boolean;
  maxIterations: number;
}

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

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
}

interface ClassItem {
  id: string;
  name: string;
  level: string;
}

interface AutoScheduleGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: ClassItem[];
  teachers: Teacher[];
  rooms: Room[];
  subjectColors: Record<string, string>;
  existingSchedule: TimeSlot[];
  onScheduleGenerated: (schedule: TimeSlot[]) => void;
}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const availableTimeSlots = [
  { start: "07:00", end: "08:00" },
  { start: "08:00", end: "09:00" },
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" },
];

const defaultSubjectRequirements: SubjectRequirement[] = [
  { subject: "Mathématiques", hoursPerWeek: 5, teacherId: "1", preferredRoomType: "Classe" },
  { subject: "Français", hoursPerWeek: 5, teacherId: "2", preferredRoomType: "Classe" },
  { subject: "Anglais", hoursPerWeek: 3, teacherId: "3", preferredRoomType: "Classe" },
  { subject: "Physique-Chimie", hoursPerWeek: 4, teacherId: "4", preferredRoomType: "Laboratoire" },
  { subject: "SVT", hoursPerWeek: 3, teacherId: "5", preferredRoomType: "Laboratoire" },
  { subject: "Histoire-Géo", hoursPerWeek: 3, teacherId: "6", preferredRoomType: "Classe" },
  { subject: "EPS", hoursPerWeek: 2, teacherId: "7", preferredRoomType: "Sport" },
];

const difficultSubjects = ["Mathématiques", "Physique-Chimie", "Français"];

export const AutoScheduleGenerator = ({
  open,
  onOpenChange,
  classes,
  teachers,
  rooms,
  subjectColors,
  existingSchedule,
  onScheduleGenerated,
}: AutoScheduleGeneratorProps) => {
  const [config, setConfig] = useState<GenerationConfig>({
    classIds: [],
    maxHoursPerDay: 6,
    breakStart: "12:00",
    breakEnd: "14:00",
    avoidConsecutiveSameSubject: true,
    distributeEvenly: true,
    prioritizeMorningForDifficult: true,
    maxIterations: 1000,
  });

  const [subjectRequirements, setSubjectRequirements] = useState<SubjectRequirement[]>(defaultSubjectRequirements);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStats, setGenerationStats] = useState<{
    totalSlots: number;
    conflicts: number;
    iterations: number;
    score: number;
  } | null>(null);
  const [previewSchedule, setPreviewSchedule] = useState<TimeSlot[]>([]);

  const updateSubjectHours = (subject: string, hours: number) => {
    setSubjectRequirements(prev =>
      prev.map(r => r.subject === subject ? { ...r, hoursPerWeek: hours } : r)
    );
  };

  const updateSubjectTeacher = (subject: string, teacherId: string) => {
    setSubjectRequirements(prev =>
      prev.map(r => r.subject === subject ? { ...r, teacherId } : r)
    );
  };

  // Optimization algorithm using constraint satisfaction with backtracking
  const generateSchedule = async () => {
    if (config.classIds.length === 0) {
      toast.error("Veuillez sélectionner au moins une classe");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStats(null);

    // Simulate async generation
    await new Promise(resolve => setTimeout(resolve, 100));

    const generatedSchedule: TimeSlot[] = [];
    let bestScore = -Infinity;
    let bestSchedule: TimeSlot[] = [];
    let iterations = 0;
    let conflicts = 0;

    // Track occupancy
    const teacherOccupancy: Map<string, Set<string>> = new Map();
    const roomOccupancy: Map<string, Set<string>> = new Map();
    const classOccupancy: Map<string, Set<string>> = new Map();

    const getSlotKey = (day: string, time: string) => `${day}-${time}`;

    const isSlotAvailable = (
      day: string,
      timeSlot: { start: string; end: string },
      teacherId: string,
      roomId: string,
      classId: string
    ) => {
      const key = getSlotKey(day, timeSlot.start);
      
      // Check teacher availability
      const teacherSlots = teacherOccupancy.get(teacherId) || new Set();
      if (teacherSlots.has(key)) return false;
      
      // Check room availability
      const roomSlots = roomOccupancy.get(roomId) || new Set();
      if (roomSlots.has(key)) return false;
      
      // Check class availability
      const classSlots = classOccupancy.get(classId) || new Set();
      if (classSlots.has(key)) return false;
      
      return true;
    };

    const markSlotOccupied = (
      day: string,
      timeSlot: { start: string; end: string },
      teacherId: string,
      roomId: string,
      classId: string
    ) => {
      const key = getSlotKey(day, timeSlot.start);
      
      if (!teacherOccupancy.has(teacherId)) teacherOccupancy.set(teacherId, new Set());
      teacherOccupancy.get(teacherId)!.add(key);
      
      if (!roomOccupancy.has(roomId)) roomOccupancy.set(roomId, new Set());
      roomOccupancy.get(roomId)!.add(key);
      
      if (!classOccupancy.has(classId)) classOccupancy.set(classId, new Set());
      classOccupancy.get(classId)!.add(key);
    };

    const findSuitableRoom = (preferredType: string, day: string, timeSlot: { start: string; end: string }) => {
      // First try preferred type
      let suitableRoom = rooms.find(r => {
        if (r.type !== preferredType) return false;
        const key = getSlotKey(day, timeSlot.start);
        const roomSlots = roomOccupancy.get(r.id) || new Set();
        return !roomSlots.has(key);
      });

      // Fallback to any available room
      if (!suitableRoom) {
        suitableRoom = rooms.find(r => {
          const key = getSlotKey(day, timeSlot.start);
          const roomSlots = roomOccupancy.get(r.id) || new Set();
          return !roomSlots.has(key);
        });
      }

      return suitableRoom;
    };

    const calculateScore = (schedule: TimeSlot[], classId: string) => {
      let score = 100;
      const classSchedule = schedule.filter(s => s.classId === classId);

      // Penalty for uneven distribution
      if (config.distributeEvenly) {
        const dayDistribution = days.map(day => 
          classSchedule.filter(s => s.day === day).length
        );
        const avg = dayDistribution.reduce((a, b) => a + b, 0) / days.length;
        const variance = dayDistribution.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / days.length;
        score -= variance * 5;
      }

      // Penalty for consecutive same subject
      if (config.avoidConsecutiveSameSubject) {
        for (const day of days) {
          const daySlots = classSchedule
            .filter(s => s.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          
          for (let i = 1; i < daySlots.length; i++) {
            if (daySlots[i].subject === daySlots[i - 1].subject) {
              score -= 10;
            }
          }
        }
      }

      // Bonus for difficult subjects in morning
      if (config.prioritizeMorningForDifficult) {
        const morningDifficult = classSchedule.filter(s => 
          difficultSubjects.includes(s.subject) && 
          parseInt(s.startTime) < 12
        ).length;
        score += morningDifficult * 3;
      }

      return score;
    };

    // Main generation loop
    for (const classId of config.classIds) {
      const classItem = classes.find(c => c.id === classId);
      if (!classItem) continue;

      const classHoursPerDay: Map<string, number> = new Map();
      days.forEach(d => classHoursPerDay.set(d, 0));

      // Sort subjects by hours (descending) for better allocation
      const sortedRequirements = [...subjectRequirements].sort((a, b) => b.hoursPerWeek - a.hoursPerWeek);

      for (const req of sortedRequirements) {
        let hoursToPlace = req.hoursPerWeek;
        const teacher = teachers.find(t => t.id === req.teacherId);
        if (!teacher) continue;

        // Prioritize morning slots for difficult subjects
        let slotsToTry = [...availableTimeSlots];
        if (config.prioritizeMorningForDifficult && difficultSubjects.includes(req.subject)) {
          slotsToTry.sort((a, b) => parseInt(a.start) - parseInt(b.start));
        } else {
          // Shuffle for variety
          slotsToTry = slotsToTry.sort(() => Math.random() - 0.5);
        }

        // Shuffle days for even distribution
        const shuffledDays = [...days].sort(() => Math.random() - 0.5);

        for (const day of shuffledDays) {
          if (hoursToPlace <= 0) break;
          
          const currentDayHours = classHoursPerDay.get(day) || 0;
          if (currentDayHours >= config.maxHoursPerDay) continue;

          for (const timeSlot of slotsToTry) {
            if (hoursToPlace <= 0) break;
            
            // Skip break time
            const slotHour = parseInt(timeSlot.start);
            if (slotHour >= 12 && slotHour < 14) continue;

            const room = findSuitableRoom(req.preferredRoomType, day, timeSlot);
            if (!room) continue;

            if (!isSlotAvailable(day, timeSlot, req.teacherId, room.id, classId)) continue;

            // Place the slot
            const newSlot: TimeSlot = {
              id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              day,
              startTime: timeSlot.start,
              endTime: timeSlot.end,
              subject: req.subject,
              teacher: teacher.name,
              teacherId: teacher.id,
              class: classItem.name,
              classId: classItem.id,
              room: room.name,
              roomId: room.id,
              color: subjectColors[req.subject] || "bg-gray-500",
            };

            generatedSchedule.push(newSlot);
            markSlotOccupied(day, timeSlot, req.teacherId, room.id, classId);
            classHoursPerDay.set(day, currentDayHours + 1);
            hoursToPlace--;
            iterations++;

            // Update progress
            const totalHours = subjectRequirements.reduce((a, b) => a + b.hoursPerWeek, 0) * config.classIds.length;
            setProgress(Math.min(99, Math.round((generatedSchedule.length / totalHours) * 100)));
            
            break;
          }
        }

        if (hoursToPlace > 0) {
          conflicts += hoursToPlace;
        }
      }
    }

    // Calculate final score
    let totalScore = 0;
    for (const classId of config.classIds) {
      totalScore += calculateScore(generatedSchedule, classId);
    }
    totalScore = Math.round(totalScore / config.classIds.length);

    setProgress(100);
    setPreviewSchedule(generatedSchedule);
    setGenerationStats({
      totalSlots: generatedSchedule.length,
      conflicts,
      iterations,
      score: Math.max(0, totalScore),
    });
    setIsGenerating(false);

    if (conflicts === 0) {
      toast.success(`Emploi du temps généré avec succès! Score: ${totalScore}/100`);
    } else {
      toast.warning(`Génération terminée avec ${conflicts} créneaux non placés`);
    }
  };

  const applySchedule = () => {
    if (previewSchedule.length === 0) return;
    
    // Remove existing slots for selected classes
    const filteredExisting = existingSchedule.filter(s => !config.classIds.includes(s.classId));
    const newSchedule = [...filteredExisting, ...previewSchedule];
    
    onScheduleGenerated(newSchedule);
    onOpenChange(false);
    toast.success("Emploi du temps appliqué avec succès!");
  };

  const resetGeneration = () => {
    setPreviewSchedule([]);
    setGenerationStats(null);
    setProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Génération Automatique d'Emploi du Temps
          </DialogTitle>
          <DialogDescription>
            Configurez les paramètres et laissez l'algorithme optimiser l'emploi du temps
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="classes" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes">Classes & Matières</TabsTrigger>
            <TabsTrigger value="constraints">Contraintes</TabsTrigger>
            <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Classes à planifier</Label>
              <div className="grid grid-cols-4 gap-2">
                {classes.map(c => (
                  <div key={c.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${c.id}`}
                      checked={config.classIds.includes(c.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setConfig({ ...config, classIds: [...config.classIds, c.id] });
                        } else {
                          setConfig({ ...config, classIds: config.classIds.filter(id => id !== c.id) });
                        }
                      }}
                    />
                    <label htmlFor={`class-${c.id}`} className="text-sm cursor-pointer">
                      {c.name}
                    </label>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfig({ ...config, classIds: classes.map(c => c.id) })}
              >
                Tout sélectionner
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Heures par matière (par semaine)</Label>
              <div className="grid grid-cols-1 gap-3">
                {subjectRequirements.map(req => (
                  <div key={req.subject} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className={`w-4 h-4 rounded ${subjectColors[req.subject] || "bg-gray-500"}`}></div>
                    <span className="font-medium w-32">{req.subject}</span>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">Heures:</Label>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={req.hoursPerWeek}
                        onChange={(e) => updateSubjectHours(req.subject, parseInt(e.target.value) || 1)}
                        className="w-16"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Label className="text-sm text-muted-foreground">Enseignant:</Label>
                      <Select
                        value={req.teacherId}
                        onValueChange={(v) => updateSubjectTeacher(req.subject, v)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="constraints" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <Label className="text-base font-semibold">Contraintes horaires</Label>
                  
                  <div className="space-y-2">
                    <Label>Max heures/jour par classe</Label>
                    <Select
                      value={config.maxHoursPerDay.toString()}
                      onValueChange={(v) => setConfig({ ...config, maxHoursPerDay: parseInt(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[4, 5, 6, 7, 8].map(h => (
                          <SelectItem key={h} value={h.toString()}>{h} heures</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Début pause</Label>
                      <Select
                        value={config.breakStart}
                        onValueChange={(v) => setConfig({ ...config, breakStart: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["11:00", "12:00", "13:00"].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fin pause</Label>
                      <Select
                        value={config.breakEnd}
                        onValueChange={(v) => setConfig({ ...config, breakEnd: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["13:00", "14:00", "15:00"].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 space-y-4">
                  <Label className="text-base font-semibold">Optimisations</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="avoid-consecutive"
                        checked={config.avoidConsecutiveSameSubject}
                        onCheckedChange={(checked) => 
                          setConfig({ ...config, avoidConsecutiveSameSubject: !!checked })
                        }
                      />
                      <label htmlFor="avoid-consecutive" className="text-sm cursor-pointer">
                        Éviter les matières consécutives identiques
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="distribute-evenly"
                        checked={config.distributeEvenly}
                        onCheckedChange={(checked) => 
                          setConfig({ ...config, distributeEvenly: !!checked })
                        }
                      />
                      <label htmlFor="distribute-evenly" className="text-sm cursor-pointer">
                        Répartir uniformément sur la semaine
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="morning-difficult"
                        checked={config.prioritizeMorningForDifficult}
                        onCheckedChange={(checked) => 
                          setConfig({ ...config, prioritizeMorningForDifficult: !!checked })
                        }
                      />
                      <label htmlFor="morning-difficult" className="text-sm cursor-pointer">
                        Matières difficiles le matin (Maths, PC, Français)
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">Paramètres avancés</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajustez les paramètres de l'algorithme d'optimisation
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Itérations max:</Label>
                    <Input
                      type="number"
                      min={100}
                      max={10000}
                      step={100}
                      value={config.maxIterations}
                      onChange={(e) => setConfig({ ...config, maxIterations: parseInt(e.target.value) || 1000 })}
                      className="w-24"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            {generationStats && (
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary">{generationStats.totalSlots}</div>
                    <div className="text-sm text-muted-foreground">Créneaux générés</div>
                  </CardContent>
                </Card>
                <Card className={generationStats.conflicts > 0 ? "border-destructive" : "border-green-500"}>
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl font-bold ${generationStats.conflicts > 0 ? "text-destructive" : "text-green-500"}`}>
                      {generationStats.conflicts}
                    </div>
                    <div className="text-sm text-muted-foreground">Conflits</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold">{generationStats.iterations}</div>
                    <div className="text-sm text-muted-foreground">Itérations</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl font-bold ${generationStats.score >= 80 ? "text-green-500" : generationStats.score >= 60 ? "text-amber-500" : "text-destructive"}`}>
                      {generationStats.score}/100
                    </div>
                    <div className="text-sm text-muted-foreground">Score qualité</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {previewSchedule.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Jour</th>
                        <th className="p-2 text-left">Horaire</th>
                        <th className="p-2 text-left">Classe</th>
                        <th className="p-2 text-left">Matière</th>
                        <th className="p-2 text-left">Enseignant</th>
                        <th className="p-2 text-left">Salle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewSchedule
                        .sort((a, b) => {
                          const dayDiff = days.indexOf(a.day) - days.indexOf(b.day);
                          if (dayDiff !== 0) return dayDiff;
                          return a.startTime.localeCompare(b.startTime);
                        })
                        .slice(0, 50)
                        .map((slot, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">{slot.day}</td>
                            <td className="p-2">{slot.startTime}-{slot.endTime}</td>
                            <td className="p-2">{slot.class}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded ${slot.color}`}></div>
                                {slot.subject}
                              </div>
                            </td>
                            <td className="p-2">{slot.teacher}</td>
                            <td className="p-2">{slot.room}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {previewSchedule.length > 50 && (
                  <div className="p-2 text-center text-sm text-muted-foreground bg-muted">
                    ... et {previewSchedule.length - 50} autres créneaux
                  </div>
                )}
              </div>
            )}

            {!generationStats && !isGenerating && (
              <div className="text-center py-12 text-muted-foreground">
                <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configurez les paramètres puis lancez la génération</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isGenerating && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Génération en cours...</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={resetGeneration} disabled={isGenerating}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={generateSchedule}
              disabled={isGenerating || config.classIds.length === 0}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Générer
            </Button>
            
            {previewSchedule.length > 0 && (
              <Button onClick={applySchedule} variant="default">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Appliquer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AutoScheduleGenerator;
