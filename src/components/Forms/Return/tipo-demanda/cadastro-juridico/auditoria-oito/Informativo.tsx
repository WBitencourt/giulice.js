import { UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { FormValues } from '.';
import { Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from 'react';

interface InformativoProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function InformativoComponent({ 
  formBag,
}: InformativoProps) {
  console.log('Componente Informativo renderizado');

  const { control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['escritorio', 'portfolio'],
  });

  const values = {
    escritorio: useWatch({ control, name: 'escritorio' }),
    portfolio: useWatch({ control, name: 'portfolio' }),
  }

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <Info className="w-5 h-5 mr-2 text-blue-500" />
        <span>Informativo</span>
      </h3>

      <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
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
      </div>
    </div>
  
  );
}

export const Informativo = React.memo(InformativoComponent, (prevProps, nextProps) => {
  return true
}); 
