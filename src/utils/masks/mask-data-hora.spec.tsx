import { describe, it, expect } from 'vitest'
import { maskDateTime } from '.';

const cases = [
  ['01', '01'],
  ['012', '01'],
  ['0102', '01/02'],
  ['01029', '01/02/9'],
  ['010290', '01/02/90'],
  ['0102900', '01/02/900'],
  ['01021000', '01/02/1000'],
  ['01022025', '01/02/2025'],
  ['0102202512', '01/02/2025 12'],
  ['010220251230', '01/02/2025 12:30'],
  ['01022025123045', '01/02/2025 12:30'],
]

const invalidCases = [
  ['xpto', ''],
  ['300220251230', ''],
  ['010220252430', '01/02/2025 2'],
  
  [0 as unknown as string, ''],
  [null as unknown as string, ''],
  [undefined as unknown as string, ''],
  [NaN as unknown as string, ''],
  [true as unknown as string, ''],
  [false as unknown as string, ''],
  [{} as unknown as string, ''],
  [[] as unknown as string, ''],
];

describe('Mask: maskDateTime', () => {
  it('should be a function', () => {
    expect(typeof maskDateTime).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof maskDateTime('11999999999')).toBe('string');
  });

  it.each(cases)('should format string input "%s" to "%s"', (input, expected) => {
    expect(maskDateTime(input)).toBe(expected);
  });
  
  it.each(invalidCases)('should format invalid input "%s" to "%s"', (input, expected) => {
    expect(maskDateTime(input)).toBe(expected);
  });
});