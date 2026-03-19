export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  updatedAt?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
