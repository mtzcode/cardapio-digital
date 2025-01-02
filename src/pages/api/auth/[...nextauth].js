import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "admin@example.com",
        },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase(); // Conecta ao banco
        const user = await User.findOne({ email: credentials.email });

        if (!user || user.password !== credentials.password) {
          console.error("Credenciais inválidas.");
          return null; // Retorna null para credenciais inválidas
        }

        return { id: user._id, name: user.name, email: user.email }; // Retorna o usuário autenticado
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // Página de login personalizada
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
