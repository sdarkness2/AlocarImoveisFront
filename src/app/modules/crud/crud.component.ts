import { Component, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CrudService } from './crud.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
  public unsub = new Subject();
  public imoveis: any;
  public isLoading = false;
  public displayedColumns: string[] = ['Tipo', 'Rua', 'Bairro', 'Cidade', 'Estado', 'Preço', 'Publicação', 'Ações']

  constructor(private _crudService: CrudService,
              private _router: Router,
              private _snack: MatSnackBar) { }

  ngOnInit(): void {
    this.load();
  }

  load(){
    this.isLoading = true;
    this._crudService.retornarImoveisAtivos().pipe(takeUntil(this.unsub)).subscribe(x => {
      this.imoveis = x,
      this.isLoading = false;
    },
    err => {
      this.isLoading = false;
    })
  }

  editImovel(id:any){
  this._router.navigate([`/criar/${id}`])
  }

  desativarImovel(id: string)
  {
    this._crudService.DesativarImovel(id).pipe(takeUntil(this.unsub)).subscribe(
      x => {
        this._snack.open("Anuncio desativado com sucesso.", "x"),
        this.load();
      },
      err => {
        this._snack.open("Alguma coisa deu errado.", "x")
      }
    )
  }
}
