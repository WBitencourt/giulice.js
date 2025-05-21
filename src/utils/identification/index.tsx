
export const checkIsValidCpf = (cpf: string | undefined): boolean => {
  if (!cpf) return false;

  const cpfClean = cpf.replace(/\D/g, '');
  if (cpfClean.length !== 11) return false;

  const cpfArray = Array.from(cpfClean);

  const isAllDigitsEqual = cpfArray.every((digit) => digit === cpfArray[0]);
  if (isAllDigitsEqual) return false;

  const calculateDigit = (cpf: string, length: number) => {
    const sum = cpf
      .slice(0, length)
      .split('')
      .reduce((acc, digit, index) => acc + Number(digit) * (length + 1 - index), 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cpfClean, 9);
  const secondDigit = calculateDigit(cpfClean, 10);

  return firstDigit === Number(cpfClean[9]) && secondDigit === Number(cpfClean[10]);
};

export const checkIsValidCnpj = (cnpj: string | undefined): boolean => {
  if (!cnpj) return false;

  const cnpjClean = cnpj.replace(/\D/g, '');
  if (cnpjClean.length !== 14) return false;

  const cnpjArray = Array.from(cnpjClean);

  const isAllDigitsEqual = cnpjArray.every((digit) => digit === cnpjArray[0]);
  if (isAllDigitsEqual) return false;

  const calculateDigit = (cnpj: string, length: number) => {
    const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = cnpj
      .slice(0, length)
      .split('')
      .reduce((acc, digit, index) => acc + Number(digit) * weights[index + (weights.length - length)], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cnpjClean, 12);
  const secondDigit = calculateDigit(cnpjClean, 13);

  return firstDigit === Number(cnpjClean[12]) && secondDigit === Number(cnpjClean[13]);
};

export const checkIsValidCpfCnpj = (cpfCnpj: string | undefined): boolean => {
  if (!cpfCnpj) return false;

  const cpfCnpjClean = cpfCnpj.replace(/\D/g, '');
  return cpfCnpjClean.length === 11 ? checkIsValidCpf(cpfCnpjClean) : checkIsValidCnpj(cpfCnpjClean);
};