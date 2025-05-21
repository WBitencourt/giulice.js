import { isValidDate } from "../date";

export const maskCurrencyBRL = (value: string | number) => {  
  if (!value) return 'R$ 0,00';

  if (typeof value === 'number') {
    value = value.toString();
  }

  value = value.replace(/\D/g, '');

  const numericValue = parseFloat(value.toString()) / 100; // Divide por 100 para considerar centavos

  if (Number.isNaN(numericValue)) {
    return 'R$ 0,00';
  }
  
  const formattedValue = numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  return formattedValue.replace(/\s/g, ' ').trim();
};

export const maskNumeroProcesso = (value: string | undefined) => {
  if (!value) return '';

  if (typeof value !== 'string') {
    return ''
  }

  const cleanValue = value?.replace(/\D/g, '').slice(0, 20); // Remove caracteres não numéricos e limita a 20 dígitos

  if (!cleanValue) return '';

  return cleanValue
    .replace(/(\d{0,7})(\d{0,2})(\d{0,4})(\d{0,1})(\d{0,2})(\d{0,4})/, (match, p1, p2, p3, p4, p5, p6) => {
      // Concatena progressivamente as partes disponíveis
      return [
        p1,
        p2 && `-${p2}`,
        p3 && `.${p3}`,
        p4 && `.${p4}`,
        p5 && `.${p5}`,
        p6 && `.${p6}`,
      ]
        .filter(Boolean) // Remove partes indefinidas
        .join('');
    });
};

