// src/app/services/banco.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Modelo de una cuenta */
export interface Cuenta {
  id: number;
  numero: string;
  saldo: number;
}

/** Respuesta genérica del backend */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  /** Algunos endpoints devuelven newSaldo */
  newSaldo?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private baseUrl = 'http://localhost:8080/api/cuentas';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/cuentas
   * Lista todas las cuentas.
   */
  getAll(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.baseUrl);
  }

  /**
   * GET /api/cuentas/cliente/{dui}
   * Recupera las cuentas de un cliente específico.
   */
  getByCliente(dui: string): Observable<ApiResponse<Cuenta[]>> {
    return this.http.get<ApiResponse<Cuenta[]>>(
      `${this.baseUrl}/cliente/${dui}`
    );
  }

  /**
   * POST /api/cuentas/cliente/{dui}
   * Crea una nueva cuenta para el cliente.
   * @param dui DUI del cliente
   * @param numero Número de nueva cuenta
   * @param saldo  Saldo inicial
   */
  create(
    dui: string,
    numero: string,
    saldo: number
  ): Observable<ApiResponse<Cuenta>> {
    return this.http.post<ApiResponse<Cuenta>>(
      `${this.baseUrl}/cliente/${dui}`,
      { numero, saldo }
    );
  }

  /**
   * DELETE /api/cuentas/cliente/{dui}/{numero}
   * Elimina la cuenta especificada.
   */
  delete(dui: string, numero: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/cliente/${dui}/${numero}`
    );
  }

  /**
   * POST /api/cuentas/cliente/{dui}/abonarefectivo
   * Abona un monto a la cuenta indicada.
   * @param dui    DUI del cliente
   * @param numero Número de cuenta
   * @param monto  Monto a abonar
   */
  abonar(
    dui: string,
    numero: string,
    monto: number
  ): Observable<ApiResponse<Cuenta>> {
    return this.http.post<ApiResponse<Cuenta>>(
      `${this.baseUrl}/cliente/${dui}/abonarefectivo`,
      { numero, monto }
    );
  }

  /**
   * POST /api/cuentas/cliente/{dui}/retirarefectivo
   * Retira un monto de la cuenta indicada.
   * @param dui    DUI del cliente
   * @param numero Número de cuenta
   * @param monto  Monto a retirar
   */
  retirar(
    dui: string,
    numero: string,
    monto: number
  ): Observable<ApiResponse<Cuenta>> {
    return this.http.post<ApiResponse<Cuenta>>(
      `${this.baseUrl}/cliente/${dui}/retirarefectivo`,
      { numero, monto }
    );
  }
}
