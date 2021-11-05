// func to match valid date format YYYY-MM-DD
export const dateValidate = (dateString: string): boolean => {
  const regex = /^\d{4}-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const cleanDateString = dateString.replace(/\D/g, "");

  const year = parseInt(cleanDateString.substr(0, 4));
  const month = parseInt(cleanDateString.substr(4, 2));
  const day = parseInt(cleanDateString.substr(6, 2));

  // Define number of days per month
  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
    daysInMonth[1] = 29;
  }

  // check month and day range
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }

  return true;
};