export const maskCpfCnpj = (value: string | undefined) => {
  if (!value) return '';

  if (typeof value !== 'string') {
    return ''
  }

  const cleanValue = value?.replace(/\D/g, '').slice(0, 14); // Remove caracteres não numéricos e limita a 14 dígitos

  if (!cleanValue) return '';

  if (cleanValue.length <= 11) {
    // Máscara para CPF
    return cleanValue
      .replace(/(\d{3})(\d{0,3})(\d{0,3})(\d{0,2})/, (match, p1, p2, p3, p4) => {
        return [p1, p2 && `.${p2}`, p3 && `.${p3}`, p4 && `-${p4}`]
          .filter(Boolean)
          .join('');
      });
  } else {
    // Máscara para CNPJ
    return cleanValue
      .replace(/(\d{2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/, (match, p1, p2, p3, p4, p5) => {
        return [p1, p2 && `.${p2}`, p3 && `.${p3}`, p4 && `/${p4}`, p5 && `-${p5}`]
          .filter(Boolean)
          .join('');
      });
  }
};

export const maskOAB = (value?: string): string => {
  if (!value) return '';

  if (typeof value !== 'string') {
    return ''
  }

  const val = value ?? '';

  // Só letras (máx. 2)
  const onlyLetters = val
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 2);

  // Só números (máx. 6)
  const onlyNumbers = val
    .replace(/[^0-9]/g, '')
    .slice(0, 6);

  // Se tiver menos de 2 letras, retorna só elas
  if (onlyLetters.length < 2) {
    return onlyLetters;
  }

  // Se tiver exatamente 2 letras mas ZERO números, não mostra hífen
  if (onlyNumbers.length === 0) {
    return onlyLetters;
  }

  // Quando houver >=1 número, monta XX-123...
  return `${onlyLetters}-${onlyNumbers}`;
};

export const maskEmail = (value: string | undefined): string => {
  if (!value || typeof value !== 'string') return '';

  // Remove espaços e limita o tamanho
  const cleanValue = value.trim().toLowerCase().slice(0, 254);

  // Remove caracteres inválidos da parte local (antes do @)
  const [rawLocal = '', rawDomain = ''] = cleanValue.split('@');

  const local = rawLocal.replace(/[^a-z0-9.+_-]/g, '');
  const domain = rawDomain.replace(/[^a-z0-9.-]/g, '');

  // Evita múltiplos @ ou partes vazias (exceto quando digitando ainda)
  const hasAt = cleanValue.includes('@');

  // Se há @, junta local@dominio; senão, retorna só a parte local filtrada
  const result = hasAt ? `${local}@${domain}` : local;

  return result;
};

// export const maskPhone = (value: string | undefined): string => {
//   if (!value) return '';
//   // Formata o número conforme vai sendo digitado, considerando o país (BR no exemplo)
//   const asYouType = new AsYouType('BR')

//   return asYouType.input(value);
// };

export const maskPhone = (value: string | undefined): string => {
  if (!value) return '';

  if (typeof value !== 'string') {
    return ''
  }

  if (value === '+55 (') {
    return '';
  }

  // Remove o prefixo "+55" se já estiver presente, para evitar contaminação
  let newValue = value;
  if (newValue.startsWith('+55')) {
    newValue = newValue.replace(/^\+55\s?/, '');
  }

  // Remove todos os caracteres que não sejam dígitos
  const digits = newValue.replace(/\D/g, '');

  // Os dois primeiros dígitos correspondem ao DDD
  const area = digits.slice(0, 2);
  // O restante é a parte do telefone
  const phone = digits.slice(2);

  let formatted = '+55';

  if (area) {
    // Se já foi digitada parte do telefone, fecha os parênteses.
    // Caso contrário (apenas o DDD), deixa o parênteses aberto para facilitar a deleção.
    if (phone.length > 0) {
      formatted += ` (${area})`;
    } else {
      formatted += ` (${area}`;
    }
  }

  if (phone) {
    formatted += ' ';
    if (phone.length < 6) {
      // Enquanto o telefone tiver menos de 6 dígitos, mostra conforme digitado.
      formatted += phone;
    } else if (phone.length >= 6 && phone.length <= 8) {
      // Se tiver de 6 a 8 dígitos, formata com 4 dígitos, hífen e o restante.
      formatted += phone.slice(0, 4) + '-' + phone.slice(4);
    } else {
      // Se tiver 9 dígitos (celular com nono dígito), formata como 5 dígitos, hífen e 4 dígitos.
      formatted += phone.slice(0, 5) + '-' + phone.slice(5, 9);
    }
  }

  return formatted;
};

export const maskUuid = (value: string | undefined): string => {
  if (!value) return '';

  if (typeof value !== 'string') {
    return ''
  }

  const cleanValue = value.replace(/[^a-fA-F0-9]/g, '').slice(0, 32); // Limita a 32 caracteres hexadecimais

  // Aplica a máscara conforme o usuário digita
  const formatted = cleanValue
    .split('')
    .map((char, index) => {
      if (index === 8 || index === 12 || index === 16 || index === 20) {
        return `-${char}`;
      }
      return char;
    })
    .join('');

  return formatted;
};

export const maskDataHora = (value: string | undefined): string => {
  if (!value) return '';

  if (typeof value !== 'string') {
    return ''
  }

  let cleanValue = value.replace(/\D/g, '').slice(0, 12); //apenas números

  // Validações para dia, mês e ano
  if (cleanValue.length <= 8) {
    const day = cleanValue.slice(0, 2);
    const month = cleanValue.slice(2, 4);
    const year = cleanValue.slice(4, 8);

    const dayInt = parseInt(day, 10);
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    if (day.length === 1 && dayInt > 3) {
      cleanValue = '';
    }

    if (day.length === 2 && dayInt > 31) {
      cleanValue = cleanValue.slice(0, 1);
    }

    if (month.length === 1 && monthInt > 1) {
      cleanValue = cleanValue.slice(0, 2);
    }

    if (month.length === 2 && monthInt > 12) {
      cleanValue = cleanValue.slice(0, 3);
    }

    if (year.length === 4) {
      const date = new Date(yearInt, 0, 1);
      if (Number.isNaN(date.getTime())) {
        cleanValue = cleanValue.slice(0, 4);
      }
    }
  }

  // Validação da hora (posições 8 e 9)
  if (cleanValue.length >= 9) {
    const hourStr = cleanValue.slice(8, 10);
    
    if (hourStr.length === 1 && parseInt(hourStr, 10) > 2) {
      cleanValue = cleanValue.slice(0, 8);
    }

    if (hourStr.length === 2 && parseInt(hourStr, 10) > 23) {
      cleanValue = cleanValue.slice(0, 9);
    }
  }

  // Validação dos minutos (posições 10 e 11)
  if (cleanValue.length >= 11) {
    const minutesStr = cleanValue.slice(10, 12);
    if (minutesStr.length === 1 && parseInt(minutesStr, 10) > 5) {
      cleanValue = cleanValue.slice(0, 10);
    }
    if (minutesStr.length === 2 && parseInt(minutesStr, 10) > 59) {
      cleanValue = cleanValue.slice(0, 11);
    }
  }

  // Aplicação da máscara conforme o usuário digita
  let formatted = cleanValue;
  
  if (cleanValue.length > 0) {
    formatted = cleanValue.slice(0, 2);
    
    if (cleanValue.length > 2) {
      formatted = `${formatted}/${cleanValue.slice(2, 4)}`;
      
      if (cleanValue.length > 4) {
        formatted = `${formatted}/${cleanValue.slice(4, 8)}`;
        
        if (cleanValue.length > 8) {
          formatted = `${formatted} ${cleanValue.slice(8, 10)}`;
          
          if (cleanValue.length > 10) {
            formatted = `${formatted}:${cleanValue.slice(10, 12)}`;
          }
        }
      }
    }
  }

  if (formatted.length === 16 && !isValidDate(formatted)) {
    return '';
  }

  return formatted;
};









