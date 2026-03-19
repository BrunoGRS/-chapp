import jwt from "jsonwebtoken";

import { env } from "../config/env";

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export function signUserToken(payload: JwtPayload) {
  const expiresIn = env.jwtExpiresIn as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
}

export function verifyUserToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
