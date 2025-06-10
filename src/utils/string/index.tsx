
export function cleanTextSQL(text: string) {
  const regex = /[']|["]|[´]|[`]/gi;

  return text.replace(regex, '');
}

export function cleanTextJustNumbersAllowed(text: string | undefined) {
  if(!text) {
    return '';
  }
  
  const regex = /\d+/g;

  return text.match(regex)?.join('') ?? text;
}

export function firstCharacterToLowercase (value: string | undefined) {
  if(!value) {
    return 
  }

  if (value.length === 0) {
    return value; // return the original value if it's empty
  }
  
  const firstCharacter = value.charAt(0).toLowerCase();
  const remainingString = value.slice(1);
  
  return firstCharacter + remainingString;
}

export function firstCharToUpperCase(value: string | undefined) {
  if (!value) {
    return '';
  }

  const words = value.split(' ');

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return word; // Mantenha palavras vazias inalteradas
    }
    const firstCharacter = word.charAt(0).toUpperCase();
    const remainingString = word.slice(1);
    return firstCharacter + remainingString;
  });

  const result = capitalizedWords.join(' ');

  return result;
}

export function literalStringInDays (day: string | number | undefined) {
  if(Number.isNaN(day)) {
    return '';
  }

  const dayNumber = Number(day);

  if(dayNumber === 0) {
    return 'Hoje';
  }

  if(dayNumber === 1) {
    return `${dayNumber.toString().padStart(2, '0')} dia`;
  }

  if(dayNumber >= 2) {
    return `${dayNumber.toString().padStart(2, '0')} dias`;
  }

  return ''
}

export function removeSpecialCharacters (text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function countNewlines(text: string | undefined) {
  if (!text) {
    return 0;
  }

  let newlineCount = 0; // \n

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') {
      newlineCount++;
    }
  }

  return newlineCount;
}

export function truncateString(text: string | undefined, limit: number | undefined) {
  if (!text) {
    return '';
  }

  if(!limit) {
    return text;
  }

  if (text.length <= limit) {
    return text;
  }

  return text.slice(0, limit) + '...';
}

export function truncateStringWord(text: string, limit: number) {
  if (text === undefined || limit === undefined) {
    return {
      text: '',
      isTruncated: false
    };
  }

  const words = text.split(' ');
  const truncatedText = [];
  
  for (const word of words) {
    const whitelist = [] as string[]

    const wordHyphen = word.split('-');

    whitelist.push(...wordHyphen);

    for (const subword of whitelist) {
      if (subword.length > limit) {
        truncatedText.push(subword.substring(0, limit) + '...');
        return {
          text: truncatedText.join(' '),
          isTruncated: true
        };
      }
    }

    truncatedText.push(word);
  }

  return {
    text: truncatedText.join(' '),
    isTruncated: false
  };
}

export const isFormattedBRLCurrency = (value: string | number | undefined): boolean => {
  if (typeof value !== 'string') return false;

  // Expressão regular para validar formato de moeda BRL
  const brlCurrencyRegex = /^R\$ ?\d{1,3}(\.\d{3})*(,\d{2})?$/;

  return brlCurrencyRegex.test(value);
};

export const formatNumberBRLCurrency = (value: string | number | undefined) => {
  if (!value) {
    return 'R$ 0,00';
  }

  if (isFormattedBRLCurrency(value)) {
    return value as string;
  }

  const numericValue = typeof value === 'number' ? value : parseFloat(value);

  const formattedNUmber = numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  if (!isFormattedBRLCurrency(formattedNUmber)) {
    return 'R$ 0,00';
  }

  return formattedNUmber;
};

export const formatBRLCurrencyNoSymbol = (value: string | number | undefined) => {
  if (!value) return '0,00';

  if (value === 0) return '0,00';

  const numericValue = parseFloat(value.toString()); // Sem divisão por 100, pois o valor já está em reais

  const formattedNUmber = numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
  });

  if (formattedNUmber === 'NaN') {
    return '0,00';
  }

  return formattedNUmber;
}

export const convertBRLCurrencyToNumber = (currency: string | undefined | null) => {
  if (typeof currency !== 'string' || currency.trim().length === 0) {
    return 0;
  }

  const sanitized = currency.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.');

  return parseFloat(sanitized);
}

export function prettyTextCharSize(text: string | undefined, size: number) {
  if(!text || size === 0) {
    return ''
  }

  const hideSuspensionPoints = size >= text.length;
  const textLimitedCharSize = text.trim().substring(0, size);

  return `${textLimitedCharSize}${hideSuspensionPoints ? '' : '...'}`
}

