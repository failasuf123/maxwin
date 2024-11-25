import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string; // Menambahkan properti `id`
  }

  interface Session {
    user?: User;
  }
}
