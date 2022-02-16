import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudComponent } from '../crud.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  logradouro: any;
  public unsub = new Subject();
  loadingCep = false;
  hasCep = false;
  hasImovel = false;
  id?: string;

  @Input() imovel:any;

  imovelForm!: FormGroup;

  constructor(private _fb: FormBuilder,
    private _cs: CrudService,
    private _snack: MatSnackBar,
    private _route: ActivatedRoute,
    private _router: Router) {
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.params['id'];
    this.imovelForm = this._fb.group({
      cep: new FormControl(['']),
      tipo: new FormControl(['', Validators.required]),
      cidade: new FormControl(['', Validators.required]),
      estado: new FormControl(['', Validators.required]),
      bairro: new FormControl(['', Validators.required]),
      rua: new FormControl(['', Validators.required]),
      numero: new FormControl(['', Validators.required]),
      preco: new FormControl(['', Validators.required])
    });
    if(this.id == null)
    {
      this.imovelForm.reset()
    }
    else
    {
      this.hasImovel = true;
      this.hasCep = true;
      this.receberForm();
    }
  }



  searchCEP(value: any) {
    var convert = value.target.value;
    if(convert.length == 8)
    {
      this.loadingCep = true;
      this._cs.retornaLogradouro(convert).pipe(debounceTime(200),takeUntil(this.unsub)).subscribe(x =>
        {
          this.logradouro = x;
          this.updateFormWithCep(this.logradouro)
          this.loadingCep = false;
          this.hasCep = true;
          console.log(this.logradouro)
        },
        err =>
        {
          this.loadingCep = false;
        })
    }
  }

  updateFormWithCep(logradouro: any)
  {
    this.imovelForm.patchValue({
      rua: logradouro.logradouro,
      bairro: logradouro.bairro,
      estado: logradouro.uf,
      cidade: logradouro.localidade,
    })
  }

  receberForm()
  {
    this._cs.ImoveisPorId(this.id).pipe(takeUntil(this.unsub)).subscribe(x =>
      {
        const x1 = x[0]
        this.imovelForm.patchValue({
          rua: x1.rua,
          bairro: x1.bairro,
          estado: x1.estado,
          cidade: x1.cidade,
          numero: x1.numero,
          datainicial: x1.datainicial,
          tipo: x1.tipo,
          preco: x1.preco
        })
        },
        err =>
        {
          this._snack.open("Alguma coisa deu errado, tente novamento mais tarde", )
        }
      )
  }

  tratarForm()
  {
    if (!this.hasImovel)
    {
      var newimovel = {
      tipo: this.imovelForm.controls['tipo'].value,
      rua: this.imovelForm.controls['rua'].value,
      bairro: this.imovelForm.controls['bairro'].value,
      estado: this.imovelForm.controls['estado'].value,
      cidade: this.imovelForm.controls['cidade'].value,
      numero: this.imovelForm.controls['numero'].value,
      disponivel: 1,
      datainicial: this.tratarData(),
      preco: this.imovelForm.controls['preco'].value,
      datafinal: null
      }
      return newimovel;
    }
    else
    {
      var editobj = {
        id: this.id,
        tipo: this.imovelForm.controls['tipo'].value,
        rua: this.imovelForm.controls['rua'].value,
        bairro: this.imovelForm.controls['bairro'].value,
        estado: this.imovelForm.controls['estado'].value,
        cidade: this.imovelForm.controls['cidade'].value,
        numero: this.imovelForm.controls['numero'].value,
        preco: this.imovelForm.controls['preco'].value,
        datafinal: null
        }
        return editobj;
    }
  }

  tratarData()
  {
    if(!this.hasImovel)
    {
      return formatDate(new Date(), 'yyyy/MM/dd', 'en');
    }
    else{
      return null;
    }
  }

  submit()
  {
    const form = this.tratarForm()
    if(!this.hasImovel)
    {
      this._cs.CriarImovel(form).pipe(takeUntil(this.unsub)).subscribe(x =>
        {
          this._snack.open("Criado com sucesso!", "x")
          this._router.navigate([`/listagem`])
        },
        err =>
        {
          this._snack.open("Falha ao cadastrar.", "x")
        })
    }
    else
    {
      this._cs.EditarImovel(form).pipe(takeUntil(this.unsub)).subscribe(x =>
        {
          this._snack.open("Editado com sucesso!", "x");
          this._router.navigate([`/listagem`])
        },
        err =>
        {
          this._snack.open("Falha ao editar.", "x")
        }
      )
    }
  }
}
