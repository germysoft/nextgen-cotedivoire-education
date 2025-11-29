import { Shield, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useRole } from '@/contexts/RoleContext';
import { UserRole, roleLabels } from '@/types/roles';
import { Badge } from '@/components/ui/badge';
import { mockTeacherAssignments } from '@/data/teacherAssignments';

export function RoleSelector() {
  const { currentRole, currentUserId, setRole } = useRole();

  // Liste des enseignants disponibles pour la démo
  const teachers = Array.from(new Set(mockTeacherAssignments.map(a => a.teacherId)))
    .map(id => {
      const assignment = mockTeacherAssignments.find(a => a.teacherId === id)!;
      return { id, name: assignment.teacherName };
    });

  const handleTeacherChange = (teacherId: string) => {
    localStorage.setItem('demo_user_id', teacherId);
    setRole('enseignant'); // Force le rôle enseignant
    window.location.reload(); // Recharge pour appliquer le changement
  };

  const roles: UserRole[] = [
    'admin',
    'directeur',
    'enseignant',
    'comptable',
    'secretaire',
    'surveillant',
    'infirmier',
    'bibliothecaire',
  ];

  const getRoleBadgeVariant = (role: UserRole): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'directeur':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-9">
          <Shield className="h-4 w-4" />
          <span className="hidden md:inline">{roleLabels[currentRole]}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Changer de rôle (Demo)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950 rounded-md m-1">
          ⚠️ Mode démonstration uniquement
        </div>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          role === 'enseignant' ? (
            <DropdownMenuSub key={role}>
              <DropdownMenuSubTrigger className="flex items-center justify-between">
                <span>{roleLabels[role]}</span>
                {currentRole === role && (
                  <Badge variant={getRoleBadgeVariant(role)} className="ml-2">
                    Actuel
                  </Badge>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Choisir l'enseignant
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {teachers.map((teacher) => (
                  <DropdownMenuItem
                    key={teacher.id}
                    onClick={() => handleTeacherChange(teacher.id)}
                    className="flex items-center justify-between"
                  >
                    <span>{teacher.name}</span>
                    {currentRole === 'enseignant' && currentUserId === teacher.id && (
                      <Badge variant="secondary" className="ml-2">
                        Actuel
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem
              key={role}
              onClick={() => setRole(role)}
              className="flex items-center justify-between"
            >
              <span>{roleLabels[role]}</span>
              {currentRole === role && (
                <Badge variant={getRoleBadgeVariant(role)} className="ml-2">
                  Actuel
                </Badge>
              )}
            </DropdownMenuItem>
          )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
