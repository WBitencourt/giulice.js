import { describe, it, expect } from 'vitest'
import { maskOAB } from '.';

const cases = [
  ['sp', 'SP'],
  ['SP', 'SP'],
  ['SP1', 'SP-1'],
  ['SP12', 'SP-12'],
  ['SP123', 'SP-123'],
  ['SP1234', 'SP-1234'],
  ['SP12345', 'SP-12345'],
  ['SP123456', 'SP-123456'],
]

const invalidCases = [
  ['1', ''],
  ['SP1234567', 'SP-123456'],

  [0 as unknown as string, ''],
  [null as unknown as string, ''],
  [undefined as unknown as string, ''],
  [NaN as unknown as string, ''],
  [true as unknown as string, ''],
  [false as unknown as string, ''],
  [{} as unknown as string, ''],
  [[] as unknown as string, ''],
];

describe('Mask: maskOAB', () => {
  it('should be a function', () => {
    expect(typeof maskOAB).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof maskOAB('12345678901')).toBe('string');
  });

  it.each(cases)('should format string input "%s" to "%s"', (input, expected) => {
    expect(maskOAB(input)).toBe(expected);
  });
  
  it.each(invalidCases)('should format invalid input "%s" to "%s"', (input, expected) => {
    expect(maskOAB(input)).toBe(expected);
  });
});