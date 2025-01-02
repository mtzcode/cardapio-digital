import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        // Simula um usuário do banco de dados
        const user = {
          id: 1,
          name: "Administrador",
          email: "admin@example.com",
        };

        // Verifica se as credenciais estão corretas
        if (
          credentials.email === "admin@example.com" &&
          credentials.password === "password123"
        ) {
          return user; // Retorna o usuário autenticado
        }

        // Retorna null se as credenciais forem inválidas
        console.error("Credenciais inválidas.");
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
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
