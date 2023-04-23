export const isValidPeriod = (from: string, to: string): boolean => {
  if (to < from) {
    return false;
  }
  if (to === from) {
    return false;
  }
  return true;
};
