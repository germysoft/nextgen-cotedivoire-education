import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, ArrowRight, AlertTriangle, CheckCircle2, Users, BookOpen, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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

interface DuplicationConfig {
  sourceClassId: string;
  targetClassIds: string[];
  keepTeachers: boolean;
  keepRooms: boolean;
  autoResolveConflicts: boolean;
  replaceExisting: boolean;
}

interface ConflictInfo {
  type: "teacher" | "room";
  day: string;
  time: string;
  description: string;
  resolution?: string;
}

interface ScheduleDuplicatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: TimeSlot[];
  classes: ClassItem[];
  teachers: Teacher[];
  rooms: Room[];
  subjectColors: Record<string, string>;
  onScheduleUpdated: (schedule: TimeSlot[]) => void;
}

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export const ScheduleDuplicator = ({
  open,
  onOpenChange,
  schedule,
  classes,
  teachers,
  rooms,
  subjectColors,
  onScheduleUpdated,
}: ScheduleDuplicatorProps) => {
  const [config, setConfig] = useState<DuplicationConfig>({
    sourceClassId: "",
    targetClassIds: [],
    keepTeachers: true,
    keepRooms: false,
    autoResolveConflicts: true,
    replaceExisting: false,
  });

  const [previewSlots, setPreviewSlots] = useState<TimeSlot[]>([]);
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sourceSchedule = useMemo(() => {
    return schedule.filter(s => s.classId === config.sourceClassId);
  }, [schedule, config.sourceClassId]);

  const availableTargetClasses = useMemo(() => {
    return classes.filter(c => c.id !== config.sourceClassId);
  }, [classes, config.sourceClassId]);

  const toggleTargetClass = (classId: string) => {
    if (config.targetClassIds.includes(classId)) {
      setConfig({
        ...config,
        targetClassIds: config.targetClassIds.filter(id => id !== classId),
      });
    } else {
      setConfig({
        ...config,
        targetClassIds: [...config.targetClassIds, classId],
      });
    }
    setPreviewSlots([]);
    setConflicts([]);
  };

  const findAvailableRoom = (
    day: string,
    startTime: string,
    endTime: string,
    preferredType: string,
    occupiedRooms: Set<string>
  ): Room | null => {
    // First try to find a room of the preferred type
    let room = rooms.find(r => {
      if (r.type !== preferredType) return false;
      const key = `${r.id}-${day}-${startTime}`;
      return !occupiedRooms.has(key);
    });

    // Fallback to any available room
    if (!room) {
      room = rooms.find(r => {
        const key = `${r.id}-${day}-${startTime}`;
        return !occupiedRooms.has(key);
      });
    }

    return room || null;
  };

  const findAvailableTeacher = (
    subject: string,
    day: string,
    startTime: string,
    occupiedTeachers: Set<string>
  ): Teacher | null => {
    return teachers.find(t => {
      if (!t.subjects.includes(subject)) return false;
      const key = `${t.id}-${day}-${startTime}`;
      return !occupiedTeachers.has(key);
    }) || null;
  };

  const analyzeAndPreview = () => {
    if (!config.sourceClassId || config.targetClassIds.length === 0) {
      toast.error("Veuillez sélectionner une classe source et au moins une classe cible");
      return;
    }

    setIsAnalyzing(true);
    const newSlots: TimeSlot[] = [];
    const detectedConflicts: ConflictInfo[] = [];

    // Track occupancy from existing schedule (excluding target classes if replacing)
    const occupiedTeachers = new Set<string>();
    const occupiedRooms = new Set<string>();

    // Build occupancy from existing schedule
    schedule.forEach(slot => {
      if (config.replaceExisting && config.targetClassIds.includes(slot.classId)) {
        return; // Skip if we're replacing these
      }
      occupiedTeachers.add(`${slot.teacherId}-${slot.day}-${slot.startTime}`);
      occupiedRooms.add(`${slot.roomId}-${slot.day}-${slot.startTime}`);
    });

    // Process each target class
    config.targetClassIds.forEach(targetClassId => {
      const targetClass = classes.find(c => c.id === targetClassId);
      if (!targetClass) return;

      sourceSchedule.forEach(sourceSlot => {
        let teacherId = sourceSlot.teacherId;
        let teacherName = sourceSlot.teacher;
        let roomId = sourceSlot.roomId;
        let roomName = sourceSlot.room;

        // Check teacher conflict
        const teacherKey = `${teacherId}-${sourceSlot.day}-${sourceSlot.startTime}`;
        if (occupiedTeachers.has(teacherKey)) {
          if (config.autoResolveConflicts && !config.keepTeachers) {
            const altTeacher = findAvailableTeacher(
              sourceSlot.subject,
              sourceSlot.day,
              sourceSlot.startTime,
              occupiedTeachers
            );
            if (altTeacher) {
              teacherId = altTeacher.id;
              teacherName = altTeacher.name;
              detectedConflicts.push({
                type: "teacher",
                day: sourceSlot.day,
                time: sourceSlot.startTime,
                description: `${sourceSlot.teacher} non disponible pour ${targetClass.name}`,
                resolution: `Remplacé par ${altTeacher.name}`,
              });
            } else {
              detectedConflicts.push({
                type: "teacher",
                day: sourceSlot.day,
                time: sourceSlot.startTime,
                description: `Aucun enseignant disponible pour ${sourceSlot.subject} (${targetClass.name})`,
              });
            }
          } else if (config.keepTeachers) {
            detectedConflicts.push({
              type: "teacher",
              day: sourceSlot.day,
              time: sourceSlot.startTime,
              description: `${sourceSlot.teacher} déjà occupé le ${sourceSlot.day} à ${sourceSlot.startTime}`,
            });
          }
        }

        // Check room conflict
        const roomKey = `${roomId}-${sourceSlot.day}-${sourceSlot.startTime}`;
        if (occupiedRooms.has(roomKey) || !config.keepRooms) {
          if (config.autoResolveConflicts) {
            const roomType = rooms.find(r => r.id === roomId)?.type || "Classe";
            const altRoom = findAvailableRoom(
              sourceSlot.day,
              sourceSlot.startTime,
              sourceSlot.endTime,
              roomType,
              occupiedRooms
            );
            if (altRoom) {
              if (occupiedRooms.has(roomKey)) {
                detectedConflicts.push({
                  type: "room",
                  day: sourceSlot.day,
                  time: sourceSlot.startTime,
                  description: `${sourceSlot.room} non disponible pour ${targetClass.name}`,
                  resolution: `Remplacée par ${altRoom.name}`,
                });
              }
              roomId = altRoom.id;
              roomName = altRoom.name;
            } else if (occupiedRooms.has(roomKey)) {
              detectedConflicts.push({
                type: "room",
                day: sourceSlot.day,
                time: sourceSlot.startTime,
                description: `Aucune salle disponible le ${sourceSlot.day} à ${sourceSlot.startTime}`,
              });
            }
          }
        }

        // Create new slot
        const newSlot: TimeSlot = {
          id: `dup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          day: sourceSlot.day,
          startTime: sourceSlot.startTime,
          endTime: sourceSlot.endTime,
          subject: sourceSlot.subject,
          teacher: teacherName,
          teacherId: teacherId,
          class: targetClass.name,
          classId: targetClass.id,
          room: roomName,
          roomId: roomId,
          color: sourceSlot.color,
        };

        newSlots.push(newSlot);

        // Mark as occupied for next iterations
        occupiedTeachers.add(`${teacherId}-${sourceSlot.day}-${sourceSlot.startTime}`);
        occupiedRooms.add(`${roomId}-${sourceSlot.day}-${sourceSlot.startTime}`);
      });
    });

    setPreviewSlots(newSlots);
    setConflicts(detectedConflicts);
    setIsAnalyzing(false);

    if (detectedConflicts.filter(c => !c.resolution).length === 0) {
      toast.success("Analyse terminée - Aucun conflit non résolu");
    } else {
      toast.warning(`${detectedConflicts.filter(c => !c.resolution).length} conflit(s) non résolu(s)`);
    }
  };

  const applyDuplication = () => {
    if (previewSlots.length === 0) {
      toast.error("Veuillez d'abord analyser la duplication");
      return;
    }

    const unresolvedConflicts = conflicts.filter(c => !c.resolution);
    if (unresolvedConflicts.length > 0) {
      toast.error(`${unresolvedConflicts.length} conflit(s) non résolu(s). Veuillez les corriger.`);
      return;
    }

    let updatedSchedule = [...schedule];

    // Remove existing slots for target classes if replacing
    if (config.replaceExisting) {
      updatedSchedule = updatedSchedule.filter(
        s => !config.targetClassIds.includes(s.classId)
      );
    }

    // Add new slots
    updatedSchedule = [...updatedSchedule, ...previewSlots];

    onScheduleUpdated(updatedSchedule);
    onOpenChange(false);

    const targetNames = config.targetClassIds
      .map(id => classes.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    toast.success(`Emploi du temps dupliqué vers: ${targetNames}`);
  };

  const resetPreview = () => {
    setPreviewSlots([]);
    setConflicts([]);
  };

  const sourceClass = classes.find(c => c.id === config.sourceClassId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-primary" />
            Dupliquer un Emploi du Temps
          </DialogTitle>
          <DialogDescription>
            Copiez l'emploi du temps d'une classe vers d'autres avec ajustements automatiques
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Source Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Classe source</Label>
              <Select
                value={config.sourceClassId}
                onValueChange={(v) => {
                  setConfig({ ...config, sourceClassId: v, targetClassIds: [] });
                  resetPreview();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la classe à copier" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {sourceClass && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">{sourceClass.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{sourceSchedule.length} créneaux à dupliquer</p>
                    <p>{[...new Set(sourceSchedule.map(s => s.subject))].length} matières</p>
                    <p>{[...new Set(sourceSchedule.map(s => s.teacherId))].length} enseignants</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label className="text-base font-semibold">Classes cibles</Label>
              <ScrollArea className="h-48 border rounded-lg p-2">
                <div className="space-y-2">
                  {availableTargetClasses.map(c => (
                    <div
                      key={c.id}
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        config.targetClassIds.includes(c.id)
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleTargetClass(c.id)}
                    >
                      <Checkbox
                        checked={config.targetClassIds.includes(c.id)}
                        onCheckedChange={() => toggleTargetClass(c.id)}
                      />
                      <div className="flex-1">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({schedule.filter(s => s.classId === c.id).length} créneaux existants)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {config.targetClassIds.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {config.targetClassIds.length} classe(s) sélectionnée(s)
                </p>
              )}
            </div>
          </div>

          {/* Options & Preview */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-base font-semibold">Options de duplication</Label>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="keep-teachers"
                      checked={config.keepTeachers}
                      onCheckedChange={(checked) => {
                        setConfig({ ...config, keepTeachers: !!checked });
                        resetPreview();
                      }}
                    />
                    <label htmlFor="keep-teachers" className="text-sm cursor-pointer">
                      Conserver les mêmes enseignants
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="keep-rooms"
                      checked={config.keepRooms}
                      onCheckedChange={(checked) => {
                        setConfig({ ...config, keepRooms: !!checked });
                        resetPreview();
                      }}
                    />
                    <label htmlFor="keep-rooms" className="text-sm cursor-pointer">
                      Conserver les mêmes salles
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-resolve"
                      checked={config.autoResolveConflicts}
                      onCheckedChange={(checked) => {
                        setConfig({ ...config, autoResolveConflicts: !!checked });
                        resetPreview();
                      }}
                    />
                    <label htmlFor="auto-resolve" className="text-sm cursor-pointer">
                      Résoudre automatiquement les conflits
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="replace-existing"
                      checked={config.replaceExisting}
                      onCheckedChange={(checked) => {
                        setConfig({ ...config, replaceExisting: !!checked });
                        resetPreview();
                      }}
                    />
                    <label htmlFor="replace-existing" className="text-sm cursor-pointer text-amber-600">
                      Remplacer l'emploi du temps existant des cibles
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conflicts & Preview */}
            {conflicts.length > 0 && (
              <Card className={conflicts.some(c => !c.resolution) ? "border-destructive" : "border-green-500"}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {conflicts.some(c => !c.resolution) ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Label className="text-sm font-semibold">
                      {conflicts.filter(c => !c.resolution).length > 0
                        ? `${conflicts.filter(c => !c.resolution).length} conflit(s) non résolu(s)`
                        : "Tous les conflits résolus"}
                    </Label>
                  </div>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {conflicts.map((conflict, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-2 rounded ${
                            conflict.resolution
                              ? "bg-green-500/10 text-green-700"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {conflict.type === "teacher" ? "Enseignant" : "Salle"}
                            </Badge>
                            <span>{conflict.day} {conflict.time}</span>
                          </div>
                          <p className="mt-1">{conflict.description}</p>
                          {conflict.resolution && (
                            <p className="text-green-600 mt-1">✓ {conflict.resolution}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {previewSlots.length > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">Aperçu</Label>
                    <Badge variant="secondary">{previewSlots.length} créneaux</Badge>
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    {config.targetClassIds.map(id => {
                      const targetClass = classes.find(c => c.id === id);
                      const targetSlots = previewSlots.filter(s => s.classId === id);
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <ArrowRight className="h-3 w-3" />
                          <span>{targetClass?.name}: {targetSlots.length} créneaux</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={analyzeAndPreview}
              disabled={!config.sourceClassId || config.targetClassIds.length === 0 || isAnalyzing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
              Analyser
            </Button>
            <Button
              onClick={applyDuplication}
              disabled={previewSlots.length === 0 || conflicts.some(c => !c.resolution)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Appliquer ({previewSlots.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDuplicator;
