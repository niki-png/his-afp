import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize, forkJoin, Observable } from 'rxjs';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { GestioneStaff } from '../../core/Staff/gestione-staff';
import { StaffMember, UserRole, UserRoleOptions } from '../../core/Staff/staff.model';

@Component({
  selector: 'his-modifica-staff',
  imports: [ReactiveFormsModule, Button, Dialog, Message, Select, ToggleSwitch],
  templateUrl: './modifica-staff.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaStaff implements OnInit {
  readonly member = input.required<StaffMember>();
  readonly closed = output<void>();

  readonly #gestioneStaff = inject(GestioneStaff);
  readonly #fb = inject(NonNullableFormBuilder);
  readonly roleOptions = UserRoleOptions;
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);

  readonly editForm = this.#fb.group({
    role: this.#fb.control<UserRole>('DOC'),
    isActive: true,
  });

  ngOnInit() {
    const { role, isActive } = this.member();
    this.editForm.setValue({ role, isActive });
  }

  onSubmit() {
    const { id, role, isActive } = this.member();
    const changes = this.editForm.getRawValue();
    // Chiama solo gli endpoint dei campi effettivamente modificati
    const requests: Observable<unknown>[] = [];
    if (changes.role !== role) {
      requests.push(this.#gestioneStaff.editRole(id, changes.role));
    }
    if (changes.isActive !== isActive) {
      requests.push(this.#gestioneStaff.setActive(id, changes.isActive));
    }
    if (requests.length === 0) {
      this.closed.emit();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);
    forkJoin(requests)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.closed.emit(),
        error: () => this.saveError.set("Errore durante l'aggiornamento dell'operatore."),
      });
  }
}
