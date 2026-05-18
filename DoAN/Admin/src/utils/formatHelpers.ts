export const formatDisplayId = (id: string, prefix: string) => {
  return id && id.length >= 6 ? `${prefix}-${id.slice(-6).toUpperCase()}` : id;
};
