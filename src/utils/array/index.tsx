export const sumObjectValuesFromArray = <T, >(array: T[], sumBy: keyof T) => {
  const initialValues = { sum: 0 };

  const result = array.reduce((previousValue, currentValue: T) => {
    previousValue.sum += typeof currentValue[sumBy] == 'number' ? currentValue[sumBy] as number : 0;
    return previousValue;
  }, initialValues);

  return result.sum;
}

export const orderAsc = (value_a: string | number | undefined, value_b: string | number | undefined) => {
  if(!value_a || !value_b) return 0;
  if(value_a > value_b) return 1;
  if(value_a < value_b) return -1;
  return 0;
}

export const isEqual = (a: unknown[], b: unknown[]) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;

  return a.every((item, index) => {
    const other = b[index];

    // Comparação simples por valor
    if (typeof item !== 'object' || item === null) {
      return item === other;
    }

    // Comparação profunda para objetos
    return JSON.stringify(item) === JSON.stringify(other);
  });
};

