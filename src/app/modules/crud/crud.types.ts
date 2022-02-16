export interface Imoveis
{
  id?:number,
  tipo: string,
  rua: string,
  numero: number,
  bairro: string,
  cidade: string,
  estado: string,
  disponivel: number,
  preco: number,
  datainicial: Date,
  datafinal: Date
}
