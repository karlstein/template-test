import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { login } from "@/api/fetch";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, trigger, session, account, user }) {
      if (trigger === "update") token.name = session.user.name;
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }

      if (account?.provider === "google") {
        // TODO - 1.1 Add login api call to BE on port 3005 to upsert user data and get token then assign the token into token.authToken or whatever you prefer
        try {
          const response = await fetch("http://localhost:3005/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: {
                email: user?.email,
                authId: account.providerAccountId, // Menggunakan ID dari Google
                provider: "google",
                Name: user?.name,
                imageUrl: user?.image || "", // Jika tersedia
                isSuper: false,
              },
              provider_access_token: account.access_token || "", // Token dari Google
            }),
          });

          const data = await response.json();
          console.log("DATA LOGIN >> ", data);

          if (response.ok && data.data?.token) {
            token.authToken = data.data.token;
          }
        } catch (err) {
          console.log("Login API failed:", err);
        }
      }
      console.log("TOKEN >> ", token);
      return token;
      
      
    },
    redirect: () => {
      return "/project";
    },
    async session({ session, token }) {
      // TODO - 1.2 assign token.authToken or token.(whatever you prefer) into session.authToken
      console.log("AuthToken >> ", token.authToken);
      
      if(token.authToken){
        session.authToken = token.authToken as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
