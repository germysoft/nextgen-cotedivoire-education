import { useRole } from '@/contexts/RoleContext';
import { RolePermissions } from '@/types/roles';

export function usePermissions() {
  const { permissions, hasPermission } = useRole();

  return {
    permissions,
    hasPermission,
    canAccess: (permission: keyof RolePermissions) => hasPermission(permission),
  };
}
