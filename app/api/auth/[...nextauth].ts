import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing Google OAuth client ID or client secret");
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub; // Menambahkan `id` ke objek sesi
      }
      return session;
    },
  },
});

