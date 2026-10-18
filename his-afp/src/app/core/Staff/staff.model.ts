export type UserRole = 'DOC' | 'INF' | 'AMM';

export const UserRoleLabel: Record<UserRole, string> = {
  DOC: 'Medico',
  INF: 'Infermiere',
  AMM: 'Amministrativo',
};

export interface StaffMember {
  id: number;
  username: string;
  role: UserRole;
  isActive: boolean;
}

export interface NewStaffMember extends Pick<StaffMember, 'username' | 'role'> {
  password: string;
}

export interface UsernameAvailability {
  available: boolean;
}
