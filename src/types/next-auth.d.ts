import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: string;
    role?: string;
  }
  interface User extends DefaultUser {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: string;
  }
}
