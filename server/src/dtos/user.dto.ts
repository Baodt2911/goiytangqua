export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type RegisterRequestDTO = {
  email: string;
  password: string;
  otp: string;
};
