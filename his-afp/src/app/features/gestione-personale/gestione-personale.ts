import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GestioneStaff } from '../../core/Staff/gestione-staff';

@Component({
  selector: 'his-gestione-personale',
  templateUrl: './gestione-personale.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionePersonale {
  readonly #gestioneStaff = inject(GestioneStaff);

  constructor() {
    this.#gestioneStaff.fetchStaff();
  }
}
