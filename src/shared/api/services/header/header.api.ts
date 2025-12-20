import api from '../../api.interface';

export const checkPhone = async (phone: string) => {
  const response = await api.post('/user/check-phone/', { phone });
  return response.data;
};

export const verifyPhone = async (phone: string, code: number) => {
  const response = await api.post('/user/verify-phone/', { phone, code });
  return response.data;
};

export const resendOtp = async (phone: string) => {
  const response = await api.post('/user/resend-otp/', { phone });
  return response.data;
};

export const register = async (phone: string, password: string) => {
  const response = await api.post('/user/register/', { phone, password });
  return response.data;
};

export const login = async (phone: string, password: string) => {
  const response = await api.post('/user/login/', { phone, password });
  return response.data;
};

export const resetPassword = async (phone: string, password: string) => {
  const response = await api.post('/user/reset-password/', { phone, password });
  return response.data;
};

export const changePassword = async (
  old_password: string,
  password: string
) => {
  const response = await api.post('/user/change-password/', {
    old_password,
    password,
  });
  return response.data;
};

export const updateProfile = async (data: FormData) => {
  const response = await api.patch('/user/', data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/user/');
  return response.data;
};