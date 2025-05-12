import { UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Clipboard } from '@/components/Clipboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import moment from 'moment';
import { maskCpfCnpj } from '@/utils/Masks';
import { FormValues } from '.';

interface BasicInfoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
  isConsultandoAutor: boolean;
  onClickConsultarAutor: () => void;
  onClickAdicionarObservacao: () => void;
}

export function BasicInfoForm({ 
  formBag, 
  isConsultandoAutor, 
  onClickConsultarAutor,
  onClickAdicionarObservacao
}: BasicInfoFormProps) {
  const { register, setValue, getValues } = formBag;

  const values = getValues();

  return (
    <div className="space-y-4">
      <div className="border-2 p-4 rounded-md">
        <div className="space-y-2">
          <Label htmlFor="pk">pk / id</Label>
          <div className="flex items-center gap-2">
            <Input
              id="pk"
              type="text"
              value={values.pk}
              disabled
              className="w-full p-2 bg-gray-100 border rounded-md text-sm text-gray-700"
            />
            <Clipboard value={values.pk} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="created_by">Criado por</Label>
          <Input 
            id="created_by" 
            readOnly 
            disabled 
            className="bg-gray-100" 
            value={values?.created_by}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usuario_atuando">Usuário Atuando</Label>
          <Input 
            id="usuario_atuando" 
            {...register('usuario_atuando')} 
            readOnly 
            disabled 
            className="bg-gray-100" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_carimbo">Data do Carimbo</Label>
          <Input 
            id="data_carimbo" 
            readOnly 
            disabled 
            className="bg-gray-100" 
            value={values?.data_carimbo ? moment(values?.data_carimbo).locale('pt-br').format('DD/MM/YYYY HH:mm') : ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Data de Vencimento do Cadastro</Label>
          <Input 
            id="due_date" 
            readOnly 
            disabled 
            className="bg-gray-100" 
            value={values?.due_date ? moment(values?.due_date).locale('pt-br').format('DD/MM/YYYY HH:mm') : ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo_demanda">Tipo da demanda</Label>
          <Input 
            id="tipo_demanda" 
            disabled
            {...formBag.register('tipo_demanda')} 
            placeholder="tipo da demanda..." 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status_demanda">Status demanda</Label>
          <Input 
            id="status_demanda" 
            disabled
            {...formBag.register('status_demanda')} 
            placeholder="tipo da demanda..." 
          />
        </div>
        <br />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Escritório selecionado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              values?.escritorio && values.escritorio.length > 0 ? (
                values?.escritorio?.sort((a, b) => a.localeCompare(b)).map((item, index) => (
                  <TableRow key={item}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='w-full'>{item}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={2}
                    className='text-center'
                  >
                    Nenhum escritório selecionado
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
        <br />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Portfólios selecionados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              values?.portfolio && values.portfolio.length > 0 ? (
                values?.portfolio?.sort((a, b) => a.localeCompare(b)).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='w-full'>{item}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={2}
                    className='text-center'
                  >
                    Nenhum portfólio selecionado
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
        
        <br />

        <Table className='w-full'>
          <TableHeader>
            <TableRow>
              <TableHead>Criado em</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead>Criado por</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              values?.observacao && values.observacao.length > 0 ? (
                values?.observacao?.sort((a, b) => a?.criada_em.localeCompare(b?.criada_em)).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='text-nowrap'>
                      {moment(item.criada_em).locale('pt-br').format('DD/MM/YYYY HH:mm')}
                    </TableCell>
                    <TableCell className='w-full'>{item.mensagem}</TableCell>
                    <TableCell>{item.criada_por}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={3}
                    className='text-center'
                  >
                    Nenhuma observação cadastrada
                  </TableCell>
                </TableRow>
              )
            }

            {/* <TableRow>
              <TableCell 
                colSpan={3} 
                className='text-center text-green-500 cursor-pointer' 
                onClick={onClickAdicionarObservacao}
              >
                Adicionar observação
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>

      </div>
      <div className="flex gap-2 items-end">
      <div className="flex flex-col w-full space-y-2">
          <Label htmlFor="documento_autor">Documento Autor</Label>
          <Input
            id="documento_autor"
            disabled
            {...register('documento_autor')}
            onChange={(e) => setValue('documento_autor', maskCpfCnpj(e.target.value))}
            placeholder="Documento Autor"
            className="w-full"
          />
        </div>
        <Button disabled type="button" onClick={onClickConsultarAutor}>
          {
            isConsultandoAutor ? (
              'Consultando...'
            ) : (
              'Consultar'
            )
          }
          
        </Button>
      </div>
      <div className="flex space-x-2">
        <div className="flex flex-1 flex-col space-y-2">
          <Label htmlFor="nome_autor">Nome Autor</Label>
          <Input 
            id="nome_autor" 
            disabled
            {...register('nome_autor')} 
            placeholder="Nome do Autor" 
          />
        </div>
      </div>
    </div>
  );
}
