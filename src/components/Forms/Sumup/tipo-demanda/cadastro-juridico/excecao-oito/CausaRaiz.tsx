import React from 'react';
import { Controller, UseFormReturn, useFormState } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldMessage } from '@/components/FieldMessage';
import { GitBranch } from 'lucide-react';
import { DadosDemandaProcon } from '../../interfaces';
import { Label } from '@/components/ui/label';

interface CausaRaizProps {
  formBag: UseFormReturn<DadosDemandaProcon>;
}

const CausaRaizComponent = ({ formBag }: CausaRaizProps) => {
  console.log('Componente CausaRaiz renderizado');

  const { control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['causa_raiz'],
  });

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <GitBranch className="w-5 h-5 mr-2 text-rose-500" />
        <span>Causa Raiz</span>
      </h3>
      <div className="space-y-4 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-md">
        <div>
          <Label className="block text-sm mb-1">Causa Raiz</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="causa_raiz"
              control={formBag.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled
                >
                <SelectTrigger 
                  ref={field.ref}
                  className={errors.causa_raiz ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecione a causa raiz" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="Accommodation Closed">Accommodation Closed</SelectItem>
                  <SelectItem value="Advertisement Removal">Advertisement Removal</SelectItem>
                  <SelectItem value="Attraction">Attraction</SelectItem>
                  <SelectItem value="Bad Experience">Bad Experience</SelectItem>
                  <SelectItem value="Booking Tools">Booking Tools</SelectItem>
                  <SelectItem value="BHI / Rentalcars">BHI / Rentalcars</SelectItem>
                  <SelectItem value="Business Partner Case">Business Partner Case</SelectItem>
                  <SelectItem value="Credit Card Issues">Credit Card Issues</SelectItem>
                  <SelectItem value="Flight">Flight</SelectItem>
                  <SelectItem value="Improper Advertising (Pictures and Services)">Improper Advertising (Pictures and Services)</SelectItem>
                  <SelectItem value="Improper Advertising (Price Issues)">Improper Advertising (Price Issues)</SelectItem>
                  <SelectItem value="Improper Cancelation">Improper Cancelation</SelectItem>
                  <SelectItem value="Improper Charge">Improper Charge</SelectItem>
                  <SelectItem value="Information Request">Information Request</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Login Issues">Login Issues</SelectItem>
                  <SelectItem value="No Show">No Show</SelectItem>
                  <SelectItem value="Non Refundable Fees">Non Refundable Fees</SelectItem>
                  <SelectItem value="Not related to Booking.com">Not related to Booking.com</SelectItem>
                  <SelectItem value="Overbooking">Overbooking</SelectItem>
                  <SelectItem value="Partner Case">Partner Case</SelectItem>
                  <SelectItem value="Partner Case / Guest Misconduct">Partner Case / Guest Misconduct</SelectItem>
                  <SelectItem value="Partner Case / PbB">Partner Case / PbB</SelectItem>
                  <SelectItem value="Partner Case / Policies & Contracts">Partner Case / Policies & Contracts</SelectItem>
                  <SelectItem value="Partner Case / Serasa">Partner Case / Serasa</SelectItem>
                  <SelectItem value="Partner Critical Matters">Partner Critical Matters</SelectItem>
                  <SelectItem value="PATO / GATO">PATO / GATO</SelectItem>
                  <SelectItem value="Right to Regret">Right to Regret</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              )}
            />
            <FieldMessage.Error.Text visible={!!errors.causa_raiz}>
              {errors.causa_raiz?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>
      </div>
    </div>
  );
};

export const CausaRaiz = React.memo(CausaRaizComponent, (prevProps, nextProps) => {
  // como não há props, sempre retorna true para não re-renderizar
  return true;
});
