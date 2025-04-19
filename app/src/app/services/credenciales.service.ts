// src/app/services/credenciales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Credencial {
  id: number;
  dui: string;
  usuario: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {
  private baseUrl = 'http://localhost:8080/api/credenciales';

  constructor(private http: HttpClient) {}

  /** Obtiene todas las credenciales */
  getAll(): Observable<Credencial[]> {
    return this.http.get<Credencial[]>(`${this.baseUrl}`);
  }

  /** Obtiene las credenciales de un cliente según su DUI */
  getByDui(dui: string): Observable<Credencial[]> {
    return this.http.get<Credencial[]>(`${this.baseUrl}/dui/${dui}`);
  }

  /** Crea una nueva credencial */
  create(cred: Omit<Credencial, 'id'>): Observable<Credencial> {
    return this.http.post<Credencial>(`${this.baseUrl}`, cred);
  }

  /** Actualiza una credencial existente */
  update(id: number, changes: Partial<Credencial>): Observable<Credencial> {
    return this.http.put<Credencial>(`${this.baseUrl}/${id}`, changes);
  }

  /** Elimina una credencial por su ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
