import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { GestioneStaff } from './gestione-staff';

const DEBOUNCE_MS = 400;

/**
 * Verifica in tempo reale che lo username non sia già in uso.
 * Va creato in un injection context (es. inizializzazione di un campo del componente).
 * Angular annulla la verifica precedente a ogni nuovo valore: il timer evita una chiamata per ogni tasto.
 */
export function usernameAvailableValidator(): AsyncValidatorFn {
  const gestioneStaff = inject(GestioneStaff);

  return (control: AbstractControl<string>): Observable<ValidationErrors | null> =>
    timer(DEBOUNCE_MS).pipe(
      switchMap(() => gestioneStaff.isUsernameAvailable(control.value)),
      map((available) => (available ? null : { usernameTaken: true })),
      catchError(() => of({ usernameCheckFailed: true })),
    );
}
