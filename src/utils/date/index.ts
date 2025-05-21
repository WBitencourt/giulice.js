export function isValidDate(input: string) {
  // Espera-se data no formato "dd/mm/yyyy hh:mm"
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
  const match = input.match(regex);

  if (!match) return false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, day, month, year, hour, minute] = match.map(Number);

  const date = new Date(year, month - 1, day, hour, minute);

  return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date.getHours() === hour &&
      date.getMinutes() === minute
  );
}
