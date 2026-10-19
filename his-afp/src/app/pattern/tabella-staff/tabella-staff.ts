import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { GestioneStaff } from '../../core/Staff/gestione-staff';
import { UserRole, UserRoleLabel } from '../../core/Staff/staff.model';

@Component({
  selector: 'his-tabella-staff',
  imports: [TableModule, TagModule],
  templateUrl: './tabella-staff.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabellaStaff {
  readonly gestioneStaff = inject(GestioneStaff);

  roleLabel(role: UserRole): string {
    return UserRoleLabel[role];
  }
}
