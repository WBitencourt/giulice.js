
const clientes = [
  'PicPayIp',
  'PicPayOutrasEmpresas',
  'PicPayBank',
  'GuiaBolso',
  'Laguz',
  'BancoOriginal',
  'Outros',
].sort((a, b) => a.localeCompare(b))

const ufs = [
  { idUF: '2', nome: 'AC' },
  { idUF: '7', nome: 'CE' },
  { idUF: '3', nome: 'AL' },
  { idUF: '6', nome: 'BA' },
  { idUF: '8', nome: 'DF' },
  { idUF: '4', nome: 'AP' },
  { idUF: '5', nome: 'AM' },
  { idUF: '10', nome: 'ES' },
  { idUF: '11', nome: 'MA' },
  { idUF: '9', nome: 'GO' },
  { idUF: '15', nome: 'PA' },
  { idUF: '12', nome: 'MT' },
  { idUF: '14', nome: 'MG' },
  { idUF: '17', nome: 'PR' },
  { idUF: '13', nome: 'MS' },
  { idUF: '18', nome: 'PE' },
  { idUF: '16', nome: 'PB' },
  { idUF: '20', nome: 'RJ' },
  { idUF: '19', nome: 'PI' },
  { idUF: '21', nome: 'RN' },
  { idUF: '22', nome: 'RS' },
  { idUF: '24', nome: 'RR' },
  { idUF: '28', nome: 'TO' },
  { idUF: '25', nome: 'SP' },
  { idUF: '23', nome: 'RO' },
  { idUF: '27', nome: 'SE' },
  { idUF: '26', nome: 'SC' },
].sort((a, b) => a.nome.localeCompare(b.nome));

export const picklist = {
  clientes,
  ufs,
}
