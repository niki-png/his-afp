import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import { GestioneStaff } from '../../core/Staff/gestione-staff';
import { NewStaffMember, UserRole, UserRoleOptions } from '../../core/Staff/staff.model';
import { usernameAvailableValidator } from '../../core/Staff/username-validator';

@Component({
  selector: 'his-nuovo-staff',
  imports: [ReactiveFormsModule, Button, Fieldset, InputText, Message, Password, Select],
  templateUrl: './nuovo-staff.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuovoStaff {
  readonly #gestioneStaff = inject(GestioneStaff);
  readonly #fb = inject(NonNullableFormBuilder);
  readonly roleOptions = UserRoleOptions;

  readonly staffForm = this.#fb.group({
    username: [
      '',
      {
        validators: [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z0-9._-]+'),
        ],
        asyncValidators: [usernameAvailableValidator()],
      },
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: this.#fb.control<UserRole | null>(null, Validators.required),
  });

  // Lo stato della form come signal: aggiorna la vista anche quando termina la verifica asincrona
  readonly #status = toSignal(this.staffForm.statusChanges, {
    initialValue: this.staffForm.status,
  });
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly checkingUsername = computed(() => this.#status() === 'PENDING');
  readonly canSave = computed(() => this.#status() === 'VALID' && !this.saving());

  // Senza 'error' indica se il campo è invalido, con 'error' se ha quell'errore specifico
  showError(control: keyof typeof this.staffForm.controls, error?: string): boolean {
    const fc = this.staffForm.controls[control];
    return (error ? fc.hasError(error) : fc.invalid) && (fc.touched || fc.dirty);
  }

  onSubmit() {
    if (!this.canSave()) {
      this.staffForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.saveError.set(null);
    this.#gestioneStaff
      .createStaffMember(this.staffForm.getRawValue() as NewStaffMember)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.staffForm.reset(),
        error: () => this.saveError.set("Errore durante il salvataggio dell'operatore."),
      });
  }
}
