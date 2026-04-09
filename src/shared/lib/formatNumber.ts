export const formatPhoneForView = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
};

/**
 * UI uchun xalqaro telefon: bo‘shliqlar bilan, boshida `+`.
 * - `998XXXXXXXXX` (12 raqam) yoki `9XXXXXXXX` (9 raqam, O‘zbekiston mobil) → `+998 XX XXX XX XX`
 * - boshqa: `+` va raqamlarni 3tadan guruhlab
 */
export function formatPhoneNumber(raw: string | null | undefined): string {
  if (raw == null) return '';
  const trimmed = String(raw).trim();
  if (!trimmed) return '';

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  const formatUz12 = (d: string): string | null => {
    const full = d.slice(0, 12);
    if (full.length !== 12 || !full.startsWith('998')) return null;
    const body = full.slice(3);
    if (body.length !== 9) return null;
    return `+998 ${body.slice(0, 2)} ${body.slice(2, 5)} ${body.slice(5, 7)} ${body.slice(7, 9)}`;
  };

  if (digits.startsWith('998') && digits.length >= 12) {
    const u = formatUz12(digits);
    if (u) return u;
  }

  if (digits.length === 9 && digits.startsWith('9')) {
    const u = formatUz12(`998${digits}`);
    if (u) return u;
  }

  const grouped = digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  return `+${grouped}`;
}

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
