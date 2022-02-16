import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Imoveis } from './crud.types';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private _http: HttpClient) { }

  public retornarImoveisAtivos(): Observable<any>
  {
    const url = `https://localhost:8081/Alocacao/v1/imoveisativos`;
    return this._http.get(url);
  }

  public retornaLogradouro(value: string): Observable<any>
  {
    const url = `https://viacep.com.br/ws/${value}/json/`
    return this._http.get(url);
  }

  public CriarImovel(value: any): Observable<any>
  {
    const url = `https://localhost:8081/Alocacao/v1/adicionarimovel`;
    return this._http.post(url, value);
  }

  public ImoveisPorId(value: any): Observable<any>
  {
    const url = `https://localhost:8081/Alocacao/v1/imoveisporid?id=${value}`;
    return this._http.get(url);
  }

  public EditarImovel(value: any): Observable<any>
  {
    const url = `https://localhost:8081/Alocacao/v1/editarimovel`;
    return this._http.put(url, value);
  }

  public DesativarImovel(value: string): Observable<any>
  {
    const url = `https://localhost:8081/Alocacao/v1/desativarimovel?id=${value}`;
    return this._http.put(url, value);
  }
}
