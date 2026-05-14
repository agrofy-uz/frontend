import API from '../../api.interface';
import type { AuthMeResponse } from '../auth/auth.types';

export type ProfileEditResponse = AuthMeResponse | null | undefined;

/**
 * PUT /api/profile/edit
 * — Rasm o‘zgarmagan yoki olib tashlangan: JSON `{ firstName, image }` (`image` — havola yoki `""`).
 * — Yangi fayl: `multipart/form-data` (`firstName`, `image` fayl).
 */
export async function updateProfileEdit(params: {
  firstName: string;
  /** JSON rejimida: mavjud URL yoki `""` */
  image: string;
  /** Bo‘lsa, multipart yuboriladi */
  imageFile?: File | null;
}): Promise<ProfileEditResponse> {
  if (params.imageFile) {
    const fd = new FormData();
    fd.append('firstName', params.firstName.trim());
    fd.append('image', params.imageFile);
    const response = await API.put<ProfileEditResponse>('/profile/edit', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data ?? null;
  }

  const response = await API.put<ProfileEditResponse>('/profile/edit', {
    firstName: params.firstName.trim(),
    image: params.image,
  });
  return response.data ?? null;
}
