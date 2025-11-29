import { Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRole } from '@/contexts/RoleContext';
import { UserRole, roleLabels } from '@/types/roles';
import { Badge } from '@/components/ui/badge';

export function RoleSelector() {
  const { currentRole, setRole } = useRole();

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
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
