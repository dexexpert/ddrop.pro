export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const toIso = (date: Date) => date.toISOString();

export const randomToken = () =>
  crypto.randomUUID().replace(/-/g, "") +
  crypto.randomUUID().replace(/-/g, "");
