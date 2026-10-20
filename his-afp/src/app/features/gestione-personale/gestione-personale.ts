import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GestioneStaff } from '../../core/Staff/gestione-staff';
import { NuovoStaff } from '../../pattern/nuovo-staff/nuovo-staff';
import { TabellaStaff } from '../../pattern/tabella-staff/tabella-staff';

@Component({
  selector: 'his-gestione-personale',
  imports: [NuovoStaff, TabellaStaff],
  templateUrl: './gestione-personale.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionePersonale {
  readonly #gestioneStaff = inject(GestioneStaff);

  constructor() {
    this.#gestioneStaff.fetchStaff();
  }
}
