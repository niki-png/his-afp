export type UserRole = 'DOC' | 'INF' | 'AMM';

export const UserRoleLabel: Record<UserRole, string> = {
  DOC: 'Medico',
  INF: 'Infermiere',
  AMM: 'Amministrativo',
};

export const UserRoleOptions = (Object.keys(UserRoleLabel) as UserRole[]).map((value) => ({
  value,
  label: UserRoleLabel[value],
}));

export interface StaffMember {
  id: number;
  username: string;
  role: UserRole;
  isActive: boolean;
}

export type StaffMemberRes = Omit<StaffMember, 'isActive'>;

export interface NewStaffMember extends Pick<StaffMember, 'username' | 'role'> {
  password: string;
}

export interface UsernameAvailability {
  available: boolean;
}
