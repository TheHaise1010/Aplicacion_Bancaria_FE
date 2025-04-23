// src/app/services/credenciales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Credencial {
  id: number;
  dui: string;
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {
  // Ajusta esta URL base según tu configuración de entorno
  private baseUrl = 'http://localhost:8080/api/credenciales';
  constructor(private http: HttpClient) {}

  /**
   * POST /api/credenciales/login
   */
  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      { correo, contrasena }
    );
  }

  /**
   * GET /api/credenciales
   */
  getAll(): Observable<Credencial[]> {
    return this.http.get<Credencial[]>(this.baseUrl);
  }

  /**
   * GET /api/credenciales/dui/{dui}
   */
  getByDui(dui: string): Observable<Credencial[]> {
    return this.http.get<Credencial[]>(`${this.baseUrl}/dui/${dui}`);
  }

  /**
   * POST /api/credenciales
   */
  create(cred: Omit<Credencial, 'id'>): Observable<Credencial> {
    return this.http.post<Credencial>(this.baseUrl, cred);
  }

  /**
   * PUT /api/credenciales/{id}
   */
  update(id: number, changes: Partial<Credencial>): Observable<Credencial> {
    return this.http.put<Credencial>(`${this.baseUrl}/${id}`, changes);
  }

  /**
   * DELETE /api/credenciales/{id}
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
