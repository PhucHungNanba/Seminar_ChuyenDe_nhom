export const formatDisplayId = (id: string | undefined, prefix: string) => {
    if (!id) return '';
    return id.length >= 6 ? `${prefix}-${id.slice(-6).toUpperCase()}` : id;
};
