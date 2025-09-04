export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type RegisterRequestDTO = {
  email: string;
  password: string;
  otp: string;
};
export type ChangePaswordRequestDTO = {
  currentPassword: string;
  newPassword: string;
};
export type UpdateProfileRequestDTO = {
  name?: string;
  birthday?: Date;
  gender?: "nam" | "nữ";
  preferences?: string[];
};
