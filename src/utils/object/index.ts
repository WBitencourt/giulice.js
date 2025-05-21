
function isEqual<T>(obj1: T, obj2: T): boolean {
  // Verifica se ambos são objetos e não são nulos
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
    return obj1 === obj2;
  }

  // Verifica se têm a mesma quantidade de propriedades
  const keys1 = Object.keys(obj1) as Array<keyof T>;
  const keys2 = Object.keys(obj2) as Array<keyof T>;

  if (keys1.length !== keys2.length) {
    return false;
  }

  // Verifica cada propriedade
  for (const key of keys1) {
    if (!isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export const object = {
  isEqual,
}