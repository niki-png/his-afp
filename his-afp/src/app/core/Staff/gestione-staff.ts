import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { APIResponse } from '../models/APIResponse.model';
import {
  NewStaffMember,
  StaffMember,
  StaffMemberRes,
  UserRole,
  UsernameAvailability,
} from './staff.model';

@Injectable({
  providedIn: 'root',
})
export class GestioneStaff {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = '/api/users';
  readonly #staff = signal<StaffMember[]>([]);
  staff = this.#staff.asReadonly();

  public fetchStaff() {
    this.#http.get<APIResponse<StaffMember[]>>(this.#baseUrl).subscribe({
      next: (res) => this.#staff.set(res.data),
      error: (err) => console.error('Errore durante il fetch del personale:', err),
    });
  }

  public isUsernameAvailable(username: string): Observable<boolean> {
    return this.#http
      .get<
        APIResponse<UsernameAvailability>
      >(`${this.#baseUrl}/check/${encodeURIComponent(username)}`)
      .pipe(map((res) => res.data.available));
  }

  public createStaffMember(member: NewStaffMember): Observable<APIResponse<StaffMemberRes>> {
    return this.#http
      .post<APIResponse<StaffMemberRes>>(this.#baseUrl, member)
      .pipe(tap((res) => this.#staff.update((list) => [...list, { ...res.data, isActive: true }])));
  }

  public editRole(id: number, role: UserRole): Observable<APIResponse<StaffMemberRes>> {
    return this.#http
      .patch<APIResponse<StaffMemberRes>>(`${this.#baseUrl}/${id}/editrole`, { role })
      .pipe(tap((res) => this.#patchMember(id, { role: res.data.role })));
  }

  public setActive(id: number, isActive: boolean): Observable<APIResponse<void>> {
    const action = isActive ? 'activate' : 'deactivate';
    return this.#http
      .patch<APIResponse<void>>(`${this.#baseUrl}/${id}/${action}`, null)
      .pipe(tap(() => this.#patchMember(id, { isActive })));
  }

  #patchMember(id: number, changes: Partial<StaffMember>) {
    this.#staff.update((list) => list.map((m) => (m.id === id ? { ...m, ...changes } : m)));
  }
}
