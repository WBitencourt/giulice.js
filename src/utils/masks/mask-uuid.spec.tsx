import { describe, it, expect } from 'vitest'
import { maskUuid } from '.';

//fba50681-7cce-4df7-9de5-d52bcfc45d2b

const cases = [
  ['xpto123', '123'],
  ['fba50681', 'fba50681'],
  ['fba506817', 'fba50681-7'],
  ['fba506817cce4', 'fba50681-7cce-4'],
  ['fba506817cce4df79', 'fba50681-7cce-4df7-9'],
  ['fba506817cce4df79de5d52bcfc45d2b', 'fba50681-7cce-4df7-9de5-d52bcfc45d2b'],
]

const invalidCases = [
  ['xpto', ''],
  ['xpto123', '123'],
  ['zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', ''],

  [0 as unknown as string, ''],
  [null as unknown as string, ''],
  [undefined as unknown as string, ''],
  [NaN as unknown as string, ''],
  [true as unknown as string, ''],
  [false as unknown as string, ''],
  [{} as unknown as string, ''],
  [[] as unknown as string, ''],
];

describe('Mask: maskUuid', () => {
  it('should be a function', () => {
    expect(typeof maskUuid).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof maskUuid('11999999999')).toBe('string');
  });

  it.each(cases)('should format string input "%s" to "%s"', (input, expected) => {
    expect(maskUuid(input)).toBe(expected);
  });
  
  it.each(invalidCases)('should format invalid input "%s" to "%s"', (input, expected) => {
    expect(maskUuid(input)).toBe(expected);
  });
});