// Convert string (format: 'dd/mm/yyyy') to Date object.
export const stringToDate = (string) => {
    if (!string) return ''
    const [day, month, year] = string.split('/').map(Number);
    const convertedDate = new Date(year, month - 1, day);
    return convertedDate;
};