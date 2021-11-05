// func to match valid date format YYYY-MM-DD
export const dateValidate = (date: string): boolean => {
  const regex = /^\d{4}-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  return regex.test(date);
};
