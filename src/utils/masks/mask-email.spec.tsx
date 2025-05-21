import { describe, it, expect } from 'vitest'
import { maskEmail } from '.';

const cases = [
  ['joao.frango@oito.srv.br', 'joao.frango@oito.srv.br'],
  ['joao_frango@oito.srv.br', 'joao_frango@oito.srv.br'],
  ['joao+frango@oito.srv.br', 'joao+frango@oito.srv.br'],
  ['joao-frango@oito.srv.br', 'joao-frango@oito.srv.br'],
]

const invalidCases = [
  ['joao!#$%¨&*()=§frango@oito.srv.br', 'joaofrango@oito.srv.br'],
  ['joao@frango@oito.srv.br', 'joao@frango'],

  [0 as unknown as string, ''],
  [null as unknown as string, ''],
  [undefined as unknown as string, ''],
  [NaN as unknown as string, ''],
  [true as unknown as string, ''],
  [false as unknown as string, ''],
  [{} as unknown as string, ''],
  [[] as unknown as string, ''],
];

describe('Mask: maskEmail', () => {
  it('should be a function', () => {
    expect(typeof maskEmail).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof maskEmail('joao.frango@oito.srv.br')).toBe('string');
  });

  it.each(cases)('should format string input "%s" to "%s"', (input, expected) => {
    expect(maskEmail(input)).toBe(expected);
  });
  
  it.each(invalidCases)('should format invalid input "%s" to "%s"', (input, expected) => {
    expect(maskEmail(input)).toBe(expected);
  });
});