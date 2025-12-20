export const formatPhoneForView = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
};

export const formatPhoneForApi = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return `+${cleaned}`.replace(
    /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
    '$1 $2 $3 $4 $5'
  );
};

export const formatPrice = (num: number) => {
  if (!num) return '0';
  return num.toLocaleString('uz-UZ').replace(/,/g, ' ');
};

