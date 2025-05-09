import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing Google OAuth client ID or client secret");
}
console.log("server for auth is called")

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
        session.user.id = token.sub; // Sekarang tidak ada error
      }
      console.log(session)
      console.log(session.user)
      return session;
    },
  },
});


