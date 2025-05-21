import { describe, it, expect } from 'vitest'
import { maskNumeroProcesso } from '.';

describe('Mask: maskNumeroProcesso', () => {
  const stringCases = [
    ['7790400', '7790400'],
    ['779040020', '7790400-20'],
    ['77904002020', '7790400-20.20'],
    ['7790400202025', '7790400-20.2025'],
    ['77904002020255', '7790400-20.2025.5'],
    ['7790400202025522', '7790400-20.2025.5.22'],
    ['77904002020255226', '7790400-20.2025.5.22.6'],
    ['779040020202552269', '7790400-20.2025.5.22.69'],
    ['7790400202025522690', '7790400-20.2025.5.22.690'],
    ['77904002020255226909', '7790400-20.2025.5.22.6909'],
  ];

  const invalidCases = [
    [0 as unknown as string, ''],
    [null as unknown as string, ''],
    [undefined as unknown as string, ''],
    [NaN as unknown as string, ''],
    [true as unknown as string, ''],
    [false as unknown as string, ''],
    [{} as unknown as string, ''],
    [[] as unknown as string, ''],
  ];

  it('should be a function', () => {
    expect(typeof maskNumeroProcesso).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof maskNumeroProcesso('100')).toBe('string');
  });

  it.each(stringCases)('should format string input "%s" to "%s"', (input, expected) => {
    expect(maskNumeroProcesso(input)).toBe(expected);
  });

  it.each(invalidCases)('should format invalid input "%s" to "%s"', (input, expected) => {
    expect(maskNumeroProcesso(input)).toBe(expected);
  });
});

