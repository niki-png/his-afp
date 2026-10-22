import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Button } from 'primeng/button';
import { GestioneStaff } from '../../core/Staff/gestione-staff';
import { StaffMember, UserRole, UserRoleLabel } from '../../core/Staff/staff.model';
import { ModificaStaff } from '../modifica-staff/modifica-staff';

@Component({
  selector: 'his-tabella-staff',
  imports: [TableModule, TagModule, Button, ModificaStaff],
  templateUrl: './tabella-staff.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabellaStaff {
  readonly gestioneStaff = inject(GestioneStaff);
  // Operatore in modifica: il dialog esiste solo quando è valorizzato
  readonly editing = signal<StaffMember | null>(null);

  roleLabel(role: UserRole): string {
    return UserRoleLabel[role];
  }
}
