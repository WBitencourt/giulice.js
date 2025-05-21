
export function normalizeStringJson(value: string | undefined): string | null {
  return !value || value?.trim()?.length === 0 ? null : value;
}

export function isValidJSON(json: string) {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}