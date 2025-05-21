import convertLiteralDataStorage, { Unit }  from 'bytes';

export interface IsFileSizeExceeded {
  size: number;
  unit: Unit;
  limit: {
    size: number;
    unit: Unit;
  }
}

export interface ConvertUnit {
  size: number;
  unit: Unit;
  newUnit: Unit;
}

export interface ConvertToBytes {
  size: number;
  unit: Unit;
}

function convertToBytes({ size, unit }: ConvertToBytes) {
  return convertLiteralDataStorage.parse(`${size} ${unit}`) ?? 0;
}

function convertToLiteralString({ size, unit, newUnit }: ConvertUnit) {
  const bytes = convertLiteralDataStorage.parse(`${size} ${unit}`) ?? 0;

  const literal = convertLiteralDataStorage.format(bytes, { 
    unitSeparator: ' ', 
    decimalPlaces: 2, 
    unit: newUnit, 
    fixedDecimals: true,
  }) ?? '';

  return literal
}

function isFileSizeExceeded(file: IsFileSizeExceeded): boolean {
  const bytes = convertLiteralDataStorage.parse(`${file.size} ${file.unit}`) ?? 0;

  const limit = convertLiteralDataStorage.parse(`${file.limit.size} ${file.limit.unit}`) ?? 0;

  return bytes > limit;
}

export const fileHelper = {
  convertToBytes,
  convertToLiteralString,
  isFileSizeExceeded,
}
