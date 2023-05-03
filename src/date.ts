export const isValidPeriod = (from: string, to: string): boolean => {
  if (to < from) {
    return false;
  }
  if (to === from) {
    return false;
  }
  return true;
};

export const getBeginingOfDay = (date: Date): Date => {
  date.setUTCHours(0, 0, 0, 0);
  return date;
};
