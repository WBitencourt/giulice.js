export const checkIsValidEmail = (email: string | undefined): boolean => {
  if (!email) {
    return false;
  }

  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}